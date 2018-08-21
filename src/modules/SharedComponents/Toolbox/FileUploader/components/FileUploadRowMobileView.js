import React, {PureComponent, Fragment} from 'react';
import PropTypes from 'prop-types';

import FileUploadAccessSelector from './FileUploadAccessSelector';
import FileUploadEmbargoDate from './FileUploadEmbargoDate';
import FileUploadRowStatus from './FileUploadRowStatus';

import * as config from '../config';

import {Grid, Typography} from '@material-ui/core';
import {Attachment, CalendarTodayOutlined, LockOutlined} from '@material-ui/icons';
import {withStyles} from '@material-ui/core/styles';

export class FileUploadRowMobileView extends PureComponent {
    static propTypes = {
        index: PropTypes.number.isRequired,
        name: PropTypes.string,
        size: PropTypes.string,
        accessConditionId: PropTypes.number,
        embargoDate: PropTypes.string,
        requireOpenAccessStatus: PropTypes.bool.isRequired,
        disabled: PropTypes.bool,
        locale: PropTypes.object,
        classes: PropTypes.object,
        onDelete: PropTypes.func.isRequired,
        onEmbargoDateChange: PropTypes.func.isRequired,
        onAccessConditionChange: PropTypes.func.isRequired,
        focusOnIndex: PropTypes.number
    };

    static defaultProps = {
        locale: {
            filenameColumn: 'File name',
            fileAccessColumn: 'File access',
            embargoDateColumn: 'Embargo date',
            embargoDateClosedAccess: 'No date required',
        }
    };

    render() {
        const {filenameColumn, fileAccessColumn, embargoDateColumn, embargoDateClosedAccess} = this.props.locale;
        const {index, requireOpenAccessStatus, disabled, accessConditionId, embargoDate, name, size} = this.props;

        return (
            <Grid container className={this.props.classes.root} direction="column" spacing={8}>
                <Grid item xs={12}>
                    <Grid container direction="row" alignItems="center" spacing={8}>
                        <Grid item xs={2}>
                            <Attachment/>
                        </Grid>
                        <Grid item xs={10}>
                            <Typography variant="body1" gutterBottom noWrap>
                                {name} ({size})
                            </Typography>
                            <Typography variant="caption" gutterBottom>
                                {filenameColumn}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                {
                    requireOpenAccessStatus &&
                    <Fragment>
                        <Grid item xs={12}>
                            <Grid container direction="row" alignItems="center" spacing={8}>
                                <Grid item xs={2}>
                                    <LockOutlined/>
                                </Grid>
                                <Grid item xs={10}>
                                    <FileUploadAccessSelector
                                        value={accessConditionId}
                                        onChange={this.props.onAccessConditionChange}
                                        disabled={disabled}
                                        ref={`accessConditionSelector${index}`}
                                    />
                                    <Typography variant="caption" gutterBottom>
                                        {fileAccessColumn}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container direction="row" alignItems="center" spacing={8}>
                                <Grid item xs={2}>
                                    <CalendarTodayOutlined/>
                                </Grid>
                                <Grid item xs={9}>
                                    {
                                        requireOpenAccessStatus && accessConditionId !== config.OPEN_ACCESS_ID &&
                                        <Typography variant="body1" gutterBottom>{embargoDateClosedAccess}</Typography>
                                    }
                                    {
                                        requireOpenAccessStatus && accessConditionId === config.OPEN_ACCESS_ID &&
                                        <FileUploadEmbargoDate
                                            value={new Date(embargoDate)}
                                            onChange={this.props.onEmbargoDateChange}
                                            disabled={disabled}
                                        />
                                    }
                                    <Typography variant="caption" gutterBottom>
                                        {embargoDateColumn}
                                    </Typography>
                                </Grid>
                                <Grid item xs={1}>
                                    <FileUploadRowStatus disabled={this.props.disabled} onDelete={this.props.onDelete} name={name}/>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Fragment>
                }
            </Grid>
        );
    }
}

const styles = () => ({
    root: {
        marginBottom: '16px',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
    }
});

export default withStyles(styles)(FileUploadRowMobileView);
