import {News, prisma, ProviderAvailabilityType} from "../../generated/prisma-client";
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

async function getAllUserProviderSettings(req, res) {
    const userSettingsId = await prisma.user({id: res.locals.user.id}).settings().id();
    const providerSettings = await prisma.userSettings({id: userSettingsId}).providerSettings()
    res.status(OK).json(providerSettings);
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
    res.status(OK).json(updatedOrCreated)
}

// endregion settings/provider
// endregion settings

export {
    createUser,
    getMe,
    getFavoriteNewses,
    postRegisterFavoriteNews,
    deleteRemoveFavoriteNews,
    getAllUserProviderSettings,
    postUpdateUserProviderSetting
}
