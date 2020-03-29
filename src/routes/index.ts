import * as express from 'express'
import {router as newsRouter} from "./news";
import {router as userRouter} from "./user";
import {router as developmentRouter} from "./development";

const router = express.Router();

router.use('/news', newsRouter);
router.use('/user', userRouter);
router.use('/development', developmentRouter);

export {router};
