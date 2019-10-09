import commonFields from './commonFields';

export default {
    ...commonFields,
    bibliographic: (isLote = false) => [
        {
            title: 'Title',
            groups: [['rek_title'], ...(isLote ? [['fez_record_search_key_translated_title']] : [])],
        },
        {
            title: 'Language of work',
            groups: [['languages']],
        },
        {
            title: 'Bibliographic',
            groups: [
                ['fez_record_search_key_total_pages'],
                ['rek_date'],
                ['rek_description'],
                ['rek_genre_type'],
                ['fez_record_search_key_org_name'],
                ['thesisOrgUnitName'],
            ],
        },
        {
            title: 'Keyword(s)',
            groups: [['fez_record_search_key_keywords']],
        },
        {
            title: 'Subject',
            groups: [['subjects']],
        },
        {
            title: 'Related publications', // Succeeds
            groups: [['fez_record_search_key_isderivationof']],
        },
    ],
    authors: () => [
        {
            title: 'Authors',
            groups: [['authors']],
        },
        {
            title: 'Editors',
            groups: [['editors']],
        },
        {
            title: 'Supervisors',
            groups: [['supervisors']],
        },
    ],
    additionalInformation: () => [
        {
            title: 'Member of collections',
            groups: [['collections']],
        },
        {
            title: 'Additional information',
            groups: [['rek_subtype'], ['fez_record_search_key_oa_status'], ['additionalNotes']],
        },
    ],
    ntro: () => [],
};

export const validateThesis = (
    { bibliographicSection: bs, filesSection: fs, authorsSection: as },
    { validationErrorsSummary: summary },
) => ({
    bibliographicSection: {
        ...((!(bs || {}).thesisOrgUnitName && {
            thesisOrgUnitName: summary.rek_org_unit_name,
        }) ||
            {}),
        ...((!(bs || {}).rek_genre_type && {
            rek_genre_type: summary.rek_genre_type,
        }) ||
            {}),
        ...((!(bs || {}).subjects && {
            subjects: summary.subjects,
        }) ||
            {}),
    },
    filesSection: {
        ...((fs || {}).rek_copyright !== 'on' && {
            rek_copyright: summary.rek_copyright,
        }),
    },
    authorsSection: {
        ...(((as || {}).authors || []).length === 0 && {
            authors: summary.authors,
        }),
        ...(((as || {}).supervisors || []).length === 0 && {
            supervisors: summary.supervisors,
        }),
    },
});
