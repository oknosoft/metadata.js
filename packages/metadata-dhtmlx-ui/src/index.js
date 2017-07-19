import InterfaceObjs from './iface'
import widgets from './dhtmlx-widgets'
import events from './events'
import mango_selection from './mango_selection'
import geocoding from './geocoding'
import ajax from './ajax'
import docxtemplater from './docxtemplater'
import jobprm from './jobprm'
import oo from './object_proto'


export default {

	/**
	 * ### Модификатор прототипов
	 * @param constructor {MetaEngine}
	 * @param classes {Object}
	 */
	proto(constructor) {

		// задаём основной скин
		dhtmlx.skin = 'dhx_terrace';

		constructor.classes.InterfaceObjs = InterfaceObjs;

		/**
		 * Загружает скрипты и стили синхронно и асинхронно
		 * @method load_script
		 * @for MetaEngine
		 * @param src {String} - url ресурса
		 * @param type {String} - "link" или "script"
		 * @param [callback] {Function} - функция обратного вызова после загрузки скрипта
		 * @async
		 */
		constructor.prototype.load_script = function (src, type, callback) {

			return new Promise(function(resolve, reject){

				var s = document.createElement(type);
				if (type == "script") {
					s.type = "text/javascript";
					s.src = src;
					s.async = true;
					s.addEventListener('load', callback ? function () {
						callback();
						resolve();
					} : resolve, false);

				} else {
					s.type = "text/css";
					s.rel = "stylesheet";
					s.href = src;
				}
				document.head.appendChild(s);

				if(type != "script")
					resolve()

			});
		};

		mango_selection(constructor);

		geocoding(constructor);
	},

	/**
	 * ### Модификатор конструктора MetaEngine
	 * Вызывается в контексте экземпляра MetaEngine
	 */
	constructor(){

		this.__define({
			/**
			 * Объекты интерфейса пользователя
			 * @property iface
			 * @for MetaEngine
			 * @type InterfaceObjs
			 * @static
			 */
			iface: {
				value: new InterfaceObjs(this)
			},
			/**
			 * Хранилище внедрённых строк
			 */
			injected_data: {
				value: {}
			},
		});

		this.md.value_mgr = this.classes.DataManager.prototype.value_mgr.bind(this.cat.meta_fields);

		docxtemplater(this);
		widgets(this);
		events(this);
		ajax(this);
		jobprm(this);

	}
}