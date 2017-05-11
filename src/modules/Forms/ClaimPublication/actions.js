// module imports
import {showSnackbar} from '../../App';

export const PUBLICATION_RESULTS_CLEARED = 'PUBLICATION_RESULTS_CLEARED';
export const PUBLICATION_SELECTED_CLEARED = 'PUBLICATION_SELECTED_CLEARED';
export const PUBLICATION_SELECTED = 'PUBLICATION_SELECTED';

/**
 * Shows the cancel message within the snackbar
 * @returns {function(*)}
 */
export function claimThisPublicationCancelled(message) {
    return dispatch => {
        dispatch(showSnackbar(message));
    };
}

/**
 * Shows the claim publication message within the snackbar
 * @returns {function(*)}
 */
export function claimThisPublication(message) {
    return dispatch => {
        dispatch(showSnackbar(message));
    };
}


export function clearSelectedPublication() {
    return {
        type: PUBLICATION_SELECTED_CLEARED,
        payload: {}
    };
}


export function loadSelectedPublication(id) {
    return {
        type: PUBLICATION_SELECTED,
        payload: id
    };
}

export function clearPublicationResults() {
    return {
        type: PUBLICATION_RESULTS_CLEARED,
        payload: {}
    };
}

