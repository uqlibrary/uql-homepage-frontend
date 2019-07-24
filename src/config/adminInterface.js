// import React from 'react';
import { PUBLICATION_TYPE_JOURNAL_ARTICLE } from 'config/general';
import locale from 'locale/components';
import Immutable from 'immutable';
import { validation } from 'config';

import { ListEditorField } from 'modules/SharedComponents/Toolbox/ListEditor';
import { LanguageField } from 'modules/SharedComponents/Toolbox/LanguageField';
import { TextField as GenericTextField } from 'modules/SharedComponents/Toolbox/TextField';
import { RichEditorField } from 'modules/SharedComponents/RichEditor';
import { CollectionField } from 'modules/SharedComponents/LookupFields';
import { PublicationSubtypeField } from 'modules/SharedComponents/PublicationSubtype';

export const fieldConfig = {
    rek_title: {
        component: RichEditorField,
        componentProps: {
            name: 'bibliographicSection.rek_title',
            title: 'Formatted title',
            titleProps: {
                variant: 'caption',
                style: {
                    opacity: 0.666,
                },
            },
            height: 100,
            format: (value) => Immutable.Map(value),
            validate: [validation.required],
        },
    },
    rek_description: {
        component: RichEditorField,
        componentProps: {
            name: 'bibliographicSection.rek_description',
            title: 'Formatted abstract',
            titleProps: {
                variant: 'caption',
                style: {
                    opacity: 0.666,
                },
            },
            height: 100,
            format: (value) => Immutable.Map(value),
            validate: [validation.required],
        },
    },
    rek_date: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliogrphicSection.rek_date',
            label: 'Publication date',
            placeholder: 'Date of publication',
            required: true,
            fullWidth: true,
        },
    },
    collections: {
        component: CollectionField,
        componentProps: {
            label: 'Collection',
            placeholder: 'Begin typing to select and add collection(s)',
            name: 'bibliographicSection.collections',
        },
    },
    rek_subtype: {
        component: PublicationSubtypeField,
        componentProps: {
            name: 'bibliographicSection.rek_subtype',
            label: 'eSpace subtype',
            required: true,
            placeholder: '',
        },
    },
    languages: {
        component: LanguageField,
        componentProps: {
            name: 'bibliographicSection.languages',
            label: 'Language',
            required: true,
            placeholder: '',
            multiple: true,
        },
    },
    fez_record_search_key_journal_name: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_journal_name.rek_journal_name',
            fullWidth: true,
            label: 'Journal name',
            placeholder: '',
            required: true,
            validate: [validation.required],
        },
    },
    fez_record_search_key_doi: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_doi.rek_doi',
            fullWidth: true,
            label: 'DOI',
            placeholder: '',
            required: true,
            validate: [validation.required],
        },
    },
    fez_record_search_key_place_of_publication: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_place_of_publication.rek_place_of_publication',
            fullWidth: true,
            label: 'Place of publication',
            placeholder: '',
            required: true,
            validate: [validation.required],
        },
    },
    fez_record_search_key_publisher: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_publisher.rek_publisher',
            fullWidth: true,
            label: 'Publisher',
            placeholder: '',
            required: true,
            validate: [validation.required],
        },
    },
    fez_record_search_key_volume_number: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_volume_number.rek_volume_number',
            fullWidth: true,
            label: 'Volume',
            placeholder: '',
            required: true,
            validate: [validation.required],
        },
    },
    fez_record_search_key_issue_number: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_issue_number.rek_issue_number',
            fullWidth: true,
            label: 'Issue',
            placeholder: '',
            required: true,
            validate: [validation.required],
        },
    },
    fez_record_search_key_article_number: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_article_number.rek_article_number',
            fullWidth: true,
            label: 'Article Number',
            placeholder: '',
        },
    },
    fez_record_search_key_start_page: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_start_page.rek_start_page',
            fullWidth: true,
            label: 'Start page',
            placeholder: '',
            required: true,
            validate: [validation.required],
        },
    },
    fez_record_search_key_end_page: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_end_page.rek_end_page',
            fullWidth: true,
            label: 'End page',
            placeholder: '',
            required: true,
            validate: [validation.required],
        },
    },
    fez_record_search_key_oa_embargo_days: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_oa_embargo_days.rek_oa_embargo_days',
            fullWidth: true,
            label: 'DOI Embargo days',
            placeholder: '',
            required: true,
            validate: [validation.required],
        },
    },
    fez_record_search_key_keywords: {
        component: ListEditorField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_keywords',
            required: true,
            validate: [validation.requiredList],
            maxInputLength: 111,
            searchKey: {
                value: 'rek_keywords',
                order: 'rek_keywords_order',
            },
            locale: locale.components.keywordsForm.field,
        },
    },
    fez_record_search_key_issn: {
        component: ListEditorField,
        componentProps: {
            remindToAdd: true,
            name: 'bibliographicSection.fez_record_search_key_issn',
            isValid: validation.isValidIssn,
            searchKey: {
                value: 'rek_issn',
                order: 'rek_issn_order',
            },
            locale: locale.components.issnForm.field,
        },
    },
    fez_record_search_key_isbn: {
        component: ListEditorField,
        componentProps: {
            remindToAdd: true,
            name: 'bibliographicSection.fez_record_search_key_isbn',
            isValid: validation.isValidIsbn,
            searchKey: {
                value: 'rek_isbn',
                order: 'rek_isbn_order',
            },
            locale: locale.components.isbnForm.field,
        },
    },
    fez_record_search_key_ismn: {
        component: ListEditorField,
        componentProps: {
            remindToAdd: true,
            name: 'bibliographicSection.fez_record_search_key_ismn',
            isValid: validation.isValidIsmn,
            searchKey: {
                value: 'rek_ismn',
                order: 'rek_ismn_order',
            },
            locale: locale.components.ismnForm.field,
        },
    },
    fez_record_search_key_total_pages: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_total_pages.rek_total_pages',
            fullWidth: true,
            label: 'Total pages',
            placeholder: '',
            required: true,
            validate: [validation.required],
        },
    },
    subjects: {
        component: '',
        componentProps: {
            name: '',
        },
    },
    languageOfJournalName: {
        component: LanguageField,
        componentProps: {
            name: 'bibliographicSection.languageOfJournalName',
            label: 'Language of journal name',
            placeholder: '',
            required: true,
            multiple: true,
            validate: [validation.required],
        },
    },
    fez_record_search_key_native_script_journal_name: {
        component: GenericTextField,
        componentProps: {
            name:
                'bibliographicSection.fez_record_search_key_native_script_journal_name.rek_native_script_journal_name',
            label: 'Native script journal name',
            placeholder: '',
            fullWidth: true,
        },
    },
    fez_record_search_key_roman_script_journal_name: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_roman_script_journal_name.rek_roman_script_journal_name',
            label: 'Roman script journal name',
            placeholder: '',
            fullWidth: true,
        },
    },
    fez_record_search_key_translated_journal_name: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_translated_journal_name.rek_translated_journal_name',
            label: 'Translated journal name',
            placeholder: '',
            fullWidth: true,
        },
    },
    languageOfTitle: {
        component: LanguageField,
        componentProps: {
            name: 'bibliographicSection.languageOfTitle',
            label: 'Language of title',
            placeholder: '',
            required: true,
            multiple: true,
            validate: [validation.required],
        },
    },
    fez_record_search_key_native_script_title: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_native_script_title.rek_native_script_title',
            label: 'Native script title',
            placeholder: '',
            fullWidth: true,
        },
    },
    fez_record_search_key_roman_script_title: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_roman_script_title.rek_roman_script_title',
            label: 'Roman script title',
            placeholder: '',
            fullWidth: true,
        },
    },
    fez_record_search_key_translated_title: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_translated_title.rek_translated_title',
            label: 'Translated title',
            placeholder: '',
            fullWidth: true,
        },
    },
};

export const adminInterfaceConfig = {
    [PUBLICATION_TYPE_JOURNAL_ARTICLE]: {
        admin: () => [
            {
                title: 'Admin Information',
                groups: [
                    ['rek_pid'],
                    ['rek_display_type'],
                    ['rek_herdc_notes'],
                    ['fez_internal_notes'],
                    ['fez_record_search_key_retracted'],
                ],
            },
        ],
        identifiers: () => [
            {
                title: 'Identifiers',
                groups: [
                    ['rek_doi', 'rek_isi_loc', 'rek_wos_doc_type'],
                    ['fez_record_search_key_scopus_id', 'rek_scopus_doc_type'],
                    ['fez_record_search_key_pubmed_id', 'rek_pubmed_doc_type'],
                    ['fez_record_search_key_link'],
                    ['fez_record_search_key_link_description'],
                ],
            },
        ],
        bibliographic: (isLote = false, isNtro = false) => [
            {
                title: 'Title',
                groups: [
                    ['rek_title'],
                    ...(isLote
                        ? [
                            ['languageOfTitle'],
                            ['fez_record_search_key_native_script_title'],
                            ['fez_record_search_key_translated_title'],
                            ['fez_record_search_key_roman_script_title'],
                        ]
                        : []),
                    ['languages'],
                ],
            },
            {
                title: 'Journal name',
                groups: [
                    ['fez_record_search_key_journal_name'],
                    ...(isLote
                        ? [
                            ['languageOfJournalName'],
                            ['fez_record_search_key_native_script_journal_name'],
                            ['fez_record_search_key_translated_journal_name'],
                            ['fez_record_search_key_roman_script_journal_name'],
                        ]
                        : []),
                    ['rek_subtype'],
                    // ['fez_record_search_key_doi', 'fez_record_search_key_oa_embargo_days']
                ],
            },
            {
                title: 'ISSN',
                groups: [['fez_record_search_key_issn']],
            },
            {
                title: 'ISBN',
                groups: [['fez_record_search_key_isbn']],
            },
            ...(isNtro
                ? [
                    {
                        title: 'ISMN',
                        groups: [['fez_record_search_key_ismn']],
                    },
                ]
                : []),
            {
                title: 'Bibliographic',
                groups: [
                    ['fez_record_search_key_place_of_publication', 'fez_record_search_key_publisher'],
                    [
                        'fez_record_search_key_volume_number',
                        'fez_record_search_key_issue_number',
                        'fez_record_search_key_article_number',
                    ],
                    [
                        'fez_record_search_key_start_page',
                        'fez_record_search_key_end_page',
                        'fez_record_search_key_total_pages',
                    ],
                    ['rek_date'],
                    // ['rek_date_available'],
                    // ['rek_refereed_source'],
                    // ['fez_record_search_key_succeeds'],
                    ['rek_description'],
                ],
            },
            {
                title: 'Keywords',
                groups: [['fez_record_search_key_keywords']],
            },
            {
                title: 'Subject',
                groups: [
                    // ['fez_record_search_key_for_codes']
                ],
            },
        ],
    },
};

export const valueExtractor = {
    rek_title: {
        getValue: (record) => ({
            plainText: record.rek_title,
            htmlText: record.rek_formatted_title || record.rek_title,
        }),
    },
    rek_description: {
        getValue: (record) => ({
            plainText: record.rek_description,
            htmlText: record.rek_formatted_abstract || record.rek_description,
        }),
    },
    rek_date: {
        getValue: (record) => record.rek_date,
    },
    rek_subtype: {
        getValue: (record) => record.rek_subtype,
    },
    fez_record_search_key_doi: {
        getValue: (record) => ({ ...record.fez_record_search_key_doi }),
    },
    languages: {
        getValue: (record) => record.fez_record_search_key_language.map((language) => language.rek_language),
    },
    fez_record_search_key_journal_name: {
        getValue: (record) => ({ ...record.fez_record_search_key_journal_name }),
    },
    fez_record_search_key_place_of_publication: {
        getValue: (record) => ({
            ...record.fez_record_search_key_place_of_publication,
        }),
    },
    fez_record_search_key_publisher: {
        getValue: (record) => ({ ...record.fez_record_search_key_publisher }),
    },
    fez_record_search_key_volume_number: {
        getValue: (record) => ({ ...record.fez_record_search_key_volume_number }),
    },
    fez_record_search_key_issue_number: {
        getValue: (record) => ({ ...record.fez_record_search_key_issue_number }),
    },
    fez_record_search_key_article_number: {
        getValue: (record) => ({ ...record.fez_record_search_key_article_number }),
    },
    fez_record_search_key_start_page: {
        getValue: (record) => ({ ...record.fez_record_search_key_start_page }),
    },
    fez_record_search_key_end_page: {
        getValue: (record) => ({ ...record.fez_record_search_key_end_page }),
    },
    fez_record_search_key_oa_embargo_days: {
        getValue: (record) => ({
            ...record.fez_record_search_key_oa_embargo_days,
        }),
    },
    fez_record_search_key_total_pages: {
        getValue: (record) => ({
            ...record.fez_record_search_key_total_pages,
        }),
    },
    collections: {
        getValue: (record) =>
            record.fez_record_search_key_ismemberof.map((collection) => ({
                id: collection.rek_ismemberof,
                value: collection.rek_ismemberof_lookup,
            })),
    },
    fez_record_search_key_keywords: {
        getValue: (record) => [...record.fez_record_search_key_keywords],
    },
    fez_record_search_key_issn: {
        getValue: (record) => [...record.fez_record_search_key_issn],
    },
    fez_record_search_key_isbn: {
        getValue: (record) => [...record.fez_record_search_key_isbn],
    },
    fez_record_search_key_ismn: {
        getValue: (record) => [...record.fez_record_search_key_ismn],
    },
    subjects: {
        getValue: (record) =>
            record.fez_record_search_key_subject.map((subject) => ({
                rek_value: {
                    key: subject.rek_subject,
                    value: subject.rek_subject_lookup,
                },
                rek_order: subject.rek_subject_order,
            })),
    },
    languageOfJournalName: {
        getValue: (record) =>
            record.fez_record_search_key_language_of_journal_name.map(
                (language) => language.rek_language_of_journal_name
            ),
    },
    fez_record_search_key_native_script_journal_name: {
        getValue: (record) =>
            (record.fez_record_search_key_native_script_journal_name || {}).rek_native_script_journal_name,
    },
    fez_record_search_key_roman_script_journal_name: {
        getValue: (record) =>
            (record.fez_record_search_key_roman_script_journal_name || {}).rek_roman_script_journal_name,
    },
    fez_record_search_key_translated_journal_name: {
        getValue: (record) => (record.fez_record_search_key_translated_journal_name || {}).rek_translated_journal_name,
    },
    languageOfTitle: {
        getValue: (record) =>
            record.fez_record_search_key_language_of_title.map((language) => language.rek_language_of_title),
    },
    fez_record_search_key_native_script_title: {
        getValue: (record) => (record.fez_record_search_key_native_script_title || {}).rek_native_script_title,
    },
    fez_record_search_key_roman_script_title: {
        getValue: (record) => (record.fez_record_search_key_roman_script_title || {}).rek_roman_script_title,
    },
    fez_record_search_key_translated_title: {
        getValue: (record) => (record.fez_record_search_key_translated_title || {}).rek_translated_title,
    },
};