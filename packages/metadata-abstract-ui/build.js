/**
 * Компилятор metadata-abstract-ui
 *
 * @module build
 *
 * Created 07.01.2017
 */

const exec = require('child_process').exec;
const concat = require('concat-files');
const root = './packages/metadata-abstract-ui/';

const exec_babel = (src, out, ignore) => {
	return new Promise((resolve, reject) => {
		const cmd = `babel ${root}${src}${out == 'dir' ? `/src --out-dir ${root}${src}` : ` --out-file ${root}${out}`} ${ignore ? '--ignore ' + ignore : ''}`;
		console.log(`to be executed: "${cmd}"`);
		exec(cmd, (error, stdout, stderr) => {
			if (error) {
				console.log(`stderr: ${stderr}`);
				return reject(error);
			}
			console.log(`${stdout}\n`);
			resolve(stdout)
		});
	})
}


exec_babel('src/meta.js', 'meta.js')
	.then(() => {

		concat([
			'ui',
			'tabulars',
			'meta_objs',
			'log_manager',
			'scheme_settings',
			'plugin',
		].map((name => `${root}src/${name}.js`)), `${root}src/index.js`, function(err) {
			if (err){
				throw err
			}
			exec_babel('src/index.js', 'index.js')
		});

	})