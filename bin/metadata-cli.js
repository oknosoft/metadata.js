#!/usr/bin/env node
//
// Command line interface for metadata.js
// &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
//

var $p = require('metadata-js');
var path = require('path');
var fs = require('fs');
var yargs = require('yargs')
	.commandDir('cmds')
	.demand(1)
	.strict()
    .usage('Metadata.js command-line utility (v '+$p.version+')\n\nUsage: metadata [command] [params]')
    
    .example('metadata init [dir]', 'Create directory structure for empty project')

	.version('v', 'Metadata.js version', $p.version).alias('v', 'version')

    .help('h')
    .alias('h', 'help')

    .epilog('\nMore information about the library: www.oknosoft.ru/metadata/');


var argv = yargs.argv;

if(0===argv._.length){
	yargs.showHelp();
	process.exit(1);
}



