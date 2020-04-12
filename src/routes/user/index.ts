import * as express from 'express'
import {
    createUser,
    getMe,
    postRegisterFavoriteNews,
    deleteRemoveFavoriteNews,
    getFavoriteNewses
} from "./controller";
import {authMiddleware} from "../../middlewares/auth";
const router = express.Router();

router.post('/', createUser);
router.get('/me', authMiddleware, getMe);
router.get('/news/favorite', authMiddleware, getFavoriteNewses);
router.post('/news/favorite', authMiddleware, postRegisterFavoriteNews);
router.delete('/news/favorite', authMiddleware, deleteRemoveFavoriteNews);
export {router};
