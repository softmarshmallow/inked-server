import {News, prisma} from "../../generated/prisma-client";
import {OK} from "http-status-codes";
import {writeHeapSnapshot} from "v8";

const createUser = async (req, res) => {
    const result = await prisma.createUser({
        ...req.body,
    });
    res.json(result)
};


async function getMe(req, res) {
    res.json(res.locals.user);
}

async function postRegisterFavoriteNews(req, res) {
    const {news} = req.body;
    const userId = res.locals.user.id;
    await prisma.updateUser({
        where: {id: userId},
        data: {
            settings: {
                update: {
                    favoriteNews: {
                        set: [{id: news}]
                    }
                }
            }
        }
    })

    const newses = await userFavoriteNewses(userId)
    res.status(OK).json(newses);
}


async function deleteRemoveFavoriteNews(req, res) {
    const {news} = req.body;
    const userId = res.locals.user.id;
    await prisma.updateUser({
        where: {id: userId}, data: {
            settings: {
                update: {
                    favoriteNews: {
                        disconnect: [{id: news}]
                    }
                }
            }
        }
    })

    const newses = await userFavoriteNewses(userId)
    res.status(OK).json(newses);
}

async function userFavoriteNewses(id: string): Promise<Array<News>>{
    return  await prisma.user({id: id}).settings().favoriteNews()
}

async function getFavoritNewses(req, res) {
    const newses = await userFavoriteNewses(res.locals.user.id);
    res.status(OK).json(newses);
}

export {
    createUser,
    getMe,
    getFavoritNewses,
    postRegisterFavoriteNews,
    deleteRemoveFavoriteNews
}
