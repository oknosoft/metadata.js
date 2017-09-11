/**
 * Дерево метаданных
 */

import $p from 'metadata'

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
}

const meta = {
  name: 'Метаданные',
  icon: 'icon_1c_root',
  toggled: true,
  children: []
}

const classes = $p.md.classes();

for (let key in struct) {
  meta.children.push({
    name: $p[key].toString(),
    icon: struct[key].icon,
    children: classes[key].map(name => ({
      meta: $p.md.get(key + "." + name),
      get name() {
        return this.meta.name || $p.md.syns_1с(name)
      },
      icon: struct[key].icon,
      children: []
    }))
  });
  meta.children[meta.children.length - 1].children.forEach(elm => {
    if (key == 'enm') {

    } else if (key.indexOf('reg') != -1) {

    } else {
      elm.children.push({
        name: 'Реквизиты',
        icon: 'icon_1c_props',
        children: Object.keys(elm.meta.fields)
          .filter(name => ['owner', 'parent', 'predefined_name'].indexOf(name) == -1)
          .map(name => ({
            name: $p.md.syns_1с(name),
            icon: 'icon_1c_props'
          }))
      })
    }
  })
}

export default meta;
