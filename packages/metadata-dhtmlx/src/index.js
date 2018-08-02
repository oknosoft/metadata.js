import InterfaceObjs from './iface';
import widgets from './dhtmlx-widgets';
import events from './events';
import mango_selection from './mango_selection';
import ajax from './ajax';
import jobprm from './jobprm';
import oo from './object_proto';

export default {

  /**
   * ### Модификатор прототипов
   * @param constructor {MetaEngine}
   * @param classes {Object}
   */
  proto(constructor) {

    // задаём основной скин и его суффикс
    dhtmlx.skin = 'dhx_terrace';
    dhtmlx.skin_suffix = () => dhtmlx.skin.replace('dhx', '') + '/';

    constructor.classes.InterfaceObjs = InterfaceObjs;

    mango_selection(constructor);

  },

  /**
   * ### Модификатор конструктора MetaEngine
   * Вызывается в контексте экземпляра MetaEngine
   */
  constructor() {

    this.__define({
      /**
       * Объекты интерфейса пользователя
       * @property iface
       * @for MetaEngine
       * @type InterfaceObjs
       * @static
       */
      iface: {
        value: new InterfaceObjs(this),
      },
      /**
       * Хранилище внедрённых строк
       */
      injected_data: {
        value: {},
      },
      load_script: {
        value: this.utils.load_script,
      }
    });

    this.md.value_mgr = this.classes.DataManager.prototype.value_mgr.bind(this.cat.meta_fields);

    widgets(this);
    events(this);
    ajax(this);
    jobprm(this);

  },
};
