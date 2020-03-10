import React from 'react';
import { AutoCompleteMultiSelectField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import { connect } from 'react-redux';
import * as actions from 'actions';

const mapStateToProps = (state, props) => {
    const { itemsList } = state.get('collectionsReducer') || {};
    return {
        id: props.id,
        itemsList: itemsList || [],
        onChange: item => props.onChange(item.map(collection => collection.rek_pid).join(', ')),
        onClear: () => props.onChange(null),
        getOptionLabel: item => item.rek_title,
        error: props.error,
        errorText: (props.error && props.errorText) || '',
    };
};

const mapDispatchToProps = dispatch => ({
    loadSuggestions: () => dispatch(actions.collectionsList()),
});

const CollectionAutoComplete = connect(
    mapStateToProps,
    mapDispatchToProps,
)(AutoCompleteMultiSelectField);

export function CollectionField(fieldProps) {
    return <CollectionAutoComplete {...fieldProps} />;
}
