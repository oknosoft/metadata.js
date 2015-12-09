/**
 * ### Административный интерфейс
 *
 * Created 09.12.2015<br />
 * &copy; http://www.oknosoft.ru 2014-2015
 * @license content of this file is covered by Oknosoft Commercial license. Usage without proper license is prohibited. To obtain it contact info@oknosoft.ru
 * @author  Evgeniy Malyarov
 * @module  http_adm
 */

module.exports = function (attr) {

	var static = require('node-static'),
		port = attr.http.adm,
		fileServer = new static.Server('./adm');

	function srv_adm(request, response) {
		request.addListener('end', function () {
			fileServer.serve(request, response);
		}).resume();
	}

	// сервер http для администрирования системы
	attr.http.adm = attr.http.http.createServer(srv_adm);
	attr.http.adm.listen(port);



};