import React from 'react';

export default {
    validationErrors: {
        publicationSearch: 'Type a valid publication DOI (e.g. 10.1163/9789004326828), Pubmed ID (e.g. 28131963) or the title (min 10 characters) of the publication',
        isbn: 'ISBN value is not valid',
        issn: 'ISSN value is not valid',
        ismc: 'ISMC value is not valid',
        isrc: 'ISRC value is not valid',
        fileUpload: 'File upload is not in valid state',
        fileUploadRequired: 'Add at least one file to upload',
        required: 'This field is required',
        email: 'Email address is not valid',
        url: 'URL is not valid',
        doi: 'DOI is not valid',
        forRequired: 'Field of research values are required',
        dateTimeDay: 'Invalid date',
        dateTimeYear: 'Invalid year',
        maxLength: 'Must be [max] characters or less',
        minLength: 'Must be at least [min] characters',
        authorLinking: 'Please select and confirm an author',
        contributorLinking: 'Please select and confirm a contributor',
        authorRequired: (<span>Please <b>provide a list of authors/creators</b> of the work and <b>select an author/creator or editor/contributor</b> as you</span>),
        editorRequired: (<span>Please <b>provide a list of editors/contributors</b> of the work and <b>select an editor/contributor or author/creator</b> as you</span>),
        supervisorRequired: 'Please provide a list of supervisors',
        googleScholarId: 'Please provide a valid 12 character Google Scholar ID',
        advancedSearchSelectionRequired: 'Please select a field to search',
        dateRange: 'Please provide a valid date range'
    },
    validationErrorsSummary: {
        rek_title: 'Title is required',
        rek_description: 'Description is required',
        rek_book_title: 'Book title is required',
        rek_date: 'Publication date is required',
        rek_subtype: 'Work subtype is required',
        authors: 'Author/creator names are required',
        currentAuthor: 'Author name is required',
        editors: 'Editor/contributor names are required',
        supervisors: 'Supervisor names are required',
        rek_journal_name: 'Journal name is required',
        rek_link: 'Link is invalid',
        rek_doi: 'DOI is invalid',
        rek_newspaper: 'Newspaper name is required',
        rek_end_page: 'End page is required',
        rek_start_page: 'Start page is required',
        rek_publisher: 'Publisher is required',
        rek_place_of_publication: 'Place of publication is required',
        rek_total_pages: 'Total page is required',
        rek_conference_name: 'Conference name is required',
        rek_conference_location: 'Conference location is required',
        rek_conference_dates: 'Conference dates are required',
        rek_org_unit_name: 'Enrolling unit is required',
        rek_org_name: 'Institution name is required',
        rek_genre_type: 'Thesis type is required',
        thesisTitle: 'Thesis title is required',
        thesisAbstract: 'Thesis abstract is required',
        files: 'File submission to be completed',
        fieldOfResearch: 'Field of research (FoR) codes are required',
        fez_record_search_key_keywords: 'Keywords are required',
        contributorLinking: 'You are required to select a contributor from the list, then confirm that it is you',
        authorLinking: 'You are required to select a author from the list, then confirm that it is you',
        comments: 'Comments are required',
        fixRecordAnyField: 'Please provide either comments, URL link or upload file(s).',
        contactName: 'Contact name is required',
        contactNameId: 'ID for contact name is required',
        contactEmail: 'Contact email is required',
        rek_access_conditions: 'Access condition is required',
        rek_copyright: 'You are required to accept deposit agreement',
        rek_license: 'Licensing and terms of access is required',
        rek_project_name: 'Project name is required',
        rek_project_description: 'Project description is required',
        fez_record_search_key_grant_id: 'Grant information is required'
    }
};
