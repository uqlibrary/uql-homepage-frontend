import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as fixRecordActions from './fixRecord';
import * as mockData from 'mock/data';

describe('Fix record actions', () => {
    const testPid = "UQ:396321";

    // extend expect to check actions
    expect.extend({toHaveDispatchedActions});

    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    describe('loadRecordToFix action', () => {
        it('dispatches expected actions when loading a record to fix from API successfully', async () => {
            mockApi
                .onGet(repositories.routes.EXISTING_RECORD_API({pid: testPid}).apiUrl)
                .reply(200, {data: {...mockData.record}});

            const expectedActions = [
                actions.FIX_RECORD_LOADING,
                actions.FIX_RECORD_LOADED
            ];

            try {
                await mockActionsStore.dispatch(fixRecordActions.loadRecordToFix(testPid));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions when loading a record to fix from API failed', async () => {
            mockApi
                .onAny()
                .reply(500);

            const expectedActions = [
                actions.FIX_RECORD_LOADING,
                actions.FIX_RECORD_LOAD_FAILED
            ];
            try {
                await mockActionsStore.dispatch(fixRecordActions.loadRecordToFix(testPid));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions when loading a record to fix from API for anon user', async () => {
            mockApi
                .onAny()
                .reply(403);

            const expectedActions = [
                actions.FIX_RECORD_LOADING,
                actions.CURRENT_ACCOUNT_ANONYMOUS,
                actions.FIX_RECORD_LOAD_FAILED
            ];
            await mockActionsStore.dispatch(fixRecordActions.loadRecordToFix(testPid));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('setting/clearing record to fix action', () => {
        it('dispatches expected actions when setting a loaded record to fix', async () => {
            const expectedActions = [
                actions.FIX_RECORD_SET
            ];
            try {
                await mockActionsStore.dispatch(fixRecordActions.setFixRecord(mockData.record));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions when clearing a loaded record to fix', async () => {
            const expectedActions = [
                actions.FIX_RECORD_CLEAR
            ];

            try {
                await mockActionsStore.dispatch(fixRecordActions.clearFixRecord());
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });
    });

    describe('fixRecord action', () => {

        it('dispatches expected actions with invalid data (missing publication data)', async () => {
            const testInput = {author: ''};

            const expectedActions = [
                actions.FIX_RECORD_FAILED
            ];

            try {
                await mockActionsStore.dispatch(fixRecordActions.fixRecord(testInput));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions with invalid data (missing author data)', async () => {
            const testInput = {publication: ''};

            const expectedActions = [
                actions.FIX_RECORD_FAILED
            ];

            try {
                await mockActionsStore.dispatch(fixRecordActions.fixRecord(testInput));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions with invalid data (missing author is not linked to publication)', async () => {
            const testInput = {
                publication: {
                    fez_record_search_key_author_id: [
                        {
                            rek_author_id: 123
                        }
                    ]
                },
                author: {
                    aut_id: 124
                }
            };

            const expectedActions = [
                actions.FIX_RECORD_FAILED
            ];

            try {
                await mockActionsStore.dispatch(fixRecordActions.fixRecord(testInput));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions for successful record fix with files', async () => {
            const testInput = {
                publication: {
                    ...mockData.record
                },
                author: {
                    aut_id: 410
                },
                files: {
                    queue: [
                        {
                            name: 'test.txt'
                        }
                    ]
                }
            };

            const expectedActions = [
                actions.FIX_RECORD_PROCESSING,
                actions.FIX_RECORD_SUCCESS
            ];

            mockApi
                .onGet(repositories.routes.FILE_UPLOAD_API({pid: testPid, fileName: "test.txt"}).apiUrl)
                .reply(200, 's3-ap-southeast-2.amazonaws.com')
                .onPut('s3-ap-southeast-2.amazonaws.com', {"name": "test.txt"})
                .reply(200, {})
                .onPatch(repositories.routes.EXISTING_RECORD_API({pid: testPid}).apiUrl)
                .reply(200, {data: {...mockData.record}})
                .onPost(repositories.routes.RECORDS_ISSUES_API({pid: testPid}).apiUrl)
                .reply(200, {});

            try {
                await mockActionsStore.dispatch(fixRecordActions.fixRecord(testInput));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions for successful record fix with url link', async () => {
            const testInput = {
                publication: {
                    ...mockData.record
                },
                author: {
                    aut_id: 410
                },
                rek_link: 'http://www.google.com'
            };

            const expectedActions = [
                actions.FIX_RECORD_PROCESSING,
                actions.FIX_RECORD_SUCCESS
            ];

            mockApi
                .onPatch(repositories.routes.EXISTING_RECORD_API({pid: testPid}).apiUrl)
                .reply(200, {data: {...mockData.record}})
                .onPost(repositories.routes.RECORDS_ISSUES_API({pid: testPid}).apiUrl)
                .reply(200, {});

            try {
                await mockActionsStore.dispatch(fixRecordActions.fixRecord(testInput));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions for successful record fix', async () => {
            const testInput = {
                publication: {
                    ...mockData.record
                },
                author: {
                    aut_id: 410
                }
            };

            const expectedActions = [
                actions.FIX_RECORD_PROCESSING,
                actions.FIX_RECORD_SUCCESS
            ];

            mockApi.onAny().reply(200, {});

            try {
                await mockActionsStore.dispatch(fixRecordActions.fixRecord(testInput));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions for record fix for anon user', async () => {
            const testInput = {
                publication: {
                    ...mockData.record
                },
                author: {
                    aut_id: 410
                }
            };

            const expectedActions = [
                actions.FIX_RECORD_PROCESSING,
                actions.CURRENT_ACCOUNT_ANONYMOUS,
                actions.FIX_RECORD_FAILED
            ];

            mockApi
                .onAny()
                .reply(403, {});

            try {
                await mockActionsStore.dispatch(fixRecordActions.fixRecord(testInput));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions for record fix with API returning error', async () => {
            const testInput = {
                publication: {
                    ...mockData.record
                },
                author: {
                    aut_id: 410
                }
            };

            const expectedActions = [
                actions.FIX_RECORD_PROCESSING,
                actions.FIX_RECORD_FAILED
            ];

            mockApi
                .onAny()
                .reply(500, {});

            try {
                await mockActionsStore.dispatch(fixRecordActions.fixRecord(testInput));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });
    });

    describe('unclaimRecord action', () => {
        it('dispatches expected actions with invalid data (missing publication data)', async () => {
            const testInput = {
                author: {}
            };

            const expectedActions = [
                actions.FIX_RECORD_FAILED
            ];

            try {
                await mockActionsStore.dispatch(fixRecordActions.unclaimRecord(testInput));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions with invalid data (missing author)', async () => {
            const testInput = {
                publication: {}
            };

            const expectedActions = [
                actions.FIX_RECORD_FAILED
            ];

            try {
                await mockActionsStore.dispatch(fixRecordActions.unclaimRecord(testInput));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions with invalid data (missing author/record link)', async () => {
            const testInput = {
                publication: {
                    fez_record_search_key_author_id: [
                        {
                            rek_author_id: 123
                        }
                    ],
                    fez_record_search_key_contributor_id: [
                        {
                            rek_contributor_id: 125
                        }
                    ]
                },
                author: {
                    aut_id: 124
                }
            };

            const expectedActions = [
                actions.FIX_RECORD_FAILED
            ];

            try {
                await mockActionsStore.dispatch(fixRecordActions.unclaimRecord(testInput));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions for successful record unclaim', async () => {
            const testInput = {
                publication: {
                    ...mockData.record,
                    fez_record_search_key_author_id: [
                        {
                            rek_author_id: 123
                        }
                    ],
                    fez_record_search_key_contributor_id: [
                        {
                            rek_contributor_id: 123
                        }
                    ]
                },
                author: {
                    aut_id: 123
                }
            };

            const expectedActions = [
                actions.FIX_RECORD_PROCESSING,
                actions.FIX_RECORD_UNCLAIM_SUCCESS
            ];

            mockApi.onPatch(repositories.routes.EXISTING_RECORD_API({pid: testPid}).apiUrl)
                .reply(200, {data: {...mockData.record}});

            try {
                await mockActionsStore.dispatch(fixRecordActions.unclaimRecord(testInput));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions for record unclaim for anon user', async () => {
            const testInput = {
                publication: {
                    ...mockData.record,
                    fez_record_search_key_author_id: [
                        {
                            rek_author_id: 123
                        }
                    ],
                    fez_record_search_key_contributor_id: [
                        {
                            rek_contributor_id: 123
                        }
                    ]
                },
                author: {
                    aut_id: 123
                }
            };

            const expectedActions = [
                actions.FIX_RECORD_PROCESSING,
                actions.CURRENT_ACCOUNT_ANONYMOUS,
                actions.FIX_RECORD_FAILED
            ];

            mockApi
                .onAny()
                .reply(403, {});

            try {
                await mockActionsStore.dispatch(fixRecordActions.unclaimRecord(testInput));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions for record unclaim with API returning error', async () => {
            const testInput = {
                publication: {
                    ...mockData.record,
                    fez_record_search_key_author_id: [
                        {
                            rek_author_id: 123
                        }
                    ],
                    fez_record_search_key_contributor_id: [
                        {
                            rek_contributor_id: 123
                        }
                    ]
                },
                author: {
                    aut_id: 123
                }
            };

            const expectedActions = [
                actions.FIX_RECORD_PROCESSING,
                actions.FIX_RECORD_FAILED
            ];

            mockApi
                .onAny()
                .reply(500, {});

            try {
                await mockActionsStore.dispatch(fixRecordActions.unclaimRecord(testInput));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });
    });
});