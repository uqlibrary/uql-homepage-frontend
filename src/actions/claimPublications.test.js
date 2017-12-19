import * as claimActions  from './claimPublications';
import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as mockData from 'mock/data';

describe('Claim publication actions tests ', () => {
    // extend expect to check actions
    expect.extend({toHaveDispatchedActions});

    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
        mockActionsStore.clearActions();
    });

    it('dispatches an action to set publication to claim', async () => {
        const input = {rek_pid: 'PID:11111'};

        const expectedActions = [
            { type: actions.PUBLICATION_TO_CLAIM_SET }
        ];

        await mockActionsStore.dispatch(claimActions.setClaimPublication(input));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches an action to clear a publication to claim', async () => {
        const expectedActions = [
            { type: actions.PUBLICATION_TO_CLAIM_CLEAR }
        ];

        await mockActionsStore.dispatch(claimActions.clearClaimPublication());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatched expected actions to get count of publications', async () => {

        mockApi
            .onAny()
            .reply(200, {data: {...mockData.possibleUnclaimedList}});

        const expectedActions = [
            {type: actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADING},
            {type: actions.POSSIBLY_YOUR_PUBLICATIONS_LOADING},
            {type: actions.POSSIBLY_YOUR_PUBLICATIONS_LOADED},
            {type: actions.POSSIBLY_YOUR_PUBLICATIONS_FACETS_LOADED},
            {type: actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADED}
        ];

        await mockActionsStore.dispatch(claimActions.countPossiblyYourPublications());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    describe('searchPossiblyYourPublications()', () => {

        it('dispatched expected actions to get a list of publications', async () => {
            const testParams = {};

            mockApi
                .onAny()
                .reply(200, {data: {...mockData.possibleUnclaimedList}});

            const expectedActions = [
                {type: actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADING},
                {type: actions.POSSIBLY_YOUR_PUBLICATIONS_LOADING},
                {type: actions.POSSIBLY_YOUR_PUBLICATIONS_LOADED},
                {type: actions.POSSIBLY_YOUR_PUBLICATIONS_FACETS_LOADED},
                {type: actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADED}
            ];

            await mockActionsStore.dispatch(claimActions.searchPossiblyYourPublications(testParams));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatched expected actions to get a list of publications filtered with facets', async () => {
            const testParams = {facets: {facetOne:"Facet"}};
            mockApi
                .onAny()
                .reply(200, {data: {...mockData.possibleUnclaimedList}});

            const expectedActions = [
                {type: actions.POSSIBLY_YOUR_PUBLICATIONS_LOADING},
                {type: actions.POSSIBLY_YOUR_PUBLICATIONS_LOADED},
                {type: actions.POSSIBLY_YOUR_PUBLICATIONS_FACETS_LOADED}
            ];

            await mockActionsStore.dispatch(claimActions.searchPossiblyYourPublications(testParams));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatched expected actions to get a list of publications for anon user', async () => {
            const testParams = {};

            mockApi
                .onAny()
                .reply(403, {});

            const expectedActions = [
                {type: actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADING},
                {type: actions.POSSIBLY_YOUR_PUBLICATIONS_LOADING},
                {type: actions.CURRENT_ACCOUNT_ANONYMOUS},
                {type: actions.POSSIBLY_YOUR_PUBLICATIONS_FAILED},
                {type: actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_FAILED}
            ];

            try {
                await mockActionsStore.dispatch(claimActions.searchPossiblyYourPublications(testParams));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch(e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatched expected actions to get a list of publications if API fails', async () => {
            const testParams = {};

            mockApi
                .onAny()
                .reply(500, {});

            const expectedActions = [
                {type: actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADING},
                {type: actions.POSSIBLY_YOUR_PUBLICATIONS_LOADING},
                {type: actions.POSSIBLY_YOUR_PUBLICATIONS_FAILED},
                {type: actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_FAILED}
            ];

            try {
                await mockActionsStore.dispatch(claimActions.searchPossiblyYourPublications(testParams));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);

            }
        });
    });

    describe('hideRecord()', () => {

        it('dispatched expected actions when hiding a publication', async () => {
            const testPid = 'UQ:12345';
            const testRecord = {pid: testPid};

            mockApi
                .onAny()
                .reply(200, {});

            const expectedActions = [
                {type: actions.HIDE_PUBLICATIONS_LOADING},
                {type: actions.HIDE_PUBLICATIONS_LOADED},
                {type: actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADING},
                {type: actions.POSSIBLY_YOUR_PUBLICATIONS_LOADING},
                {type: actions.POSSIBLY_YOUR_PUBLICATIONS_LOADED},
                {type: actions.POSSIBLY_YOUR_PUBLICATIONS_FACETS_LOADED},
                {type: actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADED}
            ];

            await mockActionsStore.dispatch(claimActions.hideRecord({record: testRecord, facets: {}}));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatched expected actions when hiding a publication with facets', async () => {
            const testPid = 'UQ:12345';
            const testRecord = {pid: testPid};
            const testFacets = {facets: {facetOne:"Facet"}};

            mockApi
                .onAny()
                .reply(200, {});

            const expectedActions = [
                {type: actions.HIDE_PUBLICATIONS_LOADING},
                {type: actions.HIDE_PUBLICATIONS_LOADED},
                {type: actions.POSSIBLY_YOUR_PUBLICATIONS_LOADING},
                {type: actions.POSSIBLY_YOUR_PUBLICATIONS_LOADED},
                {type: actions.POSSIBLY_YOUR_PUBLICATIONS_FACETS_LOADED}
            ];

            await mockActionsStore.dispatch(claimActions.hideRecord({record: testRecord, ...testFacets}));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatched expected actions when hiding a publication for anon user', async () => {
            const testPid = 'UQ:12345';
            const testRecord = {pid: testPid};

            mockApi
                .onPost(repositories.routes.HIDE_POSSIBLE_RECORD_API({}))
                .reply(403, {})
                .onGet(repositories.routes.POSSIBLE_RECORDS_API({facets: {}}))
                .reply(200, mockData.possibleUnclaimedList);

            const expectedActions = [
                {type: actions.HIDE_PUBLICATIONS_LOADING},
                {type: actions.CURRENT_ACCOUNT_ANONYMOUS},
                {type: actions.HIDE_PUBLICATIONS_FAILED}
            ];

            try {
                await mockActionsStore.dispatch(claimActions.hideRecord({record: testRecord, facets: {}}));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatched expected actions when hiding a publication if API fails', async () => {
            const testPid = 'UQ:12345';
            const testRecord = {pid: testPid};

            mockApi
                .onPost(repositories.routes.HIDE_POSSIBLE_RECORD_API({}))
                .reply(500, {})
                .onGet(repositories.routes.POSSIBLE_RECORDS_API({facets: {}}))
                .reply(200, mockData.possibleUnclaimedList);

            const expectedActions = [
                {type: actions.HIDE_PUBLICATIONS_LOADING},
                {type: actions.HIDE_PUBLICATIONS_FAILED}
            ];

            try {
                await mockActionsStore.dispatch(claimActions.hideRecord({record: testRecord, facets: {}}));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

    });

    describe('claimPublication()', () => {
        const testClaimRequest = {
            publication: {...mockData.possibleUnclaimedList.data[0]},
            author: {
                "aut_id": 1671
            }
        };

        it('dispatched expected actions when claiming a publication by author who is assigned to publication already', async () => {
            const testRequest = {
                ...testClaimRequest,
                publication: {
                    ...testClaimRequest.publication,
                    fez_record_search_key_author_id: [{
                        "rek_author_id": 1671,
                        "rek_author_id_order": 1
                    }]
                }
            };
            const expectedActions = [
                {type: actions.CLAIM_PUBLICATION_CREATE_FAILED}
            ];

            try {
                await mockActionsStore.dispatch(claimActions.claimPublication(testRequest));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatched expected actions when claiming a publication by contributor who is assigned to publication already', async () => {
            const testRequest = {
                ...testClaimRequest,
                publication: {
                    ...testClaimRequest.publication,
                    fez_record_search_key_contributor_id: [{
                        "rek_contributor_id": 1671,
                        "rek_contributor_id_order": 1
                    }]
                }
            };
            const expectedActions = [
                {type: actions.CLAIM_PUBLICATION_CREATE_FAILED}
            ];

            try {
                await mockActionsStore.dispatch(claimActions.claimPublication(testRequest));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatched expected actions when claiming a publication', async () => {
            const testParams = {pid: testClaimRequest.publication.rek_pid};
            mockApi
                .onAny()
                .reply(200, {});

            const expectedActions = [
                {type: actions.CLAIM_PUBLICATION_CREATE_PROCESSING},
                {type: actions.CLAIM_PUBLICATION_CREATE_COMPLETED}
            ];

            await mockActionsStore.dispatch(claimActions.claimPublication(testClaimRequest));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatched expected actions when claiming a publication if API fails', async () => {
            mockApi
                .onAny()
                .reply(500, {});

            const expectedActions = [
                {type: actions.CLAIM_PUBLICATION_CREATE_PROCESSING},
                {type: actions.CLAIM_PUBLICATION_CREATE_FAILED}
            ];

            try {
                await mockActionsStore.dispatch(claimActions.claimPublication(testClaimRequest));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatched expected actions when claiming a publication for anon user', async () => {
            mockApi
                .onAny()
                .reply(403, {});

            const expectedActions = [
                {type: actions.CLAIM_PUBLICATION_CREATE_PROCESSING},
                {type: actions.CURRENT_ACCOUNT_ANONYMOUS},
                {type: actions.CLAIM_PUBLICATION_CREATE_FAILED}
            ];

            try {
                await mockActionsStore.dispatch(claimActions.claimPublication(testClaimRequest));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatched expected actions when claiming a publication from external source', async () => {
            const testParams = {pid: testClaimRequest.publication.rek_pid};
            const testRequest = {
                ...testClaimRequest,
                publication: {
                    ...testClaimRequest.publication,
                    rek_pid: null
                }
            };

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API())
                .reply(200, {data: {...testClaimRequest.publication}})
                .onAny()
                .reply(200, {});

            const expectedActions = [
                {type: actions.CLAIM_PUBLICATION_CREATE_PROCESSING},
                {type: actions.CLAIM_PUBLICATION_CREATE_COMPLETED}
            ];

            try {
                await mockActionsStore.dispatch(claimActions.claimPublication(testRequest));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatched expected actions claiming a publication with files', async () => {
            const testParams = {pid: testClaimRequest.publication.rek_pid};
            const files = {
                "files": {
                    "queue": [{
                        "date": "2017-12-12T13:39:12+10:00",
                        "access_condition_id": 9,
                        "name": 'test.jpg'
                    }]
                }
            };

            mockApi
                .onAny()
                .reply(200, {});

            const expectedActions = [
                {type: actions.CLAIM_PUBLICATION_CREATE_PROCESSING},
                {type: actions.CLAIM_PUBLICATION_CREATE_COMPLETED}
            ];

            await mockActionsStore.dispatch(claimActions.claimPublication({...testClaimRequest, ...files}));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatched expected actions claiming a publication with files with file upload failed', async () => {
            const testParams = {pid: testClaimRequest.publication.rek_pid};
            const files = {
                "files": {
                    "queue": [{
                        "date": "2017-12-12T13:39:12+10:00",
                        "access_condition_id": 9,
                        "name": 'test.jpg'
                    }]
                }
            };

            mockApi
                .onPatch(repositories.routes.EXISTING_RECORD_API(testParams))
                .reply(200, {})
                .onPost(repositories.routes.RECORDS_ISSUES_API({
                    pid: testClaimRequest.publication.rek_pid,
                    fileName: files.files.queue[0].name
                }))
                .reply(200, {})
                .onGet(repositories.routes.FILE_UPLOAD_API({
                    pid: testClaimRequest.publication.rek_pid,
                    fileName: files.files.queue[0].name
                }))
                .reply(200, 's3-ap-southeast-2.amazonaws.com')
                .onPut('s3-ap-southeast-2.amazonaws.com', {"name": "test.txt"}, )
                .reply(500, {});

            const expectedActions = [
                {type: actions.CLAIM_PUBLICATION_CREATE_PROCESSING},
                {type: actions.CLAIM_PUBLICATION_CREATE_COMPLETED}
            ];

            await mockActionsStore.dispatch(claimActions.claimPublication({...testClaimRequest, ...files}));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatched expected actions claiming a publication with files with file upload failed at AWS', async () => {
            const testParams = {pid: testClaimRequest.publication.rek_pid};
            const files = {
                "files": {
                    "queue": [{
                        "date": "2017-12-12T13:39:12+10:00",
                        "access_condition_id": 9,
                        "name": 'test.jpg'
                    }]
                }
            };

            mockApi
                .onPatch(repositories.routes.EXISTING_RECORD_API(testParams))
                .reply(200, {})
                .onPost(repositories.routes.RECORDS_ISSUES_API({
                    pid: testClaimRequest.publication.rek_pid,
                    fileName: files.files.queue[0].name
                }))
                .reply(200, {})
                .onGet(repositories.routes.FILE_UPLOAD_API({
                    pid: testClaimRequest.publication.rek_pid,
                    fileName: files.files.queue[0].name
                }))
                .reply(500, {})
                .onPut('s3-ap-southeast-2.amazonaws.com', {"name": "test.txt"}, )
                .reply(200, {});

            const expectedActions = [
                {type: actions.CLAIM_PUBLICATION_CREATE_PROCESSING},
                {type: actions.CLAIM_PUBLICATION_CREATE_COMPLETED}
            ];

            await mockActionsStore.dispatch(claimActions.claimPublication({...testClaimRequest, ...files}));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatched expected actions when claiming a publication as a solo contributor', async () => {
            const testRequest = {
                ...testClaimRequest,
                publication: {
                    ...testClaimRequest.publication,
                    fez_record_search_key_author: [],
                    fez_record_search_key_author_id: [],
                    fez_record_search_key_contributor_id: [],
                    fez_record_search_key_contributor: [{
                        "rek_contributor_id": 29254063,
                        "rek_contributor_pid": "UQ:332620",
                        "rek_contributor_xsdmf_id": null,
                        "rek_contributor": "Hao, Y.",
                        "rek_contributor_order": 1
                    }]
                }
            };

            mockApi.onAny().reply(200, {});

            const expectedActions = [
                {type: actions.CLAIM_PUBLICATION_CREATE_PROCESSING},
                {type: actions.CLAIM_PUBLICATION_CREATE_COMPLETED}
            ];

            try {
                await mockActionsStore.dispatch(claimActions.claimPublication(testRequest));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatched expected actions when claiming a publication as a solo author', async () => {
            const testRequest = {
                ...testClaimRequest,
                publication: {
                    ...testClaimRequest.publication,
                    fez_record_search_key_author: [{
                        "rek_contributor_id": 29254063,
                        "rek_contributor_pid": "UQ:332620",
                        "rek_contributor_xsdmf_id": null,
                        "rek_contributor": "Hao, Y.",
                        "rek_contributor_order": 1
                    }],
                    fez_record_search_key_author_id: [],
                    fez_record_search_key_contributor_id: [],
                    fez_record_search_key_contributor: []
                }
            };

            mockApi.onAny().reply(200, {});

            const expectedActions = [
                {type: actions.CLAIM_PUBLICATION_CREATE_PROCESSING},
                {type: actions.CLAIM_PUBLICATION_CREATE_COMPLETED}
            ];

            try {
                await mockActionsStore.dispatch(claimActions.claimPublication(testRequest));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });
    });
});
