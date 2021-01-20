import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as retargetEvents from 'react-shadow-dom-retarget-events';
import UQSiteHeader from 'modules/App/components/UQSiteHeader';

export default class UqlHeader extends HTMLElement {
    static get observedAttributes() {
        return ['showLoginButton'];
    }

    mountPoint: HTMLSpanElement;
    showLoginButton: boolean;

    createHeader(showLoginButton) {
        return React.createElement(UQSiteHeader, { showLoginButton }, React.createElement('slot'));
    }

    connectedCallback() {
        this.mountPoint = document.createElement('span');
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(this.mountPoint);

        const showLoginButton = this.getAttribute('showLoginButton');
        ReactDOM.render(this.createHeader(showLoginButton), this.mountPoint);
        retargetEvents(shadowRoot);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'showLoginButton') {
            ReactDOM.render(this.createHeader(newValue), this.mountPoint);
        }
    }
}

window.customElements.define('uql-header', UqlHeader);
