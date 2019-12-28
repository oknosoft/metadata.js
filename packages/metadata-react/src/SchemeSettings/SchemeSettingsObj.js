import React from 'react';
import DataObj from '../FrmObj/DataObj';
import withStyles from '../styles/paper600';
import {withIface} from 'metadata-redux';
import SchemeSettingsTabs from './SchemeSettingsTabs';
import LoadingMessage from '../DumbLoader/LoadingMessage';

const stub = () => null;

class SchemeSettingsObj extends DataObj {
  render() {
    const {_obj} = this.state;
    return _obj ? <SchemeSettingsTabs
      scheme={_obj}
      handleSchemeChange={stub}
      height={this.props.height - 52}
    />
    :
      <LoadingMessage/>;
  }
}
export default withStyles(withIface(SchemeSettingsObj));
