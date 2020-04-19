import * as express from 'express'
import {router as newsRouter} from "./news";
import {router as userRouter} from "./user";
import {router as developmentRouter} from "./development";
import {router as filterRouter} from "./filter";
import {router as searchRouter} from "./search";
const router = express.Router();

router.use('/news', newsRouter);
router.use('/user', userRouter);
router.use('/filter', filterRouter);
router.use('/search', searchRouter);
router.use('/development', developmentRouter);

export {router};
