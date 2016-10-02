/**
 * Глобальные переменные и общие методы фреймворка __metadata.js__ <i>Oknosoft data engine</i>
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * Экспортирует глобальную переменную __$p__ типа {{#crossLink "MetaEngine"}}{{/crossLink}}
 * @module  common
 */

/**
 * ### Metadata.js - проект с открытым кодом
 * Приглашаем к сотрудничеству всех желающих. Будем благодарны за любую помощь
 *
 * ### Почему Metadata.js?
 * Библиотека предназначена для разработки бизнес-ориентированных и учетных offline-first браузерных приложений
 * и содержит JavaScript реализацию [Объектной модели 1С](http://v8.1cru/overview/Platform.htm).
 * Библиотека эмулирует наиболее востребованные классы API 1С внутри браузера или Node.js, дополняя их средствами автономной работы и обработки данных на клиенте.
 *
 * ### Для кого?
 * Для разработчиков мобильных и браузерных приложений, которым близка парадигма 1С _на базе бизнес-объектов: документов и справочников_,
 * но которым тесно в рамках традиционной платформы 1С.<br />
 * Metadata.js предоставляет программисту:
 * - высокоуровневые [data-объекты](http://www.oknosoft.ru/upzp/apidocs/classes/DataObj.html), схожие по функциональности с документами, регистрами и справочниками платформы 1С
 * - инструменты декларативного описания метаданных и автогенерации интерфейса, схожие по функциональности с метаданными и формами платформы 1С
 * - средства событийно-целостной репликации и эффективные классы обработки данных, не имеющие прямых аналогов в 1С
 *
 *
 * @class MetaEngine
 * @static
 * @menuorder 00
 * @tooltip Контекст metadata.js
 */
export default class MetaEngine{

	constructor() {

		// инициируем базовые свойства
		Object.defineProperties(this, {

			version: {
				value: "PACKAGE_VERSION",
				writable: false
			},

			toString: { value: () => "Oknosoft data engine. v:" + this.version },


			/**
			 * ### Адаптеры для PouchDB, 1С и т.д.
			 * @property adapters
			 * @type Object
			 * @final
			 */
			adapters: {
				value: {}
			},

			/**
			 * ### Параметры работы программы
			 * @property job_prm
			 * @type JobPrm
			 * @final
			 */
			job_prm: {value: new JobPrm()},

			/**
			 * Интерфейс к данным в LocalStorage, AlaSQL и IndexedDB
			 * @property wsql
			 * @type WSQL
			 * @final
			 */
			wsql: { value: new WSQL(this) },

			/**
			 * Aes для шифрования - дешифрования данных
			 *
			 * @property aes
			 * @type Aes
			 * @final
			 */
			aes: { value: new Aes("metadata.js") },

			/**
			 * ### Mетаданные конфигурации
			 * @property md
			 * @type Meta
			 * @static
			 */
			md: { value: new Meta(this) }

		})

		// создаём конструкторы менеджеров данных
		mngrs(this);

		// создаём конструкторы табличных частей
		tabulars(this);

		// при налчии расширений, выполняем их методы инициализации
		if(MetaEngine._constructors && Array.isArray(MetaEngine._constructors)){
			for(var i=0; i< MetaEngine._constructors.length; i++){
				MetaEngine._constructors[i].call(this);
			}
		}

	}

	/**
	 * ### Запись журнала регистрации
	 *
	 * @method record_log
	 * @param err
	 */
	record_log(err) {
		if(this.ireg && this.ireg.$log)
			this.ireg.$log.record(err);
		console.log(err);
	}

	/**
	 * Вспомогательные методы
	 */
	get utils(){return utils}

	/**
	 * i18n
	 */
	get msg(){return msg}

	/**
	 * Конструкторы объектов данных
	 */
	get classes(){//noinspection JSUnresolvedVariable
		return classes}

	/**
	 * ### Текущий пользователь
	 * Свойство определено после загрузки метаданных и входа впрограмму
	 * @property current_user
	 * @type CatUsers
	 * @final
	 */
	get current_user() {

		let user_name;

		if(this.superlogin){
			const session = this.superlogin.getSession();
			user_name =  session ? session.user_id : "";
		}else
			user_name = this.wsql.get_user_param("user_name");

		const user = this.cat && this.cat.users ?
			this.cat.users.by_id(user_name) : null;

		return user && !user.empty() ? user : null;
	}

	/**
	 * ### Подключает расширения metadata
	 * Принимает в качестве параметра объект с полями `proto` и `constructor` типа _function_
	 * proto выполняется в момент подключения, constructor - после основного конструктора при создании объекта
	 *
	 * @param obj
	 * @return {MetaEngine}
	 */
	static plugin(obj){

		if(typeof obj.proto == "function"){ // function style for plugins
			obj.proto(MetaEngine)
		}else if (typeof obj.proto == 'object'){
			Object.keys(obj.proto).forEach(function (id) { // object style for plugins
				MetaEngine.prototype[id] = obj.proto[id];
			});
		}

		if(obj.constructor){

			if(typeof obj.constructor != "function"){
				throw new Error('Invalid plugin: constructor must be a function');
			}

			if(!MetaEngine._constructors){
				MetaEngine._constructors = [];
			}

			MetaEngine._constructors.push(obj.constructor);
		}

		return MetaEngine;
	}

}