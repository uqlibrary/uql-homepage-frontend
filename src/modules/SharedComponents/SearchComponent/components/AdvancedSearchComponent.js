import React, {PureComponent, Fragment} from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import KeyboardArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import AdvancedSearchRow from './AdvancedSearchRow';
import Checkbox from 'material-ui/Checkbox';
import {MAX_PUBLIC_SEARCH_TEXT_LENGTH} from 'config/general';
import {publicationTypes} from 'config';
import {locale} from 'locale';
import * as recordForms from '../../PublicationForm/components/Forms';
import DocumentTypeField from './Fields/DocumentTypeField';
import PublicationYearRangeField from './Fields/PublicationYearRangeField';
import AdvancedSearchCaption from './AdvancedSearchCaption';

export default class AdvancedSearchComponent extends PureComponent {
    static propTypes = {
        className: PropTypes.string,

        fieldRows: PropTypes.array,
        docTypes: PropTypes.array,
        yearFilter: PropTypes.object,
        activeFacets: PropTypes.object,
        isOpenAccess: PropTypes.bool,
        isMinimised: PropTypes.bool,
        isLoading: PropTypes.bool,

        // Event handlers
        onToggleSearchMode: PropTypes.func,
        onToggleMinimise: PropTypes.func,
        onToggleOpenAccess: PropTypes.func,
        onAdvancedSearchRowAdd: PropTypes.func,
        onAdvancedSearchRowRemove: PropTypes.func,
        onAdvancedSearchReset: PropTypes.func,
        updateDocTypeValues: PropTypes.func,
        updateYearRangeFilter: PropTypes.func,

        onAdvancedSearchRowChange: PropTypes.func.isRequired,
        onSearch: PropTypes.func.isRequired,
    };

    static defaultProps = {
        fieldRows: [{
            searchField: '0',
            value: '',
            label: ''
        }],
        yearFilter: {
            from: null,
            to: null,
            invalid: true
        },
        isMinimised: false,
        isOpenAccess: false,

        onToggleSearchMode: () => {},
        onToggleMinimise: () => {},
        onToggleOpenAccess: () => {},
        onAdvancedSearchRowAdd: () => {},
        onAdvancedSearchRowRemove: () => {},
        onAdvancedSearchReset: () => {}
    };

    constructor(props) {
        super(props);
        this.publicationTypes = publicationTypes({...recordForms});
    }

    haveAllAdvancedSearchFieldsValidated = (fieldRows) => {
        const fieldTypes = locale.components.searchComponent.advancedSearch.fieldTypes;
        return !this.props.isLoading && !this.props.yearFilter.invalid
            && fieldRows.filter(item =>
                item.searchField !== '0' && item.searchField !== 'all' && item.value === ''
            // Check if this field is a string exceeding the maxLength
            || (fieldTypes[item.searchField].type === 'TextField') && item.value.length > 0 && MAX_PUBLIC_SEARCH_TEXT_LENGTH < item.value.trim().length
            // Check if the value is an array, and not empty
            || (fieldTypes[item.searchField].type === 'CollectionLookup') && item.value.length === 0
            ).length === 0;
    };

    _handleAdvancedSearch = (event) => {
        if (event) event.preventDefault();
        if (event && event.key && (event.key !== 'Enter')) return;
        this.props.onSearch();
    };

    _toggleSearchMode = () => {
        if (!!this.props.onToggleSearchMode) {
            this.props.onToggleSearchMode();
        }
    };

    _toggleMinimise = () => {
        if (!!this.props.onToggleMinimise) {
            this.props.onToggleMinimise();
        }
    };

    _toggleOpenAccess = (event) => {
        event.preventDefault();
        if (!!this.props.onToggleOpenAccess) {
            this.props.onToggleOpenAccess();
        }
    };

    _handleAdvancedSearchRowChange = (index, searchRow) => {
        this.props.onAdvancedSearchRowChange(index, searchRow);
    };

    _addAdvancedSearchRow = () => {
        if (!!this.props.onAdvancedSearchRowAdd) {
            this.props.onAdvancedSearchRowAdd();
        }
    };

    _removeAdvancedSearchRow = (index) => {
        if (!!this.props.onAdvancedSearchRowRemove) {
            this.props.onAdvancedSearchRowRemove(index);
        }
    };

    _resetAdvancedSearch = () => {
        if (!!this.props.onAdvancedSearchReset) {
            this.props.onAdvancedSearchReset();
        }
    };

    render() {
        const txt = locale.components.searchComponent;
        const lastFieldAdded = [...this.props.fieldRows].pop();
        const canAddAnotherField = this.haveAllAdvancedSearchFieldsValidated(this.props.fieldRows)
            && lastFieldAdded.searchField !== '0';
        const alreadyAddedFields = this.props.fieldRows.map(item => item.searchField);
        return (
            <div className={`searchComponent ${this.props.className}`}>
                <form id="advancedSearchForm" onSubmit={this._handleAdvancedSearch}>
                    <div className="advancedSearch">
                        <div className="columns is-gapless is-mobile">
                            <div className="column">
                                <h2>{txt.advancedSearch.title}</h2>
                            </div>
                            <div className="column is-narrow">
                                <IconButton onClick={this._toggleMinimise}
                                    tooltip={this.props.isMinimised
                                        ? txt.advancedSearch.tooltip.show
                                        : txt.advancedSearch.tooltip.hide}>
                                    {
                                        !this.props.isMinimised
                                            ? <KeyboardArrowUp/>
                                            : <KeyboardArrowDown/>
                                    }
                                </IconButton>
                            </div>
                        </div>
                        {
                            !this.props.isMinimised &&
                                <Fragment>
                                    <div className="columns is-multiline is-mobile">
                                        <div className="column fields is-11-mobile is-11-tablet-only">
                                            {
                                                this.props.fieldRows
                                                    .filter((item) => {
                                                        return item.searchField && txt.advancedSearch.fieldTypes[item.searchField].type !== null;
                                                    })
                                                    .map((item, index) => (
                                                        <AdvancedSearchRow
                                                            key={`advanced-search-field-${item.searchField}`}
                                                            rowIndex={index}
                                                            disabledFields={alreadyAddedFields}
                                                            onSearchRowChange={this._handleAdvancedSearchRowChange}
                                                            onSearchRowDelete={this._removeAdvancedSearchRow}
                                                            {...item}
                                                        />
                                                    ))
                                            }
                                        </div>
                                        <div className="column is-3-desktop is-12-tablet is-12-mobile openAccessCheckbox">
                                            <div className="columns is-gapless is-mobile is-multiline sidebar">
                                                <div className="column is-11-mobile is-narrow-tablet is-12-desktop" style={{minWidth: 166, marginRight: 12}}>
                                                    <Checkbox
                                                        className="advancedSearchOpenAccessCheckbox"
                                                        label={txt.advancedSearch.openAccess.title}
                                                        aria-label={txt.advancedSearch.openAccess.ariaLabel}
                                                        checked={this.props.isOpenAccess}
                                                        onCheck={this._toggleOpenAccess}
                                                        disabled={this.props.isLoading}
                                                    />
                                                </div>
                                                <div className="column is-11-mobile is-12-desktop" style={{marginRight: 12}}>
                                                    <DocumentTypeField
                                                        docTypes={this.props.docTypes}
                                                        updateDocTypeValues={this.props.updateDocTypeValues}
                                                        className="advancedSearchPublicationType"
                                                        disabled={this.props.isLoading}
                                                    />
                                                </div>
                                                <div className="column is-11-mobile is-12-desktop">
                                                    <PublicationYearRangeField
                                                        className="advancedSearchYearFilter"
                                                        yearFilter={this.props.yearFilter}
                                                        updateYearRangeFilter={this.props.updateYearRangeFilter}
                                                        disabled={this.props.isLoading}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="columns is-gapless is-mobile is-multiline actionButtons">
                                        <div className="column is-narrow-desktop is-narrow-tablet is-12-mobile">
                                            <RaisedButton
                                                label={txt.advancedSearch.addField.title}
                                                aria-label={txt.advancedSearch.addField.aria}
                                                secondary
                                                disabled={!canAddAnotherField}
                                                onClick={this._addAdvancedSearchRow}
                                                fullWidth
                                            />
                                        </div>
                                        <div className="column is-narrow-tablet is-12-mobile">
                                            <RaisedButton
                                                label={txt.advancedSearch.reset.title}
                                                aria-label={txt.advancedSearch.reset.aria}
                                                onClick={this._resetAdvancedSearch}
                                                fullWidth
                                            />
                                        </div>
                                        <div className="column is-12-mobile is-narrow-tablet">
                                            <FlatButton
                                                label={txt.advancedSearch.simpleSearch.title}
                                                aria-label={txt.advancedSearch.simpleSearch.aria}
                                                onClick={this._toggleSearchMode}
                                                fullWidth
                                            />
                                        </div>
                                        <div className="column is-hidden-mobile" />
                                        <div className="column is-3-desktop is-4-tablet is-12-mobile">
                                            <RaisedButton
                                                className="advancedSearchButton"
                                                label={txt.searchButtonText}
                                                aria-label={txt.searchButtonAriaLabel}
                                                type="submit"
                                                primary
                                                fullWidth
                                                onClick={this._handleAdvancedSearch}
                                                disabled={!this.haveAllAdvancedSearchFieldsValidated(this.props.fieldRows)}
                                            />
                                        </div>
                                    </div>
                                </Fragment>
                        }
                        <AdvancedSearchCaption {...this.props} />
                    </div>
                </form>
            </div>
        );
    }
}