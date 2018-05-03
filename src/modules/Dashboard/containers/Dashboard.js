import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Dashboard from '../components/Dashboard';
import * as actions from 'actions';
import {withRouter} from 'react-router-dom';

const mapStateToProps = (state) => {
    return {
        ...state.get('accountReducer'),
        ...state.get('academicStatsReducer'),
        ...state.get('appReducer'),
        ...state.get('publicationsReducer'),
        showLatestPublicationsTab: state.get('myLatestPublicationsReducer').showLatestPublicationsTab,
        showTrendingPublicationsTab: state.get('myTrendingPublicationsReducer').showTrendingPublicationsTab,
        possiblyYourPublicationsCount: state.get('claimPublicationReducer').possibleCounts,
        possiblyYourPublicationsCountLoading: state.get('claimPublicationReducer').loadingPossibleCounts,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

let DashboardContainer = connect(mapStateToProps, mapDispatchToProps)(Dashboard);
DashboardContainer = withRouter(DashboardContainer);

export default DashboardContainer;
