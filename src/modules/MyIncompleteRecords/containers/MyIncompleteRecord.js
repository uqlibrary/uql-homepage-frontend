import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxForm, getFormValues, getFormSyncErrors, SubmissionError, stopSubmit } from 'redux-form/immutable';
import Immutable from 'immutable';
import MyIncompleteRecord from '../components/MyIncompleteRecord';
import { withRouter } from 'react-router-dom';
import * as actions from 'actions';
import { confirmDiscardFormChanges } from 'modules/SharedComponents/ConfirmDiscardFormChanges';
import { ORG_TYPE_NOT_SET } from 'config/general';

const FORM_NAME = 'MyIncompleteRecord';

const onSubmit = (values, dispatch, props) => {
    const data = {
        ...values.toJS(),
        publication: {...props.recordToFix},
        author: {...props.author}
    };
    return dispatch(
        actions.patchIncompleteRecord(data))
        .then(() => {
            // following from fixRecord...
            // once this promise is resolved form is submitted successfully and will call parent container
            // reported bug to redux-form:
            // reset form after success action was dispatched:
            // componentWillUnmount cleans up form, but then onSubmit success sets it back to active
            // setTimeout(()=>{
            //     dispatch(reset(FORM_NAME));
            // }, 100);
        }).catch(error => {
            throw new SubmissionError({_error: error.message});
        });
};

const validate = () => {
    stopSubmit(FORM_NAME, null);
    const errors = {};
    return errors;
};

let MyIncompleteRecordContainer = reduxForm({
    form: FORM_NAME,
    // enableReinitialize: true,
    validate,
    onSubmit
})(confirmDiscardFormChanges(MyIncompleteRecord, FORM_NAME));

const mapStateToProps = (state, ownProps) => {
    const formErrors = getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({});
    const importedValues = state.get('fixRecordReducer') && state.get('fixRecordReducer').recordToFix;
    const grants = importedValues && importedValues.fez_record_search_key_grant_agency.map((grantAgency, index) => ({
        grantAgencyName: grantAgency.rek_grant_agency,
        grantId: importedValues.fez_record_search_key_grant_id && importedValues.fez_record_search_key_grant_id.length > 0 && importedValues.fez_record_search_key_grant_id[index].rek_grant_id || '',
        grantAgencyType: importedValues.fez_record_search_key_grant_agancy_type && importedValues.fez_record_search_key_grant_agancy_type.length > 0 && importedValues.fez_record_search_key_grant_agency_type[index].rek_grant_agency_type || ORG_TYPE_NOT_SET,
        disabled: ownProps.disableInitialGrants
    }));

    return {
        ...state.get('fixRecordReducer'),
        ...state.get('accountReducer'),
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({}),
        formErrors: formErrors,
        disableSubmit: formErrors && !(formErrors instanceof Immutable.Map),
        initialValues: {
            // Place all of the imported NTRO values from the PID into their form fields here....
            rek_title: importedValues && importedValues.rek_title || null,
            rek_author_affiliation_name: importedValues && importedValues.rek_author_affiliation_name || null,
            rek_author_affiliation_type: importedValues && importedValues.rek_author_affiliation_type || null,
            fez_record_search_key_significance: importedValues && importedValues.fez_record_search_key_significance || null,
            rek_description: importedValues && importedValues.rek_description || null,
            rek_formatted_abstract: importedValues && importedValues.rek_formatted_abstract || null,
            fez_record_search_key_total_pages: importedValues && importedValues.fez_record_search_key_total_pages || null,
            fez_record_search_key_language: importedValues && importedValues.fez_record_search_key_language || null,
            fez_record_search_key_quality_indicator: importedValues && importedValues.fez_record_search_key_quality_indicator || null,
            fez_record_search_key_grant_agency: importedValues && importedValues.fez_record_search_key_grant_agency || null,
            fez_record_search_key_grant_id: importedValues && importedValues.fez_record_search_key_grant_id || null,
            fez_record_search_key_grant_agency_type: importedValues && importedValues.fez_record_search_key_grant_agency_type || null,
            fez_record_search_key_audience_size: importedValues && importedValues.fez_record_search_key_audience_size || null,
            fez_record_search_key_creator_contribution_statement: importedValues && importedValues.fez_record_search_key_creator_contribution_statement || null,
            grants
        }
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

MyIncompleteRecordContainer = connect(mapStateToProps, mapDispatchToProps)(MyIncompleteRecordContainer);
MyIncompleteRecordContainer = withRouter(MyIncompleteRecordContainer);
export default MyIncompleteRecordContainer;
