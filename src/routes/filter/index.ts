import {router as newsFilterRouter} from "./news";
import * as express from 'express'


const router = express.Router();

router.use('/news', newsFilterRouter);

export {
    router
}
