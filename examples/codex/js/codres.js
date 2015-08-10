/**
 * <br />&copy; http://www.oknosoft.ru 2009-2015
 * Created 08.08.2015
 * @module  codres
 */

$p.eve.redirect = true;

$p.settings = function (prm, modifiers) {
	prm.create_tables = true;
	prm.create_tables_sql = require('create_tables');
	prm.allow_post_message = "*";
};

$p.iface.oninit = function() {
	new $p.Meta(require('meta'));
};
