import * as express from 'express'
import {
    getBlank, postCreateSearchHistory,
    postSearch, remoteSearchHistory
} from "./controller";
import {authMiddleware} from "../../middlewares/auth";

const router = express.Router();

router.post('/', authMiddleware, postSearch);
router.get('/', getBlank);
router.delete('/history', remoteSearchHistory)
router.post('/history', postCreateSearchHistory)

export {router};
