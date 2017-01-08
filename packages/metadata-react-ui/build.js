/**
 * Компилятор react-ui
 *
 * @module build
 *
 * Created 07.01.2017
 */

const exec = require('child_process').exec;

const root = './packages/metadata-react-ui/';

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


exec_babel('DataField', 'dir')
  .then((stdout) => {
    return exec_babel('DataHead', 'dir')
  })
  .then((stdout) => {
    return exec_babel('DataList', 'dir')
  })
  .then((stdout) => {
    return exec_babel('DataTree', 'dir')
  })
  .then((stdout) => {
    return exec_babel('DumbLoader', 'dir')
  })
  .then((stdout) => {
    return exec_babel('FrmLogin', 'dir')
  })
  .then((stdout) => {
    return exec_babel('FrmObj', 'dir')
  })
  .then((stdout) => {
    return exec_babel('FrmSuperLogin', 'dir')
  })
  .then((stdout) => {
    return exec_babel('MetaDesigner', 'dir')
  })
  .then((stdout) => {
    return exec_babel('MetaList', 'dir')
  })
  .then((stdout) => {
    return exec_babel('MetaTree', 'dir')
  })
  .then((stdout) => {
    return exec_babel('NavList', 'dir')
  })
  .then((stdout) => {
    return exec_babel('SchemeSettings', 'dir')
  })
  .then((stdout) => {
    return exec_babel('TabularSection', 'dir')
  })
  .then((stdout) => {
    return exec_babel('common/plugin.js', 'plugin.js')
  })
  .then((stdout) => {
    return exec_babel('common/bandle.js', 'index.js')
  })