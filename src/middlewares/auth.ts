import {prisma} from "../generated/prisma-client";
import {INTERNAL_SERVER_ERROR} from "http-status-codes";


export async function authMiddleware(req, res, next) {
    // todo implement with firebase auth
    try {
        const authToken = req.headers.authorization;
        const uid = ""; // todo get via fb admin
        const user = await prisma.user({uid: uid});
        res.locals.user = user;
        next()
    }catch (e) {
        res.status(INTERNAL_SERVER_ERROR).send("INTERNAL SERVER ERROR")
    }

}