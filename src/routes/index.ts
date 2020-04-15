import * as express from 'express'
import {router as newsRouter} from "./news";
import {router as userRouter} from "./user";
import {router as developmentRouter} from "./development";
import {router as filterRouter} from "./filter";
const router = express.Router();
const cors = require('cors')

router.use('/news', newsRouter);
router.use('/user', cors, userRouter);
router.use('/filter', filterRouter);
router.use('/development', developmentRouter);

export {router};
