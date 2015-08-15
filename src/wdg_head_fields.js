/**
 * ### Визуальный компонент - реквизиты шапки объекта
 * &copy; http://www.oknosoft.ru 2009-2015
 *
 * @module  wdg_head_fields
 * @requires common
 */

/**
 * ### Визуальный компонент - реквизиты шапки объекта
 * - Предназначен для отображения и редактирования полей {{#crossLink "DataObj"}}объекта данных{{/crossLink}}
 * - Унаследован от [dhtmlXGridObject](http://docs.dhtmlx.com/grid__index.html)
 * - Состав и типы элементов управления в дереве реквизитов формируются автоматически по описанию метаданны
 * - Программное изменение значений реквизитов объекта данных, синхронно отображается в элементе управления
 * - Редактирование в элементе управления синхронно изменяет свойства связанного объекта
 *
 * @class OHeadFields
 * @param attr
 * @param attr.parent {HTMLElement} - контейнер, в котором будет размещен элемент
 * @param attr.obj {DataObj} - ссылка на редактируемый объект
 * @param attr.ts {String} - имя поля табличной части
 * @param [attr.meta] {Object} - описание метаданных табличной части. Если не указано, описание запрашивается у объекта
 * @constructor
 */
function OHeadFields(attr){

	OHeadFields.superclass.constructor.call(this, attr);
	dhtmlXPropertyGrid(this);


}
OHeadFields._extend(dhtmlXGridObject);
$p.iface.OHeadFields = OHeadFields;

/**
 * Размещает реквизиты шапки объекта в ячейке dhtmlXCellObject
 * @param attr
 */
dhtmlXCellObject.prototype.attachHeadFields = function(conf) {

	var obj = document.createElement("DIV");
	obj.style.width = "100%";
	obj.style.height = "100%";
	obj.style.position = "relative";
	obj.style.overflow = "hidden";
	this._attachObject(obj);
	conf.parent = obj;

	this.dataType = "grid";
	this.dataObj = new OHeadFields(conf);
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

