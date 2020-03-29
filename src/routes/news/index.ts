import * as express from 'express'
import {
    getRandomNewsBySpamTag, getRecentNewses, getSingleNews,
    postCrawledNews,
    postTagNewsWithSpamTag,
} from "./controller";

const router = express.Router();
// router.get('/', getAllNews);
router.get('/recent', getRecentNewses);
router.post('/crawled', postCrawledNews);
router.get('/tag/spam', getRandomNewsBySpamTag);
router.patch('/tag/spam', postTagNewsWithSpamTag);
router.get('/:id', getSingleNews);

export {router}
