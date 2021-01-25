// External
import '@babel/polyfill';

// eslint-disable-next-line no-unused-vars
import * as webcomponents from 'modules/webcomponents';

// Internal
import 'sass/index.scss';

// Increase default (10) event listeners to 30
require('events').EventEmitter.prototype._maxListeners = 30;

// Import mock data if required
if (process.env.BRANCH !== 'production' && process.env.USE_MOCK) {
    require('./mock');
}
