import * as express from 'express'
import {
    getBlank, postCreateSearchHistory,
    postSearch, remoteSearchHistory
} from "./controller";
import {authMiddleware} from "../../middlewares/auth";

const router = express.Router();

import * as cors from 'cors'
router.use(cors());

router.post('/', authMiddleware, postSearch);
router.get('/', authMiddleware, getBlank);
router.delete('/history', authMiddleware, remoteSearchHistory)
router.post('/history', authMiddleware, postCreateSearchHistory)

export {router};
