import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useAccountContext } from 'context';

import locale from '../courseResourcesLocale';
import { a11yProps, reverseA11yProps } from '../courseResourcesHelpers';

import { Guides } from './Guides';
import { ReadingLists } from './ReadingLists';
import { MyCourses } from './MyCourses';
import { PastExamPapers } from './PastExamPapers';
import { SearchCourseResources } from './SearchCourseResources';
import { SubjectLinks } from './SubjectLinks';
import { TabPanel } from './TabPanel';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import { makeStyles } from '@material-ui/styles';

import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(
    () => ({
        courseResourceLineItem: {
            borderTop: '1px solid #e8e8e8',
            padding: '15px 0',
            '& a': {
                display: 'flex',
                alignItems: 'center',
            },
        },
        panelLayout: {
            padding: '12px 0',
        },
        studyLinks: {
            minHeight: '10rem',
        },
    }),
    { withTheme: true },
);

export const CourseResources = ({
    actions,
    guideList,
    guideListLoading,
    guideListError,
    learningResourcesList, // has sub element reading_lists (summary)
    learningResourcesListLoading,
    learningResourcesListError,
    readingList, // list of books. chapters, etc
    readingListLoading,
    readingListError,
}) => {
    const { account } = useAccountContext();
    const classes = useStyles();

    /**
     * The page consists of 3 sections:
     * - the user's enrolled courses (aka subjects),
     * - search area and
     * - some help links
     * If the user is enrolled in courses then we load that section: top0
     * Otherwise we load the search section: top1
     * These sections are displayed as 3 tabs across the top
     */
    const [topmenu, setCurrentTopTab] = useState(!!account.classes && account.classes.length ? 'top0' : 'top1');
    const handleTopTabChange = (event, topMenuTabId) => {
        setCurrentTopTab(topMenuTabId);
    };

    // store a list of the Learning Resources that have been loaded, by subject
    const [currentLearningResourcesList, updateLearningResourcesList] = useState([]);

    // store a list of the Guides that have been loaded, by subject
    const [currentGuidesList, updateGuidesList] = useState([]);

    // store a list of the Reading Lists that have been loaded, by subject
    const [currentReadingLists, updateReadingLists] = useState([]);

    const loadNewSubject = classnumber => {
        if (!currentLearningResourcesList[classnumber]) {
            !!classnumber && actions.loadLearningResources(classnumber);
        }

        if (!currentGuidesList[classnumber]) {
            !!classnumber && actions.loadGuides(classnumber);
        }
    };

    const [displayType, setDisplayType] = useState('mycourses');
    const [keywordPresets, setKeywordPresets] = useState({});

    const [listSearchedSubjects, updateSearchList] = useState([]);
    // may need state of 'listMyCourses' which then shows the mycourses tab?

    const getCampusByCode = code => {
        const campuses = {
            STLUC: 'St Lucia',
            GATTN: 'Gatton',
            IPSWC: 'Ipswich',
            HERST: 'Herston',
        };
        if (campuses.hasOwnProperty(code)) {
            return campuses[code];
        }

        return null;
    };

    const filterReadingLists = React.useCallback(
        (learningResourcesList, classnumber, classes) => {
            const readingLists =
                (!!learningResourcesList &&
                    learningResourcesList.length > 0 &&
                    !!learningResourcesList[0] &&
                    learningResourcesList[0].reading_lists) ||
                [];

            if (!readingLists || readingLists.length === 0) {
                return [];
            }

            if (readingLists.length === 1) {
                return readingLists;
            }

            const extractDetailsOfEnrolmentFromCurrentClassList = (classes, classnumber) => {
                const subjectTemplate = {
                    semester: null,
                    CAMPUS: null,
                    INSTRUCTION_MODE: null,
                };
                const subjectlist =
                    !!classes && classes.filter(aClass => !!aClass && aClass.classnumber === classnumber);
                const thisSubject = (!!subjectlist && subjectlist.length > 0 && subjectlist[0]) || null;
                return {
                    semester: thisSubject.semester || subjectTemplate.semester,
                    CAMPUS: thisSubject.CAMPUS || subjectTemplate.CAMPUS,
                    INSTRUCTION_MODE: thisSubject.INSTRUCTION_MODE || subjectTemplate.INSTRUCTION_MODE,
                };
            };

            if (displayType === 'searchresults') {
                const semesterString = keywordPresets.period;
                const campus = keywordPresets.campus;
                return readingLists.filter(item => {
                    return item.period === semesterString && item.campus.indexOf(campus) !== -1;
                });
            } else {
                const subjectEnrolment = extractDetailsOfEnrolmentFromCurrentClassList(classes, classnumber);
                const semesterString = subjectEnrolment.semester;
                const campus = getCampusByCode(subjectEnrolment.CAMPUS);
                return readingLists.filter(item => {
                    return (
                        item.period === semesterString &&
                        (item.campus.indexOf(campus) !== -1 || subjectEnrolment.INSTRUCTION_MODE === 'EX')
                    );
                });
            }
        },
        [displayType, keywordPresets],
    );

    // get the long Talis string, like 2109F2EC-AB0B-482F-4D30-1DD3531E46BE fromm the Talis url
    const getReadingListId = readingList => {
        let id = '';
        if (!!readingList.url) {
            const url = readingList.url;
            id = url.substring(url.lastIndexOf('/') + 1);
            if (id.indexOf('.') !== -1) {
                id = id.substring(0, url.indexOf('.'));
            }
        }
        return id;
    };

    const isReadingListKnown = React.useCallback(talisId => !!talisId && currentReadingLists[talisId] === undefined, [
        currentReadingLists,
    ]);

    const addReadingListToCurrentList = React.useCallback(
        subjectNumber => {
            const currentClasses = account.classes || null;
            const filteredReadingLists =
                !!learningResourcesList && learningResourcesList.length > 0
                    ? filterReadingLists(learningResourcesList, subjectNumber, currentClasses)
                    : [];
            if (filteredReadingLists.length === 1) {
                const talisId = getReadingListId(filteredReadingLists[0]);
                if (isReadingListKnown(talisId)) {
                    actions.loadReadingLists(talisId);
                }
            }
        },
        [learningResourcesList, account, actions, filterReadingLists, isReadingListKnown],
    );

    const addLearningResourceToCurrentList = React.useCallback(() => {
        if (!!learningResourcesList && learningResourcesList.length > 0 && learningResourcesList[0].title) {
            const subjectNumber = learningResourcesList[0].title;
            // if (subjectNumber !== false && currentLearningResourcesList.subjectNumber === undefined) {
            if (subjectNumber !== false && currentLearningResourcesList[subjectNumber] === undefined) {
                const newLearningResourcesList = {};
                newLearningResourcesList[subjectNumber] = learningResourcesList;
                updateLearningResourcesList(currentLearningResourcesList =>
                    Object.assign({}, ...currentLearningResourcesList, ...newLearningResourcesList),
                );
                addReadingListToCurrentList(subjectNumber);
            }
        }
    }, [learningResourcesList, currentLearningResourcesList, addReadingListToCurrentList]);

    React.useEffect(() => {
        // per https://wanago.io/2019/11/18/useeffect-hook-in-react-custom-hooks/
        addLearningResourceToCurrentList();
    }, [addLearningResourceToCurrentList]);

    // store the reading list for this subject in currentReadingLists by subject
    const updateListOfReadingLists = React.useCallback(() => {
        const getSubjectNumberbyTalisid = talisId => {
            let subjectNumber = false;
            Object.values(currentLearningResourcesList).map(item => {
                const readingList =
                    !!item[0].reading_lists && item[0].reading_lists.length > 0 && item[0].reading_lists[0];
                if (talisId === getReadingListId(readingList)) {
                    subjectNumber = item[0].title;
                }
            });
            return subjectNumber;
        };

        if (!!readingList && readingList.length > 0 && !!readingList[0].talisId) {
            const subject = getSubjectNumberbyTalisid(readingList[0].talisId);
            if (subject !== false && currentReadingLists[subject] === undefined) {
                const newReadingList = {};
                newReadingList[subject] = readingList;
                updateReadingLists(currentReadingLists => Object.assign({}, ...currentReadingLists, ...newReadingList));
            }
        }
    }, [readingList, currentReadingLists, currentLearningResourcesList]);

    React.useEffect(() => {
        updateListOfReadingLists();
    }, [updateListOfReadingLists]);

    const updateGuidesSubjectList = React.useCallback(() => {
        if (!!guideList && guideList.length > 0 && guideList[0].coursecode) {
            const subjectNumber = guideList[0].coursecode;
            // if (subjectNumber !== false && currentGuidesList.subjectNumber === undefined) {
            if (subjectNumber !== false && currentGuidesList[subjectNumber] === undefined) {
                const newGuidesList = {};
                newGuidesList[subjectNumber] = guideList;
                updateGuidesList(currentGuidesList => Object.assign({}, ...currentGuidesList, ...newGuidesList));
            }
        }
    }, [guideList, currentGuidesList]);

    React.useEffect(() => {
        updateGuidesSubjectList();
    }, [updateGuidesSubjectList]);

    // load the data for the first class (it is automatically displayed if the user has classes). Should only run once
    React.useEffect(() => {
        const firstEnrolledClassNumber =
            (!!account.classes &&
                account.classes.length > 0 &&
                !!account.classes[0] &&
                account.classes[0].classnumber) ||
            null;
        if (firstEnrolledClassNumber !== null) {
            !!firstEnrolledClassNumber && actions.loadLearningResources(firstEnrolledClassNumber);

            !!firstEnrolledClassNumber && actions.loadGuides(firstEnrolledClassNumber);
        }
    }, [account, actions]);

    const renderStudyHelpLinks = (
        <Grid container alignContent={'space-between'} className={classes.studyLinks}>
            <Grid item xs={12}>
                <StandardCard title={locale.studyHelp.title}>
                    <Grid container spacing={2}>
                        {!!locale.studyHelp.links &&
                            locale.studyHelp.links.length > 0 &&
                            locale.studyHelp.links.map((item, index) => {
                                return item.linkTo && item.linkLabel ? (
                                    <Grid
                                        item
                                        className={classes.courseResourceLineItem}
                                        key={`studylink-${index}`}
                                        xs={12}
                                    >
                                        <a
                                            // on-tap="linkClicked"
                                            id={item.id || null}
                                            href={item.linkTo}
                                        >
                                            {!!item.icon && item.icon}
                                            {item.linkLabel}
                                        </a>
                                    </Grid>
                                ) : (
                                    <Typography>{locale.studyHelp.unavailable}</Typography>
                                );
                            })}
                    </Grid>
                </StandardCard>
            </Grid>
        </Grid>
    );

    const renderSubjectTabBody = subject => {
        const courseTitle =
            !!currentLearningResourcesList &&
            !!currentLearningResourcesList[subject.classnumber] &&
            !!currentLearningResourcesList[subject.classnumber][0] &&
            !!currentLearningResourcesList[subject.classnumber][0].course_title
                ? currentLearningResourcesList[subject.classnumber][0].course_title
                : null;

        return (
            <Grid container>
                <Grid item xs={12}>
                    <Typography color={'primary'} component={'h3'} variant={'h5'} style={{ textAlign: 'center' }}>
                        {subject.classnumber} - {courseTitle}
                    </Typography>
                </Grid>

                <ReadingLists
                    // actions={actions}
                    classnumber={subject.classnumber}
                    currentClasses={account.classes}
                    filterReadingLists={filterReadingLists}
                    readingList={currentReadingLists[[subject.classnumber]]}
                    readingListLoading={readingListLoading}
                    readingListError={readingListError}
                    learningResourcesList={currentLearningResourcesList[subject.classnumber]}
                    learningResourcesListLoading={learningResourcesListLoading}
                    learningResourcesListError={learningResourcesListError}
                />

                <PastExamPapers
                    subject={subject}
                    learningResourcesList={currentLearningResourcesList[subject.classnumber]}
                    learningResourcesListLoading={learningResourcesListLoading}
                    learningResourcesListError={learningResourcesListError}
                />

                <Guides
                    guideList={currentGuidesList[subject.classnumber]}
                    guideListLoading={guideListLoading}
                    guideListError={guideListError}
                />

                <SubjectLinks subject={subject} />
            </Grid>
        );
    };

    /*
    let classes = account.classes || null;

    // dev hack while we wait for api update (needs more fields)
    if (classes === null) {
        classes = [
            {
                SUBJECT: 'FREN',
                subjectLevel: '1010',
                classnumber: 'FREN1010',
                classname: 'Introductory French 1',
            },
            {
                SUBJECT: 'HIST',
                subjectLevel: '1201',
                classnumber: 'HIST1201',
                classname: 'The Australian  Experience',
            },
            {
                SUBJECT: 'PHIL',
                subjectLevel: '1002',
                classnumber: 'PHIL1002',
                classname: 'Introduction to Philosophy: What is Philosophy?',
            },
        ];
    }
    */

    return (
        <StandardPage title={locale.title}>
            <div className="layout-card" style={{ margin: '0 auto 16px' }}>
                <StandardCard noPadding noHeader>
                    <Grid container className={classes.panelLayout} spacing={1}>
                        <Grid item xs={12} data-testid="course-resources">
                            <AppBar
                                data-testid="course-resource-top-menu"
                                id="course-resource-top-menu"
                                position="static"
                                component="div"
                            >
                                <Tabs centered onChange={handleTopTabChange} value={topmenu}>
                                    <Tab value="top0" label={locale.myCourses.title} {...a11yProps('0')} />
                                    <Tab value="top1" label={locale.search.title} {...a11yProps('1')} />
                                    <Tab value="top2" label={locale.studyHelp.title} {...a11yProps('2')} />
                                </Tabs>
                            </AppBar>

                            <TabPanel
                                value={topmenu}
                                index="top0" // must match 'value' in Tabs
                                label="topmenu"
                                {...reverseA11yProps('0')}
                            >
                                <MyCourses
                                    loadNewSubject={loadNewSubject}
                                    renderSubjectTabBody={renderSubjectTabBody}
                                />
                            </TabPanel>
                            <TabPanel
                                value={topmenu}
                                index="top1" // must match 'value' in Tabs
                                label="topmenu"
                                {...reverseA11yProps('1')}
                            >
                                <SearchCourseResources
                                    listSearchedSubjects={listSearchedSubjects}
                                    loadNewSubject={loadNewSubject}
                                    renderSubjectTabBody={renderSubjectTabBody}
                                    setKeywordPresets={setKeywordPresets}
                                    setDisplayType={setDisplayType}
                                    updateSearchList={updateSearchList}
                                />
                            </TabPanel>
                            <TabPanel
                                value={topmenu}
                                index="top2"
                                tabId="topmenu"
                                label="topmenu"
                                {...reverseA11yProps('2')}
                            >
                                {renderStudyHelpLinks}
                            </TabPanel>
                        </Grid>
                    </Grid>
                </StandardCard>
            </div>
        </StandardPage>
    );
};

CourseResources.propTypes = {
    actions: PropTypes.object,
    guideList: PropTypes.any,
    guideListLoading: PropTypes.bool,
    guideListError: PropTypes.string,
    learningResourcesList: PropTypes.any,
    learningResourcesListLoading: PropTypes.bool,
    learningResourcesListError: PropTypes.string,
    readingList: PropTypes.any,
    readingListLoading: PropTypes.bool,
    readingListError: PropTypes.string,
};

export default React.memo(CourseResources);
