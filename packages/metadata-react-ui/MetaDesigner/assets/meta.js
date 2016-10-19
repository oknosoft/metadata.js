'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _metadata = require('metadata');

var _metadata2 = _interopRequireDefault(_metadata);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var struct = {
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

var meta = {
  name: 'Метаданные',
  icon: 'icon_1c_root',
  toggled: true,
  children: []
};

var classes = _metadata2.default.md.classes();

var _loop = function _loop(key) {
  meta.children.push({
    name: _metadata2.default[key].toString(),
    icon: struct[key].icon,
    children: classes[key].map(function (name) {
      return {
        meta: _metadata2.default.md.get(key + "." + name),
        get name() {
          return this.meta.name || _metadata2.default.md.syns_1с(name);
        },
        icon: struct[key].icon,
        children: []
      };
    })
  });
  meta.children[meta.children.length - 1].children.forEach(function (elm) {
    if (key == 'enm') {} else if (key.indexOf('reg') != -1) {} else {
      elm.children.push({
        name: 'Реквизиты',
        icon: 'icon_1c_props',
        children: (0, _keys2.default)(elm.meta.fields).filter(function (name) {
          return ['owner', 'parent', 'predefined_name'].indexOf(name) == -1;
        }).map(function (name) {
          return {
            name: _metadata2.default.md.syns_1с(name),
            icon: 'icon_1c_props'
          };
        })
      });
    }
  });
};

for (var key in struct) {
  _loop(key);
}

exports.default = meta;