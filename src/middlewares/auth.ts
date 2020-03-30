import * as admin from 'firebase-admin';
import { prisma } from "../generated/prisma-client";
import { INTERNAL_SERVER_ERROR, UNAUTHORIZED } from "http-status-codes";


export async function authMiddleware(req, res, next) {
    const authorization = req.headers.authorization;
    if (authorization) {

        // todo implement with firebase auth
        try {
            const token = authorization.split(' ')[1] // token is formatted as `Bearer <REAL_TOKEN_VALUE>`, we split with white spaces.
            const uid = await (await admin.auth().verifyIdToken(token[1])).uid
            const user = await prisma.user({ uid: uid });
            res.locals.user = user;
            next()
        } catch (e) {
            console.log(e);
            res.status(UNAUTHORIZED).send(e)
        }
    } else {
        res.status(UNAUTHORIZED).send();
    }
}
