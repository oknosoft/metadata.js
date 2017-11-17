import {connect} from 'react-redux';

function mapDispatchToProps(dispatch) {
  return {
    handleSocialAuth: (provider) => {
      const fn = $p.superlogin._actions.handleSocialAuth(provider);
      return () => fn(dispatch);
    },
    dispatch
  };
}

export default connect(null, mapDispatchToProps);
