import React from 'react';
import PropTypes from 'prop-types';
import AddRecordStepper from './AddRecordStepper';
import {StandardPage} from 'uqlibrary-react-toolbox';

// forms & custom components
import {PublicationSearchForm} from 'modules/PublicationSearchForm';

import {locale, ROUTES} from 'config';

export default class SearchRecord extends React.Component {
    static propTypes = {
        actions: PropTypes.object,
        history: PropTypes.object.isRequired,
        stepperIndex: PropTypes.number
    };

    static defaultProps = {
        stepperIndex: 0
    };

    constructor(props) {
        super(props);
    }

    _performSearch = (values) => {
        this.props.actions.searchPublications(values.get('searchQuery'));
        this.props.history.push(ROUTES.records.searchResults);
    };

    render() {
        const txt = locale.pages.addRecord;
        return (
            <StandardPage title={txt.title}>
                <AddRecordStepper activeStep={this.props.stepperIndex} steps={txt.stepper} />
                <PublicationSearchForm locale={txt.step1} onSubmit={this._performSearch}/>
            </StandardPage>
        );
    }
}
