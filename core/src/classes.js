import * as mngrs from './mngrs.js';
import * as objs from './objs.js';
import * as tabulars from './tabulars.js';
import Meta from './meta/index.js';
import MetaEventEmitter from './meta/emitter.js';

const classes = {Meta, MetaEventEmitter, ...mngrs, ...objs, ...tabulars};
export default classes;
