// This file was automatically generated from "codex.lmd.json"
(function(global,main,modules,modules_options,options){var initialized_modules={},global_eval=function(code){return global.Function("return "+code)()},global_document=global.document,local_undefined,register_module=function(moduleName,module){var output={exports:{}};initialized_modules[moduleName]=1;modules[moduleName]=output.exports;if(!module){module=module||global[moduleName]}else if(typeof module==="function"){var module_require=lmd_require;if(modules_options[moduleName]&&modules_options[moduleName].sandbox&&typeof module_require==="function"){module_require=local_undefined}module=module(module_require,output.exports,output)||output.exports}module=module;return modules[moduleName]=module},lmd_require=function(moduleName){var module=modules[moduleName];var replacement=[moduleName,module];if(replacement){moduleName=replacement[0];module=replacement[1]}if(initialized_modules[moduleName]&&module){return module}if(typeof module==="string"&&module.indexOf("(function(")===0){module=global_eval(module)}return register_module(moduleName,module)},output={exports:{}};for(var moduleName in modules){initialized_modules[moduleName]=0}main(lmd_require,output.exports,output)})
(this,(function (require, exports, module) { /* wrapped by builder */
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
				width:  220
			},
			{
				id:     "b",
				header: false,
				height: 320
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
	layout.attachHeader("codex_header");

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

	// дерево
	var tree = layout.cells("a").attachTree();
	tree.setImagePath(dhtmlx.image_path + 'dhxtree_web/');
	tree.setIconsPath(dhtmlx.image_path + 'dhxtree_web/');
	tree.attachEvent("onSelect", function(id){
		$p.iface.content.attachHTMLString(marked(require('md'+id)));
		var js = require('js'+id);
		if(js)
			$p.iface.editor.setValue(js);
	});
	tree.loadJSONObject(require('tree'));
	tree.selectItem("0110", true);

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



}),{
"tree": {"id":0,
  "item":[
    {"id":"0100","text":"Демо-приложения","child":"1",
      "item":[
        {"id":"0110", "text":"Элементы управления"},
        {"id":"0120", "text":"Управление небольшой фирмой"},
        {"id":"0130", "text":"Бухгалтерия предприятия"},
        {"id":"0140", "text":"Безбумажное производство"}
      ]},
    {"id":"0200", "text":"Объектная модель","child":"1",
      "item":[
        {"id":"0210", "text":"MetaEngine"}
      ]}
  ]
},
"md0100": "# Демо-приложения\r\nПодключение к типовым конфигурациям 1С\r\n===\r\nПримеры реализации javascript-клиентов к типовым конфигурациям 1С",
"md0110": "{\r\n  \"0100\": {\r\n    content: \"\"\r\n  }\r\n}",
"md0120": "{\r\n  \"0100\": {\r\n    content: \"\"\r\n  }\r\n}",
"md0130": "{\r\n  \"0100\": {\r\n    content: \"\"\r\n  }\r\n}",
"md0140": "{\r\n  \"0100\": {\r\n    content: \"\"\r\n  }\r\n}",
"md0200": "{\r\n  \"0100\": {\r\n    content: \"\"\r\n  }\r\n}",
"md0210": "{\r\n  \"0100\": {\r\n    content: \"\"\r\n  }\r\n}",
"js0100": "<!---->\r\nfunction msg(){\r\n\t$p.msg.show_msg({\r\n\t\ttitle: \"Справка\",\r\n\t\ttype: \"alert-info\",\r\n\t\ttext: $p.msg.not_implemented\r\n\t});\r\n}"
},{},{});
