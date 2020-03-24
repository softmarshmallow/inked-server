import * as express from 'express'
import {router as newsRouter} from "./news";
import {router as userRouter} from "./user";
const router = express.Router();

router.use('/news', newsRouter);
router.use('/user', userRouter);

export {router};
