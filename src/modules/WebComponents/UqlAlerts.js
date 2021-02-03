import React from 'react';
import * as ReactDOM from 'react-dom';
import * as retargetEvents from 'react-shadow-dom-retarget-events';
import JssProvider from 'react-jss/lib/JssProvider';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert/components/Alert';
import { mui1theme } from 'config/index';

import { createGenerateClassName } from '@material-ui/core/styles';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import ThemeProvider from '@material-ui/styles/ThemeProvider';

const generateClassName = createGenerateClassName({
    dangerouslyUseGlobalCSS: false,
    productionPrefix: 'uq-espace-',
});

export default class UqlAlerts extends HTMLElement {
    createUqlAlerts() {
        const alerts = React.createElement(Alert, {}, React.createElement('slot'));
        const muithemeprovider = React.createElement(MuiThemeProvider, { theme: mui1theme }, alerts);
        const themeprovider = React.createElement(ThemeProvider, { theme: mui1theme }, muithemeprovider);
        return React.createElement(JssProvider, { generateClassName: generateClassName }, themeprovider);
    }

    connectedCallback() {
        this.mountPoint = document.createElement('span');
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(this.mountPoint);

        ReactDOM.render(this.createUqlAlerts(), this.mountPoint);
        retargetEvents(shadowRoot);
    }
}

window.customElements.define('uql-alerts', UqlAlerts);
