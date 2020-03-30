import {prisma} from "../../generated/prisma-client";

const createUser = async (req, res) => {
    const result = await prisma.createUser({
        ...req.body,
    });
    res.json(result)
};



async function getMe(req, res) {
    res.json({"ok": res.locals.ok})
}


export {
    createUser,
    getMe
}
