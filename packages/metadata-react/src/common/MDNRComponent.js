/**
 * Компонент
 * - содержит свойство _mounted
 * - знает, размещен ли он в основном дереве react или во всплывающем окне
 * - устанавливает title основного раздела интерфейса
 *
 * Created 11.01.2017
 */

import React from 'react';
import PropTypes from 'prop-types';
import MComponent from './MComponent';

export default class MDNRComponent extends MComponent {

  static contextTypes = {
    dnr: PropTypes.object
  };

  shouldComponentUpdate({_mgr, _meta, title, handleIfaceState}) {

    let res = true;

    const {props, ltitle, context} = this;

    // если изменился менеджер, ищем новые настройки компоновки
    if(props._mgr !== _mgr && this.handleManagerChange) {
      this.handleManagerChange({_mgr, _meta});
      res = false;
    }

    // если мы не в диалоге, меняем заголовок приложения
    if (!context.dnr && ltitle && title != ltitle && !props.ignoreTitle) {
      handleIfaceState({
        component: '',
        name: 'title',
        value: ltitle,
      });
      res = false;
    }

    return res;
  }

  get sizes() {
    let {context: {dnr}, props: {width, height}, state: {columns}} = this;

    if(!height) {
      height = dnr && parseInt(dnr.frameRect.height) - 26;
    }
    if(!height || height < 320) {
      height = 320;
    }
    if(!width) {
      width = dnr && parseInt(dnr.frameRect.width);
    }
    if(!width || width < 480) {
      width = 480;
    }

    // горизонтальная прокрутка
    const w2 = columns && columns.reduce((sum, val) => sum + val._width, 0);
    if(w2 > width) {
      width = w2;
    }

    return {width, height};
  }
}
