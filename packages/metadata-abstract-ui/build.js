'use strict';

const fs = require('fs');
const rollup = require('rollup').rollup;
const resolve = require('rollup-plugin-node-resolve');
const replace = require('rollup-plugin-replace');
const cleanup = require('rollup-plugin-cleanup');
const path = require('path');
const package_data = require(path.resolve(__dirname, './package.json'));

const external = ['clipboard'];
const plugins = [
	resolve({jsnext: true, main: true}),
	replace({PACKAGE_VERSION: package_data.version}),
	cleanup(),
];
const header = `/*!
 ${package_data.name} v${package_data.version}, built:${new Date().toISOString().split('T')[0]}
 © 2014-2017 Evgeniy Malyarov and the Oknosoft team http://www.oknosoft.ru
 metadata.js may be freely distributed under the MIT
 To obtain commercial license and technical support, contact info@oknosoft.ru
 */\n\n`;

return rollup({
	entry: path.resolve(__dirname, './src/plugin.js'),
	external,
	plugins,
})
	.then((bundle) => bundle.generate({
		format: 'cjs', // output format - 'amd', 'cjs', 'es', 'iife', 'umd'
		moduleName: package_data.name.replace(/-/g, '_') + '_plugin',
		//sourceMap: true,
	}))
	.then((result) => fs.writeFileSync(path.resolve(__dirname, './index.js'), header + result.code))
	.then(() => rollup({
		entry: path.resolve(__dirname, './src/meta.js'),
		external,
		plugins,
	}))
	.then((bundle) => bundle.generate({
		format: 'cjs', // output format - 'amd', 'cjs', 'es', 'iife', 'umd'
		moduleName: package_data.name.replace(/-/g, '_') + '_meta',
		//sourceMap: true,
	}))
	.then((result) => fs.writeFileSync(path.resolve(__dirname, './meta.js'), header + result.code));

