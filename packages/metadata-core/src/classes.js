import * as data_managers from './mngrs';
import * as data_objs from './objs';
import * as data_tabulars from './tabulars';
import Meta from './meta';
import MetaEventEmitter from './emitter';
import AbstracrAdapter from './abstract_adapter';

const classes = Object.assign({Meta, MetaEventEmitter, AbstracrAdapter}, data_managers, data_objs, data_tabulars);
export default classes;