import { ReactCustomElement } from 'web-components-with-react';
import UQSiteHeader from 'modules/SharedComponents/Header/UQSiteHeader';

// may have to something larger with a container to get the account to feed in?
const LibraryHeader = () => {
    // possibly fix the reference with https://www.npmjs.com/package/modify-source-webpack-plugin
    return (
        // eslint-disable-next-line react/react-in-jsx-scope
        <>
            {/* eslint-disable-next-line react/react-in-jsx-scope */}
            <link rel="stylesheet" href="/homepage-react/dist/development/main-cfe5320bb6afc419eba0.min.css" />
            {/* eslint-disable-next-line react/react-in-jsx-scope */}
            <UQSiteHeader />
        </>
    );
};

customElements.define('library-header', ReactCustomElement(LibraryHeader));
