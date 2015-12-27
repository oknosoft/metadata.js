/**
 * ### Административный интерфейс
 *
 * Created 09.12.2015<br />
 * &copy; http://www.oknosoft.ru 2014-2015
 * @license content of this file is covered by Oknosoft Commercial license. Usage without proper license is prohibited. To obtain it contact info@oknosoft.ru
 * @author  Evgeniy Malyarov
 * @module  http_adm
 */

module.exports = function ($p) {

	var node_static = require('node-static')
		fileServer = new node_static.Server('../designer'),

		// сервер http для администрирования системы
		adm = require('http').createServer(srv_adm);

	function srv_adm(request, response) {

		var rtext="";

		if(request.method == "POST"){

			// через post получаем команды конфигуратора

			request.on("data", function(chunk) {
				rtext+=chunk.toString();
			});

			request.on("end", function() {
				response.end("OK");
				//reg_from_1c(rtext);
			});

		}else if(request.method == "GET"){

			// get обслуживает статический http сервер

			request.addListener('end', function () {
				fileServer.serve(request, response);
			}).resume();
		}
	}


	adm.listen($p.job_prm.network.adm);



};

//window.dhx4.skin = 'dhx_terrace';
//var main_layout = new dhtmlXLayoutObject(document.body, '3W');
//
//var meta = main_layout.cells('a');
//meta.setText('Конфигурация');
//var tree_1 = meta.attachTree();
//tree_1.setImagePath('./codebase/imgs/dhxtree_'+dhx4.skin.replace(/^dhx_/,'')+'/');
//tree_1.load('./data/tree.xml', 'xml');
//
//
//
//var b = main_layout.cells('b');
//b.hideHeader();
//
//
//var properties = main_layout.cells('c');
//properties.setText('Свойства');
//var grid_1 = properties.attachGrid();
//grid_1.setIconsPath('./codebase/imgs/');
//
//grid_1.setHeader(["Column 1","Column 2"]);
//grid_1.setColTypes("ro,ro");
//
//grid_1.setColSorting('str,str');
//grid_1.setInitWidths('*,*');
//grid_1.init();
//grid_1.load('./data/grid.xml', 'xml');
//
//
//
//var toolbar_1 = main_layout.attachToolbar();
//toolbar_1.setIconsPath('./codebase/imgs/');
//
//toolbar_1.loadStruct('./data/toolbar.xml', function() {});
//var status_1 = main_layout.attachStatusBar();
//status_1.setText('kjhkjh');