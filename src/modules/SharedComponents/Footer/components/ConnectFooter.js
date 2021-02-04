import React from 'react';
import { styled } from 'linaria/react';

import { default as locale } from '../footer.locale.js';
import { default as menuLocale } from 'locale/menu';

import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';

const MainConnectFooter = styled(Grid)`
    align-items: flex-start;
    display: flex;
    flex-wrap: wrap;
    font-weight: 300;
    justify-content: center;
    line-height: 25px;
    margin: 0 auto 0 auto;
    max-width: 90%;
    padding: 20px 0;
    position: relative;
    width: 100%;
    a {
        color: $secondaryDark;
        text-decoration: none;
        &:hover {
            color: $primaryMain;
            text-decoration: underline;
        }
    }
    div {
        flex-grow: 0;
        max-width: 33.333333%;
        flex-basis: 33.333333%;
    }
    @media (min-width: 1280px) {
        max-width: 1200px;
    }
`;

const SiteNavigation = styled(Grid)`
    margin-top: -4px;
    ul {
        padding: 0;
        margin: 0;
        @media (max-width: 960px) {
            text-align: center;
        }
    }
    li {
        list-style: none;
        margin: 0;
        padding: 0;
        @media (max-width: 960px) {
            display: inline-block;
        }
        @media (min-width: 960px) {
            font-size: 14px;
            line-height: 1.7;
        }
    }
`;

const Separator = styled(Hidden)`
    display: inline-block;
`;

const SocialButton = styled(Button)`
    width: 32px;
    height: 32px;
    min-width: 32px;
    padding: 0;
    background-color: $primaryMain;
    color: $whiteMain;
    &:hover {
        background-color: $primaryDark !important;
    }
`;

const Internal = styled(Grid)`
    bottom: 1rem;
    position: absolute;
    @media (max-width: 960px) {
        bottom: auto;
        margin-top: 1rem;
        position: relative;
        text-align: center;
    }
`;

const GivingBlock = styled(Grid)`
    div {
        margin-left: auto;
        @media (max-width: 960px) {
            margin: 5px auto;
            max-width: 300px;
        }
    }
    text-align: right;
`;

const GivingButtonHolder = styled(Grid)`
    max-width: 240px;
    margin-right: 10px;
    button {
        color: $whiteMain !important;
        background-color: $accentMain;
        &:hover {
            background-color: $accentDark;
        }
        padding: 1rem;
        text-transform: initial;
    }
`;

const Contacts = styled(Grid)`
    margin-top: -4px;
    max-width: 400px;
    div {
        div {
            @media (max-width: 960px) {
                margin: 0 auto;
            }
        }
    }
`;

export const ConnectFooter = () => {
    const loadLinkInSamePage = url => {
        window.location.assign(url);
    };

    const loadLinkToTarget = (url, target) => {
        window.open(url, target);
    };

    const separator = () => <Separator mdUp>&nbsp;|&nbsp;</Separator>;

    return (
        <MainConnectFooter container data-testid="connect-footer" justify="center">
            <SiteNavigation item xs={12} md={4}>
                <ul>
                    <li>
                        <a data-testid="footermenu-homepage" href={menuLocale.menuhome.linkTo}>
                            {menuLocale.menuhome.primaryText}
                        </a>
                        {separator()}
                    </li>
                    {menuLocale.publicmenu.map((linkProperties, index) => (
                        <li key={`footerli-${index}`}>
                            <a data-testid={linkProperties.dataTestid} href={linkProperties.linkTo}>
                                {linkProperties.primaryText}
                            </a>
                            {index < menuLocale.publicmenu.length - 1 && separator()}
                        </li>
                    ))}
                </ul>
            </SiteNavigation>
            <Contacts item xs={12} md={4}>
                <Grid container>
                    <Grid item xs={'auto'}>
                        <Typography variant={'h6'} component={'h3'} style={{ marginTop: -4 }}>
                            {locale.connectFooter.buttonSocialHeader}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    {locale.connectFooter.buttonSocial.map((item, index) => (
                        <Grid item xs={'auto'} key={`buttonSocial-${index}`} id={`buttonSocial-${index}`}>
                            <Tooltip
                                id={`auth-button-${index}`}
                                title={`${item.linkMouseOver}`}
                                placement="bottom"
                                TransitionProps={{ timeout: 300 }}
                            >
                                <SocialButton
                                    aria-label={item.linkMouseOver}
                                    color="primary"
                                    variant="contained"
                                    data-testid={item.dataTestid}
                                    id={`socialbutton-${index}`}
                                    onClick={() => loadLinkToTarget(item.linkTo)}
                                >
                                    {item.icon}
                                </SocialButton>
                            </Tooltip>
                        </Grid>
                    ))}
                </Grid>
                <Internal>
                    {locale.connectFooter.internalLinks.map((linkProperties, index) => {
                        return (
                            <span key={`internallabel-${index}`}>
                                <a data-testid={linkProperties.dataTestid} href={linkProperties.linkTo}>
                                    {linkProperties.linklabel}
                                </a>
                                {index < locale.connectFooter.internalLinks.length - 1 && <span>&nbsp;|&nbsp; </span>}
                            </span>
                        );
                    })}
                </Internal>
            </Contacts>
            <GivingBlock item xs={12} md={4}>
                <Grid container spacing={2}>
                    {locale.connectFooter.givingLinks.map((item, index) => {
                        return (
                            <GivingButtonHolder item xs={12} key={`givingLinks-${index}`}>
                                <Button
                                    fullWidth
                                    children={item.label}
                                    data-testid={item.dataTestid}
                                    key={`givingLinks-${index}-button`}
                                    onClick={() => loadLinkInSamePage(item.linkTo)}
                                    variant="contained"
                                />
                            </GivingButtonHolder>
                        );
                    })}
                </Grid>
            </GivingBlock>
        </MainConnectFooter>
    );
};

export default ConnectFooter;
