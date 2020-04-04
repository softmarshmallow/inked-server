import * as express from 'express'
import {
    postCreateTermsNewsFilter,
    deleteSingleTermsNewsFilter,
    getFetchAllTermsNewsFilters,
    patchUpdateSingleTermsNewsFilter,
    getSngleTermsNewsFilter
} from "./controller";

const router = express.Router();
router.post('/terms', postCreateTermsNewsFilter);
router.get('/terms', getFetchAllTermsNewsFilters);
router.get('/terms/:id', getSngleTermsNewsFilter);
router.patch('/terms/:id', patchUpdateSingleTermsNewsFilter);
router.delete('/terms/:id', deleteSingleTermsNewsFilter);

export {router};
