import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

import locale from 'locale/pages';

import { withStyles } from '@material-ui/core/styles';
import useTheme from '@material-ui/styles/useTheme';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';

import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import AdminInterface from './AdminInterface';

import SecuritySection from './security/SecuritySectionContainer';
import IdentifiersSection from './IdentifiersSection';
import BibliographicSection from './bibliographic/BibliographicSection';
import AdminSection from './admin/AdminSection';
import GrantInformationSection from './GrantInformationSection';
import FilesSection from './FilesSection';
import AuthorDetailsSection from './AuthorDetailsSection';

import { TabbedContext, RecordContext } from 'context';
import { RECORD_TYPE_RECORD } from 'config/general';

const styles = (theme) => ({
    helpIcon: {
        color: theme.palette.secondary.main,
        opacity: 0.66,
        '&:hover': {
            opacity: 0.87
        }
    },
    tabIndicator: {
        height: 4,
        backgroundColor: theme.palette.primary.main
    },
    badgeMargin: {
        top: 8,
        left: 28,
        width: 12,
        height: 12,
        fontSize: 10,
        fontWeight: 'bold',
        backgroundColor: '#595959'
    }
});

export const AdminContainer = ({
    loadingRecordToView,
    recordToView,
    actions,
    location,
    classes,
    submitting,
    submitSucceeded,
    disableSubmit,
    handleSubmit,
    match,
    history
}) => {
    const [tabbed, setTabbed] = useState(
        Cookies.get('adminFormTabbed') && !!(Cookies.get('adminFormTabbed') === 'tabbed')
    );
    const theme = useTheme();

    const isMobileView = useMediaQuery(theme.breakpoints.down('xs')) || false;

    /* istanbul ignore next */
    /* Enzyme's shallow render doesn't support useEffect hook yet */
    useEffect(() => {
        if (!!match.params.pid && !!actions.loadRecordToView) {
            actions.loadRecordToView(match.params.pid);
        }
    }, []);

    /* istanbul ignore next */
    const handleToggle = useCallback(() => setTabbed(!tabbed), [setTabbed, tabbed]);

    const txt = locale.pages.edit;

    if (loadingRecordToView) {
        return <InlineLoader message={txt.loadingMessage} />;
    } else if (!recordToView) {
        return <div className="empty" />;
    }

    return (
        <TabbedContext.Provider
            value={{
                tabbed: isMobileView ? false : tabbed,
                toggleTabbed: handleToggle
            }}
        >
            <RecordContext.Provider value={{ record: recordToView }}>
                <AdminInterface
                    classes={classes}
                    handleSubmit={handleSubmit}
                    record={recordToView}
                    submitting={submitting}
                    submitSucceeded={submitSucceeded}
                    disableSubmit={disableSubmit}
                    location={location}
                    history={history}
                    tabs={{
                        admin: {
                            component: AdminSection,
                            activated: recordToView.rek_object_type_lookup.toLowerCase() === RECORD_TYPE_RECORD
                        },
                        identifiers: {
                            component: IdentifiersSection,
                            activated: recordToView.rek_object_type_lookup.toLowerCase() === RECORD_TYPE_RECORD
                        },
                        bibliographic: {
                            component: BibliographicSection,
                            activated: recordToView.rek_object_type_lookup.toLowerCase() === RECORD_TYPE_RECORD
                        },
                        grantInformation: {
                            component: GrantInformationSection,
                            activated: false
                        },
                        authorDetails: {
                            component: AuthorDetailsSection,
                            activated: false
                        },
                        files: {
                            component: FilesSection,
                            activated: false
                        },
                        security: {
                            component: SecuritySection,
                            activated: true
                        }
                    }}
                />
            </RecordContext.Provider>
        </TabbedContext.Provider>
    );
};

AdminContainer.propTypes = {
    loadingRecordToView: PropTypes.bool,
    recordToView: PropTypes.object,
    actions: PropTypes.object,
    location: PropTypes.object,
    classes: PropTypes.object,
    submitting: PropTypes.any,
    submitSucceeded: PropTypes.bool,
    disableSubmit: PropTypes.any,
    handleSubmit: PropTypes.func,
    match: PropTypes.object,
    history: PropTypes.object
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
