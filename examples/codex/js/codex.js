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

	// табы
	var tabs = $p.iface.tabs = layout.cells("b").attachTabbar({
		tabs: [
			{id: "content", text: "Описание", active: true},
			{id: "js", text: "JavaScript"}
		]
	});

	tabs.tabs("js").attachObject("code_mirror");
	$p.iface.editor_bar = new dhtmlXToolbarObject({
		parent: "code_toolbar",
		icons_path: dhtmlx.image_path + 'dhxtoolbar_web/',
		items:[
			{id: "run", type: "button", img: "execute.png", text: "Выполнить"}
		],
		onClick:function(id){
			if(id=="run")
				$p.iface.result.execute($p.iface.editor.getValue());
		}
	});
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
			var t = {
				doc: iframe.contentDocument,
				window: iframe.contentWindow
			};
			this.execute = function (code) {
				(function ($p, document, window, alasql) {
					try{
						eval(code);
					}catch(e){
						console.log(e);
					}
				})(t.window.$p, t.doc, t.window, t.window.alasql);
			}
		})(layout.cells("c").cell.lastChild.firstChild);
	});

	// дерево
	var tree = layout.cells("a").attachTree();
	tree.setImagePath(dhtmlx.image_path + 'dhxtree_web/');
	tree.setIconsPath(dhtmlx.image_path + 'dhxtree_web/');
	tree.attachEvent("onSelect", function(id){
		$p.iface.content.innerHTML = marked(require('md'+id));
		var js = require('js'+id);
		if(js)
			$p.iface.editor.setValue(js.substr(9));
		else
			$p.iface.editor.setValue("");
		$p.iface.editor.clearHistory();
	});
	tree.loadJSONObject(require('tree'));
	tree.selectItem("0100", true);

};

/**
 * Обработчик события перед маршрутизацией
 * @param event
 * @return {boolean}
 */
$p.iface.before_route = function (event) {
	var route_prm = $p.job_prm.parse_url();
	if(route_prm.view && route_prm.view!="oper"){
		setTimeout(function () {
			$p.iface.set_hash("", "", "", "oper");
		}, 0);
		return false;
	}
};


