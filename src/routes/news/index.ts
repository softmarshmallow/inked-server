import * as express from 'express'
import {getAllNews, postCrawledNews, updateCrawledNews} from "./controller";

const router = express.Router();
router.get('/', getAllNews);
router.get('/recent', getAllNews);
router.post('/crawled', postCrawledNews);
router.put('/crawled', updateCrawledNews);
router.get('/spam', postCrawledNews);
router.post('/spam', postCrawledNews);

export {router}
