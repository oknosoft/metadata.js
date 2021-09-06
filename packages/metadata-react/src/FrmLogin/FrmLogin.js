import React, {Component} from 'react';

import TabsLogin from './TabsLogin';
import TabsUser from './TabsUser';
import {compose} from 'redux';
import {withMeta, withIface} from 'metadata-redux';

export function FrmLogin({ classes, ...other}) {
  return (other.user.logged_in && other._obj) ?
    < TabsUser {...other} />
    :
    < TabsLogin {...other} />;
};

export default compose(withIface, withMeta)(FrmLogin);
