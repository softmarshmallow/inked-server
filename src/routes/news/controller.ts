import {News, NewsCategory, prisma, SpamMark, SpamTag} from "../../generated/prisma-client";

import {
    CREATED,
    CONFLICT,
    INTERNAL_SERVER_ERROR,
    ACCEPTED,
    BAD_REQUEST,
    OK, NO_CONTENT
} from "http-status-codes";
import moment = require("moment");
import Axios from "axios";
import {newsEventToClient, NewsRefreshType} from "../../sockets";
import {polishProvider} from "../../utils/crawler/polish-provider";

const postCrawledNews = async (req, res) => {
    try {
        const {title, content, time, meta, originUrl} = req.body;
        const provider = polishProvider(req.body["provider"]);
        let exists: boolean;
        let reason: string = "";
        if (originUrl == null) {
            exists = false;
        } else {
            const urlMatchingNewsFound = await prisma.$exists.news({
                originUrl: originUrl
            });

            if (urlMatchingNewsFound) {
                exists = true;
                reason = `record already exists with ${originUrl}`
            } else {
                // check duplicate first
                const news = {
                    id: null,
                    title: title,
                    content: content,
                    provider: provider,
                    time: time,
                    originUrl: originUrl,
                    meta: meta
                };
                const duplicateCheckRes = await checkDuplicate(news);
                if (duplicateCheckRes.isDuplicated) {
                    console.log(duplicateCheckRes);
                    const replacedNews = await replaceCrawledNews(duplicateCheckRes.news.id, news);
                    res.status(ACCEPTED).json(replacedNews);
                    return
                }
            }
        }

        if (exists) {
            res.status(CONFLICT).json({"reason": reason})
        } else {
            const result = await prisma.createNews({
                title: title,
                content: content,
                provider: provider,
                time: time,
                originUrl: originUrl,
                meta: {create: meta}
            });
            newsEventToClient(NewsRefreshType.NEW, result);
            updateNews(result);
            res.status(CREATED).json(result);
        }
    } catch (e) {
        console.log(e);
        res.status(INTERNAL_SERVER_ERROR).send(e)
    }
};

interface DuplicateCheckResponse {
    isDuplicated: boolean
    reason: string
    news?: News
}

const ENGINE_BASE_URL = "http://localhost:8001/api/news";

async function checkDuplicate(news: News): Promise<DuplicateCheckResponse> {
    try {
        const res = await Axios.post<DuplicateCheckResponse>(`${ENGINE_BASE_URL}/tools/duplicate-check`, news);
        return res.data
    } catch (e) {
        return {
            isDuplicated: false,
            news: undefined,
            reason: "engine did not response properly"
        }
    }
}


interface SingleAnalysisResult {
    spamMarks: [SpamMark]
    summary: string
    subject: string
    category: NewsCategory
    categories: [NewsCategory]
    tags: [string]
}

async function analyzeCrawledNews(news: News): Promise<News> {
    try {
        const res = await Axios.post<SingleAnalysisResult>(`${ENGINE_BASE_URL}/analyze`, news);
        const analysisData = res.data;
        const updated = await prisma.updateNews(
            {
                where: {id: news.id}, data: {
                    meta: {
                        update: {
                            summary: analysisData.summary,
                            subject: analysisData.subject,
                            spamMarks: {create: analysisData.spamMarks},
                            category: analysisData.category,
                            categories: {set: analysisData.categories},
                            tags: { set: analysisData.tags}
                        }
                    }
                }
            }
        );
        return updated;
    } catch (e) {
        console.error(e);
        return null
    }
}




async function getSingleNews(req, res){
    const {id} = req.params;
    const news = await prisma.news({id});
    res.json(news)
}

async function replaceCrawledNews(targetId: string, updateWith: News,): Promise<News> {
    console.log(targetId)
    const updated = await prisma.updateNews(
        {
            where: {id: targetId}, data: {
                content: updateWith.content,
                originUrl: updateWith.originUrl,
                provider: updateWith.provider,
                meta: {
                    update: {
                        source: updateWith.meta.source,
                        status: "CRAWLED",
                        updateTransactions: {
                            create: {
                                operation: "REPLACED_SOURCE"
                            }
                        }
                    }
                }
            }
        }
    );
    newsEventToClient(NewsRefreshType.REPLACED, updated);
    updateNews(updated);
    return updated
}

async function updateNews(news: News) {
    try {
        const updated = await analyzeCrawledNews(news);
        const indexed = await indexNews(updated);
        newsEventToClient(NewsRefreshType.ANALYZED, updated);
    }catch (e) {
        console.error(e);
        return null
    }
}


interface IndexResult{
    result: string
}

async function indexNews(news: News) {
    try {
        const res = await Axios.post<IndexResult>(`${ENGINE_BASE_URL}/index`, news);
        return res.data
    }catch (e) {
        console.error(e);
    }
}

const getRandomNewsBySpamTag = async (req, res) => {
    const from = moment(Date.now()).subtract(1, 'd').format();
    const {tag} = req.query;
    console.log(tag);
    const results = await prisma.newses({
        where: {
            time_gte: from,
            meta : {
                spamMarks_every : {
                    spam : tag
                }
            },
        },
        first: 1,
        orderBy: "time_DESC"
    });
    console.log(results);

    if (results.length == 0){
        res.status(NO_CONTENT).send();
    }else {
        res.status(OK).json(results[0]);
    }
};

const postTagNewsWithSpamTag = async (req, res) => {
    const {id, tag, reason} = req.body;
    const notExits = await prisma.$exists.news({
        id: id,
        meta: {
            spamMarks_none: {spam: tag}
        }
    });
    if (!notExits) {
        res.status(BAD_REQUEST).json({"reason": "news already marked as spam"});
        return
    }

    // add spam mark data
    const updated = await prisma.updateNews({
        where: {id: id},
        data: {
            meta: {
                update: {
                    spamMarks: {
                        create: {
                            spam: tag,
                            reason: reason
                        }
                    }
                }
            }
        }
    });
    res.json(updated);
};


const getAllNews = async (req, res) => {
    const result = await prisma.newses();
    res.json(result)
};

const getRecentNewses = async (req, res) => {
    const from = moment(Date.now()).subtract(1, 'm').format();
    const result = await prisma.newses({
        where: {
            time_gt: from,
        }, first: 20, orderBy: "time_DESC"
    });
    res.json(result)
}


export {
    postCrawledNews,
    getAllNews,
    getSingleNews,
    getRecentNewses,

    // region spam
    getRandomNewsBySpamTag,
    postTagNewsWithSpamTag
    // endregion spam
}
