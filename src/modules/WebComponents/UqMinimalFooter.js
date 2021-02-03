import React from 'react';
import * as ReactDOM from 'react-dom';
import * as retargetEvents from 'react-shadow-dom-retarget-events';

import { MinimalFooter } from 'modules/SharedComponents/Footer';

export default class UqMinimalFooter extends HTMLElement {
    createHeader() {
        return React.createElement(MinimalFooter, {}, React.createElement('slot'));
    }

    connectedCallback() {
        const styles = document.createElement('link');
        styles.setAttribute('rel', 'stylesheet');
        styles.setAttribute('href', '/homepage-react/dist/development/main-a7ae6f80b9153ba46a45.min.css');

        this.mountPoint = document.createElement('span');
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(this.mountPoint);
        shadowRoot.appendChild(styles);

        ReactDOM.render(this.createHeader(), this.mountPoint);
        retargetEvents(shadowRoot);
    }
}

window.customElements.define('uq-minimal-footer', UqMinimalFooter);
