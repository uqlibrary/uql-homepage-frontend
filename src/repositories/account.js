import {api} from 'config';

/**
 * Fetches the user's account
 * @returns {Promise}
 */
export function getAccount() {
    return new Promise((resolve, reject) => {
        const now = new Date().getTime();
        api.get('account?' + now).then(response => {
            if (response.data && response.data.hasOwnProperty('hasSession') && response.data.hasSession === true) {
                resolve(response.data);
            } else {
                reject({
                    response: {
                        status: 403,
                        data: 'Unauthorized user'
                    },
                });
            }
        }).catch(e => {
            if (e.hasOwnProperty('response') && e.response !== null && typeof(e.response) !== 'undefined'
                && e.response.hasOwnProperty('status') && (e.response.status === 401 || e.response.status === 403)) {
                console.log('Unauthorized user....');
            }
            reject(e);
        });
    });
}
