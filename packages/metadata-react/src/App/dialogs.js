/**
 * Методы для вызова диалогов react в процедурном стиле
 *
 * @module dialogs
 *
 * Created by Evgeniy Malyarov on 16.11.2018.
 */

import React from 'react';
import InputRadio from './InputRadio';

export default {

  /**
   * ### Инициализирует UI
   * Сюда передаём метод управления состоянием
   * @param handleIfaceState
   */
  init ({handleIfaceState}) {
    this._handleIfaceState = handleIfaceState;
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

      let timer = setTimeout(reject_confirm, timeout);
      let value;
      let children;

      if(list) {
        if(!initialValue) {
          initialValue = list[0].value || list[0].ref || list[0];
        }
        value = initialValue.value || initialValue.ref || initialValue;
        children = <InputRadio
          value={value}
          list={list}
          handleChange={(v) => value = v}
        />;
      }

      this._handleIfaceState({
        component: '',
        name: 'confirm',
        value: {
          open: true,
          title,
          text,
          children,
          handleOk: close_confirm,
          handleCancel: reject_confirm,
        }
      });

    });
  },

  /**
   * Диалог Ок, Отмена
   * @param title
   * @param text
   * @param timeout
   * @return {Promise}
   */
  confirm({
            title = 'Внимание',
            text,
            timeout = 60000,
          }) {
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
        value: {
          open: true,
          title,
          text,
          handleOk: close_confirm,
          handleCancel: reject_confirm,
        }
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
  alert({
            title = 'Внимание',
            text,
            timeout = 60000,
          }) {
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
        value: {
          open: true,
          title,
          text,
          handleOk: close_confirm,
        }
      });

    });
  },

};
