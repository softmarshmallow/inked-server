import * as express from 'express'
import {newsEventToClient, NewsRefreshType} from "../../sockets";
import {authMiddleware} from "../../middlewares/auth";
import {
    getBlank,
    postCreateSearchHistory,
    postSearch,
    remoteSearchHistory
} from "../search/controller";

const router = express.Router();

router.get('/socket-test', (req, res)=>{
    newsEventToClient(NewsRefreshType.NEW, req.body);
    res.send("ok")
});


router.post('/search', authMiddleware, postSearch);
router.get('/search', getBlank);
router.delete('/search/history', remoteSearchHistory)
router.post('/search/history', postCreateSearchHistory)

export {router}
