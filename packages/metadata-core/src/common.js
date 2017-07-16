/**
 * Глобальные переменные и общие методы фреймворка __metadata.js__ <i>Oknosoft data engine</i>
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2017
 *
 * Экспортирует глобальную переменную __$p__ типа {{#crossLink "MetaEngine"}}{{/crossLink}}
 * @module  metadata
 */

import utils from './utils';
import Aes from '../lib/aes';
import JobPrm from './jobprm';
import WSQL from './wsql';
import Meta from './meta';
import msg from './i18n.ru';
import mngrs from './mngrcollections';
import classes from './classes';


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
class MetaEngine {

	constructor() {

		// дублируем ссылку на конструкторы в объекте
		this.classes = classes;

		/**
		 * ### Адаптеры для PouchDB, 1С и т.д.
		 * @property adapters
		 * @type Object
		 * @final
		 */
		this.adapters = {};

		/**
		 * Aes для шифрования - дешифрования строк
		 *
		 * @property aes
		 * @type Aes
		 * @final
		 */
		this.aes = new Aes('metadata.js');

		/**
		 * ### Параметры работы программы
		 * @property job_prm
		 * @type JobPrm
		 * @final
		 */
		this.job_prm = new JobPrm(this);

		/**
		 * Интерфейс к данным в LocalStorage, AlaSQL и IndexedDB
		 * @property wsql
		 * @type WSQL
		 * @final
		 */
		this.wsql = new WSQL(this);

		/**
		 * ### Mетаданные конфигурации
		 * @property md
		 * @type Meta
		 * @static
		 */
		this.md = new Meta(this);

		// создаём конструкторы менеджеров данных
		mngrs(this);

		// дублируем метод record_log в utils
		this.record_log = this.record_log.bind(this);

		// при налчии расширений, выполняем их методы инициализации
		MetaEngine._plugins.forEach((plugin) => plugin.call(this));
		MetaEngine._plugins.length = 0;

	}

	on(type, listener) {
		this.md.on(type, listener);
	}

	off(type, listener) {
		this.md.off(type, listener);
	}

	get version() {
		return 'PACKAGE_VERSION';
	}

	toString() {
		return 'Oknosoft data engine. v:' + this.version;
	}


	/**
	 * ### Запись журнала регистрации
	 *
	 * @method record_log
	 * @param err
	 */
	record_log(err) {
		this && this.ireg && this.ireg.log && this.ireg.log.record(err);
		console && console.log(err);
	}


	/**
	 * Вспомогательные методы
	 */
	get utils() {
		return utils;
	}

	/**
	 * i18n
	 */
	get msg() {
		return msg;
	}

	/**
	 * ### Текущий пользователь
	 * Свойство определено после загрузки метаданных и входа впрограмму
	 * @property current_user
	 * @type CatUsers
	 * @final
	 */
	get current_user() {

		const {CatUsers, cat, superlogin, wsql} = this;
		// заглушка "всё разрешено", если методы acl не переопределены внешним приложением
		if(CatUsers && !CatUsers.prototype.hasOwnProperty("role_available")){

			CatUsers.prototype.__define({


				/**
				 * ### Роль доступна
				 *
				 * @param name {String}
				 * @returns {Boolean}
				 */
				role_available: {
					value: (name) => true
				},

				/**
				 * ### Права на объект
				 * Если не задано в модификаторе, разрешаем полный доступ
				 */
				get_acl: {
					value: (class_name) => "rvuidepo"
				},

			});
		}

		let user_name, user;

		if (superlogin) {
			const session = superlogin.getSession();
			user_name = session ? session.user_id : '';
		}

		if (!user_name) {
			user_name = wsql.get_user_param('user_name');
		}

		if (cat && cat.users) {
			user = cat.users.by_id(user_name);
			if (!user || user.empty()) {
				cat.users.find_rows_remote({
					_top: 1,
					id: user_name,
				});
			}
		}

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
	static plugin(obj) {

		if (obj.hasOwnProperty('proto')) {
			if (typeof obj.proto == 'function') {         // function style for plugins
				obj.proto(MetaEngine);
			}
			else if (typeof obj.proto == 'object') {     // object style for plugins
				Object.keys(obj.proto).forEach((id) => MetaEngine.prototype[id] = obj.proto[id]);
			}
		}

		if (obj.hasOwnProperty('constructor')) {
			if (typeof obj.constructor != 'function') {
				throw new Error('Invalid plugin: constructor must be a function');
			}
			MetaEngine._plugins.push(obj.constructor);
		}

		return MetaEngine;
	}
}

/**
 * Конструкторы объектов данных
 */
MetaEngine.classes = classes;

/**
 * Хранилище плагинов
 * @type {Array}
 * @private
 */
MetaEngine._plugins = [];

export default MetaEngine;
