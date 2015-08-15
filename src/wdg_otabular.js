/**
 * ### Визуальный компонент - табличное поле объекта
 * &copy; http://www.oknosoft.ru 2009-2015
 *
 * @module  wdg_otabular
 * @requires common
 */

/**
 * ### Визуальный компонент - табличное поле объекта
 * - Предназначен для отображения и редактирования {{#crossLink "TabularSection"}}табличной части{{/crossLink}}
 * - Унаследован от [dhtmlXGridObject](http://docs.dhtmlx.com/grid__index.html)
 * - Состав и типы колонок формируются автоматически по описанию метаданны
 * - Программное изменение состава строк и значений в полях строк синхронно отображается в элементе управления
 * - Редактирование в элементе управления синхронно изменяет свойства табличной части связанного объекта
 *
 * @class OTabular
 * @param attr
 * @param attr.parent {HTMLElement} - контейнер, в котором будет размещен элемент
 * @param attr.obj {DataObj} - ссылка на редактируемый объект
 * @param attr.ts {String} - имя поля табличной части
 * @param [attr.meta] {Object} - описание метаданных табличной части. Если не указано, описание запрашивается у объекта
 * @constructor
 */
function OTabular(attr){

	OTabular.superclass.constructor.call(this, attr.parent);

}
OTabular._extend(dhtmlXGridObject);
$p.iface.OTabular = OTabular;

/**
 * Размещает табличное поле объекта в ячейке dhtmlXCellObject
 * @param attr
 */
dhtmlXCellObject.prototype.attachTabular = function(attr) {

	var obj = document.createElement("DIV");
	obj.style.width = "100%";
	obj.style.height = "100%";
	obj.style.position = "relative";
	obj.style.overflow = "hidden";
	this._attachObject(obj);
	attr.parent = obj;

	this.dataType = "grid";
	this.dataObj = new OTabular(attr);
	this.dataObj.setSkin(this.conf.skin);

	// keep border for window and remove for other
	if (this.conf.skin == "dhx_skyblue" && typeof(window.dhtmlXWindowsCell) != "undefined" && this instanceof window.dhtmlXWindowsCell) {
		this.dataObj.entBox.style.border = "1px solid #a4bed4";
		this.dataObj._sizeFix = 0;
	} else {
		this.dataObj.entBox.style.border = "0px solid white";
		this.dataObj._sizeFix = 2;
	}

	obj = null;

	this.callEvent("_onContentAttach",[]);

	/**
	 *  патч, ради которого
	 */
	this.dataObj.objBox.ontouchend = function(){
		try{
			this.hdrBox.scrollLeft=this.objBox.scrollLeft;
		}catch(e){}
	};

	return this.dataObj;
};

