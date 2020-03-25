import * as express from 'express'
import {
    getAllNews,
    getRandomNewsBySpamTag, getRecentNewses,
    postCrawledNews,
    postTagNewsWithSpamTag,
    updateCrawledNews
} from "./controller";

const router = express.Router();
// router.get('/', getAllNews);
router.get('/recent', getRecentNewses);
router.post('/crawled', postCrawledNews);
router.put('/crawled', updateCrawledNews);
router.get('/tag/spam', getRandomNewsBySpamTag);
router.patch('/tag/spam', postTagNewsWithSpamTag);

export {router}
