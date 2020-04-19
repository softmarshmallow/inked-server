import {prisma} from "../generated/prisma-client";
import {UNAUTHORIZED} from "http-status-codes";
import {MASTER_USER_UID} from "../seed";

async function getUid(token: string) : Promise<string>{
    return token; // for development purpose, we are using uid as token

    // todo implement with firebase auth
    // return (await admin.auth().verifyIdToken(token[1])).uid;
}

export async function authMiddleware(req, res, next) {
    // const authorization = req.headers.authorization;
    // if (authorization) {
    //     try {
    //         const token = authorization.split(' ')[1] // token is formatted as `Bearer <REAL_TOKEN_VALUE>`, we split with white spaces.
    //         const uid = await getUid(token);
    //         res.locals.user = await prisma.user({uid: uid});
    //         next()
    //     } catch (e) {
    //         console.log(e);
    //         res.status(UNAUTHORIZED).send(e)
    //     }
    // } else {
    //     res.status(UNAUTHORIZED).send();
    // }
    // fixme dangerous
    res.locals.user = await prisma.user({uid: MASTER_USER_UID});
    next()
}
