/**
 * ### Действия и типы действий объектов данных в терминах redux
 *
 * Created 05.09.2016
 */

export const ADD = 'OBJ_ADD';             // Команда создать объект
export const ADD_ROW = 'OBJ_ADD_ROW';         // Команда добавить строку в табчасть объекта
export const DEL_ROW = 'OBJ_DEL_ROW';         // Команда удалить строку табчасти объекта
export const EDIT = 'OBJ_EDIT';            // Команда открыть форму редактирования объекта
export const REVERT = 'OBJ_REVERT';          // Команда вернуть объект в состояние до редактирования (перечитать из базы данных)
export const SAVE = 'OBJ_SAVE';            // Команда записать изменённый объект (пометка удаления, проведение и отмена проведения - это так же, запись)
export const CHANGE = 'OBJ_CHANGE';          // Записан изменённый объект (по команде интерфейса или в результате репликации)
export const VALUE_CHANGE = 'OBJ_VALUE_CHANGE';    // Изменён реквизит шапки или строки табчасти

export function add(_mgr) {
  const _obj = _mgr.create();
  return {
    type: ADD,
    payload: {class_name: _mgr.class_name, ref: _obj.ref}
  };
}

export function add_row(class_name, ref, tabular, proto) {
  return {
    type: ADD_ROW,
    payload: {
      class_name: class_name,
      ref: ref,
      tabular: tabular,
      proto: proto
    }
  };
}

/**
 * ### Удаляет строку, не оставляет следов в истории
 * @param class_name
 * @param ref
 * @param tabular
 * @param index
 * @return {function(): Promise.<T>}
 */
export function del_row(class_name, ref, tabular, index) {
  // удаляем строку

  // возвращаем thunk
  return () => Promise.resolve();
}

/**
 * ### Генерирует событие маршрутизации на форму объекта
 * @param class_name
 * @param ref
 * @param frm
 * @return {{type: string, payload: {class_name: *, ref: *, frm: *}}}
 */
export function edit(class_name, ref, frm) {
  return {
    type: EDIT,
    payload: {
      class_name: class_name,
      ref: ref,
      frm: frm
    }
  };
}

export function revert(class_name, ref) {
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        dispatch(dispatch({
          type: REVERT,
          payload: {
            class_name: class_name,
            ref: ref
          }
        }));
        resolve();
      }, 200);
    });
  };
}

export function save(class_name, ref, post, mark_deleted) {
  return (dispatch, getState) => {
    let _obj;
    if(typeof class_name == 'object') {
      _obj = class_name;
      class_name = _obj._manager.class_name;
      ref = _obj.ref;

      if(mark_deleted) {
        _obj._obj._deleted = true;
      }

      _obj.save(post)
        .then(
          () => {
            dispatch({
              type: SAVE,
              payload: {
                class_name: class_name,
                ref: ref,
                post: post,
                mark_deleted: mark_deleted
              }
            });
          }
        );
    }
  };
}

export function post(class_name, ref) {
  return save(class_name, ref, true);
}

export function unpost(class_name, ref) {
  return save(class_name, ref, false);
}

export function mark_deleted(class_name, ref) {
  return save(class_name, ref, undefined, true);
}

export function unmark_deleted(class_name, ref) {
  return save(class_name, ref, undefined, false);
}

export function change(class_name, ref) {
  return {
    type: CHANGE,
    payload: {
      class_name: class_name,
      ref: ref
    }
  };
}

export function value_change(class_name, ref) {
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        dispatch(dispatch({
          type: VALUE_CHANGE,
          payload: {
            class_name: class_name,
            ref: ref
          }
        }));
        resolve();
      }, 200);
    });
  };
}
