import React from 'react';
import * as ReactDOM from 'react-dom';
import * as retargetEvents from 'react-shadow-dom-retarget-events';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert/components/Alert';

export default class UqlAlerts extends HTMLElement {
    createUqlAlerts() {
        return React.createElement(Alert, {}, React.createElement('slot'));
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
