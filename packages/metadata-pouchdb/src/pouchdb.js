/**
 * Экспортирует конструктор PouchDB с учетом среды исполнения
 */

let PouchDB;

/**
 * В зависимости от среды исполнения, подключаем адаптер memory или idb или websql
 * isNode
 */
if(typeof process !== 'undefined' && process.versions && process.versions.node){
	PouchDB = require('pouchdb-core')
		.plugin(require('pouchdb-adapter-http'))
		.plugin(require('pouchdb-replication'))
		.plugin(require('pouchdb-mapreduce'))
		.plugin(require('pouchdb-find'))
		.plugin(require('pouchdb-adapter-memory'));
}
else{
	if(window.PouchDB){
		PouchDB = window.PouchDB;
	}
	else{
		PouchDB = require('pouchdb-core')
			.plugin(require('pouchdb-adapter-http'))
			.plugin(require('pouchdb-replication'))
			.plugin(require('pouchdb-mapreduce'))
			.plugin(require('pouchdb-find'))
			.plugin(require('pouchdb-authentication'));
		const ua = (navigator && navigator.userAgent) ? navigator.userAgent.toLowerCase() : '';
		if(ua.match('safari') && !ua.match('chrome')){
			PouchDB.plugin(require('pouchdb-adapter-websql'));
		}else{
			PouchDB.plugin(require('pouchdb-adapter-idb'));
		}
	}
}

export default PouchDB;

