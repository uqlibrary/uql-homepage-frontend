/* eslint-disable */
import React from 'react';
import Immutable from 'immutable';
import { rtlRender, fireEvent, cleanup, waitForElement, withRedux, withRouter } from 'test-utils';

import { SearchRecords } from '.';
import * as repositories from 'repositories';
import { internalTitleSearchList } from 'mock/data';

describe('SearchRecords', () => {
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
        cleanup();
    });

    it('Should be able to perform simple search', async () => {
        const route = '/records/search';
        const initialState = Immutable.Map({});
        const { asFragment, getByText, getByTestId, getByLabelText } = rtlRender(
            withRedux(initialState)(withRouter({ route })(<SearchRecords />)),
        );

        const testSearchParam = 'vaccination';
        const apiObject = repositories.routes.SEARCH_INTERNAL_RECORDS_API({
            searchQueryParams: {
                all: testSearchParam,
            },
            page: 1,
            pageSize: 20,
            sortBy: 'score',
            sortDirection: 'Desc',
            activeFacets: {
                filters: {},
                ranges: {},
            },
            facets: {
                filters: {},
                ranges: {},
            },
        });

        mockApi.onGet(apiObject.apiUrl, apiObject.options).reply(200, {
            ...internalTitleSearchList,
            total: 2,
            to: 2,
            data: internalTitleSearchList.data.slice(-2),
        });

        let fragment = asFragment();
        const searchElement = getByLabelText('Search eSpace');

        fireEvent.change(searchElement, {
            target: {
                value: testSearchParam,
            },
        });
        expect(fragment).toMatchDiffSnapshot((fragment = asFragment())); // Search query set

        fireEvent.click(getByTestId('simpleSearchButton'));
        expect(fragment).toMatchDiffSnapshot((fragment = asFragment())); // Waiting for search results

        await waitForElement(() => getByText(/Displaying works/));
        expect(fragment).toMatchDiffSnapshot((fragment = asFragment())); // Search results loaded
    });

    it('Should be able to perform advanced search', async () => {
        const route = '/records/search';
        const initialState = Immutable.Map({});
        const { asFragment, getByText, getByTestId, getByPlaceholderText } = rtlRender(
            withRedux(initialState)(withRouter({ route })(<SearchRecords />)),
        );

        const simpleSearchTestParam = 'vaccination';
        const titleSearchTestParam = 'Rheumatic';
        const apiObject = repositories.routes.SEARCH_INTERNAL_RECORDS_API({
            page: 1,
            pageSize: 20,
            sortBy: 'score',
            sortDirection: 'Desc',
            activeFacets: { filters: {}, ranges: {} },
            searchQueryParams: {
                all: {
                    value: simpleSearchTestParam,
                    label: '',
                },
                rek_title: {
                    value: titleSearchTestParam,
                    label: '',
                },
                rek_display_type: [],
            },
            searchMode: 'advanced',
            facets: {
                filters: {},
                ranges: {},
            },
        });

        mockApi.onGet(apiObject.apiUrl, apiObject.options).reply(200, {
            ...internalTitleSearchList,
            total: 1,
            to: 1,
            data: internalTitleSearchList.data.filter(result => result.rek_title.indexOf(titleSearchTestParam) === 0),
        });

        let fragment = asFragment();

        fireEvent.click(getByTestId('showAdvancedSearchButton'));
        expect(fragment).toMatchDiffSnapshot((fragment = asFragment())); // Switched to advanced search

        fireEvent.click(getByText('Select a field'));
        expect(fragment).toMatchDiffSnapshot((fragment = asFragment())); // Opened dropdown to change field to search

        fireEvent.click(getByText('Any field'));
        expect(fragment).toMatchDiffSnapshot((fragment = asFragment())); // Chose to search any field

        fireEvent.change(getByPlaceholderText('Add some text to search all fields with'), {
            target: {
                value: simpleSearchTestParam,
            },
        });
        expect(fragment).toMatchDiffSnapshot((fragment = asFragment())); // Set first field

        fireEvent.click(getByText('Add another field'));
        expect(fragment).toMatchDiffSnapshot((fragment = asFragment())); // Added another search field

        fireEvent.click(getByText('Select a field'));
        expect(fragment).toMatchDiffSnapshot((fragment = asFragment())); // Opened dropdown to change field to search

        fireEvent.click(getByText('Title'));
        expect(fragment).toMatchDiffSnapshot((fragment = asFragment())); // Chose to search title field

        fireEvent.change(getByPlaceholderText('Add a title'), {
            target: {
                value: titleSearchTestParam,
            },
        });
        expect(fragment).toMatchDiffSnapshot((fragment = asFragment())); // Set second search field

        fireEvent.click(getByTestId('advancedSearchButton'));
        expect(fragment).toMatchDiffSnapshot((fragment = asFragment())); // Waiting for search results

        await waitForElement(() => getByText(/Displaying works/));
        expect(fragment).toMatchDiffSnapshot((fragment = asFragment())); // Search results loaded
    });
});
