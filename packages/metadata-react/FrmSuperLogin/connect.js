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

function mapStateToProps(/*{meta}*/) {
  if($p.superlogin.authenticated()) {
    let {current_user} = $p;
    if(!current_user) {
      const {user_id} = $p.superlogin.getSession();
      current_user = $p.cat.users.create({
        ref: $p.utils.generate_guid(),
        id: user_id,
        name: user_id,
      }, false, true);
    }
    return {
      _obj: current_user,
      _mgr: $p.cat.users,
      _acl: 'r',
    };
  }
  else {
    return {};
  }
};

export default connect(mapStateToProps, mapDispatchToProps);
