import React from 'react';
import * as ReactDOM from 'react-dom';
import * as retargetEvents from 'react-shadow-dom-retarget-events';
import JssProvider from 'react-jss/lib/JssProvider';

import { mui1theme } from 'config/index';
import UQSiteHeader from 'modules/SharedComponents/Header/UQSiteHeader';

import { createGenerateClassName } from '@material-ui/core/styles';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import ThemeProvider from '@material-ui/styles/ThemeProvider';

const generateClassName = createGenerateClassName({
    dangerouslyUseGlobalCSS: false,
    productionPrefix: 'uq-espace-',
});

// TODO need to include UQHeader as well as UQSiteHeader
export default class UqlHeader extends HTMLElement {
    static get observedAttributes() {
        return ['showLoginButton', 'showAskusButton', 'showMylibraryButton'];
    }

    createHeader(showAskusButton, showLoginButton, showMylibraryButton) {
        const header = React.createElement(
            UQSiteHeader,
            { showAskusButton, showLoginButton, showMylibraryButton },
            React.createElement('slot'),
        );
        const muithemeprovider = React.createElement(MuiThemeProvider, { theme: mui1theme }, header);
        const themeprovider = React.createElement(ThemeProvider, { theme: mui1theme }, muithemeprovider);
        return React.createElement(JssProvider, { generateClassName: generateClassName }, themeprovider);
    }

    connectedCallback() {
        this.mountPoint = document.createElement('span');
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(this.mountPoint);

        const showAskusButton = this.getAttribute('showAskusButton');
        const showLoginButton = this.getAttribute('showLoginButton');
        const showMylibraryButton = this.getAttribute('showMylibraryButton');
        ReactDOM.render(this.createHeader(showAskusButton, showLoginButton, showMylibraryButton), this.mountPoint);
        retargetEvents(shadowRoot);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (['showLoginButton', 'showAskusButton', 'showMylibraryButton'].includes(name)) {
            // this doesnt make sense - must pass all 3 values! TODO
            ReactDOM.render(this.createHeader(newValue), this.mountPoint);
        }
    }
}

window.customElements.define('uql-header', UqlHeader);
