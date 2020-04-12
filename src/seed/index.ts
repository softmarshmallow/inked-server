import {prisma} from "../generated/prisma-client";

export const MASTER_USER_UID = "master-user";
export const SUPER_DEVELOPER_BOT_USER_UID = "super-user-developer";

async function seed() {

    // master user
    await prisma.createUser({
        uid: MASTER_USER_UID,
        name: "mater user",
        robot: false,
        settings: {
            create: {
                favoriteNewses: {create: []},
                memo: "created by seeding"
            }
        }
    })

    // developer bot user
    await prisma.createUser({
        uid: SUPER_DEVELOPER_BOT_USER_UID,
        name: "super developer bot user",
        robot: true,
        settings: {
            create: {
                favoriteNewses: {create: []},
                memo: "created by seeding"
            }
        }
    })
}

export {
    seed
}

if (require.main === module) {
    seed();
}
