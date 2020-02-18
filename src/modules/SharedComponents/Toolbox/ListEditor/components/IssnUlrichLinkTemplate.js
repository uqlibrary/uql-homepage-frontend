import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import { default as globalLocale } from 'locale/global';

export const IssnUlrichLinkTemplate = ({ item }) => {
    return (
        <React.Fragment>
            <Typography variant="body2" component={'span'}>
                <span>{!!item.key ? item.key : item}</span>{' '}
                {!!item.value && !!item.value.ulrichs.link && !!item.value.ulrichs.linkText && (
                    <ExternalLink href={item.value.ulrichs.link} aria-label={globalLocale.global.ulrichsLink.ariaLabel}>
                        <i>{item.value.ulrichs.linkText}</i> {globalLocale.global.ulrichsLink.labelSuffix}
                    </ExternalLink>
                )}
            </Typography>
        </React.Fragment>
    );
};

IssnUlrichLinkTemplate.propTypes = {
    item: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};