import {
    News,
    prisma,
    ProviderAvailabilityType,
    ProviderSettings
} from "../../generated/prisma-client";
import {INTERNAL_SERVER_ERROR, OK} from "http-status-codes";

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
                    favoriteNewses: {
                        connect: {id: news}
                    }
                }
            }
        }
    })

    const newses = await userFavoriteNewses(userId)
    res.status(OK).json(newses);
}


async function deleteRemoveFavoriteNews(req, res) {
    try{
        const {news} = req.body;
        const userId = res.locals.user.id;
        await prisma.updateUser({
            where: {id: userId}, data: {
                settings: {
                    update: {
                        favoriteNewses: {
                            disconnect: {id: news}
                        }
                    }
                }
            }
        })

        const newses = await userFavoriteNewses(userId)
        res.status(OK).json(newses);
    }catch (e) {
        console.error(e);
        res.status(INTERNAL_SERVER_ERROR).send()
    }
}

async function userFavoriteNewses(id: string): Promise<Array<News>> {
    return await prisma.user({id: id}).settings().favoriteNewses()
}

async function getFavoriteNewses(req, res) {
    const newses = await userFavoriteNewses(res.locals.user.id);
    res.status(OK).json(newses);
}

// region settings
// region settings/provider

async function getUserProviderSettings(req, res) {
    try {
        const userSettingsId = await prisma.user({id: res.locals.user.id}).settings().id();
        const providerSettings = await fetchUserProviderSettings(userSettingsId)
        res.status(OK).json(providerSettings);
    }catch (e) {
        console.error(e)
        res.status(INTERNAL_SERVER_ERROR).send()
    }
}

async function fetchUserProviderSettings(userSettingsId: string): Promise<Array<ProviderSettings>>{
    return  await prisma.userSettings({id: userSettingsId}).providerSettings();
}

interface DTO_UpdateProviderSettings {
    provider: string
    availability: ProviderAvailabilityType
}

async function postUpdateUserProviderSetting(req, res) {
    const body: DTO_UpdateProviderSettings = req.body;
    const settingId = await prisma.user({id: res.locals.user.id}).settings().id()
    const providerSettingExists = await prisma.$exists.userSettings({
        id: settingId,
        providerSettings_some: {
            provider: body.provider
        }
    })

    let updatedOrCreated;
    if (providerSettingExists) {
        updatedOrCreated = await prisma.updateUserSettings(
            {
                where: {id: settingId}, data: {
                    providerSettings: {
                        updateMany: {
                            where: {provider: body.provider},
                            data: {
                                availability: body.availability
                            }
                        }
                    }
                }
            }
        )
    } else {
        updatedOrCreated = await prisma.updateUserSettings({
            where: {id: settingId},
            data: {
                providerSettings: {
                    create: {
                        provider: body.provider,
                        availability: body.availability
                    }
                }
            }
        })
    }
    const providerSettings = await fetchUserProviderSettings(settingId);
    res.status(OK).json(providerSettings)
}

// endregion settings/provider
// endregion settings

export {
    createUser,
    getMe,
    getFavoriteNewses,
    postRegisterFavoriteNews,
    deleteRemoveFavoriteNews,
    getUserProviderSettings,
    postUpdateUserProviderSetting
}
