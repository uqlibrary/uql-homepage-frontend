import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { default as locale } from './locale.js';
import { default as menuLocale } from 'locale/menu';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const uqBlue = 'rgb(14, 98, 235)';
const styles = theme => ({
    connectFooter: {
        fontWeight: '300',
        lineHeight: '25px',
        margin: '20px auto 0 auto',
        maxWidth: '1200px',
        position: 'relative',
        '& a': {
            color: '#333',
            textDecoration: 'none',
        },
        '& div': {
            [theme.breakpoints.down('sm')]: {
                textAlign: 'center',
            },
        },
    },
    navigation: {
        '& ul': {
            padding: 0,
        },
        '& li': {
            listStyle: 'none',
            margin: 0,
            padding: 0,
            [theme.breakpoints.down('sm')]: {
                display: 'inline-block',
            },
            '& a': {
                fontSize: '14px',
            },
        },
    },
    separator: {
        display: 'none',
        [theme.breakpoints.down('sm')]: {
            display: 'inline-block',
        },
    },
    socialButtonClass: {
        '& a': {
            backgroundColor: '#000 !important',
            color: '#fff',
        },
        '& div:first-child': {
            // blog button has to be forced wider
            minWidth: '5em',
        },
        [theme.breakpoints.down('sm')]: {
            maxWidth: '400px',
            margin: '0 auto',
        },
    },
    internal: {
        bottom: '1rem',
        position: 'absolute',
        [theme.breakpoints.down('sm')]: {
            bottom: 'auto',
            marginTop: '1rem',
            position: 'relative',
        },
    },
    giving: {
        '& div': {
            marginLeft: 'auto',
            [theme.breakpoints.down('sm')]: {
                margin: '5px auto',
            },
        },
        textAlign: 'right',
    },
    givingButtonClass: {
        color: theme.palette.white.main + '!important',
        backgroundColor: uqBlue,
        '&:hover': {
            backgroundColor: theme.palette.white.main,
            color: uqBlue + ' !important',
        },
        width: '70%',
        marginBottom: '1rem',
        padding: '1rem',
    },
    contacts: {
        '& div': {
            '& div': {
                [theme.breakpoints.down('sm')]: {
                    margin: '0 auto',
                },
            },
        },
    },
});

export function ConnectFooter(props) {
    const { classes } = props;
    const separator = <li className={classes.separator}>&nbsp;|&nbsp;</li>;
    return (
        <Grid className={classes.connectFooter} container data-testid="connect-footer">
            <Grid item xs={12} md={4} className={classes.navigation}>
                <ul>
                    <li>
                        <a href={menuLocale.home.linkTo} data-testid={menuLocale.home.dataTestid}>
                            {menuLocale.home.primaryText}
                        </a>
                    </li>
                    {separator}
                    {menuLocale.menu.map((item, index) => (
                        <Fragment>
                            <li>
                                <a
                                    href={item.linkTo}
                                    data-testid={item.dataTestid}
                                    rel={item.relOpener || 'noopener noreferrer'}
                                >
                                    {item.primaryText}
                                </a>
                            </li>
                            {index < menuLocale.menu.length - 1 && separator}
                        </Fragment>
                    ))}
                </ul>
            </Grid>
            <Grid item xs={12} md={4} className={classes.contacts}>
                <Grid container>
                    <Grid item>
                        <Typography variant={'h6'} component={'h3'}>
                            {locale.connectFooter.buttonSocialLabel}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container className={classes.socialButtonClass}>
                    {locale.connectFooter.buttonSocial.map((item, index) => (
                        <Grid aria-disabled="false" item role="button" xs={2}>
                            <IconButton
                                color="primary"
                                data-testid={item.dataTestid}
                                href={item.linkTo}
                                key={`buttonSocial-${index}`}
                                target="_blank"
                                title={item.linktitle}
                            >
                                {!!item.linklabel ? item.linklabel : item.icon}
                            </IconButton>
                        </Grid>
                    ))}
                </Grid>
                <div className={classes.internal}>
                    {locale.connectFooter.internalLinks.map((item, index) => {
                        return (
                            <Fragment>
                                <a
                                    href={item.linkTo}
                                    data-testid={item.dataTestid}
                                    key={`internalLinks-${index}`}
                                    rel={item.relOpener || 'noopener noreferrer'}
                                >
                                    {item.linklabel}
                                </a>
                                {index < locale.connectFooter.internalLinks.length - 1 && <span>&nbsp;|&nbsp; </span>}
                            </Fragment>
                        );
                    })}
                </div>
            </Grid>
            <Grid item xs={12} md={4} className={classes.giving}>
                {locale.connectFooter.givingLinks.map((item, index) => {
                    return (
                        <Button
                            variant="contained"
                            className={classes.givingButtonClass}
                            href={item.linkTo}
                            key={`givingLinks-${index}`}
                            data-testid={item.dataTestid}
                            children={item.label}
                        />
                    );
                })}
            </Grid>
        </Grid>
    );
}

ConnectFooter.propTypes = {
    classes: PropTypes.object.isRequired,
};

ConnectFooter.defaultProps = {
    classes: {},
};

export default withStyles(styles, { withTheme: true })(ConnectFooter);
