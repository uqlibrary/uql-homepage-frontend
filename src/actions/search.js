import {getSearchExternal} from 'repositories/search';

/**
 * Action types
 * for specific source actions will create source@SEARCH_ACTION, eg SEARCH_LOADING@wos etc
 */
export const SEARCH_LOADING = 'SEARCH_LOADING';
export const SEARCH_COMPLETED = 'SEARCH_COMPLETED';
export const SEARCH_FAILED = 'SEARCH_FAILED';

/**
 * External search sources
 */
export const SOURCE_WOS = 'wos';
export const SOURCE_CROSSREF = 'crossref';
export const SOURCE_SCOPUS = 'scopus';
export const SOURCE_PUBMED = 'pubmed';

/**
 * List of valid external sources
 *
 * @type {[*]}
 */
export const externalSources = [
    SOURCE_CROSSREF,
    SOURCE_PUBMED,
    SOURCE_SCOPUS,
    SOURCE_WOS
];

export function createSearchPromise(source, queryString, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({type: `${SEARCH_LOADING}@${source}`});
        getSearchExternal(source, queryString)
            .then(data => {
                dispatch({
                    type: `${SEARCH_COMPLETED}@${source}`,
                    payload: data
                });
                resolve(data);
            })
            .catch((error) => {
                console.log(error);
                dispatch({
                    type: `${SEARCH_FAILED}@${source}`,
                    payload: error
                });
                reject(error);
            });
    });
}

/**
 * Search publications from various sources
 * @param searchQuery
 * @returns {action}
 */
export function searchPublications(searchQuery) {
    return dispatch => {
        dispatch({type: SEARCH_LOADING});

        // TODO: implement internal search when available
        // const internalSearchPropmise = ...
        const externalSearchPropmises = externalSources.map(source => createSearchPromise(source, searchQuery, dispatch));

        Promise.all(externalSearchPropmises)
            .then((data) => {
                let flattenedResults = [].concat.apply([], data);
                flattenedResults = flattenedResults.slice(0, flattenedResults.length);
                dispatch({
                    type: SEARCH_COMPLETED,
                    payload: flattenedResults
                });
            })
            .catch(error => {
                dispatch({
                    type: SEARCH_FAILED,
                    payload: error
                });
            });
    };
}
