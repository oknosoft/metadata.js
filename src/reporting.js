/**
 * Конструкторы табличных документов печатных форм и отчетов<br/>
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016<br/>
 * Created 17.04.2016
 *
 * @module reporting
 */

/**
 * Объект для построения печатных форм и отчетов
 *
 * @param [attr] {Object} - размер листа, ориентация, поля и т.д.
 * @constructor
 */
function SpreadsheetDocument(attr) {

	this._attr = {
		orientation: "portrait",
		title: "",
		content: document.createElement("DIV")
	};

	if(attr && typeof attr == "string"){
		this.content = attr;

	} else if(typeof attr == "object"){
		this._mixin(attr);
	}
	attr = null;
}
SpreadsheetDocument.prototype.__define({

	clear: {
		value: function () {
			while (this._attr.content.firstChild) {
				this._attr.content.removeChild(this._attr.content.firstChild);
			}
		}
	},

	/**
	 * Выводит область ячеек в табличный документ
	 */
	put: {
		value: function (range, attr) {

			var elm;

			if(range instanceof HTMLElement){
				elm = document.createElement(range.tagName);
				elm.innerHTML = range.innerHTML;
				if(!attr)
					attr = range.attributes;
			}else{
				elm = document.createElement("DIV");
				elm.innerHTML = range;
			}

			if(attr){
				Object.keys(attr).forEach(function (key) {
					if(key == "id" || attr[key].name == "id")
						return;
					elm.setAttribute(attr[key].name || key, attr[key].value || attr[key]);
				});
			}

			this._attr.content.appendChild(elm);
		}
	},

	content: {
		get: function () {
			return this._attr.content
		},
		set: function (v) {

			this.clear();

			if(typeof v == "string")
				this._attr.content.innerHTML = v;

			else if(v instanceof HTMLElement)
				this._attr.content.innerHTML = v.innerHTML;

		}
	},

	title: {
		get: function () {
			return this._attr.title
		},
		set: function (v) {

			this._attr.title = v;

		}
	}
});

/**
 * Экспортируем конструктор SpreadsheetDocument, чтобы экземпляры печатного документа можно было создать снаружи
 * @property SpreadsheetDocument
 * @for MetaEngine
 * @type {function}
 */
$p.SpreadsheetDocument = SpreadsheetDocument;


/**
 * Табличный документ для экранных отчетов
 * @param container {HTMLElement|dhtmlXCellObject} - элемент DOM, в котором будет размещена таблица
 * @param [attr] {Object} - атрибуты инициплизации  
 * @constructor
 */
function HandsontableDocument(container, attr) {

	var init = function () {
		
		if(this._then)
			this._then(this);

	}.bind(this);
	
	this._online = (attr && attr.allow_offline) || (navigator.onLine && $p.wsql.pouch.authorized);
	
	if(container instanceof dhtmlXCellObject){
		this._cont = document.createElement('div');
		container.detachObject(true);
		container.attachObject(this._cont);
	}else{
		this._cont = container;
	}

	this._cont.classList.add("handsontable_wrapper");
	if(!this._online){
		this._cont.innerHTML = $p.msg.report_need_online;
	}else{
		this._cont.innerHTML = attr.autorun ? $p.msg.report_prepare : $p.msg.report_need_prepare;
	}

	this.then = function (callback) {
		this._then = callback;
		return this;
	};

	this.requery = function (opt) {
		if(this.hot)
			this.hot.destroy();
		this._cont.innerHTML = "";
		this.hot = new Handsontable(this._cont, opt);
	};

	// отложенная загрузка handsontable и зависимостей
	if(typeof Handsontable != "function" && this._online){

		//https://cdnjs.cloudflare.com/ajax/libs/numbro/1.9.2/numbro.min.js
		//http://cdnjs.cloudflare.com/ajax/libs/numbro/1.9.2/languages/ru-RU.min.js

		$p.load_script("//cdnjs.cloudflare.com/ajax/libs/pikaday/1.4.0/pikaday.min.js","script")
			.then(function () {
				return $p.load_script("//cdnjs.cloudflare.com/ajax/libs/numbro/1.9.2/numbro.min.js","script")
			})
			.then(function () {
				return $p.load_script("//cdn.jsdelivr.net/g/zeroclipboard,handsontable@0.26(handsontable.min.js)","script")
			})
			.then(function () {
				return Promise.all([
					$p.load_script("//cdn.jsdelivr.net/handsontable/0.26/handsontable.min.css","link"),
					$p.load_script("//cdnjs.cloudflare.com/ajax/libs/numbro/1.9.2/languages/ru-RU.min.js","script")
				]);
			})
			.then(init);

		// $p.load_script("//cdnjs.cloudflare.com/ajax/libs/pikaday/1.4.0/pikaday.min.js","script",function () {
		// 	$p.load_script("//cdn.jsdelivr.net/g/zeroclipboard,handsontable@0.25(handsontable.min.js)","script",init);
		// 	$p.load_script("//cdn.jsdelivr.net/handsontable/0.25/handsontable.min.css","link");
		// });

	}else{
		setTimeout(init);
	}
	
}

/**
 * Экспортируем конструктор HandsontableDocument, чтобы экземпляры табличного документа можно было создать снаружи
 * @property HandsontableDocument
 * @for MetaEngine
 * @type {function}
 */
$p.HandsontableDocument = HandsontableDocument;