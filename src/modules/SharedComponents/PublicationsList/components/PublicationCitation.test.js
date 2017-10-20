jest.dontMock('./PublicationCitation');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import PublicationCitation from './PublicationCitation';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Immutable from 'immutable';
import {locale} from 'config';
import {myRecordsList} from 'mock/data';


function setup({publication, customActions, showDefaultActions, isShallow = true}) {
    const props = {
        publication: publication || myRecordsList.data[0], // : PropTypes.object.isRequired,
        customActions: customActions || [], // : PropTypes.array,
        showDefaultActions: showDefaultActions || false // : PropTypes.bool
    };

    if(isShallow) {
        return shallow(<PublicationCitation {...props} />);
    }

    return mount(<PublicationCitation {...props} />, {
        context: {
            muiTheme: getMuiTheme()
        },
        childContextTypes: {
            muiTheme: PropTypes.object.isRequired
        }
    });
}

beforeAll(() => {
    injectTapEventPlugin();
});

describe('PublicationCitation renders ', () => {
    it('component with default item', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with default actions', () => {
        const wrapper = setup({showDefaultActions: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with custom actions', () => {
        const wrapper = setup({
            customActions: [
                {
                    label: 'Claim now',
                    handleAction: jest.fn()
                },
                {
                    label: 'Not mine',
                    handleAction: jest.fn()
                },
                {
                    label: 'View stats',
                    handleAction: jest.fn()
                }
            ]});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});