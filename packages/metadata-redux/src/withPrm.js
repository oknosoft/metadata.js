import { connect } from 'react-redux';
import {prm_change} from './actions_base';

const mapStateToProps = () => {
  const {wsql} = $p;
  const res = {};
  for(const name of ['zone', 'couch_path', 'couch_suffix', ['couch_direct', 'boolean'], ['enable_save_pwd', 'boolean'], 'user_name', 'user_pwd']){
    if(Array.isArray(name)){
      res[name[0]] = wsql.get_user_param(name[0], name[1]);
    }
    else{
      res[name] = wsql.get_user_param(name);
    }
  }
  return res;
};

const mapDispatchToProps = (dispatch) => {
	return {
    handleSetPrm(name, value) {
      dispatch(prm_change(name, value));
    },
	};
};


export default connect(mapStateToProps, mapDispatchToProps);
