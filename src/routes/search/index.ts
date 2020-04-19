import * as express from 'express'
import {
    getBlank,
    postSearch, remoteSearchHistory
} from "./controller";
import {authMiddleware} from "../../middlewares/auth";

const router = express.Router();

router.post('/', authMiddleware, postSearch);
router.get('/', authMiddleware, getBlank);
router.delete('/history', authMiddleware, remoteSearchHistory)
export {router};
