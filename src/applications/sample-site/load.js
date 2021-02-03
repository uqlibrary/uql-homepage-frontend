function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function loadReusableComponents() {
    // insert elements, even before React is loaded

    // first element of the original document
    const firstElement = document.body.children[0];

    // insert header at body start
    const uqheader = document.createElement('uq-header');
    document.body.insertBefore(uqheader, firstElement);

    // // const header = document.createElement('library-header');
    const header = document.createElement('uql-header'); // older approach
    document.body.insertBefore(header, firstElement);

    // insert alerts after headers
    // const alerts = document.createElement('uql-alerts');
    // // const alerts = document.createElement('alerts-web-component');
    // document.body.insertBefore(alerts, firstElement);

    // // insert sub footer before body-tag
    // const subFooter = document.createElement('library-connect-footer');
    const subFooter = document.createElement('uql-connect-footer');
    document.body.appendChild(subFooter);

    // insert footer before body-tag
    const footer = document.createElement('uq-minimal-footer');
    document.body.appendChild(footer);

    window.addEventListener('WebComponentsReady', function () {
        // when react is ready - configure elements
        // these values are the default, but I wanted to show it
        header.showLoginButton = true;
        header.showAskusButton = true;
        header.showMylibraryButton = true;
    });
}

ready(loadReusableComponents);
