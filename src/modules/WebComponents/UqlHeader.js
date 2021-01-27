import React from 'react';
import * as ReactDOM from 'react-dom';
import * as retargetEvents from 'react-shadow-dom-retarget-events';
import UQSiteHeader from 'modules/SharedComponents/Header/UQSiteHeader';
// import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
// import ThemeProvider from '@material-ui/styles/ThemeProvider';
// import { mui1theme } from 'config';

// TODO need to include UQHeader and UQSiteHeader
export default class UqlHeader extends HTMLElement {
    static get observedAttributes() {
        return ['showLoginButton', 'showAskusButton', 'showMylibraryButton'];
    }

    createHeader(showAskusButton, showLoginButton, showMylibraryButton) {
        console.log('about to createElement');
        return React.createElement(
            UQSiteHeader,
            { showAskusButton, showLoginButton, showMylibraryButton },
            React.createElement('slot'),
        );
        // const header = React.createElement(
        //     UQSiteHeader,
        //     { showAskusButton, showLoginButton, showMylibraryButton },
        //     React.createElement('slot'),
        // );
        // return React.createElement(MuiThemeProvider, { theme: mui1theme }, header);
    }

    connectedCallback() {
        this.mountPoint = document.createElement('span');
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(this.mountPoint);

        const showAskusButton = this.getAttribute('showAskusButton');
        const showLoginButton = this.getAttribute('showLoginButton');
        const showMylibraryButton = this.getAttribute('showMylibraryButton');
        console.log('about to render');
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
