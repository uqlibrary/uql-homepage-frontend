import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as retargetEvents from 'react-shadow-dom-retarget-events';
import { MinimalFooter } from 'modules/SharedComponents/Footer';

export default class UqlMinimalFooter extends HTMLElement {
    mountPoint: HTMLSpanElement;

    createMinimalFooter() {
        return React.createElement(MinimalFooter, {}, React.createElement('slot'));
    }

    connectedCallback() {
        this.mountPoint = document.createElement('span');
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(this.mountPoint);

        ReactDOM.render(this.createMinimalFooter(), this.mountPoint);
        retargetEvents(shadowRoot);
    }
}

window.customElements.define('uql-minimal-footer', UqlMinimalFooter);
