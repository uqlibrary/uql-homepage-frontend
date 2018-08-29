import React from 'react';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

import PropTypes from 'prop-types';
import propFilter from '../../helpers/_filterProps';
import {HelpIcon} from '../../HelpDrawer';

const SelectFieldWrapper = props => {
    const filteredProps = propFilter(props, Select.propTypes);
    filteredProps.onChange = (event) => props.input.onChange(event.target.value);
    filteredProps.onBlur = () => props.input.onBlur(props.input.value);
    const error = !!filteredProps.errorText || !!filteredProps.error;
    const helperText = filteredProps.errorText || filteredProps.error || null;
    delete filteredProps.errorText;
    return (
        <React.Fragment>
            <FormControl error={error} style={{width: '100%'}}>
                <InputLabel>{filteredProps.label}</InputLabel>
                <Select {...filteredProps} autoWidth />
                {
                    helperText &&
                    <FormHelperText>{helperText}</FormHelperText>
                }
            </FormControl>
            {props.help && props.help.text && <HelpIcon {...props.help} />}
        </React.Fragment>
    );
};

SelectFieldWrapper.propTypes = {
    ...Select.propTypes,
    help: PropTypes.shape({
        title: PropTypes.string,
        text: PropTypes.any,
        buttonLabel: PropTypes.string
    })
};

export default SelectFieldWrapper;
