import {prisma, SpamTag} from "../../generated/prisma-client";

import {CREATED, CONFLICT, INTERNAL_SERVER_ERROR} from "http-status-codes";
import moment = require("moment");

const postCrawledNews = async (req, res) => {
    try {
        const {title, content, time, meta, originUrl, provider} = req.body;
        const newsExists = await prisma.$exists.news({
            originUrl: originUrl
        });
        if (newsExists) {
            res.status(CONFLICT).send(`record already exists with ${originUrl}`)
        } else {
            const result = await prisma.createNews({
                title: title,
                content: content,
                provider: provider,
                time: time,
                originUrl: originUrl,
                meta: {create: meta}
            });
            res.status(CREATED).json(result);
        }
    } catch (e) {
        console.log(e)
        res.status(INTERNAL_SERVER_ERROR).send(e)
    }
};


const updateCrawledNews = async (req, res) => {
    // todo
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

    const result = await  prisma.newses({where: {
    time_gte: newDateObj,
        }, first: 50, orderBy: "time_ASC"});
    res.json(result)
}


export {
    postCrawledNews,
    updateCrawledNews,
    getAllNews,
    getRecentNewses,

    // region spam
    getRandomNewsBySpamTag,
    postTagNewsWithSpamTag
    // endregion spam
}
