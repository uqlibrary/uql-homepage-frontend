import {
    SecuritySelector,
    styles
} from './SecuritySelector';

function setup(testProps, isShallow = true) {
    const props = {
        classes: {},
        disabled: false,
        selectedPolicyKey: 1,
        text: {
            description: 'test1',
            prompt: 'test2',
            dataStream: {
                overridePrompt: 'test3'
            }
        },
        recordType: 'community',
        ...testProps
    };

    return getElement(SecuritySelector, props, isShallow);
}

describe('SecuritySelector component', () => {
    it('should render properly for community', () => {
        const testProps = {
            disabled: false,
            text: {
                description: 'test description for community',
                prompt: 'test2',
                selectedTitle: 'test3',
            },
            securityPolicy: 2
        };
        const wrapper = setup(testProps);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render properly for collection', () => {
        const testProps = {
            disabled: false,
            text: {
                description: 'test description for collection',
                prompt: 'test2',
                selectedTitle: 'test3',
            },
            securityPolicy: 2,
            recordType: 'collection'
        };
        const wrapper = setup(testProps);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render properly for record', () => {
        const testProps = {
            disabled: false,
            text: {
                description: 'test description for record',
                prompt: 'test2',
                selectedTitle: 'test3',
            },
            securityPolicy: 2,
            recordType: 'record'
        };
        const wrapper = setup(testProps);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});