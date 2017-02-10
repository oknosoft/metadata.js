/**
 * Компилятор react-ui
 *
 * @module build
 *
 * Created 07.01.2017
 */

const exec = require('child_process').exec;
const concat = require('concat-files');
const root = './packages/metadata-react-ui/';

const exec_babel = (src, out, ignore) => {
  return new Promise((resolve, reject) => {
    const cmd = `babel ${root}${src}${out == 'dir' ? `/src --out-dir ${root}${src}` : ` --out-file ${root}${out}`} ${ignore ? '--ignore ' + ignore : ''}`;
    console.log(`to be executed: "${cmd}"`);
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.log(`stderr: ${stderr}`);
        return reject(err);
      }
      console.log(`${stdout}\n`);
      resolve(stdout)
    });
  })
}

const exec_concat = (src, dir, out) => {
  return new Promise((resolve, reject) => {
    concat(src.map((name => `${root}${dir}/${name}.js`)), `${root}${dir}/${out}.js`, (err) => {
      if (err){
        return reject(err)
      }
      resolve()
    })
  })
}


exec_babel('DataField', 'dir')
  .then((res) => {
    return exec_babel('DataHead', 'dir')
  })
  .then((res) => {
    return exec_babel('DataList', 'dir')
  })
  .then((res) => {
    return exec_babel('DataListField', 'dir')
  })
  .then((res) => {
    return exec_babel('DataTree', 'dir')
  })
  .then((res) => {
    return exec_babel('DumbLoader', 'dir')
  })
  .then((res) => {
    return exec_babel('FrmLogin', 'dir')
  })
  .then((res) => {
    return exec_babel('FrmObj', 'dir')
  })
  .then((res) => {
    return exec_babel('FrmSuperLogin', 'dir')
  })
  .then((res) => {
    return exec_babel('MetaDesigner', 'dir')
  })
  .then((res) => {
    return exec_babel('MetaList', 'dir')
  })
  .then((res) => {
    return exec_babel('MetaTree', 'dir')
  })
  .then((res) => {
    return exec_babel('NavList', 'dir')
  })
  .then((res) => {
    return exec_babel('SchemeSettings', 'dir')
  })
  .then((res) => {
    return exec_babel('TabularSection', 'dir')
  })
  .then((res) => {
    return exec_concat([
      'rx_columns',
      'export_handlers',
      'print',
      'plugin_src',
    ], 'common', 'plugin')
  })
  .then((res) => {
    return exec_babel('common/plugin.js', 'plugin.js')
  })
  .then((res) => {
    return exec_babel('common/bandle.js', 'index.js')
  })