import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as retargetEvents from 'react-shadow-dom-retarget-events';
import AppAlert from 'modules/App/containers/AppAlert';

export default class UqlUqlAlerts extends HTMLElement {
    mountPoint: HTMLSpanElement;

    createUqlAlerts() {
        return React.createElement(AppAlert, {}, React.createElement('slot'));
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
