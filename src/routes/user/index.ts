import * as express from 'express'
import {createUser, getMe} from "./controller";
import {authMiddleware} from "../../middlewares/auth";
const router = express.Router();

router.post('/', createUser);
router.get('/me', authMiddleware, getMe)
export {router};
