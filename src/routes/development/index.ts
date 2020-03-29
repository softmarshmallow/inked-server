import * as express from 'express'
import {newsEventToClient, NewsRefreshType} from "../../sockets";

const router = express.Router();

router.get('/socket-test', (req, res)=>{
    newsEventToClient(NewsRefreshType.NEW, req.body);
    res.send("ok")
});

export {router}
