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

			this.location = iframe.contentWindow.location;

		})(layout.cells("c").cell.lastChild.firstChild);
	});

	// дерево
	var tree = $p.iface.tree = layout.cells("a").attachTree();
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
	if(route_prm.view && (route_prm.view=="js" || route_prm.view=="content")){
		$p.iface.tabs.tabs(route_prm.view).setActive();
	}
	if(route_prm.obj && route_prm.obj.indexOf("0")==0){
		try{
			$p.iface.tree.selectItem(route_prm.obj, true);
		}catch(e){

		}
	}

	return false;
};



}),{
"tree": {"id":0,
  "item":[
    {"id":"0100","text":"Демо-приложения","child":"1", "open":"1",
      "item":[
        {"id":"0110", "text":"Элементы управления","child":"1", "open":"1",
          "item":[
            {"id":"0111", "text":"Сообщения пользователю"}
            ]
        },
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
"urls": {
  "0110": "result.html"
},
"md0100": "# Демо-приложения\r\nПри навигации по дереву, закладка `Описание` отображает текст раздела, а закладка `JavaScript` - контекстные примеры кода.<br />Код можно редактировать по месту и выполнять.\r\n\r\n## Элементы управления\r\nПримеры подключения полей ввода, списков, окон и диалогов\r\n\r\n## Подключение к типовым конфигурациям 1С\r\nПримеры реализации javascript-клиентов к типовым конфигурациям 1С",
"md0110": "## Элементы управления\r\nПри навигации по дереву, закладка `Описание` отображает текст раздела, а закладка `JavaScript` - контекстные примеры кода.<br />Код можно редактировать по месту и выполнять.\r\n",
"md0111": "## Сообщения пользователю\r\nПример содержит два варианта вывода сообщений: _модальный диалог_ и _всплывающее сообщение_.\r\n\r\nЕсли заменить `type` сообщения `alert-info` на один из доступных вариантов - вид диалога изменится, а для типов `confirm`, будут показаны кнопки `Ok` и `Отмена`. Текст кнопок можно задать в том же объекте свойств сообщения. Например, так: \r\n```\r\n{\r\n\ttitle: \"Справка\",\r\n\ttype: \"confirm-error\", \r\n\ttext: \"Нет справки\",\r\n\tcancel: \"До свидания\"\r\n}\r\n```",
"md0120": "{\r\n  \"0100\": {\r\n    content: \"\"\r\n  }\r\n}",
"md0130": "{\r\n  \"0100\": {\r\n    content: \"\"\r\n  }\r\n}",
"md0140": "{\r\n  \"0100\": {\r\n    content: \"\"\r\n  }\r\n}",
"md0200": "# Объектная модель",
"md0210": "{\r\n  \"0100\": {\r\n    content: \"\"\r\n  }\r\n}",
"js0100": "<!---->\r\nfunction msg(){\r\n\t$p.msg.show_msg({\r\n\t\ttitle: \"Справка\",\r\n\t\ttype: \"alert-info\",\r\n\t\ttext: $p.msg.not_implemented\r\n\t});\r\n}",
"js0111": "<!---->\r\n// модальное окно сообщения\r\n$p.msg.show_msg({\r\n\ttitle: \"Справка\",\r\n\ttype: \"alert-warning\", // варианты alert, confirm, modalbox, alert-info, confirm-error\r\n\ttext: \"Нет справки\"\r\n});\r\n\r\n// всплывающие сообщения показываем с задержкой в секунду\r\nsetTimeout(function(){\r\n\t$p.msg.show_msg(\"Это сообщение в верхнем правом\");\r\n\t$p.msg.show_msg({type: \"error\", text: \"Сообщение на красном фоне\"});\r\n}, 1000);"
},{},{});
