/**
 * Интерфейс к localstorage, alasql и pouchdb
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module  common
 * @submodule wsql
 */

//const _ls = require("node-localstorage").LocalStorage

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
class WSQL {

	constructor($p) {

		var user_params = {
			value: {}
		}

		Object.defineProperties(this, {

			// TODO: отказаться от localStorage
			_ls: {
				get: function () {

					if(typeof localStorage === "undefined"){

						return {
							setItem: function (name, value) {

							},
							getItem: function (name) {

							}
						};

						// локальное хранилище внутри node.js
						if(typeof WorkerGlobalScope === "undefined"){
							return new _ls('./localstorage');

						}else{
							return {
								setItem: function (name, value) {

								},
								getItem: function (name) {

								}
							};
						}

					} else
						return localStorage;
				}
			},

			/**
			 * ### Создаёт и заполняет умолчаниями таблицу параметров
			 *
			 * @method init_params
			 * @param settings {Function}
			 * @param meta {Function}
			 * @async
			 */
			init: {
				value: function (settings, meta) {

					$p.job_prm.init(settings);

					// префикс параметров LocalStorage
					// TODO: отразить в документации, что если префикс пустой, то параметры не инициализируются
					if (!$p.job_prm.local_storage_prefix && !$p.job_prm.create_tables)
						return;


					// значения базовых параметров по умолчанию
					var nesessery_params = [
						{p: "user_name", v: "", t: "string"},
						{p: "user_pwd", v: "", t: "string"},
						{p: "browser_uid", v: utils.generate_guid(), t: "string"},
						{
							p: "zone",
							v: $p.job_prm.hasOwnProperty("zone") ? $p.job_prm.zone : 1,
							t: $p.job_prm.zone_is_string ? "string" : "number"
						},
						{p: "enable_save_pwd", v: true, t: "boolean"},
						{p: "rest_path", v: "", t: "string"},
						{p: "couch_path", v: "", t: "string"}
					], zone;

					// подмешиваем к базовым параметрам настройки приложения
					if ($p.job_prm.additional_params)
						nesessery_params = nesessery_params.concat($p.job_prm.additional_params);

					// если зона не указана, устанавливаем "1"
					if (!this._ls.getItem($p.job_prm.local_storage_prefix + "zone"))
						zone = $p.job_prm.hasOwnProperty("zone") ? $p.job_prm.zone : 1;

					if (zone !== undefined)
						this.set_user_param("zone", zone);

					// дополняем хранилище недостающими параметрами
					nesessery_params.forEach((o) => {
						if (!this.prm_is_set(o.p))
							this.set_user_param(o.p, $p.job_prm.hasOwnProperty(o.p) ? $p.job_prm[o.p] : o.v);
					});

					// сообщяем движку pouch пути и префиксы
					if($p.adapters.pouch){
						const pouch_prm = {
							path: this.get_user_param("couch_path", "string") || $p.job_prm.couch_path || "",
							zone: this.get_user_param("zone", "number"),
							prefix: $p.job_prm.local_storage_prefix,
							suffix: this.get_user_param("couch_suffix", "string") || "",
							user_node: $p.job_prm.user_node,
							noreplicate: $p.job_prm.noreplicate
						};
						if (pouch_prm.path) {

							$p.adapters.pouch.init(pouch_prm)
						}
					}

					meta($p);

				}
			},

			/**
			 * ### Устанавливает параметр в user_params и localStorage
			 *
			 * @method set_user_param
			 * @param prm_name {string} - имя параметра
			 * @param prm_value {string|number|object|boolean} - значение
			 * @async
			 */
			set_user_param: {
				value: function(prm_name, prm_value){

					var str_prm = prm_value;
					if(typeof prm_value == "object")
						str_prm = JSON.stringify(prm_value);

					else if(prm_value === false)
						str_prm = "";

					this._ls.setItem($p.job_prm.local_storage_prefix+prm_name, str_prm);
					user_params[prm_name] = prm_value;
				}
			},

			/**
			 * ### Возвращает значение сохраненного параметра из localStorage
			 * Параметр извлекается с приведением типа
			 *
			 * @method get_user_param
			 * @param prm_name {String} - имя параметра
			 * @param [type] {String} - имя типа параметра. Если указано, выполняем приведение типов
			 * @return {*} - значение параметра
			 */
			get_user_param: {
				value: function(prm_name, type){

					if(!user_params.hasOwnProperty(prm_name) && this._ls)
						user_params[prm_name] = this.fetch_type(this._ls.getItem($p.job_prm.local_storage_prefix+prm_name), type);

					return user_params[prm_name];
				}
			},

			/**
			 * ### Проверяет, установлено ли свойство в
			 */
			prm_is_set: {
				value: function (prm_name) {
					return user_params.hasOwnProperty(prm_name) || (this._ls && this._ls.hasOwnProperty($p.job_prm.local_storage_prefix+prm_name))
				}
			},

			/**
			 * ### Указатель на aladb
			 * @property aladb
			 * @type alasql.Database
			 */
			aladb: {
				value: new alasql.Database('md')
			}


		});
	}

	/**
	 * ### Указатель на alasql
	 * @property alasql
	 * @type Function
	 */
	get alasql(){ return alasql	}

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
	 * ### Восстанавливает сохраненные параметры в объект _options_
	 * @method restore_options
	 * @param prefix {String} - имя области
	 * @param options {Object} - объект, в который будут записаны параметры
	 */
	restore_options(prefix, options){
		var options_saved = this.get_user_param(prefix + "_" + options.name, "object");
		for(var i in options_saved){
			if(typeof options_saved[i] != "object")
				options[i] = options_saved[i];
			else{
				if(!options[i])
					options[i] = {};
				for(var j in options_saved[i])
					options[i][j] = options_saved[i][j];
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
		}else if(type == "number")
			return utils.fix_number(prm, true);
		else if(type == "date")
			return utils.fix_date(prm, true);
		else if(type == "boolean")
			return utils.fix_boolean(prm);
		else
			return prm;
	}

}
