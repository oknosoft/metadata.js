/**
 * Глобальные переменные и общие методы фреймворка __metadata.js__ <i>Oknosoft data engine</i>
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * Экспортирует глобальную переменную __$p__ типа {{#crossLink "MetaEngine"}}{{/crossLink}}
 * @module  common
 */

var $p

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
 * ### Контекст metadata.js
 * [metadata.js](https://github.com/oknosoft/metadata.js), экспортирует в глобальную область видимости переменную __$p__ типа {{#crossLink "MetaEngine"}}{{/crossLink}}
 *
 * @class MetaEngine
 * @static
 * @menuorder 00
 * @tooltip Контекст metadata.js
 */
class MetaEngine{

	constructor() {

		if($p)
			return $p;

		$p = this;

		Object.defineProperties(this, {

			version: {
				value: "PACKAGE_VERSION",
				writable: false
			},

			toString: { value: () => "Oknosoft data engine. v:" + this.version },

			/**
			 * ### Буфер для строковых и двоичных данных, внедряемых в скрипт
			 * В этой структуре живут, например, sql текст инициализации таблиц, xml-строки форм и менюшек и т.д.
			 *
			 * @property injected_data
			 * @type Object
			 * @final
			 */
			injected_data: { value: {} },

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
			 * ### Подключает обработчики событий
			 *
			 * @method on
			 * @param name {String|Object} - имя события
			 * @param fn {Function} - функция - обработчик
			 * @returns {*}
			 */
			on: {
				value: function (name, fn) {
					if(typeof name == "object"){
						for(var n in name){
							if(!name[n]._evnts)
								name[n]._evnts = [];
							name[n]._evnts.push(this.eve.attachEvent(n, name[n]));
						}
					}else
						return this.eve.attachEvent(name, fn);
				}
			},

			/**
			 * ### Отключает обработчики событий
			 *
			 * @method off
			 * @param id {String|Number|Function}
			 */
			off: {
				value: function (id) {
					if(typeof id == "function" && id._evnts){
						id._evnts.forEach(function (id) {
							eve.detachEvent(id);
						});
					}else if(!id)
						eve.detachAllEvents();
					else
						eve.detachEvent(id);
				}
			},

			/**
			 * ### Запись журнала регистрации
			 *
			 * @method record_log
			 * @param err
			 */
			record_log: {
				value: function (err) {
					if(this.ireg && this.ireg.$log)
						this.ireg.$log.record(err);
					console.log(err);
				}
			},

			/**
			 * ### Mетаданные конфигурации
			 * @property md
			 * @type Meta
			 * @static
			 */
			md: { value: new Meta(this) }

		})

		mngrs(this);

		tabulars(this);

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
	get classes(){return classes}

}

if(!classes.MetaEngine){
	Object.defineProperties(classes, {
		MetaEngine: {value: MetaEngine}
	});
}




