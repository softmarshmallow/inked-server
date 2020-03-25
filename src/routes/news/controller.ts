import {prisma} from "../../generated/prisma-client";

import {CREATED, CONFLICT, INTERNAL_SERVER_ERROR} from "http-status-codes";

const postCrawledNews = async (req, res) => {
    try {
        const {title, content, time, meta, originUrl} = req.body;
        const newsExists = await prisma.$exists.news({
            originUrl: originUrl
        });
        if (newsExists) {
            res.status(CONFLICT).send(`record already exists with ${originUrl}`)
        } else {
            const result = await prisma.createNews({
                title: title,
                content: content,
                time: time,
                originUrl: originUrl,
                meta: {create: meta}
            });
            res.json(result)
        }
    } catch (e) {
        console.log(e)
        res.status(INTERNAL_SERVER_ERROR).send(e)
    }
};


const updateCrawledNews = async (req, res) => {
    // todo
}


const getAllNews = async (req, res) => {
    const result = await prisma.newses();
    res.json(result)
};


export {
    postCrawledNews,
    updateCrawledNews,
    getAllNews,
}
