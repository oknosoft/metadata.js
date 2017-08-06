/**
 * ### Действия и типы действий в терминах redux
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 * @module actions.js
 *
 * Created 05.09.2016
 */

import * as auth from './actions_auth';
import * as obj from './actions_obj';
import * as pouch from './actions_pouch';
import * as base from './actions_base';


export default {

  [base.META_LOADED]: base.meta_loaded,
  [base.PRM_CHANGE]: base.prm_change,

  [auth.TRY_LOG_IN]: auth.try_log_in,
  [auth.LOG_IN]: auth.log_in,
  [auth.DEFINED]: auth.defined,
  [auth.LOG_OUT]: auth.log_out,
  [auth.LOG_ERROR]: auth.log_error,

  [pouch.DATA_LOADED]: pouch.data_loaded,
  [pouch.DATA_PAGE]: pouch.data_page,
  [pouch.DATA_ERROR]: pouch.data_error,
  [pouch.LOAD_START]: pouch.load_start,
  [pouch.NO_DATA]: pouch.no_data,
  [pouch.SYNC_DATA]: pouch.sync_data,

  [obj.ADD]: obj.add,
  [obj.ADD_ROW]: obj.add_row,
  [obj.DEL_ROW]: obj.del_row,
  [obj.EDIT]: obj.edit,
  [obj.REVERT]: obj.revert,
  [obj.SAVE]: obj.save,
  [obj.CHANGE]: obj.change,
  [obj.VALUE_CHANGE]: obj.value_change,
  obj_post: obj.post,
  obj_unpost: obj.unpost,
  obj_mark_deleted: obj.mark_deleted,
  obj_unmark_deleted: obj.unmark_deleted,

};

