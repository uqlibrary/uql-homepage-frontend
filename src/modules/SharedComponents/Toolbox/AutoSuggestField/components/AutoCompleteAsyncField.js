import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Popper from '@material-ui/core/Popper';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';
import Clear from '@material-ui/icons/Clear';
import { throttle } from 'throttle-debounce';

export const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    container: {
        flexGrow: 1,
        position: 'relative',
    },
    paper: {
        maxHeight: 250,
        overflowY: 'scroll',
        position: 'absolute',
        zIndex: 999,
    },
    inputRoot: {
        flexWrap: 'wrap',
    },
    noWrap: {
        flexWrap: 'unset',
    },
    chip: {
        margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
    },
});

export class AutoCompleteAsyncField extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        loadSuggestions: PropTypes.func,
        itemsList: PropTypes.array,
        itemsListLoading: PropTypes.bool,
        category: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        onChange: PropTypes.func,
        onDelete: PropTypes.func,
        itemToString: PropTypes.func,
        floatingLabelText: PropTypes.string,
        hideLabel: PropTypes.bool,
        error: PropTypes.bool,
        errorText: PropTypes.string,
        hintText: PropTypes.string,
        allowFreeText: PropTypes.bool,
        async: PropTypes.bool,
        disabled: PropTypes.bool,
        maxResults: PropTypes.number,
        required: PropTypes.bool,
        selectedValue: PropTypes.any,
        filter: PropTypes.func,
        openOnFocus: PropTypes.bool,
        clearInput: PropTypes.bool,
        MenuItemComponent: PropTypes.func,
        showChips: PropTypes.bool,
        selectedItem: PropTypes.array,
        onClear: PropTypes.func,
        showClear: PropTypes.bool,
    };

    static defaultProps = {
        maxResults: 7,
        required: false,
        filter: (searchText, key) => {
            const anyKey = isNaN(key) ? key : `${key}`;
            const regex = new RegExp(
                `(${searchText
                    .split(' ')
                    .join('|')
                    .replace(/[()]/g, '')})`,
                'gi',
            );
            return regex.test(anyKey);
        },
        MenuItemComponent: ({ suggestion }) => (
            <ListItemText
                primary={suggestion.value}
                secondary={suggestion.id}
                primaryTypographyProps={{
                    variant: 'body1',
                }}
                secondaryTypographyProps={{
                    variant: 'body2',
                }}
            />
        ),
        onClear: () => {},
        showClear: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedItem: (props.selectedItem || []).reduce(
                (items, item) => ({
                    ...items,
                    [item.id]: item,
                }),
                {},
            ),
        };
        this.throttledLoadSuggestions = throttle(1000, this.props.loadSuggestions);
    }

    componentDidMount() {
        if (!this.props.async && this.props.loadSuggestions) {
            this.props.loadSuggestions(this.props.category);
        }
    }

    componentWillReceiveProps(newProps) {
        if ((this.props.selectedItem || []).length !== (newProps.selectedItem || []).length) {
            this.setState({
                selectedItem: newProps.selectedItem.reduce(
                    (items, item) => ({
                        ...items,
                        [item.id]: item,
                    }),
                    {},
                ),
            });
        }
    }
    getSuggestions = event => {
        if (this.props.async && this.props.loadSuggestions) {
            this.throttledLoadSuggestions(this.props.category, event.target.value);
        }
    };

    renderInput = ({ inputProps, classes, openMenu, ...other }) => {
        return (
            <TextField
                InputProps={{
                    inputRef: node => {
                        this.textInputRef = node;
                        if (!!this.textInputRef && this.props.openOnFocus) {
                            this.textInputRef.addEventListener('focus', openMenu);
                        }
                    },
                    classes: {
                        root: !!(inputProps || {}).endAdornment ? classes.noWrap : classes.inputRoot,
                    },
                    ...inputProps,
                }}
                {...other}
            />
        );
    };

    renderMenuItemComponent = suggestion => <this.props.MenuItemComponent suggestion={suggestion} />;

    renderSuggestion = ({ suggestion, index, itemProps, highlightedIndex, selectedItem }) => {
        const isHighlighted = highlightedIndex === index;
        const isSelected = ((selectedItem && selectedItem.value) || '').indexOf(suggestion.value) > -1;
        return (
            <MenuItem
                button
                {...itemProps}
                key={suggestion.key || suggestion.id || suggestion.value}
                selected={isHighlighted}
                style={{
                    fontWeight: isSelected ? 500 : 400,
                    whiteSpace: 'normal',
                    height: 'auto',
                }}
            >
                {this.renderMenuItemComponent(suggestion)}
            </MenuItem>
        );
    };

    stateReducer = (state, changes) => {
        if (this.props.allowFreeText) {
            switch (changes.type) {
                case Downshift.stateChangeTypes.blurInput:
                case Downshift.stateChangeTypes.mouseUp:
                    return {
                        ...changes,
                        inputValue: state.inputValue,
                    };
                default:
                    return changes;
            }
        } else {
            switch (changes.type) {
                case Downshift.stateChangeTypes.blurInput:
                case Downshift.stateChangeTypes.clickItem:
                case Downshift.stateChangeTypes.keyDownEnter:
                case Downshift.stateChangeTypes.mouseUp:
                    return {
                        ...changes,
                        inputValue: '',
                    };
                default:
                    return changes;
            }
        }
    };

    handleStateChange = () =>
        this.props.allowFreeText
            ? ({ inputValue }) => {
                inputValue !== undefined && !!inputValue && this.props.onChange({ value: inputValue });
            }
            : () => {};

    handleDelete = item => () => {
        this.setState(
            state => ({
                selectedItem: Object.entries(state.selectedItem)
                    .filter(([key]) => key !== item.id)
                    .reduce((selectedItem, [key, value]) => ({ ...selectedItem, [key]: value }), {}),
            }),
            () => {
                this.props.onDelete(Object.values(this.state.selectedItem));
            },
        );
    };

    handleClear = cb => () => {
        cb();
        this.props.onClear();
    };

    render() {
        const {
            classes,
            itemsList,
            error,
            errorText,
            hintText,
            floatingLabelText,
            hideLabel,
            disabled,
            maxResults,
            itemToString,
            required,
            selectedValue,
            itemsListLoading,
        } = this.props;
        const selectedItemProps = this.props.clearInput ? { selectedItem: '' } : {};
        const labelText = floatingLabelText || 'autosuggest';
        return (
            <div className={classes.root}>
                <label id={`${labelText.replace(/[^\w]/g, '')}-label`} hidden>
                    {floatingLabelText || ''}
                </label>
                <Downshift
                    {...selectedItemProps}
                    defaultInputValue={(!!selectedValue && selectedValue.value) || ''}
                    stateReducer={this.stateReducer}
                    onChange={this.props.onChange}
                    itemToString={itemToString}
                    id={labelText.replace(/[^\w]/g, '')}
                    aria-label={labelText}
                    onStateChange={this.handleStateChange()}
                >
                    {({
                        getInputProps,
                        getMenuProps,
                        isOpen,
                        inputValue,
                        getItemProps,
                        selectedItem,
                        highlightedIndex,
                        openMenu,
                        clearSelection,
                    }) => {
                        return (
                            <div className={classes.container}>
                                <Grid container spacing={16} alignItems={'flex-end'} alignContent={'flex-end'}>
                                    <Grid item xs>
                                        {this.renderInput({
                                            fullWidth: true,
                                            classes,
                                            inputProps: getInputProps({
                                                onChange: this.getSuggestions,
                                                ...(this.props.showChips
                                                    ? {
                                                        startAdornment: Object.values(this.state.selectedItem).map(
                                                            (item, index) => (
                                                                <Chip
                                                                    key={item.id}
                                                                    tabIndex={-1}
                                                                    label={item.value}
                                                                    className={classes.chip}
                                                                    onDelete={this.handleDelete(item, index)}
                                                                />
                                                            ),
                                                        ),
                                                    }
                                                    : {}),
                                                ...(this.props.showClear
                                                    ? {
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    id="clear-input"
                                                                    aria-label="Clear"
                                                                    onClick={this.handleClear(clearSelection)}
                                                                >
                                                                    <Clear />
                                                                </IconButton>
                                                            </InputAdornment>
                                                        ),
                                                    }
                                                    : {}),
                                            }),
                                            error: error,
                                            errorText: (error && errorText) || '',
                                            placeholder: hintText,
                                            label: !hideLabel ? labelText : undefined,
                                            id: `${labelText.replace(/[^\w]/g, '')}-input`,
                                            value: inputValue,
                                            disabled: disabled,
                                            required: required,
                                            openMenu: openMenu,
                                        })}
                                    </Grid>
                                    {itemsListLoading && (
                                        <Grid item xs={'auto'}>
                                            <CircularProgress size={16} color="primary" />
                                        </Grid>
                                    )}
                                </Grid>
                                {isOpen && itemsList.length > 0 ? (
                                    <div {...getMenuProps()}>
                                        <Popper
                                            disablePortal
                                            id="downshift-popper"
                                            open
                                            anchorEl={this.textInputRef}
                                            placement="bottom-start"
                                        >
                                            <Paper
                                                className={classes.paper}
                                                square
                                                style={{
                                                    width: this.textInputRef ? this.textInputRef.clientWidth : null,
                                                }}
                                            >
                                                {itemsList
                                                    .filter(suggestion =>
                                                        this.props.filter(
                                                            inputValue,
                                                            isNaN(inputValue)
                                                                ? suggestion.value
                                                                : suggestion.id || suggestion.value.toString(),
                                                        ),
                                                    )
                                                    .slice(0, maxResults)
                                                    .map((suggestion, index) => {
                                                        return (
                                                            !!suggestion &&
                                                            this.renderSuggestion({
                                                                suggestion,
                                                                index,
                                                                itemProps: getItemProps({ item: suggestion }),
                                                                highlightedIndex,
                                                                selectedItem,
                                                            })
                                                        );
                                                    })}
                                            </Paper>
                                        </Popper>
                                    </div>
                                ) : null}
                            </div>
                        );
                    }}
                </Downshift>
            </div>
        );
    }
}

export default withStyles(styles)(AutoCompleteAsyncField);
