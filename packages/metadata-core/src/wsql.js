/**
 * Интерфейс к localstorage, alasql и pouchdb
 *
 * @module  metadata
 * @submodule wsql
 */

import utils from './utils';

//import alasql from 'alasql/dist/alasql.min';
const alasql = (typeof window != 'undefined' && window.alasql) || require('alasql/dist/alasql.min');
if(typeof window != 'undefined' && !window.alasql){
  window.alasql = alasql;
}

const fake_ls = {
	setItem(name, value) {},
	getItem(name) {}
}

/**
 * ### Интерфейс к localstorage, alasql и pouchdb
 * - Обеспечивает взаимодействие с локальными и серверными данными
 * - Обслуживает локальные параметры пользователя
 *
 * @class WSQL
 * @static
 * @menuorder 33
 * @tooltip Данные localstorage
 */
export default class WSQL {

	constructor($p) {
		this.$p = $p;
		this._params = {};

		/**
		 * ### Указатель на aladb
		 * @property aladb
		 * @type alasql.Database
		 */
		this.aladb = new alasql.Database('md');

		/**
		 * ### Указатель на alasql
		 * @property alasql
		 * @type Function
		 */
		this.alasql = alasql;

	}


	/**
	 * ### Поправка времени javascript
	 * @property js_time_diff
	 * @type Number
	 */
	get js_time_diff(){ return -(new Date("0001-01-01")).valueOf()}

	/**
	 * ### Поправка времени javascript с учетом пользовательского сдвига из константы _time_diff_
	 * @property time_diff
	 * @type Number
	 */
	get time_diff(){
		var diff = this.get_user_param("time_diff", "number");
		return (!diff || isNaN(diff) || diff < 62135571600000 || diff > 62135622000000) ? this.js_time_diff : diff;
	}

	/**
	 * Обёрнутый localStorage
	 * @return {*}
	 * @private
	 */
	get _ls() {
		return typeof localStorage === "undefined" ? fake_ls : localStorage;
	}

	/**
	 * ### Создаёт и заполняет умолчаниями таблицу параметров
	 *
	 * @method init_params
	 * @param settings {Function}
	 * @param meta {Function}
	 * @async
	 */
	init(settings, meta) {

		alasql.utils.isBrowserify = false;

		const {job_prm, adapters} = this.$p;

		job_prm.init(settings);

		// префикс параметров LocalStorage
		if (!job_prm.local_storage_prefix){
      throw new Error('local_storage_prefix unset in job_prm settings');
    }

		// значения базовых параметров по умолчанию
    const nesessery_params = [
      {p: 'user_name', v: '', t: 'string'},
      {p: 'user_pwd', v: '', t: 'string'},
      {p: 'browser_uid', v: utils.generate_guid(), t: 'string'},
      {p: 'zone', v: job_prm.hasOwnProperty('zone') ? job_prm.zone : 1, t: job_prm.zone_is_string ? 'string' : 'number'},
      {p: 'rest_path', v: '', t: 'string'},
      {p: 'couch_path', v: '', t: 'string'},
      {p: 'couch_direct', v: true, t: 'boolean'},
      {p: 'enable_save_pwd', v: true, t: 'boolean'},
    ];

		// подмешиваем к базовым параметрам настройки приложения
		Array.isArray(job_prm.additional_params) && job_prm.additional_params.forEach((v) => nesessery_params.push(v));

		// если зона не указана, устанавливаем "1"
    let zone;
		if (!this._ls.getItem(job_prm.local_storage_prefix + "zone")){
      zone = job_prm.hasOwnProperty("zone") ? job_prm.zone : 1;
    }
		if (zone !== undefined){
      this.set_user_param("zone", zone);
    }

    // для гостевой зоны, couch_direct по умолчанию сброшен
    if(zone == job_prm.zone_demo){
      nesessery_params.some((prm) => {
        if(prm.p == 'couch_direct'){
          prm.v = false;
          return true;
        }
      })
    }

		// дополняем хранилище недостающими параметрами
		nesessery_params.forEach((prm) => {
		  if(job_prm.url_prm && job_prm.url_prm.hasOwnProperty(prm.p)) {
        this.set_user_param(prm.p, this.fetch_type(job_prm.url_prm[prm.p], prm.t));
      }
			else if (!this.prm_is_set(prm.p)){
        this.set_user_param(prm.p, this.fetch_type(job_prm.hasOwnProperty(prm.p) ? job_prm[prm.p] : prm.v, prm.t));
      }
		});

		// инициализируем метаданные
    if(meta) {
      meta(this.$p);
      // сообщяем адаптерам пути и префиксы
      for(let i in adapters){
        adapters[i].init(this, job_prm);
      }
    }

	};

	/**
	 * ### Сохраняет настройки формы или иные параметры объекта _options_
	 * @method save_options
	 * @param prefix {String} - имя области
	 * @param options {Object} - сохраняемые параметры
	 * @return {Promise}
	 * @async
	 */
	save_options(prefix, options){
		return this.set_user_param(prefix + "_" + options.name, options);
	}

	/**
	 * ### Устанавливает параметр в user_params и localStorage
	 *
	 * @method set_user_param
	 * @param prm_name {string} - имя параметра
	 * @param prm_value {string|number|object|boolean} - значение
	 * @async
	 */
	set_user_param(prm_name, prm_value){

		const {$p, _params, _ls} = this;

		if(typeof prm_value == "object"){
			_params[prm_name] = prm_value;
			prm_value = JSON.stringify(prm_value);
		}
		else if(prm_value === false || prm_value === "false"){
			this._params[prm_name] = false;
			prm_value = "";
		}
		else{
			_params[prm_name] = prm_value;
		}

		_ls.setItem($p.job_prm.local_storage_prefix+prm_name, prm_value);
	}

	/**
	 * ### Возвращает значение сохраненного параметра из localStorage
	 * Параметр извлекается с приведением типа
	 *
	 * @method get_user_param
	 * @param prm_name {String} - имя параметра
	 * @param [type] {String} - имя типа параметра. Если указано, выполняем приведение типов
	 * @return {*} - значение параметра
	 */
	get_user_param(prm_name, type){
		const {$p, _params, _ls} = this;
		if(!_params.hasOwnProperty(prm_name) && _ls){
			_params[prm_name] = this.fetch_type(_ls.getItem($p.job_prm.local_storage_prefix+prm_name), type);
		}
		return this._params[prm_name];
	}

	/**
	 * ### Проверяет, установлено ли свойство в
	 */
	prm_is_set(prm_name) {
		const {$p, _params, _ls} = this;
		return _params.hasOwnProperty(prm_name) || (_ls && _ls.hasOwnProperty($p.job_prm.local_storage_prefix+prm_name))
	}

	/**
	 * ### Восстанавливает сохраненные параметры в объект _options_
	 * @method restore_options
	 * @param prefix {String} - имя области
	 * @param options {Object} - объект, в который будут записаны параметры
	 */
	restore_options(prefix, options){
		const options_saved = this.get_user_param(prefix + "_" + options.name, "object");
		for(let i in options_saved){
			if(typeof options_saved[i] != "object"){
				options[i] = options_saved[i];
			}
			else{
				if(!options[i]){
					options[i] = {};
				}
				for(let j in options_saved[i]){
					options[i][j] = options_saved[i][j];
				}
			}
		}
		return options;
	}

	/**
	 * ### Приведение типов при операциях с `localStorage`
	 * @method fetch_type
	 * @param prm
	 * @param type
	 * @returns {*}
	 */
	fetch_type(prm, type){
		if(type == "object"){
			try{
				prm = JSON.parse(prm);
			}catch(e){
				prm = {};
			}
			return prm;
		}
		else if(type == "number"){
			return utils.fix_number(prm, true);
		}
		else if(type == "date"){
			return utils.fix_date(prm, true);
		}
		else if(type == "boolean"){
			return utils.fix_boolean(prm);
		}
    else if(type == "string"){
      return prm ? prm.toString() : '';
    }
		return prm;
	}

}
