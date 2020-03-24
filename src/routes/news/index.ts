import * as express from 'express'
import {getAllNews, postCrawledNews} from "./controller";

const router = express.Router();
router.get('/', getAllNews);
router.get('/recent', getAllNews);
router.post('/crawled', postCrawledNews);
router.get('/spam', postCrawledNews);
router.post('/spam', postCrawledNews);

export {router}
