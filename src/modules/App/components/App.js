import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Route, Switch} from 'react-router';
import {routes, AUTH_URL_LOGIN, AUTH_URL_LOGOUT, APP_URL} from 'config';
import locale from 'locale/global';

// application components
import {AppLoader} from 'modules/SharedComponents/Toolbox/Loaders';
import {InlineLoader} from 'modules/SharedComponents/Toolbox/Loaders';
import {MenuDrawer} from 'modules/SharedComponents/Toolbox/MenuDrawer';
import {HelpDrawer} from 'modules/SharedComponents/Toolbox/HelpDrawer';
import {AuthButton} from 'modules/SharedComponents/Toolbox/AuthButton';
import {Alert} from 'modules/SharedComponents/Toolbox/Alert';
import AppAlertContainer from '../containers/AppAlert';
import {Meta} from 'modules/SharedComponents/Meta';
import {OfflineSnackbar} from 'modules/SharedComponents/OfflineSnackbar';
import {SearchComponent} from 'modules/SharedComponents/SearchComponent';
import {ConfirmDialogBox} from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import * as pages from './pages';

// MUI1
import {Tooltip, Fade, AppBar, Toolbar, Typography, IconButton, Grid, Hidden} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {withStyles} from '@material-ui/core/styles';

const logo = require('../../../images/uq-logo-white-minimal.svg');

const styles = theme => ({
    layoutCard: {
        maxWidth: '1200px',
        margin: '24px auto',
        width: '90%',
        padding: 0,
        [theme.breakpoints.down('sm')]: {
            margin: '0 auto 24px auto'
        },
    },
    layoutFill: {
        margin: 0,
        padding: 0,
        maxHeight: '100%',
        height: '100%'
    },
    titleLink: {
        '& a': {
            textDecoration: 'none',
            '&:hover': {
                textDecoration: 'underline'
            }
        }
    }
});

export class App extends PureComponent {
    static propTypes = {
        account: PropTypes.object,
        author: PropTypes.object,
        accountLoading: PropTypes.bool,
        accountAuthorLoading: PropTypes.bool,
        isSessionExpired: PropTypes.bool,
        actions: PropTypes.object,
        location: PropTypes.object,
        history: PropTypes.object.isRequired,
        classes: PropTypes.object
    };
    static childContextTypes = {
        isMobile: PropTypes.bool,
        selectFieldMobileOverrides: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            menuDrawerOpen: false,
            docked: false,
            mediaQuery: window.matchMedia('(min-width: 1280px)'),
            isMobile: window.matchMedia('(max-width: 720px)').matches,
        };
    }

    getChildContext() {
        return {
            isMobile: this.state.isMobile,
            selectFieldMobileOverrides: {
                style: !this.state.isMobile ? {width: '100%'} : {},
                autoWidth: !this.state.isMobile,
                fullWidth: this.state.isMobile,
                menuItemStyle: this.state.isMobile ? {
                    whiteSpace: 'normal',
                    lineHeight: '18px',
                    paddingBottom: '8px'
                } : {},
            }
        };
    }

    componentDidMount() {
        this.props.actions.loadCurrentAccount();
        this.handleResize(this.state.mediaQuery);
        this.state.mediaQuery.addListener(this.handleResize);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isSessionExpired) {
            this.sessionExpiredConfirmationBox.showConfirmation();
        }
    }

    componentWillUnmount() {
        this.state.mediaQuery.removeListener(this.handleResize);
    }

    handleResize = (mediaQuery) => {
        this.setState({
            docked: mediaQuery.matches
        });
    };

    toggleDrawer = () => {
        this.setState({
            menuDrawerOpen: !this.state.menuDrawerOpen
        });
    };

    redirectUserToLogin = (isAuthorizedUser = false, redirectToCurrentLocation = false) => () => {
        const redirectUrl = isAuthorizedUser ? AUTH_URL_LOGOUT : AUTH_URL_LOGIN;
        const returnUrl = redirectToCurrentLocation || !isAuthorizedUser ? window.location.href : APP_URL;
        window.location.assign(`${redirectUrl}?url=${window.btoa(returnUrl)}`);
    };

    redirectToOrcid = () => {
        if (window.location.search.indexOf('?') >= 0 && window.location.search.indexOf('code') >= 0) {
            // if user already received an orcid response - clean up query string by redirecting via window.location
            window.location.assign(routes.pathConfig.authorIdentifiers.orcid.absoluteLink);
        } else {
            this.props.history.push(routes.pathConfig.authorIdentifiers.orcid.link);
        }
    };

    isPublicPage = (menuItems) => (
        menuItems
            .filter(menuItem => this.props.location.pathname === menuItem.linkTo && menuItem.public)
            .length > 0
        || (new RegExp(routes.pathConfig.records.view(`(${routes.pidRegExp})`)).test(this.props.location.pathname))
    );

    setSessionExpiredConfirmation = (ref) => {
        this.sessionExpiredConfirmationBox = ref;
    };

    hideBrokenImage = () =>{
        document.getElementById('logo').style.display = 'none';
    };

    render() {
        const {classes} = this.props;
        if (this.props.accountLoading) {
            return (
                <Grid container zeroMinWidth className={classes.layoutFill}>
                    <Grid item xs={12}>
                        <AppLoader
                            title={locale.global.title}
                            logoImage={locale.global.logo.image}
                            logoText={locale.global.logo.label}/>
                    </Grid>
                </Grid>
            );
        }

        const isAuthorizedUser = !this.props.accountLoading && this.props.account !== null;
        const isAuthorLoading = this.props.accountLoading || this.props.accountAuthorLoading;
        const isOrcidRequired = this.props.author && !this.props.author.aut_orcid_id
            && this.props.location.pathname !== routes.pathConfig.authorIdentifiers.orcid.link;
        const isHdrStudent = !isAuthorLoading && !!this.props.account && !!this.props.author
            && this.props.account.class.indexOf('IS_CURRENT') >= 0
            && this.props.account.class.indexOf('IS_UQ_STUDENT_PLACEMENT') >= 0;

        const menuItems = routes.getMenuConfig(this.props.account, isOrcidRequired && isHdrStudent);
        const isPublicPage = this.isPublicPage(menuItems);
        const isThesisSubmissionPage = this.props.location.pathname === routes.pathConfig.hdrSubmission ||
            this.props.location.pathname === routes.pathConfig.sbsSubmission;
        const isSearchPage = this.props.location.pathname === routes.pathConfig.records.search ||
            this.props.location.pathname === routes.pathConfig.records.search;

        const showMenu = !isThesisSubmissionPage;
        const containerStyle = this.state.docked && !isThesisSubmissionPage ? {paddingLeft: 260} : {};
        if (!isAuthorizedUser && isThesisSubmissionPage) {
            this.redirectUserToLogin()();
            return (<div/>);
        }

        let userStatusAlert = null;
        if (!this.props.accountLoading && !this.props.account && !isPublicPage) {
            // user is not logged in
            userStatusAlert = {
                ...locale.global.loginAlert,
                action: this.redirectUserToLogin()
            };
        } else if (!isPublicPage && !isAuthorLoading && this.props.account && !this.props.author) {
            // user is logged in, but doesn't have eSpace author identifier
            userStatusAlert = {
                ...locale.global.notRegisteredAuthorAlert
            };
        } else if (!isPublicPage && !isAuthorLoading && isOrcidRequired && !isHdrStudent && !isThesisSubmissionPage) {
            // user is logged in, but doesn't have ORCID identifier
            userStatusAlert = {
                ...locale.global.noOrcidAlert,
                action: this.redirectToOrcid
            };
        } else if (!isPublicPage && !isThesisSubmissionPage && !isAuthorLoading && isOrcidRequired && isHdrStudent) {
            // user is logged in, but doesn't have ORCID identifier
            userStatusAlert = {
                ...locale.global.forceOrcidLinkAlert
            };
        }
        const routesConfig = routes.getRoutesConfig({
            components: pages,
            account: this.props.account,
            forceOrcidRegistration: isOrcidRequired && isHdrStudent,
            isHdrStudent: isHdrStudent
        });
        const titleStyle = this.state.docked && !isThesisSubmissionPage ? {paddingLeft: 284} : {paddingLeft: 0};
        return (
            <Grid container className={classes.layoutFill}>
                <Meta routesConfig={routesConfig}/>
                <AppBar
                    className="AppBar"
                    color={'primary'}
                    position={'fixed'}>
                    <Toolbar style={{height: '70px'}}>
                        <Grid container spacing={8}
                            alignItems="center"
                            direction="row"
                            wrap="nowrap"
                            justify="flex-start">
                            {/* Menu/Close Button */}
                            {
                                !this.state.docked && !isThesisSubmissionPage &&
                                <Grid item zeroMinWidth>
                                    <Tooltip title={locale.global.mainNavButton.tooltip}
                                        placement="bottom-end"
                                        TransitionComponent={Fade}>
                                        <IconButton
                                            aria-label={locale.global.mainNavButton.aria}
                                            style={{marginLeft: '-12px', marginRight: '12px'}}
                                            onClick={this.toggleDrawer}>
                                            <Menu style={{color: 'white'}}/>
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            }
                            {/* Logo */}
                            <Hidden smDown={!isThesisSubmissionPage}>
                                <Grid item style={titleStyle}>
                                    <img id="logo" src={logo} style={{width: 66, height: 66}} aria-label={locale.global.logo.label} onError={this.hideBrokenImage} />
                                </Grid>
                            </Hidden>
                            {/* Title */}
                            <Grid item style={{flexGrow: 1}}>
                                <Typography variant="title" noWrap className={classes.titleLink}>
                                    {locale.global.appTitle}
                                </Typography>
                            </Grid>
                            {/* Search */}
                            {!isThesisSubmissionPage && !isSearchPage &&
                                <Grid item md={4} zeroMinWidth>
                                    <SearchComponent isInHeader showPrefixIcon showMobileSearchButton/>
                                </Grid>
                            }
                            <Grid item xs={'auto'} zeroMinWidth>
                                <AuthButton
                                    isAuthorizedUser={isAuthorizedUser}
                                    onClick={this.redirectUserToLogin(isAuthorizedUser, isAuthorizedUser && !isHdrStudent && isThesisSubmissionPage)}
                                    signInTooltipText={locale.global.authentication.signInText}
                                    signOutTooltipText={isAuthorizedUser ? (`${locale.global.authentication.signOutText} - ${this.props.account.name}`) : ''}
                                    ariaLabel={isAuthorizedUser ? locale.global.authentication.ariaOut : locale.global.authentication.ariaIn} />
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
                {
                    showMenu &&
                    <MenuDrawer
                        menuItems={menuItems}
                        drawerOpen={this.state.docked || this.state.menuDrawerOpen}
                        docked={this.state.docked}
                        history={this.props.history}
                        logoImage={locale.global.logo.image}
                        logoText={locale.global.logo.label}
                        logoLink={locale.global.logo.link}
                        onToggleDrawer={this.toggleDrawer}
                        isMobile={this.state.isMobile}
                        locale={{
                            skipNavAriaLabel: locale.global.skipNav.ariaLabel,
                            skipNavTitle: locale.global.skipNav.title,
                            closeMenuLabel: locale.global.mainNavButton.closeMenuLabel
                        }}/>
                }
                <div className="content-container" style={containerStyle}>
                    <ConfirmDialogBox
                        hideCancelButton
                        onRef={this.setSessionExpiredConfirmation}
                        onAction={this.props.actions.logout}
                        locale={locale.global.sessionExpiredConfirmation}
                    />
                    {
                        userStatusAlert &&
                        <Grid container alignContent={'center'} justify={'center'} alignItems={'center'} >
                            <Grid item className={classes.layoutCard} style={{marginTop: 0, marginBottom: 0}}>
                                <Alert {...userStatusAlert} />
                            </Grid>
                        </Grid>
                    }
                    <AppAlertContainer/>
                    {
                        isAuthorLoading &&
                        <InlineLoader message={locale.global.loadingUserAccount}/>
                    }

                    {
                        !isAuthorLoading &&
                        <Switch>
                            {
                                routesConfig.map((route, index) => (
                                    <Route key={`route_${index}`} {...route} />
                                ))
                            }
                        </Switch>
                    }
                </div>
                <HelpDrawer/>
                <OfflineSnackbar/>
            </Grid>
        );
    }
}

export default withStyles(styles, {withTheme: true})(App);
