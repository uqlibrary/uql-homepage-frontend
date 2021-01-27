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

    // insert alerts after body-tag
    // let alerts = document.querySelector('uql-alerts');
    // if (!alerts) {
    //     // as a back up insert header if it's not defined already
    //     alerts = document.createElement('uqlibrary-alerts');
    //     document.body.insertBefore(alerts, firstElement);
    // }

    // insert header after alerts
    const header = document.createElement('uql-header');
    document.body.insertBefore(header, firstElement);

    // // insert sub footer before body-tag
    // const subFooter = document.createElement('uql-connect-footer');
    // document.body.appendChild(subFooter);
    //
    // // insert footer before body-tag
    // const footer = document.createElement('uql-minimal-footer');
    // document.body.appendChild(footer);

    window.addEventListener('WebComponentsReady', function () {
        // when react is ready - configure elements
        // these values are the default, but I wanted to show it
        header.showLoginButton = false;
        header.showAskusButton = false;
        header.showMylibraryButton = false;
    });
}

ready(loadReusableComponents);
