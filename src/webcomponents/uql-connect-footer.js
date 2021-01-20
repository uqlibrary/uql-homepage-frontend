import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as retargetEvents from 'react-shadow-dom-retarget-events';
import { ConnectFooter } from 'modules/SharedComponents/Footer';

export default class UqlConnectFooter extends HTMLElement {
    mountPoint: HTMLSpanElement;

    createConnectFooter() {
        return React.createElement(ConnectFooter, {}, React.createElement('slot'));
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
