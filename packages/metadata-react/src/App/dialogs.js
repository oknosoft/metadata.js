/**
 * Методы для вызова диалогов react в процедурном стиле
 *
 * @module dialogs
 *
 * Created by Evgeniy Malyarov on 16.11.2018.
 */

import React from 'react';
import TextField from '@material-ui/core/TextField';
import InputRadio from './InputRadio';

export default {

  /**
   * ### Инициализирует UI
   * Сюда передаём метод управления состоянием
   * @param handleIfaceState
   */
  init ({handleIfaceState, DataList, lazy}) {
    this._handleIfaceState = handleIfaceState;
    if(DataList) {
      this.DataList = DataList;
    }
    else if(lazy) {
      this.lazy = lazy;
    }
  },

  close_confirm(name = 'confirm') {
    this._handleIfaceState({
      component: '',
      name,
      value: {open: false}
    });
    this._confirm = false;
  },

  /**
   * ### Диалог ввода значения
   * @param title
   * @param text
   * @param timeout
   * @param type
   * @param list
   * @param initialValue
   * @return {Promise}
   */
  input_value({
                title = 'Ввод значения',
                text,
                timeout = 60000,
                type,
                list,
                initialValue
  }) {

    if(!this._handleIfaceState) {
      return Promise.reject('init');
    }
    if(this._confirm) {
      return Promise.reject('already open');
    }
    if(!type && !list) {
      return Promise.reject('type or list must be defined');
    }
    if(list && list.some((v) => {
      const key = v.value || v.ref || v;
      return !key || typeof key !== 'string';
    })) {
      return Promise.reject('list keys must be defined and has a string type');
    }

    return new Promise((resolve, reject) => {

      const close_confirm = () => {
        this.close_confirm();
        if(timer) {
          clearTimeout(timer);
          timer = 0;
        }
        resolve(value);
      };

      const reject_confirm = () => {
        this.close_confirm();
        if(timer) {
          clearTimeout(timer);
          timer = 0;
        }
        reject();
      };

      const handleChange = (v) => value = v;

      let timer = setTimeout(reject_confirm, timeout);
      let value;
      const iface_state = {
        component: '',
        name: 'confirm',
        value: {
          open: true,
          title,
          text,
          children: [],
          handleOk: close_confirm,
          handleCancel: reject_confirm,
        }
      }

      if(list) {
        if(!initialValue) {
          initialValue = list[0].value || list[0].ref || list[0];
        }
        value = initialValue.value || initialValue.ref || initialValue;
        iface_state.value.children = <InputRadio
          value={value}
          list={list}
          handleChange={handleChange}
        />;
      }
      else if(type.includes('.')) {
        value = initialValue ? (initialValue.ref || initialValue) : '';
        const _mgr = $p.md.mgr_by_class_name(type);
        if(_mgr) {
          let {DataList, lazy} = this;
          if(!DataList && lazy){
            DataList = lazy.DataList;
          }
          if(DataList) {
            iface_state.value.children = <DataList
              _mgr={_mgr}
              _acl="r"
              _ref={value}
              handlers={{
                handleSelect: (v) => {
                  _mgr.get(v, 'promise')
                    .then((v) => {
                      handleChange(v);
                      close_confirm();
                    });
                },
              }}
              selectionMode
              denyAddDel
            />;
            iface_state.value.noSpace = true;
            iface_state.value.hide_actions = true;
          }
          else {
            iface_state.value.children = `Компонент DataList не подключен к $p.ui`;
          }
        }
        else {
          iface_state.value.children = `Не найден менеджер для типа '${type}'`;
        }
      }
      else {
        value = initialValue.value || initialValue;
        iface_state.value.children = <TextField
          value={value}
          onChange={handleChange}
          InputProps={{type}}
        />;
      }

      this._handleIfaceState(iface_state);

    });
  },

  /**
   * Диалог Ок, Отмена
   * @param title
   * @param text
   * @param timeout
   * @return {Promise}
   */
  confirm({title = 'Внимание', text, html, initFullScreen, timeout = 60000}) {
    if(!this._handleIfaceState) {
      return Promise.reject('init');
    }
    if(this._confirm) {
      return Promise.reject('already open');
    }

    return new Promise((resolve, reject) => {

      const close_confirm = () => {
        this.close_confirm();
        if(timer) {
          clearTimeout(timer);
          timer = 0;
        }
        resolve();
      };

      const reject_confirm = () => {
        this.close_confirm();
        if(timer) {
          clearTimeout(timer);
          timer = 0;
        }
        reject();
      };

      let timer = setTimeout(reject_confirm, timeout);

      this._handleIfaceState({
        component: '',
        name: 'confirm',
        value: {open: true, title, text, html, initFullScreen, handleOk: close_confirm, handleCancel: reject_confirm}
      });

    });
  },

  /**
   * Диалог alert
   * @param title
   * @param text
   * @param timeout
   * @return {Promise}
   */
  alert({title = 'Внимание', text, html, initFullScreen, timeout = 60000}) {
    if(!this._handleIfaceState) {
      return Promise.reject('init');
    }
    if(this._confirm) {
      return Promise.reject('already open');
    }

    return new Promise((resolve, reject) => {

      const close_confirm = () => {
        this.close_confirm('alert');
        if(timer) {
          clearTimeout(timer);
          timer = 0;
        }
        resolve();
      };

      let timer = setTimeout(close_confirm, timeout);

      this._handleIfaceState({
        component: '',
        name: 'alert',
        value: {open: true, title, text, html, initFullScreen, handleOk: close_confirm}
      });

    });
  },

};
