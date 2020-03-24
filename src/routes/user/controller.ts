import {prisma} from "../../generated/prisma-client";

const createUser = async (req, res) => {
    const result = await prisma.createUser({
        ...req.body,
    });
    res.json(result)
};

export {
    createUser
}
