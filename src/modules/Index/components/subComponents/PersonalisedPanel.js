import React from 'react';
import { PropTypes } from 'prop-types';

import { seeFines, seeLoans, seePrintBalance } from 'helpers/access';

import { makeStyles } from '@material-ui/styles';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import PrintIcon from '@material-ui/icons/Print';

// import { useCookies } from 'react-cookie';
const moment = require('moment');

const useStyles = makeStyles(theme => ({
    flexWrapper: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        borderLeft: '1px solid' + theme.palette.secondary.light,
        paddingLeft: 32,
        [theme.breakpoints.down('sm')]: {
            borderLeft: 'none',
            paddingLeft: 0,
        },
    },
    flexHeader: {
        height: 'auto',
    },
    flexContent: {
        flexGrow: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingTop: 12,
        [theme.breakpoints.down('sm')]: {
            overflowX: 'hidden',
            overflowY: 'hidden',
            paddingLeft: 0,
        },
    },
    flexFooter: {
        height: 'auto',
    },
    greeting: {
        fontSize: '2.25rem',
        lineHeight: 1,
    },
    uqidIcon: {
        marginBottom: -2,
        marginRight: 6,
        height: 12,
        width: 12,
    },
    ppButton: {
        width: 24,
        minWidth: 24,
        height: 24,
        padding: 8,
        margin: 2,
        backgroundColor: theme.palette.accent.main,
        '&:hover': {
            backgroundColor: theme.palette.accent.dark,
        },
        '& svg': {
            width: 18,
            height: 18,
            padding: 4,
            color: theme.palette.white.main,
        },
    },
    ppBadgeError: {
        zIndex: 999,
        width: 12,
        minWidth: 12,
        height: 12,
        fontSize: 8,
        backgroundColor: 'red',
        left: -8,
        top: 8,
        padding: 1,
    },
    ppBadgeWarning: {
        zIndex: 999,
        width: 12,
        minWidth: 12,
        height: 12,
        fontSize: 8,
        backgroundColor: 'orange',
        left: -8,
        top: 8,
        padding: 1,
    },
    ppBadgeInfo: {
        zIndex: 999,
        width: 12,
        minWidth: 12,
        height: 12,
        fontSize: 8,
        backgroundColor: '#656565',
        left: -8,
        top: 8,
        padding: 1,
    },
}));

const PersonalisedPanel = ({ account, loans, printBalance }) => {
    const classes = useStyles();

    const [anchorPapercutEl, setAnchorPapercutEl] = React.useState(null);
    const handlePapercutClick = event => {
        setAnchorPapercutEl(event.currentTarget);
    };
    const handlePapercutClose = () => {
        setAnchorPapercutEl(null);
    };

    const greeting = () => {
        const time = moment().format('H');
        if (time < 12) {
            return <span>Good morning</span>;
        } else if (time >= 12 && time < 18) {
            return <span>Good afternoon</span>;
        } else {
            return <span>Good evening</span>;
        }
    };
    console.log(account, loans, printBalance);
    if (!account) {
        return <div />;
    }

    return (
        <Grid
            container
            spacing={1}
            style={{ borderLeft: '1px solid #CCCCCC', paddingLeft: 6, height: '100%' }}
            justify={'flex-end'}
            data-testid="personal-panel"
        >
            {account && account.id && (
                <Grid item xs={12} style={{ marginTop: -16 }}>
                    <Typography
                        variant={'h5'}
                        component={'h5'}
                        color={'primary'}
                        style={{ paddingLeft: 16, fontSize: '2.25rem' }}
                    >
                        {greeting()}
                        <br />
                        {(account && account.firstName) || ''}
                    </Typography>
                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            <Tooltip
                                id="auth-button"
                                title={`Your UQ username is ${account && account.id}`}
                                placement="top"
                                TransitionProps={{ timeout: 300 }}
                            >
                                <Typography component={'span'} color={'secondary'} style={{ fontSize: 14 }}>
                                    <AccountBoxIcon
                                        fontSize={'small'}
                                        style={{
                                            marginLeft: 16,
                                            marginBottom: -2,
                                            marginRight: 6,
                                            height: 12,
                                            width: 12,
                                        }}
                                    />
                                    {(account && account.id) || ''}
                                </Typography>
                            </Tooltip>
                        </Grid>
                        {/* <Grid item xs={12}>*/}
                        {/*    <Location handleLocationChange={handleLocationChange}
                         currentLocation={cookies.location} />*/}
                        {/* </Grid>*/}
                    </Grid>
                </Grid>
            )}
            <Grid item xs={12} style={{ marginBottom: -12, alignSelf: 'flex-end', marginLeft: -24 }}>
                {seePrintBalance(account) && (
                    <Grid container spacing={0}>
                        <MenuItem
                            style={{
                                width: '100%',
                                marginBottom: -3,
                                marginTop: -3,
                                paddingTop: 3,
                                paddingBottom: 3,
                            }}
                            onClick={handlePapercutClick}
                        >
                            <Grid item data-testid="print-balance-personalisation" xs style={{ lineHeight: '30px' }}>
                                <Typography style={{ color: '#316799' }}>Manage your print balance ($12.50)</Typography>
                            </Grid>
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorPapercutEl}
                                keepMounted
                                open={Boolean(anchorPapercutEl)}
                                onClose={handlePapercutClose}
                                onBlur={handlePapercutClose}
                            >
                                <MenuItem disabled>Manage your PaperCut account</MenuItem>
                                <MenuItem onClick={handlePapercutClose}>Log in and manage your print balance</MenuItem>
                                <MenuItem onClick={handlePapercutClose}>Top up your print balance - $5</MenuItem>
                                <MenuItem onClick={handlePapercutClose}>Top up your print balance - $10</MenuItem>
                                <MenuItem onClick={handlePapercutClose}>Top up your print balance - $20</MenuItem>
                            </Menu>
                            <Grid item xs={'auto'}>
                                <Tooltip
                                    id="auth-button"
                                    title={'Manage your print balance'}
                                    placement="left"
                                    TransitionProps={{ timeout: 300 }}
                                >
                                    <Button size={'small'} variant={'contained'} className={classes.ppButton}>
                                        <PrintIcon />
                                    </Button>
                                </Tooltip>
                            </Grid>
                        </MenuItem>
                    </Grid>
                )}
                {seeLoans(account) && (
                    <Grid container spacing={0}>
                        <MenuItem
                            style={{
                                width: '100%',
                                marginBottom: -3,
                                marginTop: -3,
                                paddingTop: 3,
                                paddingBottom: 3,
                            }}
                        >
                            <Grid item data-testid="loans-personalisation" xs style={{ lineHeight: '24px' }}>
                                <Typography style={{ color: '#316799' }}>
                                    Manage your library loans (2 overdue)
                                </Typography>
                            </Grid>
                            <Grid item xs={'auto'}>
                                <Tooltip
                                    id="auth-button"
                                    title={'Manage your item loans (6 current | 2 overdue)'}
                                    placement="left"
                                    TransitionProps={{ timeout: 300 }}
                                >
                                    <Badge badgeContent={2} color="error" classes={{ badge: classes.ppBadgeWarning }}>
                                        <Button size={'small'} variant={'contained'} className={classes.ppButton}>
                                            <MenuBookIcon />
                                        </Button>
                                    </Badge>
                                </Tooltip>
                            </Grid>
                        </MenuItem>
                    </Grid>
                )}
                {seeFines(account) && (
                    <Grid container spacing={0}>
                        <MenuItem
                            style={{
                                width: '100%',
                                marginBottom: -3,
                                marginTop: -3,
                                paddingTop: 3,
                                paddingBottom: 3,
                            }}
                        >
                            <Grid item xs style={{ lineHeight: '24px' }} data-testid="fines-personalisation">
                                <Typography style={{ color: '#316799' }}>Pay overdue fines (1 outstanding)</Typography>
                            </Grid>
                            <Grid item xs={'auto'}>
                                <Tooltip
                                    id="auth-button"
                                    title={'Pay your overdue fines | 1 outstanding'}
                                    placement="left"
                                    TransitionProps={{ timeout: 300 }}
                                >
                                    <Badge badgeContent={1} color="error" classes={{ badge: classes.ppBadgeError }}>
                                        <Button size={'small'} variant={'contained'} className={classes.ppButton}>
                                            <MonetizationOnIcon />
                                        </Button>
                                    </Badge>
                                </Tooltip>
                            </Grid>
                        </MenuItem>
                    </Grid>
                )}
            </Grid>
        </Grid>
    );
};

PersonalisedPanel.propTypes = {
    account: PropTypes.object,
    loans: PropTypes.object,
    printBalance: PropTypes.object,
};

PersonalisedPanel.defaultProps = {};

export default PersonalisedPanel;
