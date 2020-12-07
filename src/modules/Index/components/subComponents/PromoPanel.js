import React from 'react';
import { PropTypes } from 'prop-types';

import { promoPanel as locale } from './promoPanel.locale';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Grid from '@material-ui/core/Grid';

const PromoPanel = ({ account }) => {
    return (
        <StandardCard
            accentHeader
            fullHeight
            standardCardId="promo-panel"
            title={
                <Grid container>
                    <Grid item xs>
                        {!!account ? locale.loggedin.title : locale.loggedout.title}
                    </Grid>
                </Grid>
            }
        >
            <Grid container spacing={1} id="thingummy">
                <Grid item xs>
                    {!!account ? locale.loggedin.content : locale.loggedout.content}
                </Grid>
            </Grid>
        </StandardCard>
    );
};

PromoPanel.propTypes = {
    libHours: PropTypes.object,
    account: PropTypes.object,
    libHoursLoading: PropTypes.bool,
};

PromoPanel.defaultProps = {};

export default PromoPanel;
