import React from 'react';
import SecurityCard, { isSame } from './SecurityCard';
import { shallow } from 'enzyme';
import { List } from 'immutable';

jest.mock('../../../../context');
import { useFormValuesContext, useRecordContext } from 'context';

/*
    -   Enzyme doesn't support hooks yet
    -   Not using `getElement` global function to shallow render functional component
        because functional component using hooks are tricky to test with current setup.
    -   Work around is to mock implementation of hooks
*/
function setup(testProps = {}) {
    const props = {
        disabled: false,
        ...testProps,
    };
    return shallow(<SecurityCard {...props} />);
}


describe('SecurityCard component', () => {
    it('should render security card correctly for record type', () => {
        useFormValuesContext.mockImplementation(() => ({
            formValues: {
                dataStreams: new List([{
                    dsi_dsid: 'test.txt',
                    dsi_security_policy: 1,
                }]),
                rek_security_inherited: 1,
                rek_security_policy: 5,
                rek_datastream_policy: 5,
            },
        }));

        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456',
                rek_object_type_lookup: 'Record',
                fez_record_search_key_ismemberof: [{
                    rek_ismemberof: 'Test collection',
                    parent: {
                        rek_security_policy: 2,
                        rek_datastream_policy: 1,
                    },
                }],
            },
        }));

        const wrapper = setup();

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Memo(InheritedSecurityDetails)')).toHaveLength(2);
        expect(wrapper.find('Memo(SecuritySelector)')).toHaveLength(0);
    });

    it('should not render data stream security selector for the record if no datastreams found', () => {
        useFormValuesContext.mockImplementation(() => ({
            formValues: {
                dataStreams: [],
                rek_security_inherited: 1,
                rek_security_policy: 5,
                rek_datastream_policy: 5,
            },
        }));

        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456',
                rek_object_type_lookup: 'Record',
                fez_record_search_key_ismemberof: [{
                    rek_ismemberof: 'Test collection',
                    parent: {
                        rek_security_policy: 2,
                        rek_datastream_policy: 1,
                    },
                }],
            },
        }));

        const wrapper = setup();

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Memo(InheritedSecurityDetails)')).toHaveLength(1);
        expect(wrapper.find('Memo(SecuritySelector)')).toHaveLength(0);
    });

    it('should render security card correctly for record type if user checks override security', () => {
        useFormValuesContext.mockImplementation(() => ({
            formValues: {
                dataStreams: new List([{
                    dsi_dsid: 'test.txt',
                    dsi_security_policy: 1,
                }]),
                rek_security_inherited: 0,
                rek_security_policy: 5,
                rek_datastream_policy: 5,
            },
        }));

        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456',
                rek_object_type_lookup: 'Record',
                fez_record_search_key_ismemberof: [{
                    rek_ismemberof: 'Test collection',
                    parent: {
                        rek_security_policy: 2,
                        rek_datastream_policy: 1,
                    },
                }],
            },
        }));

        const wrapper = setup();

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Memo(InheritedSecurityDetails)')).toHaveLength(2);
        expect(wrapper.find('Memo(SecuritySelector)')).toHaveLength(1);
    });

    it('should render security card correctly for collection with data stream selector for collection', () => {
        useFormValuesContext.mockImplementation(() => ({
            formValues: {
                dataStreams: new List([]),
                rek_security_inherited: 0,
                rek_security_policy: 5,
                rek_datastream_policy: 5,
            },
        }));

        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456',
                rek_object_type_lookup: 'Collection',
            },
        }));

        const wrapper = setup();

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Memo(InheritedSecurityDetails)')).toHaveLength(0);
        expect(wrapper.find('Memo(SecuritySelector)')).toHaveLength(2);
    });

    it('should render security card correctly for community', () => {
        useFormValuesContext.mockImplementation(() => ({
            formValues: {
                rek_security_inherited: 0,
                rek_security_policy: 5,
                rek_datastream_policy: 5,
            },
        }));

        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456',
                rek_object_type_lookup: 'Community',
            },
        }));

        const wrapper = setup();

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Memo(InheritedSecurityDetails)')).toHaveLength(0);
        expect(wrapper.find('Memo(SecuritySelector)')).toHaveLength(1);
    });

    it('should render security card with disabled inputs', () => {
        useFormValuesContext.mockImplementation(() => ({
            formValues: {
                dataStreams: new List([{
                    dsi_dsid: 'test.txt',
                    dsi_security_policy: 1,
                }]),
                rek_security_inherited: 0,
                rek_security_policy: 5,
                rek_datastream_policy: 5,
            },
        }));

        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456',
                rek_object_type_lookup: 'Record',
                fez_record_search_key_ismemberof: [{
                    rek_ismemberof: 'Test collection',
                    parent: {
                        rek_security_policy: 2,
                        rek_datastream_policy: 1,
                    },
                }],
            },
        }));

        const wrapper = setup({ disabled: true });

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Memo(InheritedSecurityDetails)')).toHaveLength(2);
        expect(wrapper.find('Memo(SecuritySelector)')).toHaveLength(1);
    });

    describe('isSame callback function', () => {
        it('should return true if current props are same as previous props', () => {
            expect(isSame(
                { disabled: true },
                { disabled: true }
            )).toBeTruthy();
        });

        it('should return false if props do not match', () => {
            expect(isSame(
                { disabled: true },
                { disabled: false }
            )).toBeFalsy();
        });
    });
});
