import * as mngrs from './mngrs';
import * as objs from './objs';
import * as tabulars from './tabulars';
import Meta from './meta';
import MetaEventEmitter from './meta/emitter';

const classes = {Meta, MetaEventEmitter, ...mngrs, ...objs, ...tabulars};
export default classes;
