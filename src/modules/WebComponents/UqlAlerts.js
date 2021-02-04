import React from 'react';
import * as ReactDOM from 'react-dom';
import * as retargetEvents from 'react-shadow-dom-retarget-events';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert/components/Alert';
// import AppAlertContainer from '../../App/containers/AppAlert';
import { mui1theme } from 'config';

import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';

export default class UqlAlerts extends HTMLElement {
    createUqlAlerts() {
        const alerts = React.createElement(Alert, {}, React.createElement('slot'));
        return React.createElement(MuiThemeProvider, { theme: mui1theme }, alerts);
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
