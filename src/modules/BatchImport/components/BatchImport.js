import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/lib/immutable';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { CommunitiesSelectField, DocumentTypeSingleField } from 'modules/SharedComponents/PublicationSubtype';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import DirectorySelectField from '../containers/DirectorySelectField';
import CollectionSelectField from '../containers/CollectionSelectField';
import { useFormErrorsContext } from 'context';

import { validation } from 'config';
import { pathConfig } from 'config/routes';
import { default as componentsLocale } from 'locale/components';
import { default as publicationLocale } from 'locale/publicationForm';

export const FORM_NAME = 'BatchImport';
export const BatchImport = ({
    communityID,
    disableSubmit,
    handleSubmit,
    history,
    loadItemsList,
    resetCollectionField,
    submitSucceeded,
    submitting,
}) => {
    const batchImportTxt = componentsLocale.components.digiTeam.batchImport;
    const { formErrors } = useFormErrorsContext();

    useEffect(() => {
        loadItemsList(communityID);
    }, [communityID, loadItemsList]);

    const alertProps = validation.getErrorAlertProps({
        alertLocale: {
            validationAlert: { ...publicationLocale.validationAlert },
            progressAlert: { ...publicationLocale.progressAlert },
            successAlert: { ...batchImportTxt.submitSuccessAlert },
            errorAlert: { ...batchImportTxt.submitFailureAlert },
        },
        formErrors,
        submitSucceeded,
        submitting,
    });

    const _abandonImport = () => {
        history.push(pathConfig.index);
    };

    return (
        <StandardPage title={batchImportTxt.title}>
            <form>
                <Grid container spacing={16}>
                    <Grid item xs={12}>
                        <StandardCard title={batchImportTxt.cardTitle} help={batchImportTxt.help}>
                            <Grid container spacing={16}>
                                <Grid item xs={12}>
                                    <Typography variant="body2">{batchImportTxt.cardDescription}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        component={CommunitiesSelectField}
                                        disabled={submitting}
                                        error={formErrors.communityID}
                                        name="communityID"
                                        label={batchImportTxt.formLabels.collection.label}
                                        required
                                        validate={[validation.required]}
                                        onChange={resetCollectionField}
                                    />
                                </Grid>
                                {!!communityID && (
                                    <Grid item xs={12}>
                                        <Field
                                            component={CollectionSelectField}
                                            disabled={submitting}
                                            error={formErrors.collection_pid}
                                            label={batchImportTxt.formLabels.collection.placeholder}
                                            name="collection_pid"
                                            parentPid={communityID}
                                            required
                                            title={batchImportTxt.formLabels.collection.title}
                                            validate={[validation.required]}
                                        />
                                    </Grid>
                                )}
                            </Grid>

                            <Grid container spacing={16}>
                                <Grid item xs={12}>
                                    <Field
                                        component={DocumentTypeSingleField}
                                        name="doc_type_id"
                                        disabled={submitting}
                                        error={formErrors.doc_type_id}
                                        label={batchImportTxt.formLabels.docType.placeholder}
                                        required
                                        validate={[validation.required]}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={24}>
                                <Grid item xs={12}>
                                    <Field
                                        component={DirectorySelectField}
                                        disabled={submitting}
                                        error={formErrors.directory}
                                        name="directory"
                                        required
                                        validate={[validation.required]}
                                        {...batchImportTxt.formLabels.directory}
                                    />
                                </Grid>
                            </Grid>
                        </StandardCard>
                    </Grid>

                    {alertProps && (
                        <Grid item xs={12}>
                            <Alert {...alertProps} />
                        </Grid>
                    )}

                    <Grid item xs={false} sm />
                    <Grid item xs={12} sm="auto">
                        <Button
                            aria-label={batchImportTxt.formLabels.cancelButtonLabel}
                            children={batchImportTxt.formLabels.cancelButtonLabel}
                            disabled={submitting}
                            fullWidth
                            onClick={_abandonImport}
                            variant="contained"
                        />
                    </Grid>
                    <Grid item xs={12} sm="auto">
                        <Button
                            aria-label={batchImportTxt.formLabels.submitButtonLabel}
                            children={batchImportTxt.formLabels.submitButtonLabel}
                            color="primary"
                            disabled={submitting || disableSubmit}
                            fullWidth
                            id="submit-data-collection"
                            onClick={handleSubmit}
                            variant="contained"
                        />
                    </Grid>
                </Grid>
            </form>
        </StandardPage>
    );
};

BatchImport.propTypes = {
    collectionsList: PropTypes.array,
    communityID: PropTypes.string,
    disableSubmit: PropTypes.bool,
    handleSubmit: PropTypes.func,
    history: PropTypes.object,
    loadItemsList: PropTypes.func,
    resetCollectionField: PropTypes.func,
    submitSucceeded: PropTypes.bool,
    submitting: PropTypes.bool,
};

export default React.memo(BatchImport);
