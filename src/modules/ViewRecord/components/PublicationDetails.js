import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/viewRecord';
import {pathConfig} from 'config/routes';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {Link} from 'react-router-dom';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
    header: {
        fontWeight: 400,
        [theme.breakpoints.down('xs')]: {
            fontSize: '0.975rem',
        },
        [theme.breakpoints.up('sm')]: {
            fontSize: '0.775rem',
            fontWeight: 500
        }
    },
    data: {
        fontSize: '0.8rem',
        lineHeight: '1.5rem'
    },
    gridRow: {
        borderBottom: `1px solid ${theme.palette.secondary.light}`
    },
    ul: {
        listStyleType: 'none',
        padding: 0,
        margin: 0
    }
});

export class PublicationDetails extends PureComponent {
    static propTypes = {
        publication: PropTypes.object.isRequired,
        classes: PropTypes.object
    };

    ViewRecordRow = ({heading, data}) => (
        <div style={{padding: 16}}>
            <Grid container spacing={32} className={this.props.classes.gridRow} alignItems="flex-start">
                <Grid item xs={12} sm={3}>
                    <Typography variant="body2" classes={{root: this.props.classes.header}}>{heading}</Typography>
                </Grid>
                <Grid item xs={12} sm={9} className={this.props.classes.data}>{data}</Grid>
            </Grid>
        </div>
    );

    render() {
        if (!this.props.publication.rek_display_type_lookup) {
            return null;
        }

        return (
            <Grid item xs={12}>
                <StandardCard title={locale.viewRecord.sections.publicationDetails}>
                    {
                        this.props.publication.rek_display_type_lookup &&
                            <this.ViewRecordRow
                                heading={locale.viewRecord.headings.default.publicationDetails.rek_display_type}
                                data={this.props.publication.rek_display_type_lookup}
                            />
                    }
                    {
                        this.props.publication.rek_subtype &&
                            <this.ViewRecordRow
                                heading={locale.viewRecord.headings.default.publicationDetails.rek_subtype}
                                data={this.props.publication.rek_subtype}
                            />
                    }
                    {
                        this.props.publication.fez_record_search_key_ismemberof &&
                        this.props.publication.fez_record_search_key_ismemberof.length > 0 &&
                            <this.ViewRecordRow
                                heading={locale.viewRecord.headings.default.publicationDetails.fez_record_search_key_ismemberof}
                                data={(
                                    <ul className={this.props.classes.ul}>
                                        {
                                            this.props.publication.fez_record_search_key_ismemberof.map((collection, index)=>(
                                                collection.rek_ismemberof && collection.rek_ismemberof_lookup &&
                                                <li key={`collection-${index}`}>
                                                    <Link to={pathConfig.list.collection(collection.rek_ismemberof, collection.rek_ismemberof_lookup)}>{collection.rek_ismemberof_lookup}</Link>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                )}
                            />
                    }
                </StandardCard>
            </Grid>
        );
    }
}

export default withStyles(styles)(PublicationDetails);
