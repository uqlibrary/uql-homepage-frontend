import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

import locale from 'locale/pages';
import { NTRO_SUBTYPES } from 'config/general';

import { withStyles } from '@material-ui/core/styles';
import useTheme from '@material-ui/styles/useTheme';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import AdminInterface from './AdminInterface';
import SecuritySection from './security/SecuritySectionContainer';
import IdentifiersSection from './identifiers/IdentifiersSectionContainer';
import BibliographicSection from './bibliographic/BibliographicSectionContainer';
import AdminSection from './admin/AdminSectionContainer';
import AdminSectionContainer from './add/AddSectionContainer';
import GrantInformationSection from './grantInformation/GrantInformaionSectionContainer';
import FilesSection from './files/FilesSectionContainer';
import AdditionalInformationSection from './additionalInformation/AdditionalInformationSectionContainer';
import NtroSection from './ntro/NtroSectionContainer';
import AuthorsSection from './authors/AuthorsSectionContainer';

import { TabbedContext, RecordContext } from 'context';
import { RECORD_TYPE_RECORD } from 'config/general';

const styles = theme => ({
    helpIcon: {
        color: theme.palette.secondary.main,
        opacity: 0.66,
        '&:hover': {
            opacity: 0.87,
        },
    },
    tabIndicator: {
        height: 4,
        backgroundColor: theme.palette.primary.main,
    },
    badgeMargin: {
        top: 8,
        left: 28,
        width: 12,
        height: 12,
        fontSize: 10,
        fontWeight: 'bold',
        backgroundColor: '#595959',
    },
});

export const AdminContainer = ({
    location,
    formValues,
    recordToView = {},
    loadRecordToView,
    loadingRecordToView,
    clearRecordToView,
    classes,
    submitting,
    submitSucceeded,
    disableSubmit,
    handleSubmit,
    match,
    history,
}) => {
    const [tabbed, setTabbed] = useState(
        Cookies.get('adminFormTabbed') && !!(Cookies.get('adminFormTabbed') === 'tabbed'),
    );
    const theme = useTheme();
    // const { loadingRecordToView, recordToView } = useSelector((state) => state.get('viewRecordReducer'));
    // const dispatch = useDispatch();

    const isMobileView = useMediaQuery(theme.breakpoints.down('xs')) || false;

    /* istanbul ignore next */
    const handleToggle = useCallback(() => setTabbed(!tabbed), [setTabbed, tabbed]);

    // const { recordToView, loadingRecordToView } = useSelector((state) => state.get('viewRecordReducer'));

    // const formErrors = useSelector((state) => getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({}));
    // const dispatch = useDispatch();
    // const disableSubmit = useRef(formErrors && !(formErrors instanceof Immutable.Map));

    /* istanbul ignore next */
    /* Enzyme's shallow render doesn't support useEffect hook yet */
    React.useEffect(() => {
        if (!!match.params.pid && !!loadRecordToView) {
            loadRecordToView(match.params.pid);
        }

        return () => {
            clearRecordToView();
        };
    }, [loadRecordToView, clearRecordToView, match.params.pid]);

    /* istanbul ignore next */
    /* Enzyme's shallow render doesn't support useEffect hook yet */
    // useEffect(() => {
    //     if (!!match.params.pid && !!loadRecordToView) {
    //         dispatch(loadRecordToView(match.params.pid));
    //     }
    // }, []);

    const txt = locale.pages.edit;
    if (!!match.params.pid && loadingRecordToView) {
        return <InlineLoader message={txt.loadingMessage} />;
    }
    console.log('formValues', JSON.stringify(formValues));
    return (
        <React.Fragment>
            {!match.params.pid && !recordToView && <AdminSectionContainer formValues={formValues} />}
            {!!match.params.pid && recordToView && (
                <TabbedContext.Provider
                    value={{
                        tabbed: isMobileView ? false : tabbed,
                        toggleTabbed: handleToggle,
                    }}
                >
                    <RecordContext.Provider value={{ record: recordToView }}>
                        <AdminInterface
                            classes={classes}
                            handleSubmit={handleSubmit}
                            submitting={submitting}
                            submitSucceeded={submitSucceeded}
                            disableSubmit={disableSubmit}
                            location={location}
                            history={history}
                            tabs={{
                                admin: {
                                    component: AdminSection,
                                    activated:
                                        (recordToView &&
                                            recordToView.rek_object_type_lookup.toLowerCase() === RECORD_TYPE_RECORD) ||
                                        (formValues.rek_display_type &&
                                            formValues.rek_display_type.toLowerCase() === RECORD_TYPE_RECORD),
                                },
                                identifiers: {
                                    component: IdentifiersSection,
                                    activated:
                                        (recordToView &&
                                            recordToView.rek_object_type_lookup.toLowerCase() === RECORD_TYPE_RECORD) ||
                                        (formValues.rek_display_type &&
                                            formValues.rek_display_type.toLowerCase() === RECORD_TYPE_RECORD),
                                },
                                bibliographic: {
                                    component: BibliographicSection,
                                    activated:
                                        (recordToView &&
                                            recordToView.rek_object_type_lookup.toLowerCase() === RECORD_TYPE_RECORD) ||
                                        (formValues.rek_display_type &&
                                            formValues.rek_display_type.toLowerCase() === RECORD_TYPE_RECORD),
                                },
                                authorDetails: {
                                    component: AuthorsSection,
                                    activated:
                                        (recordToView &&
                                            recordToView.rek_object_type_lookup.toLowerCase() === RECORD_TYPE_RECORD) ||
                                        (formValues.rek_display_type &&
                                            formValues.rek_display_type.toLowerCase() === RECORD_TYPE_RECORD),
                                },
                                additionalInformation: {
                                    component: AdditionalInformationSection,
                                    activated:
                                        (recordToView &&
                                            recordToView.rek_object_type_lookup.toLowerCase() === RECORD_TYPE_RECORD) ||
                                        (formValues.rek_display_type &&
                                            formValues.rek_display_type.toLowerCase() === RECORD_TYPE_RECORD),
                                },
                                ntro: {
                                    component: NtroSection,
                                    activated:
                                        (recordToView &&
                                            recordToView.rek_object_type_lookup.toLowerCase() === RECORD_TYPE_RECORD) ||
                                        (formValues.rek_display_type &&
                                            formValues.rek_display_type.toLowerCase() === RECORD_TYPE_RECORD &&
                                            NTRO_SUBTYPES.includes(recordToView.rek_subtype)),
                                },
                                grantInformation: {
                                    component: GrantInformationSection,
                                    activated:
                                        (recordToView &&
                                            recordToView.rek_object_type_lookup.toLowerCase() === RECORD_TYPE_RECORD) ||
                                        (formValues.rek_display_type &&
                                            formValues.rek_display_type.toLowerCase() === RECORD_TYPE_RECORD &&
                                            recordToView.rek_display_type !== 374),
                                },
                                files: {
                                    component: FilesSection,
                                    activated:
                                        (recordToView &&
                                            recordToView.rek_object_type_lookup.toLowerCase() === RECORD_TYPE_RECORD) ||
                                        (formValues.rek_display_type &&
                                            formValues.rek_display_type.toLowerCase() === RECORD_TYPE_RECORD),
                                },
                                security: {
                                    component: SecuritySection,
                                    activated: true,
                                },
                            }}
                        />
                    </RecordContext.Provider>
                </TabbedContext.Provider>
            )}
        </React.Fragment>
    );
};

AdminContainer.propTypes = {
    publicationSubtypeItems: PropTypes.array,
    hasSubtypes: PropTypes.bool,
    hasDefaultDocTypeSubType: PropTypes.bool,
    formValues: PropTypes.object,
    formErrors: PropTypes.object,
    loadingRecordToView: PropTypes.bool,
    loadRecordToView: PropTypes.func,
    clearRecordToView: PropTypes.func,
    recordToView: PropTypes.object,
    actions: PropTypes.object,
    location: PropTypes.object,
    classes: PropTypes.object,
    submitting: PropTypes.any,
    submitSucceeded: PropTypes.bool,
    disableSubmit: PropTypes.any,
    handleSubmit: PropTypes.func,
    match: PropTypes.object,
    history: PropTypes.object,
};

export function isChanged(prevProps, nextProps) {
    return (
        prevProps.disableSubmit === nextProps.disableSubmit &&
        prevProps.submitting === nextProps.submitting &&
        prevProps.submitSucceeded === nextProps.submitSucceeded &&
        (prevProps.recordToView || {}).pid === (nextProps.recordToView || {}).pid &&
        prevProps.loadingRecordToView === nextProps.loadingRecordToView
    );
}

export default React.memo(withStyles(styles, { withTheme: true })(AdminContainer), isChanged);
