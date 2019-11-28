import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
// MUI 1
import Grid from '@material-ui/core/Grid';
import FormHelperText from '@material-ui/core/FormHelperText';
import { withStyles } from '@material-ui/core/styles';

const moment = require('moment');

const styles = theme => ({
    fakeTitle: {
        color: theme.palette.secondary.main,
        marginTop: -32,
    },
    hideLabel: {
        position: 'absolute',
        left: -10000,
        top: 'auto',
        width: 1,
        height: 1,
        overflow: 'hidden',
    },
});

export const STATUS_VALID = 1; // user entered a valid date
export const STATUS_INVALID = 2; // user entered an invalid date
export const STATUS_FUTURE_DATE = 3; // the date entered is valid but in the future, when prop disableFuture is

export const MONTH_UNSELECTED = -1;

export class PartialDateForm extends Component {
    static propTypes = {
        locale: PropTypes.object,
        onChange: PropTypes.func,
        dateFormat: PropTypes.string,
        allowPartial: PropTypes.bool,
        disabled: PropTypes.bool,
        months: PropTypes.array,
        className: PropTypes.string,
        floatingTitle: PropTypes.string.isRequired,
        floatingTitleRequired: PropTypes.bool,
        classes: PropTypes.object,
        required: PropTypes.bool,
        hasError: PropTypes.string,
        disableFuture: PropTypes.bool,
    };

    static defaultProps = {
        locale: {
            dayLabel: 'Day',
            monthLabel: 'Month',
            yearLabel: 'Year',
            validationMessage: {
                date: 'Invalid date',
                day: 'Invalid day',
                month: 'Enter a month',
                year: 'Invalid year',
                yearRequired: 'Year required',
                future: 'Date must be before now',
            },
            minNumberCharCode: 48,
            maxNumberCharCode: 57,
        },
        months: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ],
        dateFormat: 'YYYY-MM-DD',
        allowPartial: false,
        floatingTitle: 'Enter a date',
        floatingTitleRequired: false,
        className: '',
        disableFuture: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            day: null,
            month: null,
            year: null,
        };
        this.errors = { day: '', month: '', year: '' };
    }

    componentDidMount() {
        this._setDate({ day: '', month: '', year: '' });
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.onChange) {
            this.props.onChange(this._setDate(nextState));
        }
    }

    /**
     * validate the entered date field
     * @param state
     * @returns {int} returns one of STATUS_VALID, STATUS_INVALID, STATUS_FUTURE_DATE, defined above
     * @private
     */
    _validate = state => {
        let validationStatus;
        // const { day, month, year } = state;
        const day = state.day;
        const year = state.year;
        let month = state.month;
        if (state.month === MONTH_UNSELECTED) {
            // moment validation doesnt recognise -1 as a valid date
            month = null;
        }

        if (this.props.allowPartial) {
            validationStatus = !!year && moment(state).isValid() ? STATUS_VALID : STATUS_INVALID;
        } else {
            validationStatus =
                !!day && month !== null && !!year && moment(state).isValid() ? STATUS_VALID : STATUS_INVALID;
        }

        if (validationStatus === STATUS_VALID && !!this.props.disableFuture) {
            if (!!this.props.allowPartial) {
                const yearNow = moment().year();
                if (state.year > yearNow) {
                    return STATUS_FUTURE_DATE;
                }
            } else {
                const dateNow = moment();
                if (!moment(state).isSameOrBefore(dateNow)) {
                    return STATUS_FUTURE_DATE;
                }
            }
        }

        return validationStatus;
    };

    _displayErrors = (state, validationStatus, allowPartial = '', isRequired = '') => {
        const allowPartialHere = allowPartial === '' ? this.props.allowPartial : allowPartial;
        const isRequiredHere = isRequired === '' ? this.props.required : isRequired;

        const { day, month, year } = state;
        const { locale } = this.props;
        const validMonthIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

        this.errors.date = (!!year && isNaN(year) && locale.validationMessage.year) || '';

        switch (validationStatus) {
            case STATUS_INVALID:
                this.errors.date =
                    // initial load of 'required' message for required date fields
                    (allowPartialHere &&
                        isRequiredHere &&
                        !year &&
                        !isNaN(year) &&
                        locale.validationMessage.yearRequired) ||
                    // initial load of 'required' message for required date fields
                    (isNaN(year) && locale.validationMessage.year) ||
                    // they've just typed in a nonsense number
                    // dont wait for date complete for the moment validation to kick in
                    ((isNaN(day) || (!!day && (day < 1 || day > 31))) && locale.validationMessage.day) ||
                    // // date fields initially blank // remove
                    // (year === null && this._isUnselected(month) && day === null && '') || // remove
                    // they've entered a day
                    (year === null && this._isUnselected(month) && !!day && '') ||
                    // they've entered a day and a month
                    (year === null && validMonthIndices.includes(month) && !!day && '') ||
                    // encourage them to select a month if the year and day are selected
                    (!!year && this._isUnselected(month) && !!day && locale.validationMessage.month) ||
                    locale.validationMessage.date;
                break;
            case STATUS_VALID:
                // cypress does not like more concise format (?!?) (integration tests didnt either?!?!?)
                if (!!year && validMonthIndices.includes(month) && !!day) {
                    // date complete for non-partial-entry
                    this.errors.date = '';
                } else if (allowPartialHere && !!year && this._isUnselected(month) && day === null) {
                    // partial entry means they can get away with just a year
                    this.errors.date = '';
                } else {
                    this.errors.date = locale.validationMessage.date;
                }
                break;
            case STATUS_FUTURE_DATE:
                this.errors.date = locale.validationMessage.future;
                break;
            /* istanbul ignore next */
            default:
                break;
        }
    };

    _isUnselected(month) {
        return month === MONTH_UNSELECTED || month === null;
    }

    _setDate = date => {
        const validationStatus = this._validate(date);

        this._displayErrors(date, validationStatus, this.props.allowPartial, this.props.required);

        if (date.month === MONTH_UNSELECTED) {
            // moment validation doesnt recognise -1 as a valid month number
            date.month = null;
        }
        return validationStatus === STATUS_VALID ? moment(date).format(this.props.dateFormat) : '';
    };

    _isNumber = event => {
        if (
            event.charCode < this.props.locale.minNumberCharCode ||
            event.charCode > this.props.locale.maxNumberCharCode
        ) {
            event.preventDefault();
        }
    };

    _onDateChanged = key => {
        return (event, index, value) => {
            if (event.target.value === '') {
                // allow the field to be cleared (otherwise it sets NaN, which fires the validation)
                this.setState({ [key]: null });
            } else {
                this.setState({
                    [key]: parseInt(event.target.value === undefined ? value : event.target.value, 10),
                });
            }
        };
    };

    render() {
        const { locale, months } = this.props;
        const renderMonths = months.map((month, index) => (
            <MenuItem key={index} value={index}>
                {month}
            </MenuItem>
        ));
        const isError = this.errors.date || this.props.hasError || '';
        return (
            <Grid container spacing={0}>
                <Grid item xs={12}>
                    <InputLabel error={!!isError} shrink required={this.props.required} style={{ zoom: '0.75' }}>
                        {this.props.floatingTitle}
                    </InputLabel>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={16} style={{ marginTop: -12 }}>
                        <Grid item xs={4}>
                            <TextField
                                name="day"
                                id="day"
                                type="text"
                                fullWidth
                                disabled={this.props.disabled}
                                error={!!isError}
                                onKeyPress={this._isNumber}
                                onChange={this._onDateChanged('day')}
                                onBlur={!this.props.allowPartial ? this._onDateChanged('day') : undefined}
                                placeholder={locale.dayLabel}
                                inputProps={{ label: 'day', maxLength: 2 }}
                            />
                            {isError && <FormHelperText error>{isError}</FormHelperText>}
                        </Grid>
                        <Grid item xs={4}>
                            <Select
                                style={{ width: '100%' }}
                                name="month"
                                id="month"
                                error={!!isError}
                                disabled={this.props.disabled}
                                value={this.state.month === null ? -1 : this.state.month}
                                placeholder={locale.monthLabel}
                                onChange={this._onDateChanged('month')}
                                inputProps={{ label: 'month', maxLength: 2 }}
                            >
                                <MenuItem key={-1} value={MONTH_UNSELECTED}>
                                    Month
                                </MenuItem>
                                {renderMonths}
                            </Select>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                name="year"
                                id="year"
                                type="text"
                                fullWidth
                                disabled={this.props.disabled}
                                placeholder={locale.yearLabel}
                                error={!!isError}
                                onKeyPress={this._isNumber}
                                onChange={this._onDateChanged('year')}
                                onBlur={this._onDateChanged('year')}
                                inputProps={{ label: 'year', maxLength: 4 }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(PartialDateForm);
