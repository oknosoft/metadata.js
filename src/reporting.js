/**
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 * @module reporting
 * Created 17.04.2016
 */

/**
 * Табличный документ для потсроения печатных форм и отчетов
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
 * Экспортируем конструктор SpreadsheetDocument, чтобы экземпляры табличного документа можно было создать снаружи
 * @property SpreadsheetDocument
 * @for $p
 * @type {function}
 */
if(typeof $p !== "undefined")
	$p.SpreadsheetDocument = SpreadsheetDocument;