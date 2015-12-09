/**
 * Created 09.12.2015<br />
 * &copy; http://www.oknosoft.ru 2014-2015
 * @license content of this file is covered by Oknosoft Commercial license. Usage without proper license is prohibited. To obtain it contact info@oknosoft.ru
 * @author  Evgeniy Malyarov
 * @module  server
 */

var argv = process.argv,
	attr = argv.length > 2 ? argv[2] : 'settings.json';

function parser(filename, callback){

	require('fs').readFile(filename, { encoding:'utf8' }, function(err, dataFromFile){

		if(err){
			callback(err);
		} else {
			try {
				callback(null, JSON.parse(dataFromFile.toString().trim()));
			}
			catch (e){
				callback(e)
			}
		}

	});
}



parser(attr, function(err, data){

	if(err){
		throw (err);
	}

	attr = data;
	data = null;

	// metadata.js
	attr.$p = require('../lib/metadata.core.js');

	// если указано использование сокетов - инициализируем
	if(attr.http["socket"])
		require('socket.js')(attr);

	// если указано использование взаимодействия с 1С - инициализируем
	if(attr.http["1c"])
		require('sync_1c.js')(attr);

});