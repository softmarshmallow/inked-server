import {prisma} from "../../generated/prisma-client";


const postCrawledNews = async (req, res) => {
    const {title, content, time, meta} = req.body;
    const result = await prisma.createNews({
        title: title,
        content: content,
        time: time,
        meta: {create: meta}
    });
    res.json(result)
};


const getAllNews = async (req, res) => {
    const result = await prisma.newses();
    res.json(result)
};



export {
    postCrawledNews,
    getAllNews
}
