import * as express from 'express'
import {
    getAllNews,
    getRandomNewsBySpamTag,
    postCrawledNews,
    postTagNewsWithSpamTag,
    updateCrawledNews
} from "./controller";

const router = express.Router();
router.get('/', getAllNews);
router.get('/recent', getAllNews);
router.post('/crawled', postCrawledNews);
router.put('/crawled', updateCrawledNews);
router.get('/tag/spam', getRandomNewsBySpamTag);
router.post('/tag/spam', postTagNewsWithSpamTag);

export {router}
