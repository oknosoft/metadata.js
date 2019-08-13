/**
 * Дерево метаданных
 */

// global $p

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

export default async function meta() {

  const {adapters: {pouch}, md, utils} = $p;
  const meta = {
    name: 'Метаданные',
    icon: 'icon_1c_root',
    toggled: true,
    children: []
  }

  function syns(name) {
    if(name === 'parent') return 'Родитель';
    if(name === 'owner') return 'Владелец';
    return md.syns_1с(name);
  }

  function add_fields(elm, direct) {
    const children = Object.keys(elm.meta.fields)
      .filter(name => name !== 'predefined_name')
      .map(name => ({
        _id: name,
        _owner: elm,
        name: syns(name),
        icon: 'icon_1c_props',
      }));
    if(direct) {
      elm.children = children;
    }
    else {
      elm.children.push({
        name: 'Реквизиты',
        icon: 'icon_1c_props',
        children,
      });
    }
  }

  return pouch.remote.meta.allDocs({
    include_docs: true,
    attachments: true,
    startkey: 'meta',
    endkey: 'meta\ufff0',
  })
    .then((res) => {
      const _m = {};
      for(const {doc} of res.rows) {
        utils._patch(_m, doc);
      }

      for (let key in struct) {
        const keys = Object.keys(_m[key]);
        meta.children.push({
          name: $p[key].toString(),
          icon: struct[key].icon,
          children: keys.map(name => ({
            meta: _m[key][name],
            get name() {
              return this.meta.name || syns(name)
            },
            icon: struct[key].icon,
            children: []
          }))
        });
        meta.children[meta.children.length - 1].children.forEach(elm => {
          if (key == 'enm') {
            elm.children.push({
              name: 'Значения',
              icon: 'icon_1c_props',
              children: elm.meta.map(v => Object.assign({
                icon: 'icon_1c_props',
                _owner: elm,
              }, v))
            });
          }
          else if (key.includes('reg')) {

          }
          else {
            add_fields(elm);

            const tabs = {
              name: 'Табличные части',
              icon: 'icon_1c_tabular',
              children: []
            };
            elm.children.push(tabs);
            for(const name in elm.meta.tabular_sections) {
              const ts = elm.meta.tabular_sections[name];
              const tab = {
                _id: name,
                _owner: tabs,
                meta: ts,
                name: syns(name),
                icon: 'icon_1c_tabular',
                children: []
              }
              add_fields(tab, true);
              tabs.children.push(tab);
            }

            const frms = {
              name: 'Формы',
              icon: 'icon_1c_frm',
              children: []
            };
            elm.children.push(frms);

          }
        })
      };

      const schamas = {
        name: 'Схемы компоновки',
        icon: 'icon_1c_tsk',
        children: []
      }

      meta.children.push(schamas);

      return meta;

    });
};
