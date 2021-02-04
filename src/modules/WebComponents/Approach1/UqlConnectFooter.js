import React from 'react';
import * as ReactDOM from 'react-dom';
import * as retargetEvents from 'react-shadow-dom-retarget-events';

import { ConnectFooter } from 'modules/SharedComponents/Footer/components/ConnectFooter';
import { mui1theme } from 'config/index';

import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';

export default class UqlConnectFooter extends HTMLElement {
    createConnectFooter() {
        const connectfooter = React.createElement(ConnectFooter, {}, React.createElement('slot'));
        return React.createElement(MuiThemeProvider, { theme: mui1theme }, connectfooter);
        // return React.createElement(MuiThemeProvider, {}, connectfooter);
    }

    connectedCallback() {
        const styles = document.createElement('link');
        styles.setAttribute('rel', 'stylesheet');
        // https://www.npmjs.com/package/modify-source-webpack-plugin
        styles.setAttribute('href', '/homepage-react/dist/development/webcomponents-e89843e11ddb1ea0738d.min.css');

        this.mountPoint = document.createElement('span');
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(this.mountPoint);
        shadowRoot.appendChild(styles);

        ReactDOM.render(this.createConnectFooter(), this.mountPoint);
        retargetEvents(shadowRoot);
    }
}

window.customElements.define('uql-connect-footer', UqlConnectFooter);
