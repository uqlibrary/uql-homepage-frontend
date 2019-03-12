import {GrantListEditorFormClass} from './GrantListEditorForm';
import GrantListEditorForm from './GrantListEditorForm';

function setup(testProps, isShallow = true){
    const props = {
        onAdd: jest.fn(),
        errorText: null,
        locale: {addButton: 'Button'},
        disabled: false,
        required: true,
        hideType: false,
        classes: {},
        theme: {},
        ...testProps,
    };
    return getElement(GrantListEditorFormClass, props, isShallow);
}

describe('GrantListEditorForm', () => {
    it('should render default view', () => {
        const wrapper = getElement(GrantListEditorForm,{
            onAdd: jest.fn(),
            errorText: null,
            locale: {addButton: 'Test'},
            disabled: false,
            required: true,
            hideType: false,
            classes: {},
            theme: {},
        }, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render default view', () => {
        const wrapper = setup({}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should hide grant agency type input', () => {
        const wrapper = setup({hideType: true});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('WithStyles(FormControl)').length).toEqual(0);
    });

    it('should set grant agency type as a required input if agency name is set', () => {
        const wrapper = setup({required: false});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('WithStyles(FormControl)').props().required).toBeFalsy();

        wrapper.setState({
            grantAgencyName: 'test'
        });
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('WithStyles(FormControl)').props().required).toBeTruthy();

        wrapper.setState({
            grantId: '1234'
        });
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('WithStyles(FormHelperText)').length).toEqual(1);
    });

    it('should add grant', () => {
        const onAddFn = jest.fn();
        const wrapper = setup({
            onAdd: onAddFn
        });

        wrapper.setState({
            grantAgencyName: 'test',
            grantId: '123',
            grantAgencyType: 'Government'
        });

        const setState = jest.spyOn(wrapper.instance(), 'setState');
        wrapper.instance()._addGrant({key: 'Enter'});

        expect(onAddFn).toHaveBeenCalledWith({
            grantAgencyName: 'test',
            grantId: '123',
            grantAgencyType: 'Government'
        });

        expect(setState).toHaveBeenCalledWith({
            grantAgencyName: '',
            grantId: '',
            grantAgencyType: ''
        });
    });

    it('should not add grant if form has value but Enter key is not pressed', () => {
        const onAddFn = jest.fn();
        const wrapper = setup({onAdd: onAddFn});

        wrapper.setState({
            grantAgencyName: 'test',
            grantId: '123',
            grantAgencyType: 'Government'
        });

        const setState = jest.spyOn(wrapper.instance(), 'setState');
        wrapper.instance()._addGrant({key: 'Esc'});

        expect(onAddFn).not.toBeCalled();
        expect(setState).not.toBeCalled();
    });

    it('should not add grant if grant agency name is empty string and enter is pressed', () => {
        const onAddFn = jest.fn();
        const wrapper = setup({onAdd: onAddFn});

        wrapper.setState({
            grantAgencyName: '',
            grantId: '123',
            grantAgencyType: 'Government'
        });

        const setState = jest.spyOn(wrapper.instance(), 'setState');
        wrapper.instance()._addGrant({key: 'Enter'});

        expect(onAddFn).not.toBeCalled();
        expect(setState).not.toBeCalled();
    });

    it('should not add grant if form is disabled', () => {
        const onAddFn = jest.fn();
        const wrapper = setup({onAdd: onAddFn, disabled: true});

        wrapper.setState({
            grantAgencyName: 'test',
            grantId: '123',
            grantAgencyType: 'Government'
        });

        const setState = jest.spyOn(wrapper.instance(), 'setState');
        wrapper.instance()._addGrant({key: 'Enter'});

        expect(onAddFn).not.toBeCalled();
        expect(setState).not.toBeCalled();
    });

    it('should set correct state on name changed', () => {
        const wrapper = setup({});
        const setState = jest.spyOn(wrapper.instance(), 'setState');
        wrapper.instance()._onNameChanged({target: {value: 'test'}});
        expect(setState).toHaveBeenCalledWith({grantAgencyName: 'test'});
    });

    it('should set correct state on id changed', () => {
        const wrapper = setup({});
        const setState = jest.spyOn(wrapper.instance(), 'setState');
        wrapper.instance()._onIDChanged({target: {value: 'test'}});
        expect(setState).toHaveBeenCalledWith({grantId: 'test'});
    });

    it('should set correct state on type changed', () => {
        const wrapper = setup({});
        const setState = jest.spyOn(wrapper.instance(), 'setState');
        wrapper.instance()._onTypeChanged({target: {value: 'test'}});
        expect(setState).toHaveBeenCalledWith({grantAgencyType: 'test'});
    });
});