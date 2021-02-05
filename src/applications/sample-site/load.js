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

    // insert the react root for the react code to grab onto
    const reactRoot = document.createElement('div');
    reactRoot.setAttribute('id', 'react-root');
    reactRoot.setAttribute('class', 'layout-fill');
    reactRoot.setAttribute('style', 'height:auto');
    document.body.insertBefore(reactRoot, firstElement);

    // wait for the footer to exist before we move it
    const checkExist = setInterval(function () {
        const footer = document.getElementById('webComponentFooter');
        if (!!footer) {
            console.log('Exists!');
            console.log('footer = ', footer);
            !!footer && document.body.appendChild(footer.firstElementChild);
            clearInterval(checkExist);

            document.body.style.overflow = 'auto';
        }
    }, 100); // check every 100ms
}

ready(loadReusableComponents);
