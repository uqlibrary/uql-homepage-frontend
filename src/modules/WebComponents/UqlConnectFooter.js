import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as retargetEvents from 'react-shadow-dom-retarget-events';

import { ConnectFooter } from 'modules/SharedComponents/Footer';
// import { mui1theme } from 'config/index';

import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';

export default class UqlConnectFooter extends HTMLElement {
    createConnectFooter() {
        const connectfooter = React.createElement(ConnectFooter, {}, React.createElement('slot'));
        // return React.createElement(MuiThemeProvider, { theme: mui1theme }, connectfooter);
        return React.createElement(MuiThemeProvider, {}, connectfooter);
    }

    connectedCallback() {
        this.mountPoint = document.createElement('span');
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(this.mountPoint);

        ReactDOM.render(this.createConnectFooter(), this.mountPoint);
        retargetEvents(shadowRoot);
    }
}

window.customElements.define('uql-connect-footer', UqlConnectFooter);
