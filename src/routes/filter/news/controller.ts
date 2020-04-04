import {prisma} from "../../../generated/prisma-client";
import {ACCEPTED, CREATED, INTERNAL_SERVER_ERROR, OK} from "http-status-codes";


async function postCreateTermsNewsFilter(req, res) {
    try {
        const {terms, action} = req.body;
        const createdTermsNewsFilter = await prisma.createTermsNewsFilter(
            {
                terms: terms,
                action: action
            }
        );
        res.status(CREATED).json(createdTermsNewsFilter);
    } catch (e) {
        console.error(e);
        res.status(INTERNAL_SERVER_ERROR).send();
    }

}

async function getFetchAllTermsNewsFilters(req, res) {
    const filters = await prisma.termsNewsFilters();
    res.status(OK).json(filters);
}

async function getSngleTermsNewsFilter(req, res) {
    try {
        const {id} = req.params;
        const item = await prisma.termsNewsFilter({id: id});
        res.status(OK).json(item);
    }
    catch (e) {
        console.error(e);
        res.status(INTERNAL_SERVER_ERROR).send();
    }
}

async function patchUpdateSingleTermsNewsFilter(req, res) {
    const {terms, action} = req.body;
    try {
        const {id} = req.params;
        const updated = await prisma.updateTermsNewsFilter({
            where: {id: id}, data: {
                terms: terms,
                action: action
            }
        });
        res.status(ACCEPTED).json(updated);
    } catch (e) {
        console.error(e);
        res.status(INTERNAL_SERVER_ERROR).send();
    }
}

async function deleteSingleTermsNewsFilter(req, res) {
    try {
        const {id} = req.params;
        const deleted = await prisma.deleteTermsNewsFilter({id: id});
        res.status(ACCEPTED).json(deleted);
    } catch (e) {
        console.error(e);
        res.status(INTERNAL_SERVER_ERROR).send();
    }
}

export {
    postCreateTermsNewsFilter,
    getSngleTermsNewsFilter,
    getFetchAllTermsNewsFilters,
    deleteSingleTermsNewsFilter,
    patchUpdateSingleTermsNewsFilter
}
