import commonFields from './commonFields';

export default {
    ...commonFields,
    identifiers: () => [
        {
            title: 'Manage identifiers',
            groups: [
                ['fez_record_search_key_isi_loc', 'rek_wok_doc_type'],
                ['fez_record_search_key_scopus_id', 'rek_scopus_doc_type'],
                ['rek_pubmed_doc_type'],
            ],
        },
        {
            title: 'Manage links',
            groups: [['links']],
        },
    ],
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
            title: 'ISSN',
            groups: [['fez_record_search_key_issn']],
        },
        {
            title: 'Bibliographic',
            groups: [
                ['fez_record_search_key_place_of_publication', 'fez_record_search_key_publisher'],
                ['fez_record_search_key_edition'],
                [
                    'fez_record_search_key_start_page',
                    'fez_record_search_key_end_page',
                    'fez_record_search_key_total_pages',
                ],
                ['rek_date', 'fez_record_search_key_refereed_source'],
                ['rek_description'],
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
    ],
    additionalInformation: () => [
        {
            title: 'Member of collections',
            groups: [['collections']],
        },
        {
            title: 'Additional information',
            groups: [
                ['fez_record_search_key_herdc_code', 'fez_record_search_key_herdc_status'],
                ['fez_record_search_key_institutional_status', 'fez_record_search_key_oa_status', 'contentIndicators'],
                ['additionalNotes'],
            ],
        },
        {
            title: 'Temporary placement',
            groups: [
                ['fez_record_search_key_newspaper'],
                ['fez_record_search_key_section'],
                ['fez_record_search_key_translated_newspaper'],
            ],
        },
    ],
    ntro: () => [],
};