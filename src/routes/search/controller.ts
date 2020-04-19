import core from "@bridged.io/remote-ui-core"
import {ACCEPTED, OK} from "http-status-codes";
import {prisma, SearchHistory} from "../../generated/prisma-client";

export async function getBlank(req, res) {

    const user = res.locals.user;
    console.log(user);
    console.log({user: {id: user.id}})

    const searchHistories = await prisma.searchHistories(
        {
            where: {user: {id: user.id}},
        },
    )
    let results: Array<core.SearchLayouts.SearchItemLayoutBase> = []

    for (let h of searchHistories) {
        results.push(searchHistoryToBasicSearchItem(h))
    }

    res.status(OK).json(results)
}

function searchHistoryToBasicSearchItem(searchHistory: SearchHistory): core.SearchLayouts.SearchHistoryItemLayout {
    return new core.SearchLayouts.SearchHistoryItemLayout({
        title: new core.UI.Text(searchHistory.term),
        meta: new core.UI.Text(searchHistory.at),
    })
}


export async function postSearch(req, res) {
    const {term} = req.body;
    const user = res.locals.user;

    const exists = await prisma.$exists.searchHistory(
        {user: {id: user.id}, term: term}
    )

    let history;

    if (exists) {
        history = (await prisma.searchHistories(
            {
                where: {user: {id: user.id}, term: term}
            }
        ))[0];
        history = await prisma.updateSearchHistory(
            {
                where: {id: history.id},
                data: {
                    term: term,
                }
            }
        )
    } else {
        history = await prisma.createSearchHistory({
            user: {connect: {id: user.id}},
            term: term
        })
    }

    res.status(OK).json(history);
}

export async function remoteSearchHistory(req, res) {
    const {term} = req.body;
    const user = res.locals.user;
    await prisma.deleteManySearchHistories(
        {
            user: {id: user.id},
            term: term
        }
    )
    res.status(ACCEPTED).send();
}
