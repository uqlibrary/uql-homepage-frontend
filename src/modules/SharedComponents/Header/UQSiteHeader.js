import React, { useState, useRef } from 'react';
import { throttle } from 'throttle-debounce';
import { PropTypes } from 'prop-types';
import styled from 'styled-components';

import { isHdrStudent } from 'helpers/access';
import { loadChatStatus, loadCurrentAccount, loadLibHours } from 'actions';
import { APP_URL, AUTH_URL_LOGIN, AUTH_URL_LOGOUT, routes } from 'config';
import locale from 'locale/global';
import { pathConfig } from 'config/routes';
import { UQSiteHeaderLocale } from './UQSiteHeader.locale';
import { mui1theme } from 'config/index';

import { AskUs } from 'modules/App/components/AskUs';
import { AuthButton } from 'modules/SharedComponents/Toolbox/AuthButton';
import Megamenu from 'modules/App/components/Megamenu';
import MyLibrary from 'modules/App/components/MyLibrary';

import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';

// conversion ala https://levelup.gitconnected.com/material-ui-styled-components-fff4d345fb07
const SiteHeader = styled.div`
    width: 100%;
    background-color: ${mui1theme.palette.white.main};
    padding-bottom: 1rem;
`;

const SiteHeaderTop = styled(Grid)`
    max-width: 1280px;
    margin-left: auto;
    margin-right: auto;
    padding-top: 0.5rem;
    padding-bottom: 0;
    padding-left: 46px;
    padding-right: 44px;
    ${mui1theme.breakpoints.down('xs')} {
        padding-left: 12px;
        padding-right: 12px;
    }
    margin-top: 0;
    margin-bottom: 0;
`;

const SiteHeaderBottom = styled(Grid)`
    max-width: 1280px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 0;
    margin-bottom: 0;
    padding-left: 0;
    padding-right: 0;
`;

const Title = styled(Button)`
    color: ${mui1theme.palette.primary.main};
    font-size: 1.25rem;
    font-weight: 500;
    text-transform: capitalize;
    margin-left: -10px;
    &:hover {
        text-decoration: none !important;
    }
`;

const Utility = styled(Grid)`
    margin-top: -8px;
    margin-bottom: -16px;
    margin-left: 0;
    margin-right: -8px;
`;

const UtilityButton = styled(IconButton)`
    font-size: 12px;
    font-weight: 400;
    color: ${mui1theme.palette.primary.main};
    span {
        display: flex;
        flex-direction: column;
    }
`;

export const UQSiteHeader = ({
    account,
    accountLoading,
    author,
    authorDetails,
    history,
    chatStatus,
    libHours,
    libHoursLoading,
    libHoursError,
    isLibraryWebsiteCall,
    showAskusButton,
    showLoginButton,
    showMylibraryButton,
}) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen(!menuOpen);

    const throttledAccountLoad = useRef(throttle(3100, () => loadCurrentAccount()));
    const throttledOpeningHoursLoad = useRef(throttle(3100, () => loadLibHours()));
    const throttledChatStatusLoad = useRef(throttle(3100, () => loadChatStatus()));
    if (!isLibraryWebsiteCall) {
        // if the component is not inside our React app then these wont have been passed in
        !accountLoading && (!account || !author || !authorDetails) && throttledAccountLoad.current();
        !libHoursLoading && !libHours && throttledOpeningHoursLoad.current();
        !chatStatus && throttledChatStatusLoad.current();
    }

    const menuItems = routes.getMenuConfig(account, author, authorDetails, !!isHdrStudent(account), false);
    const isAuthorizedUser = !!account && !!account.id;
    const redirectUserToLogin = (isAuthorizedUser = false, redirectToCurrentLocation = false) => () => {
        const redirectUrl = isAuthorizedUser ? AUTH_URL_LOGOUT : AUTH_URL_LOGIN;
        const returnUrl = redirectToCurrentLocation || !isAuthorizedUser ? window.location.href : APP_URL;
        window.location.assign(`${redirectUrl}?url=${window.btoa(returnUrl)}`);
    };

    const visitHomepage = () => {
        const libraryHomepageUrl = 'https://www.library.uq.edu.au/';
        const localhostHomepageUrl = 'http://localhost:2020/';
        const isHomePage =
            window.location.href === libraryHomepageUrl ||
            window.location.href === localhostHomepageUrl ||
            window.location.href.startsWith(`${localhostHomepageUrl}?`);
        const isSubpageOfHomepageReactApp =
            !isHomePage &&
            (window.location.href.startsWith(libraryHomepageUrl) ||
                window.location.href.startsWith(localhostHomepageUrl)) &&
            typeof history === 'object' &&
            history !== null;

        if (isHomePage) {
            // do nothing
            return false;
        } else if (isSubpageOfHomepageReactApp) {
            return !!history && history.push(pathConfig.index);
        } else {
            window.location.href(libraryHomepageUrl);
            return false;
        }
    };

    return (
        <SiteHeader id="uq-site-header" data-testid="uq-site-header">
            <SiteHeaderTop container spacing={0}>
                <Grid item xs={'auto'}>
                    <Title
                        onClick={() => visitHomepage()}
                        id="uq-site-header-home-button"
                        data-testid="uq-site-header-home-button"
                    >
                        {UQSiteHeaderLocale.title}
                    </Title>
                </Grid>
                <Grid item xs />
                {isAuthorizedUser && showMylibraryButton && (
                    <Utility item xs={'auto'} id="mylibrary" data-testid="mylibrary">
                        <MyLibrary account={account} author={author} history={history} />
                    </Utility>
                )}
                {!!showAskusButton && (
                    <Utility item xs={'auto'} id="askus" data-testid="askus">
                        <AskUs
                            chatStatus={chatStatus}
                            libHours={libHours}
                            libHoursLoading={libHoursLoading}
                            libHoursError={libHoursError}
                        />
                    </Utility>
                )}
                {!!showLoginButton && (
                    <Utility item xs={'auto'} id="auth" data-testid="auth">
                        <AuthButton
                            isAuthorizedUser={isAuthorizedUser}
                            onClick={redirectUserToLogin(isAuthorizedUser, true)}
                        />
                    </Utility>
                )}
                <Utility item xs={'auto'} data-testid="mobile-megamenu" id="mobile-megamenu">
                    <Hidden lgUp>
                        <Grid item xs={'auto'} id="mobile-menu" data-testid="mobile-menu">
                            <Tooltip title={locale.global.mainNavButton.tooltip}>
                                <UtilityButton
                                    aria-label={locale.global.mainNavButton.aria}
                                    onClick={toggleMenu}
                                    id="main-menu-button"
                                    data-testid="main-menu-button"
                                    // classes={{ label: classes.utilityButtonLabel, root: classes.utilityButton }}
                                >
                                    {menuOpen ? <CloseIcon color={'primary'} /> : <MenuIcon color={'primary'} />}
                                    <div>Menu</div>
                                </UtilityButton>
                            </Tooltip>
                        </Grid>
                    </Hidden>
                </Utility>
            </SiteHeaderTop>
            <Grid container>
                <Hidden lgUp>
                    <Megamenu
                        history={history}
                        menuItems={menuItems}
                        menuOpen={menuOpen}
                        toggleMenu={toggleMenu}
                        isMobile
                    />
                </Hidden>
            </Grid>
            <SiteHeaderBottom
                container
                spacing={0}
                role="region"
                aria-label="Main site navigation"
                justify={'flex-start'}
            >
                <Hidden mdDown>
                    <Grid item xs={12} id="desktop-megamenu">
                        <Megamenu menuItems={menuItems} history={history} />
                    </Grid>
                </Hidden>
            </SiteHeaderBottom>
            <span
                id="after-navigation"
                role="region"
                tabIndex="0"
                aria-label="Start of content"
                style={{ position: 'fixed', top: '-2000px', left: '-2000px' }}
            >
                Start of content
            </span>
        </SiteHeader>
    );
};

UQSiteHeader.propTypes = {
    account: PropTypes.object,
    accountLoading: PropTypes.bool,
    author: PropTypes.object,
    authorDetails: PropTypes.object,
    chatStatus: PropTypes.bool,
    history: PropTypes.object,
    libHours: PropTypes.object,
    libHoursLoading: PropTypes.bool,
    libHoursError: PropTypes.bool,
    isLibraryWebsiteCall: PropTypes.bool,
    showAskusButton: PropTypes.bool,
    showLoginButton: PropTypes.bool,
    showMylibraryButton: PropTypes.bool,
};

UQSiteHeader.defaultProps = {
    isLibraryWebsiteCall: false,
    showAskusButton: false,
    showLoginButton: false,
    showMylibraryButton: false,
};

export default UQSiteHeader;
