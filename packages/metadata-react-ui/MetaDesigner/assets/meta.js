'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _metadata = require('metadata');

var _metadata2 = _interopRequireDefault(_metadata);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const struct = {
  cat: {
    icon: 'icon_1c_cat'
  },
  doc: {
    icon: 'icon_1c_doc'
  },
  enm: {
    icon: 'icon_1c_enm'
  }
}; /**
    * Дерево метаданных
    */

const meta = {
  name: 'Метаданные',
  icon: 'icon_1c_root',
  toggled: true,
  children: []
};

const classes = _metadata2.default.md.classes();

for (let key in struct) {
  meta.children.push({
    name: _metadata2.default[key].toString(),
    icon: struct[key].icon,
    children: classes[key].map(name => ({
      meta: _metadata2.default.md.get(key + "." + name),
      get name() {
        return this.meta.name || _metadata2.default.md.syns_1с(name);
      },
      icon: struct[key].icon,
      children: []
    }))
  });
  meta.children[meta.children.length - 1].children.forEach(elm => {
    if (key == 'enm') {} else if (key.indexOf('reg') != -1) {} else {
      elm.children.push({
        name: 'Реквизиты',
        icon: 'icon_1c_props',
        children: Object.keys(elm.meta.fields).filter(name => ['owner', 'parent', 'predefined_name'].indexOf(name) == -1).map(name => ({
          name: _metadata2.default.md.syns_1с(name),
          icon: 'icon_1c_props'
        }))
      });
    }
  });
}

exports.default = meta;