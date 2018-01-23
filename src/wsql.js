/**
 * Интерфейс к localstorage, alasql и pouchdb
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module  common
 * @submodule wsql
 */


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
function WSQL(){

	var wsql = this,
		ls,
		user_params = {};

	this.__define({

		/**
		 * ### Поправка времени javascript
		 * @property js_time_diff
		 * @type Number
		 */
		js_time_diff: {
			value: -(new Date("0001-01-01")).valueOf()
		},

		/**
		 * ### Поправка времени javascript с учетом пользовательского сдвига из константы _time_diff_
		 * @property time_diff
		 * @type Number
		 */
		time_diff: {
			get: function () {
				var diff = this.get_user_param("time_diff", "number");
				return (!diff || isNaN(diff) || diff < 62135571600000 || diff > 62135622000000) ? this.js_time_diff : diff;
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

				if(typeof prm_value == "object"){
					user_params[prm_name] = prm_value;
					prm_value = JSON.stringify(prm_value);
				}
				else if(prm_value === false || prm_value === "false"){
					user_params[prm_name] = false;
					prm_value = "";
				}
				else{
					user_params[prm_name] = prm_value;
				}

				ls.setItem($p.job_prm.local_storage_prefix+prm_name, prm_value);

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

				if(!user_params.hasOwnProperty(prm_name) && ls){
					user_params[prm_name] = this.fetch_type(ls.getItem($p.job_prm.local_storage_prefix+prm_name), type);
				}

				return user_params[prm_name];
			}
		},

		/**
		 * ### Сохраняет настройки формы или иные параметры объекта _options_
		 * @method save_options
		 * @param prefix {String} - имя области
		 * @param options {Object} - сохраняемые параметры
		 * @return {Promise}
		 * @async
		 */
		save_options: {
			value: function(prefix, options){
				return wsql.set_user_param(prefix + "_" + options.name, options);
			}
		},

		/**
		 * ### Восстанавливает сохраненные параметры в объект _options_
		 * @method restore_options
		 * @param prefix {String} - имя области
		 * @param options {Object} - объект, в который будут записаны параметры
		 */
		restore_options: {
			value: function(prefix, options){
				var options_saved = wsql.get_user_param(prefix + "_" + options.name, "object");
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
		},

		/**
		 * ### Приведение типов при операциях с `localStorage`
		 * @method fetch_type
		 * @param prm
		 * @param type
		 * @returns {*}
		 */
		fetch_type: {
			value: 	function(prm, type){
				if(type == "object"){
					try{
						prm = JSON.parse(prm);
					}catch(e){
						prm = {};
					}
					return prm;
				}else if(type == "number")
					return $p.utils.fix_number(prm, true);
				else if(type == "date")
					return $p.utils.fix_date(prm, true);
				else if(type == "boolean")
					return $p.utils.fix_boolean(prm);
				else
					return prm;
			}
		},

		/**
		 * ### Указатель на alasql
		 * @property alasql
		 * @type Function
		 */
		alasql: {
			value: typeof alasql != "undefined" ? alasql : require("alasql")
		},

		/**
		 * ### Создаёт и заполняет умолчаниями таблицу параметров
		 *
		 * @method init_params
		 * @return {Promise}
		 * @async
		 */
		init_params: {

			value: function(){

				// префикс параметров LocalStorage
				// TODO: отразить в документации, что если префикс пустой, то параметры не инициализируются
				if(!$p.job_prm.local_storage_prefix && !$p.job_prm.create_tables)
					return Promise.resolve();

				if(typeof localStorage === "undefined"){

					// локальное хранилище внутри node.js
					// if(typeof WorkerGlobalScope === "undefined"){
					// 	ls = new require('node-localstorage').LocalStorage('./localstorage');
					// }
          ls = {
            setItem: function (name, value) {
            },
            getItem: function (name) {
            }
          };
				}
				else{
          ls = localStorage;
        }

				// значения базовых параметров по умолчанию
				var nesessery_params = [
					{p: "user_name",      v: "", t:"string"},
					{p: "user_pwd",       v: "", t:"string"},
					{p: "browser_uid",		v: $p.utils.generate_guid(), t:"string"},
					{p: "zone",           v: $p.job_prm.hasOwnProperty("zone") ? $p.job_prm.zone : 1, t: $p.job_prm.zone_is_string ? "string" : "number"},
					{p: "enable_save_pwd",v: $p.job_prm.enable_save_pwd,	t:"boolean"},
          {p: "couch_direct",   v: $p.job_prm.hasOwnProperty("couch_direct") ? $p.job_prm.couch_direct : true,	t:"boolean"},
					{p: "couch_path",		  v: $p.job_prm.couch_path,	t:"string"},
          {p: "rest_path",		  v: "", t:"string"},
					{p: "skin",		        v: "dhx_web", t:"string"},
				],	zone;

				// подмешиваем к базовым параметрам настройки приложения
				if($p.job_prm.additional_params)
					nesessery_params = nesessery_params.concat($p.job_prm.additional_params);

				// если зона не указана, устанавливаем "1"
				if(!ls.getItem($p.job_prm.local_storage_prefix+"zone"))
					zone = $p.job_prm.hasOwnProperty("zone") ? $p.job_prm.zone : 1;
				// если зона указана в url, используем её
				if($p.job_prm.url_prm.hasOwnProperty("zone"))
					zone = $p.job_prm.zone_is_string ? $p.job_prm.url_prm.zone : $p.utils.fix_number($p.job_prm.url_prm.zone, true);
				if(zone !== undefined)
					wsql.set_user_param("zone", zone);

				// дополняем хранилище недостающими параметрами
				nesessery_params.forEach(function(o){
					if((o.t == "boolean" ? wsql.get_user_param(o.p) : wsql.get_user_param(o.p, o.t)) == undefined ||
						(!wsql.get_user_param(o.p, o.t) && (o.p.indexOf("url") != -1)))
						wsql.set_user_param(o.p, $p.job_prm.hasOwnProperty(o.p) ? $p.job_prm[o.p] : o.v);
				});

				// сообщяем движку pouch пути и префиксы
				var pouch_prm = {
					path: wsql.get_user_param("couch_path", "string") || $p.job_prm.couch_path || "",
					zone: wsql.get_user_param("zone", "number"),
					prefix: $p.job_prm.local_storage_prefix,
					direct: wsql.get_user_param("couch_direct", "boolean"),
					user_node: $p.job_prm.user_node,
					noreplicate: $p.job_prm.noreplicate
				};
				if(pouch_prm.path){

					/**
					 * ### Указатель на локальные и сетевые базы PouchDB
					 * @property pouch
					 * @for WSQL
					 * @type Pouch
					 */
					wsql.__define("pouch", { value: new Pouch()	});
					wsql.pouch.init(pouch_prm);
				}

				// создаём таблицы alasql
				if(this.create_tables){
					this.alasq(this.create_tables, []);
					this.create_tables = "";
				}


			}
		},

		/**
		 * ### Удаляет таблицы WSQL
		 * Например, для последующего пересоздания при изменении структуры данных
		 * @method drop_tables
		 * @param callback {Function}
		 * @async
		 */
		drop_tables: {
			value: function(callback){
				var cstep = 0, tmames = [];

				function ccallback(){
					cstep--;
					if(cstep<=0)
						setTimeout(callback, 10);
					else
						iteration();
				}

				function iteration(){
					var tname = tmames[cstep-1]["tableid"];
					if(tname.substr(0, 1) == "_")
						ccallback();
					else
						wsql.alasql("drop table IF EXISTS " + tname, [], ccallback);
				}

				function tmames_finded(data){
					tmames = data;
					if(cstep = data.length)
						iteration();
					else
						ccallback();
				}

				wsql.alasql("SHOW TABLES", [], tmames_finded);
			}
		}

	});

	/**
	 * ### Указатель на aladb
	 * @property aladb
	 * @type alasql.Database
	 */
	this.__define({
		aladb: {
			value: new this.alasql.Database('md')
		}
	});

}
