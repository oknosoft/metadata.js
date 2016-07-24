/**
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 * @module build_meta
 * Created 19.07.2016
 */

var $p = require('../../lib/metadata.core.js');

// установим параметры
$p.on("settings", function (prm) {

	var settings = require('./settings.json'),
		fs = require('fs');

	// разделитель для localStorage
	prm.local_storage_prefix = settings.pouch.prefix;

	// по умолчанию, обращаемся к зоне 0
	prm.zone = settings.pouch.zone;

	// объявляем номер демо-зоны
	prm.zone_demo = 1;

	// расположение couchdb
	prm.couch_path = settings.pouch.path;

	// логин гостевого пользователя couchdb
	prm.guest_name = "guest";

	// пароль гостевого пользователя couchdb
	prm.guest_pwd = "meta";

	// расположение rest-сервиса 1c
	prm.rest_path = settings["1c"].odata;

	prm.create_tables_sql = fs.readFileSync('./create_tables.sql', 'utf8');

});

// после готовности метаданных, можно развлекаться
$p.on("meta", function () {

});