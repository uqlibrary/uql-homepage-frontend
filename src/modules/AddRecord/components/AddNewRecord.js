import React from 'react';
import PropTypes from 'prop-types';
import {StandardPage, ConfirmDialogBox} from 'uqlibrary-react-toolbox';

// forms & custom components
import AddRecordStepper from './AddRecordStepper';
import {PublicationForm} from 'modules/PublicationForm';

import {locale, validation, ROUTES} from 'config';

export default class AddNewRecord extends React.Component {
    static propTypes = {
        publicationsList: PropTypes.array,
        history: PropTypes.object.isRequired,
        stepperIndex: PropTypes.number,
        rawSearchQuery: PropTypes.string
    };

    static defaultProps = {
        stepperIndex: 2,
        rawSearchQuery: ''
    };

    constructor(props) {
        super(props);
    }

    _recordSaved = () => {
        // show record save successfully confirmation box
        this.confirmationBox.showConfirmation();
    };

    _restartWorkflow = () => {
        this.props.history.push(ROUTES.records.find);
    };

    _navigateToDashboard = () => {
        // TODO: should navigation be handled by top-level container only, eg pass on as props:
        // TODO: this.props.navigateToDashboard() and this.props.navigateToClaimForm(item) <- fixes issue of linking item
        this.props.history.push(ROUTES.dashboard);
    };

    render() {
        const txt = locale.pages.addRecord;
        const {rawSearchQuery} = this.props;

        // set initial value only if it's a title (not pubmed/DOI)
        const initialValues = {
            rek_title: (!validation.isValidDOIValue(rawSearchQuery) && !validation.isValidPubMedValue(rawSearchQuery)) ? rawSearchQuery : ''
        };

        return (
            <StandardPage title={txt.title}>
                <ConfirmDialogBox
                    onRef={ref => (this.confirmationBox = ref)}
                    onAction={this._navigateToDashboard}
                    onCancelAction={this._restartWorkflow}
                    locale={txt.confirmationDialog}/>

                <AddRecordStepper activeStep={this.props.stepperIndex} steps={txt.stepper} />
                <div>
                    {
                        <PublicationForm
                            onFormSubmitSuccess={this._recordSaved}
                            onFormCancel={this._restartWorkflow}
                            initialValues={initialValues}/>
                    }
                </div>
            </StandardPage>
        );
    }
}
