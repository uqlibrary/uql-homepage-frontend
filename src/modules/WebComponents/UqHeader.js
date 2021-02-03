import React from 'react';
import * as ReactDOM from 'react-dom';
import * as retargetEvents from 'react-shadow-dom-retarget-events';
import JssProvider from 'react-jss/lib/JssProvider';

import { mui1theme } from 'config/index';
import { UQHeader as UQHeaderReact } from 'modules/SharedComponents/Header/UQHeader';

import { createGenerateClassName } from '@material-ui/core/styles';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import ThemeProvider from '@material-ui/styles/ThemeProvider';

const generateClassName = createGenerateClassName({
    dangerouslyUseGlobalCSS: false,
    productionPrefix: 'uq-espace-',
});

// TODO need to include UQHeader as well as UQSiteHeader
export default class UqHeader extends HTMLElement {
    // static get observedAttributes() {
    //     return ['showLoginButton', 'showAskusButton', 'showMylibraryButton'];
    // }

    createHeader() {
        const header = React.createElement(UQHeaderReact, {}, React.createElement('slot'));
        const muithemeprovider = React.createElement(MuiThemeProvider, { theme: mui1theme }, header);
        const themeprovider = React.createElement(ThemeProvider, { theme: mui1theme }, muithemeprovider);
        return React.createElement(JssProvider, { generateClassName: generateClassName }, themeprovider);
    }

    connectedCallback() {
        const styles = document.createElement('link');
        styles.setAttribute('rel', 'stylesheet');
        // https://www.npmjs.com/package/modify-source-webpack-plugin
        styles.setAttribute('href', '/homepage-react/dist/development/main-dc172b3d43cb187382f7.min.css');

        this.mountPoint = document.createElement('span');
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(this.mountPoint);
        shadowRoot.appendChild(styles);

        ReactDOM.render(this.createHeader(), this.mountPoint);
        retargetEvents(shadowRoot);
    }

    // attributeChangedCallback(name, oldValue, newValue) {
    //     if (['showLoginButton', 'showAskusButton', 'showMylibraryButton'].includes(name)) {
    //         // this doesnt make sense - must pass all 3 values! TODO
    //         ReactDOM.render(this.createHeader(newValue), this.mountPoint);
    //     }
    // }
}

window.customElements.define('uq-header', UqHeader);
