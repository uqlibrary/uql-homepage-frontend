import {PublicationYearRangeField} from './PublicationYearRangeField';
import PublicationYearRangeFieldWithStyles from './PublicationYearRangeField';

function setup(testProps, isShallow = true) {
    // build full props list required by the component
    const props = {
        updateYearRangeFilter: jest.fn(),
        classes: {},
        ...testProps,
    };
    return getElement(PublicationYearRangeField, props, isShallow);
}

describe('Component PublicationYearRangeField', () => {

    it('should render as expected', () => {
        const props = {"className":"advancedSearchYearFilter","yearFilter":{"from":1999,"invalid":false,"to":2001},"disabled":false};
        const wrapper = setup({...props});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should return values as expect for a valid setValue', () => {
        const setValueMock = jest.fn();
        const updateMock = jest.fn();
        const props = {updateYearRangeFilter: updateMock, "className":"advancedSearchYearFilter","yearFilter":{"from":1999,"invalid":false,"to":2001},"disabled":false};
        const wrapper = setup({...props});
        wrapper.instance().setValue = setValueMock;
        expect(wrapper.instance().props.yearFilter.from).toEqual(1999);
        wrapper.find('#from').simulate('change', {target: {value: 1000}});
        expect(updateMock).toBeCalledWith({"from": 1999, "invalid": true, "to": 1000});
    });

    it('should return values as expect for an invalid setValue', () => {
        const setValueMock = jest.fn();
        const updateMock = jest.fn();
        const props = {updateYearRangeFilter: updateMock, "className":"advancedSearchYearFilter","yearFilter":{"from":1999,"invalid":false,"to":2001},"disabled":false};
        const wrapper = setup({...props});
        wrapper.instance().setValue = setValueMock;
        expect(wrapper.instance().props.yearFilter.from).toEqual(1999);

        wrapper.find('#from').simulate('change', {target: {value: 'hello100'}});
        expect(updateMock).toBeCalledWith({"from": 1999, "invalid": true, "to": 100});

        wrapper.find('#from').simulate('change', {target: {value: '100hello'}});
        expect(updateMock).toBeCalledWith({"from": 1999, "invalid": true, "to": 100});

        wrapper.find('#from').simulate('change', {target: {value: '1100'}});
        expect(updateMock).toBeCalledWith({"from": 1999, "invalid": true, "to": 1100});
    });

    it('should render with styles', () => {
        const wrapper = getElement(PublicationYearRangeFieldWithStyles, {updateYearRangeFilter: jest.fn()});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
