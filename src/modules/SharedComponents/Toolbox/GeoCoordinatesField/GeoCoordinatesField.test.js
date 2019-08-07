import GeoCoordinatesField from './GeoCoordinatesField';

function setup(testProps = {}) {
    const props = {
        input: {
            onChange: jest.fn(),
        },
        ...testProps,
    };

    return getElement(GeoCoordinatesField, props);
}

describe('GeoCoordinatesField component', () => {
    it('should render default view', () => {
        const wrapper = setup();

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
