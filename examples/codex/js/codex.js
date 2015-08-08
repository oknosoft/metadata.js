/**
 * Основное окно примеров кода и документации
 * <br />&copy; http://www.oknosoft.ru 2009-2015
 * Created 17.06.2015
 * @module  main
 */


/**
 * Процедура устанавливает параметры работы программы, специфичные для текущей сборки
 * @param prm {Object} - в свойствах этого объекта определяем параметры работы программы
 * @param modifiers {Array} - сюда можно добавить обработчики, переопределяющие функциональность объектов данных
 */
$p.settings = function (prm, modifiers) {
	prm.offline = true; // автономная работа. запросы к 1С запрещены
};


/**
 * Обработчик события при начале работы программы
 */
$p.iface.oninit = function() {

	$p.eve.redirect = true;

	var layout = new dhtmlXLayoutObject({
		parent: document.body,
		pattern: "3L",
		cells: [
			{
				id:     "a",
				header: false,
				width:  300
			},
			{
				id:     "b",
				header: false,
				height: 340
			},
			{
				id:     "c",
				header: false
			}
		],
		offsets: {          // optional, offsets for fullscreen init
			top:    2,     // you can specify all four sides
			right:  2,     // or only the side where you want to have an offset
			bottom: 2,
			left:   2
		}
	});

	layout.attachEvent("onPanelResizeFinish", function(names){
		if(names.indexOf("b")!=-1){
			var h = layout.cells("b").getHeight();
			$p.iface.editor.setSize(null, h - 66);
		}
	});

	// табы
	var tabs = $p.iface.tabs = layout.cells("b").attachTabbar({
		tabs: [
			{id: "content", text: "Описание", active: true},
			{id: "js", text: "JavaScript"}
		]
	});

	tabs.tabs("js").attachObject("code_mirror");

	$p.iface.editor_bar = new $p.iface.OTooolBar({
		wrapper: document.querySelector("#code_toolbar"),
		width: '99%',
		height: '28px',
		top: '6px',
		left: '10px',
		name: 'top',
		image_path:	dhtmlx.image_path + 'dhxtoolbar_web/',
		buttons: [
			{name: 'run', img: 'execute.png', text: 'Выполнить', width: '110px', float: 'left'}
		], onclick: function (name) {
			switch(name) {
				case 'run':
					$p.iface.result.execute($p.iface.editor.getValue());
					break;

				default:
					$p.msg.show_msg(name);
					break;
			}
		}});

	$p.iface.editor = CodeMirror.fromTextArea(document.querySelector("#code_editor"), {
		mode: "javascript",
		lineNumbers: true,
		lineWrapping: true,
		scrollbarStyle: "simple"
	});


	tabs.tabs("content").attachHTMLString("<div style='height: 100%; width: 100%; overflow: auto'></div>")
	$p.iface.content = tabs.tabs("content").cell.firstChild.firstChild;

	// iframe с результатами
	layout.cells("c").attachURL("examples/codex/result.html");
	setTimeout(function () {
		$p.iface.result = new (function Results(iframe) {

			this.execute = function (code) {
				(function ($p, document, window, alasql) {
					try{
						eval(code);
					}catch(e){
						console.log(e);
					}
				})(iframe.contentWindow.$p, iframe.contentDocument, iframe.contentWindow, iframe.contentWindow.alasql);
			};


			this._define("location", {
				get: function () {
					return iframe.contentWindow.location;
				}
			});

		})(layout.cells("c").cell.lastChild.firstChild);
	});

	// дерево
	var tree = $p.iface.tree = layout.cells("a").attachTree();
	tree.setImagePath(dhtmlx.image_path + 'dhxtree_web/');
	tree.setIconsPath(dhtmlx.image_path + 'dhxtree_web/');
	tree.attachEvent("onSelect", tree_select);
	tree.loadJSONObject(require('tree'));
	tree.selectItem("0100", true);

};

function tree_select(id){

	// обновляем текст описания
	$p.iface.content.innerHTML = marked(require('md'+id));

	// обновляем текст js
	var js = require('js'+id);
	if(js)
		$p.iface.editor.setValue(js.substr(9));
	else
		$p.iface.editor.setValue("");
	$p.iface.editor.clearHistory();

	// при необходимости, обновляем url страницы результата
	var opt = require('options')[id], url;
	if(typeof opt == "string")
		url = opt;
	else if(typeof opt == "object")
		url = opt.url;

	if(url && ($p.iface.result.location.origin + $p.iface.result.location.pathname).indexOf(url)==-1)
		$p.iface.result.location.replace(url);

}

/**
 * Обработчик события перед маршрутизацией
 * @param event
 * @return {boolean}
 */
$p.iface.before_route = function (event) {
	var route_prm = $p.job_prm.parse_url();
	if(route_prm.view && (route_prm.view=="js" || route_prm.view=="content")){
		$p.iface.tabs.tabs(route_prm.view).setActive();
	}
	if(route_prm.obj && route_prm.obj.indexOf("0")==0){
		try{ $p.iface.tree.selectItem(route_prm.obj, true); }
		catch(e){ }
	}

	return false;
};


