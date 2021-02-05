import React from 'react';
import { ConnectedRouter } from 'connected-react-router/immutable';
import { Route, Switch } from 'react-router';
import PropTypes from 'prop-types';
// MUI1
import { mui1theme } from 'config';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import JssProvider from 'react-jss/lib/JssProvider';
import { createGenerateClassName } from '@material-ui/core/styles';
const generateClassName = createGenerateClassName({
    dangerouslyUseGlobalCSS: false,
    productionPrefix: 'uq-espace-',
});

import WebComponentsApp from 'modules/WebComponents/container/WebComponentsApp';

const WebComponentsRoot = ({ history }) => {
    return (
        <ConnectedRouter history={history}>
            <JssProvider generateClassName={generateClassName}>
                <MuiThemeProvider theme={mui1theme}>
                    <Switch>
                        <Route component={WebComponentsApp} />
                    </Switch>
                </MuiThemeProvider>
            </JssProvider>
        </ConnectedRouter>
    );
};

WebComponentsRoot.propTypes = {
    history: PropTypes.object,
};

export default WebComponentsRoot;
