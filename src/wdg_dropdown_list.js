/**
 * ### Визуальный компонент - гиперссылка с выпадающим списком для выбора значения
 *
 * Created 13.11.2015<br />
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author  Evgeniy Malyarov
 * @module  wdg_dropdown_list
 */

/**
 * ### Визуальный компонент - гиперссылка с выпадающим списком
 * - Предназначен для отображения и редактирования значения перечислимого типа (короткий список)
 *
 * @class ODropdownList
 * @param attr
 * @param attr.container {HTMLElement} - контейнер, в котором будет размещен элемент
 * @param attr.title {String} - заголовок элемента
 * @param attr.values {Array} - список строковых представлений перечисления или объект, в ключах которого ключи, а в значениях - представления значений
 * @param attr.event_name {String} - имя события, которое будет генерировать элемент при изменении значения
 * @param [attr.class_name] {String} - имя класса CSS, добавляемое к стилям элемета
 * @constructor
 */
function ODropdownList(attr){

	var ul = document.createElement('ul'), li, div, a;

	function set_order_text(silent){
		a.innerHTML = attr.values[a.getAttribute("current")];
		if(attr.event_name && !silent)
			dhx4.callEvent(attr.event_name, [a.getAttribute("current")]);
	}

	function body_click(){
		div.classList.remove("open");
	}

	attr.container.innerHTML = '<div class="dropdown_list">' + attr.title + '<a href="#" class="dropdown_list"></a></div>';
	div = attr.container.firstChild;
	a = div.querySelector("a");
	a.setAttribute("current", Array.isArray(attr.values) ? "0" : Object.keys(attr.values)[0]);
	div.onclick = function (e) {
		if(!div.classList.contains("open")){
			div.classList.add("open");
		}else{
			if(e.target.tagName == "LI"){
				for(var i in ul.childNodes){
					if(ul.childNodes[i] == e.target){
						a.setAttribute("current", e.target.getAttribute("current"));
						set_order_text();
						break;
					}
				}
			}
			body_click();
		}
		return $p.cancel_bubble(e);
	};
	div.appendChild(ul);
	ul.className = "dropdown_menu";
	if(attr.class_name){
		div.classList.add(attr.class_name);
		ul.classList.add(attr.class_name);
	}

	for(var i in attr.values){
		li = document.createElement('li');
		var pos = attr.values[i].indexOf('<i');
		li.innerHTML = attr.values[i].substr(pos) + " " + attr.values[i].substr(0, pos);
		li.setAttribute("current", i);
		ul.appendChild(li);
	};

	document.body.addEventListener("keydown", function (e) {
		if(e.keyCode == 27) { // закрытие по {ESC}
			div.classList.remove("open");
		}
	});
	document.body.addEventListener("click", body_click);

	this.unload = function () {
		var child;
		while (child = div.lastChild)
			div.removeChild(child);
		attr.container.removeChild(div);
		li = ul = div = a = attr = null;
	};

	set_order_text(true);

}
$p.iface.ODropdownList = ODropdownList;