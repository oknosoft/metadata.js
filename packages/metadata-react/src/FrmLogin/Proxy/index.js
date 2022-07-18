import FrmProxyLogin from './Auth';
import Login from './FrmLogin';
import {withMeta} from 'metadata-redux';
const FrmLogin = withMeta(Login);

export default FrmProxyLogin;
export {FrmLogin};
