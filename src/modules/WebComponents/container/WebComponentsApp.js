import { connect } from 'react-redux';
import WebComponentsApp from '../components/WebComponentsApp';
import { bindActionCreators } from 'redux';
import * as actions from 'actions';

const mapStateToProps = state => ({
    ...state.get('accountReducer'),
    ...state.get('chatReducer'),
});

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
};

const WebComponentsAppContainer = connect(mapStateToProps, mapDispatchToProps)(WebComponentsApp);
export default WebComponentsAppContainer;
