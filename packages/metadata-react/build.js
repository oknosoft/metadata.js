/**
 * Компилятор react-ui
 *
 * @module build
 *
 * Created 07.01.2017
 */

const exec = require('child_process').exec;
const concat = require('concat-files');
const root = './packages/metadata-react/';

const exec_babel = (src, out, ignore) => {
  return new Promise((resolve, reject) => {
    const cmd = `babel ${root}src/${src}${out == 'dir' ? ` --out-dir ${root}dist/${src}` : ` --out-file ${root}dist/${out}`} ${ignore ? '--ignore ' + ignore : ''}`;
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
    concat(src.map((name => `${root}${dir}/${name}.js`)), `${root}${out}.js`, (err) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}

const cmps = 'DataField,FieldsSet,DataList,DataListField,DataTree,Dialog,DumbLoader,FlexPanel,FrmLogin,FrmObj,FrmReport,FrmSuperLogin,MetaDesigner,MetaList,MetaTree,NavList,SchemeSettings,Tabs,TabularSection'.split(',');

//const cmps = [];

const exec_recursive = () => {
  const cmp = cmps.pop();
  if (cmp) {
    return exec_babel(cmp, 'dir').then(exec_recursive)
  }
  else {
    return exec_concat([
      'rx_columns',
      'export_handlers',
      'print',
      'plugin_src',
    ], 'src/common', 'src/plugin')
      .then((res) => {
        return exec_babel('common/MetaComponent.js', 'common/MetaComponent.js')
      })
      .then((res) => {
        return exec_babel('plugin.js', 'plugin.js')
      })
      .then((res) => {
        return exec_babel('index.js', 'index.js')
      })
  }
}

exec_recursive();

