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
				id:             "a",
				header:         false,
				width:          220
			},
			{
				id:             "b",
				header:         false
			},
			{
				id:             "c",
				header:         false
			}
		],
		offsets: {          // optional, offsets for fullscreen init
			top:    2,     // you can specify all four sides
			right:  2,     // or only the side where you want to have an offset
			bottom: 2,
			left:   2
		}
	});
	layout.attachHeader("codex_header");

	// дерево
	var tree = layout.cells("a").attachTree();
	tree.setImagePath(dhtmlx.image_path + 'dhxtree_web/');
	tree.setIconsPath(dhtmlx.image_path + 'dhxtree_web/');
	tree.attachEvent("onSelect", function(id){
		console.log(id);
	});
	tree.loadJSON("examples/codex/data/tree.json", function () {
		this.selectItem("0110", true);
	}, "json");

	// табы
	var tabs = $p.iface.tabs = layout.cells("b").attachTabbar({
		tabs: [
			{id: "content", text: "Описание", active: true},
			{id: "js", text: "JavaScript"}
		]
	});
	tabs.tabs("js").attachHTMLString("<textarea style='width:100%;height:100%;'></textarea>");

	$p.iface.editor = CodeMirror.fromTextArea(tabs.tabs("js").cell.firstChild.firstChild, {
		mode: "javascript",
		lineNumbers: true,
		lineWrapping: true
	});

	$p.iface.content = tabs.tabs("content");

	// iframe с результатами
	layout.cells("c").attachURL("examples/codex/result.html");

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


