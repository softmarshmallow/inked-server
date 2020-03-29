import {News, prisma, SpamTag} from "../../generated/prisma-client";

import {CREATED, CONFLICT, INTERNAL_SERVER_ERROR, ACCEPTED} from "http-status-codes";
import moment = require("moment");
import Axios from "axios";

const postCrawledNews = async (req, res) => {
    try {
        const {title, content, time, meta, originUrl, provider} = req.body;
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
            res.status(CONFLICT).send(reason)
        } else {
            const result = await prisma.createNews({
                title: title,
                content: content,
                provider: provider,
                time: time,
                originUrl: originUrl,
                meta: {create: meta}
            });
            indexNews(result);
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

async function checkDuplicate(news: News): Promise<DuplicateCheckResponse> {
    try {
        const res = await Axios.post<DuplicateCheckResponse>("http://localhost:8000/api/news/tools/duplicate-check", news);
        return res.data
    } catch (e) {
        return {
            isDuplicated: false,
            news: undefined,
            reason: "engine did not response properly"
        }
    }
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

    indexNews(updated);
    return updated
}

function indexNews(news: News) {
    // todo index to search engine
}

const getRandomNewsBySpamTag = async (req, res) => {
    const {tag} = req.body;
    switch (tag as SpamTag) {
        case "UNTAGGED":
            break;
        case "SPAM":
            break;
        case "NOTSPAM":
            break;
    }
}

const postTagNewsWithSpamTag = async (req, res) => {
    const {id, tag, reason} = req.body;
    prisma.$exists.news({
        id: id,
        meta: {}
    })

    // add spam mark data
    prisma.updateNews({
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
    })
}


const getAllNews = async (req, res) => {
    const result = await prisma.newses();
    res.json(result)
};

const getRecentNewses = async (req, res) => {
    var newDateObj = moment(Date.now()).subtract(5, 'm').toDate();

    const result = await prisma.newses({
        where: {
            time_gte: newDateObj,
        }, first: 50, orderBy: "time_ASC"
    });
    res.json(result)
}


export {
    postCrawledNews,
    getAllNews,
    getRecentNewses,

    // region spam
    getRandomNewsBySpamTag,
    postTagNewsWithSpamTag
    // endregion spam
}
