import React from 'react';
import PropTypes from 'prop-types';

// forms & custom components
import {StandardPage} from 'uqlibrary-react-toolbox';
import {Stepper} from 'modules/SharedComponents/Stepper';
import {locale, routes} from 'config';

export default class AddMissingRecord extends React.Component {
    static propTypes = {
        addRecordStep: PropTypes.func,
        actions: PropTypes.object,
        location: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    getStepperIndex = (location) => {
        const locationTokens = location.split('/').filter(Boolean);
        if (locationTokens.length !== 3) return 0;
        const configTokens = routes.pathConfig[locationTokens[0]][locationTokens[1]];
        return Object.keys(configTokens).indexOf(locationTokens[2]);
    };

    render() {
        const txt = locale.pages.addRecord;
        return (
            <StandardPage title={txt.title}>
                <Stepper activeStep={this.getStepperIndex(this.props.location.pathname)} steps={txt.stepper} />
                <this.props.addRecordStep {...this.props} />
            </StandardPage>
        );
    }
}