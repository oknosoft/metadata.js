import InterfaceObjs from './iface'
import widgets from './dhtmlx-widgets'
import events from './events'

export default {

	/**
	 * ### Модификатор прототипов
	 * @param constructor {MetaEngine}
	 * @param classes {Object}
	 */
	proto(constructor) {

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
	},

	/**
	 * ### Модификатор конструктора MetaEngine
	 * Вызывается в контексте экземпляра MetaEngine
	 */
	constructor(){

		/**
		 * Объекты интерфейса пользователя
		 * @property iface
		 * @for MetaEngine
		 * @type InterfaceObjs
		 * @static
		 */
		this.iface =  new InterfaceObjs(this);

		const {load_script, wsql, utils} = this;

		/**
		 * ### Врзвращает объект Docxtemplater из blob
		 * blob может быть получен из вложения DataObj
		 *
		 * @method docxtemplater
		 * @for Utils
		 * @param blob {Blob} - двоичные данные шаблона
		 * @return {Docxtemplater} - объект open-xml-docx
		 * @async
		 */
		utils.docxtemplater = function (blob) {

			return (window.Docxtemplater ?
				Promise.resolve() :
				Promise.all([
					load_script("https://cdn.jsdelivr.net/jszip/2/jszip.min.js", "script"),
					load_script("https://cdn.jsdelivr.net/combine/gh/open-xml-templating/docxtemplater-build/build/docxtemplater-latest.min.js,gh/open-xml-templating/docxtemplater-image-module-build/build/docxtemplater-image-module-latest.min.js", "script"),
				]))
				.then(function () {
					if(!Docxtemplater.prototype.saveAs){
						Docxtemplater.prototype.saveAs = function (name) {
							var out = this.getZip().generate({type: "blob", mimeType: utils.mime_lookup('docx')});
							wsql.alasql.utils.saveAs(out, name);
						};
					}
					return utils.blob_as_text(blob, 'array');
				})
				.then(function (buffer) {
					return new Docxtemplater().loadZip(new JSZip(buffer));
				});
		};

		widgets(this);

		events(this);

	}
}