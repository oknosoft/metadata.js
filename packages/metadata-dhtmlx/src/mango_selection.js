/**
 * Абстрактная форма списка и выбора выбора объектов ссылочного типа (документов и справочников) с использованием mango-селектора
 *
 * @module mango_selection
 *
 * Created by Evgeniy Malyarov on 24.04.2017.
 */

class MangoSelection {

  constructor(mgr, pwnd, attr = {}) {

    this._mgr = mgr;
    this._attr = attr;
    this._pwnd = pwnd || attr.pwnd || {};
    this._meta = attr.metadata || mgr.metadata();
    this._prev_filter = {};
    this._direction = 'desc';

    this.__define('_sort', {
      get: function () {
        const {_sort} = this.wnd.elmnts.filter.custom_selection;
        for(const srt of _sort) {
          for(const fld in srt) {
            srt[fld] = this._direction;
          }
        };
        return _sort;
      }
    });

    this.select = this.select.bind(this);
    this.body_keydown = this.body_keydown.bind(this);

    // создаём и настраиваем форму
    if(this.has_tree && attr.initial_value && attr.initial_value != $p.utils.blank.guid && !attr.parent) {
      this._mgr.get(attr.initial_value, true)
        .then((tObj) => {
          attr.set_parent = attr.parent = tObj.parent.ref;
          this.frm_create();
        });
    }
    else {
      this.frm_create();
    }

  }

  get has_tree() {
    return this._meta.hierarchical && !(this._mgr instanceof this._mgr._owner.$p.classes.ChartOfAccountManager);
  }


  // указатель на dhtmlXGridObject
  get grid() {

  }

  // аналог 1С-ного ПриСозданииНаСервере()
  frm_create() {

    const {_attr, _mgr, _pwnd, _meta} = this;

    // создаём и настраиваем окно формы
    if(_pwnd instanceof dhtmlXCellObject) {
      if(!(_pwnd instanceof dhtmlXTabBarCell) && (typeof _pwnd.close == 'function')) {
        _pwnd.close(true);
      }
      this.wnd = _pwnd;
      this.wnd.close = (on_create) => {
        const wnd = this.wnd || _pwnd;
        if(wnd) {
          wnd.detachToolbar();
          wnd.detachStatusBar();
          if(wnd.conf) {
            wnd.conf.unloading = true;
          }
          wnd.detachObject(true);
        }
        this.frm_unload(on_create);
      };
      if(!_attr.hide_header) {
        setTimeout(() => this.wnd.showHeader());
      }
    }
    else {
      const wnd = this.wnd = $p.iface.w.createWindow(null, 0, 0, 700, 500);
      wnd.centerOnScreen();
      wnd.setModal(1);
      wnd.button('park').hide();
      wnd.button('minmax').show();
      wnd.button('minmax').enable();
      wnd.attachEvent('onClose', this.frm_close.bind(this));
    }

    const {wnd} = this;

    $p.iface.bind_help(wnd);

    if(wnd.setText && !_attr.hide_text) {
      wnd.setText('Список ' + (_mgr.class_name.indexOf('doc.') == -1 ? 'справочника "' : 'документов "') + (_meta.list_presentation || _meta.synonym) + '"');
    }

    document.body.addEventListener('keydown', this.body_keydown, false);

    wnd.elmnts = {};
    wnd._mgr = _mgr;

    // командная панель формы
    this.create_toolbar(wnd);

    // таблица и дерево
    this.create_tree_and_grid(wnd);

    // оповещаем о готовности
    this._attr.on_create && this._attr.on_create(wnd);

  }

  create_toolbar(wnd) {

    const {elmnts} = wnd;
    const {_attr, _mgr, _pwnd} = this;

    const toolbar = elmnts.toolbar = wnd.attachToolbar();
    toolbar.setIconsPath(dhtmlx.image_path + 'dhxtoolbar' + dhtmlx.skin_suffix());
    toolbar.loadStruct(_attr.toolbar_struct || $p.injected_data['toolbar_selection.xml'], () => {

      toolbar.attachEvent('onclick', this.toolbar_click.bind(this));

      // если мы приклеены к ячейке, сдвигаем toolbar на 4px
      if(wnd === _pwnd) {
        toolbar.cont.parentElement.classList.add('dhx_cell_toolbar_no_borders');
        toolbar.cont.parentElement.classList.remove('dhx_cell_toolbar_def');
        //toolbar.cont.style.top = "4px";
      }

      // текстовое поле фильтра по подстроке
      const tbattr = {
        manager: _mgr,
        toolbar: toolbar,
        onchange: this.input_filter_change.bind(this),
        hide_filter: _attr.hide_filter,
        custom_selection: _attr.custom_selection
      };
      if(_attr.date_from) tbattr.date_from = _attr.date_from;
      if(_attr.date_till) tbattr.date_till = _attr.date_till;
      if(_attr.filter) tbattr.filter = _attr.filter;
      if(_attr.period) tbattr.period = _attr.period;
      elmnts.filter = new $p.iface.Toolbar_filter(tbattr);


      // учтём права для каждой роли на каждый объект
      const _acl = $p.current_user.get_acl(_mgr.class_name);

      if(_acl.indexOf('i') == -1) {
        toolbar.hideItem('btn_new');
      }

      if(_acl.indexOf('v') == -1) {
        toolbar.hideItem('btn_edit');
      }

      if(_acl.indexOf('d') == -1) {
        toolbar.hideItem('btn_delete');
      }

      if(!(_pwnd.on_select || _attr.on_select)) {
        toolbar.hideItem('btn_select');
        toolbar.hideItem('sep1');
        if($p.iface.docs && $p.iface.docs.getViewName && $p.iface.docs.getViewName() == 'oper') {
          toolbar.addListOption('bs_more', 'btn_order_list', '~', 'button', '<i class="fa fa-briefcase fa-lg fa-fw"></i> Список заказов');
        }
      }
      toolbar.addListOption('bs_more', 'btn_import', '~', 'button', '<i class="fa fa-upload fa-lg fa-fw"></i> Загрузить из файла');
      toolbar.addListOption('bs_more', 'btn_export', '~', 'button', '<i class="fa fa-download fa-lg fa-fw"></i> Выгрузить в файл');


      // добавляем команды печати
      if(_mgr.printing_plates) {
        _mgr.printing_plates().then((pp) => {
          let added;
          for (let pid in pp) {
            toolbar.addListOption('bs_print', pid, '~', 'button', pp[pid].toString());
            added = true;
          }
          if(!added) {
            toolbar.hideItem('bs_print');
          }
        });
      }
      else {
        toolbar.hideItem('bs_print');
      }
    });
  }

  create_tree_and_grid(wnd) {

    let cell_grid, tree, grid_inited;

    const do_reload = () => setTimeout(() => wnd.elmnts.grid && this.reload(), 20);

    if(this.has_tree) {
      const layout = wnd.attachLayout('2U');

      cell_grid = layout.cells('b');
      cell_grid.hideHeader();

      const cell_tree = wnd.elmnts.cell_tree = layout.cells('a');
      cell_tree.setWidth('220');
      cell_tree.hideHeader();

      tree = wnd.elmnts.tree = cell_tree.attachDynTree(_mgr, null, do_reload);
      tree.attachEvent('onSelect', (id, mode) => {	// довешиваем обработчик на дерево
        if(!mode) {
          return;
        }
        if(this.do_not_reload) {
          delete this.do_not_reload;
        }
        else {
          do_reload();
        }
      });
      tree.attachEvent('onDblClick', this.select);

    }
    else {
      cell_grid = wnd;
      do_reload();
    }

    // настройка грида
    const grid = wnd.elmnts.grid = cell_grid.attachGrid();
    grid.setIconsPath(dhtmlx.image_path);
    grid.setImagePath(dhtmlx.image_path);
    grid.attachEvent('onBeforeSorting', this.custom_column_sort.bind(this));
    grid.attachEvent('onXLE', () => cell_grid.progressOff());
    grid.attachEvent('onXLS', () => cell_grid.progressOn());
    grid.attachEvent('onRowDblClicked', (rId, cInd) => {
      if(tree && tree.items[rId]) {
        tree.selectItem(rId);
        const pid = tree.getParentId(rId);
        pid && pid != $p.utils.blank.guid && tree.openItem(pid);
      }
      else {
        this.select(rId);
      }
    });

    const {acols} = this._mgr.caption_flds({});
    grid.setHeader(acols.map(v => v.caption).join(','));
    grid.setInitWidths(acols.map(v => v.width).join(','));
    grid.setColAlign(acols.map(v => v.align).join(','));
    grid.setColTypes(acols.map(v => v.type).join(','));
    grid.setColSorting(acols.map(v => v.sort).join(','));
    grid.enableAutoWidth(true);
    grid.enableMultiselect(true);
    grid.init();
    grid.enableSmartRendering(true, 40);

    grid.load = this.load();

  }

  // загружает очередную порцию данных в грид
  load() {

    const that = this;

    return function (url, call) {

      this.callEvent('onXLS', [this]);
      this._data_type = 'xml';
      if(!this.xmlFileUrl) {
        this.xmlFileUrl = url;
      }
      if(!this.xmlLoader_updated) {
        this.xmlLoader_updated = true;
        this.xmlLoader = (xml) => {
          if(!this.callEvent) return;
          this._process_xml(xml.xmlDoc);
          if(!this._contextCallTimer) {
            this.callEvent('onXLE', [this, 0, 0, xml.xmlDoc]);
          }
        };
      }

      let start = this._current_load ? this._current_load[0] : 0;
      let count = this._current_load ? this._current_load[1] : 40;
      const parts = url.split('?');
      if(parts.length > 1) {
        const prm = $p.job_prm.parse_url_str(parts[1]);
        if(prm.posStart) {
          start = parseInt(prm.posStart);
        }
        if(prm.count) {
          count = parseInt(prm.count);
        }
      }
      const filter = that.get_filter(start, count);

      // если вместо фильтра нам подсунули промис, запросов не делаем - берём результат из него
      (filter instanceof Promise ? filter : that._mgr.pouch_db.find(filter))
        .then(({docs}) => {

          if(that._need_reload) {
            that._need_reload = false;
            return this.load(url, call);
          }

          return {
            xmlDoc: $p.iface.data_to_grid.call(that._mgr, docs.map(v => {
              v.ref = v._id.substr(15);
              delete v._id;
              v.date = new Date(v.date);
              v.posted = v.posted || false;
              v.partner = $p.cat.partners.get(v.partner).presentation;
              v.manager = $p.cat.users.get(v.manager).presentation;
              return v;
            }), {
              _total_count: start + (docs.length < count ? docs.length : docs.length + 1),
              start: start
            }),
            filePath: url,
            async: true
          };

        })
        .catch((err) => {
          $p.msg.show_msg('Ошибка получения списка заказов');
          return {
            xmlDoc: $p.iface.data_to_grid.call(that._mgr, [], {
              _total_count: start,
              start: start
            }),
            filePath: url,
            async: true
          };
        })
        .then((xml) => {
          xml && this.xmlLoader(xml);

          const sort = that._sort[0];
          this.setSortImgState(true, 0, sort[Object.keys(sort)[0]]);

          typeof call === 'function' && call();

          that._loading = false;
        });
    };
  }

  get_filter(start, count) {

    const {wnd, _mgr, _attr, _sort} = this;
    const fields = _mgr.caption_flds({}).acols.map(v => v.id);
    fields.push('_id');
    fields.push('posted');
    fields.push('_deleted');

    const eflt = wnd.elmnts.filter;
    const flt = eflt.get_filter(true);

    const date = {
      $gte: moment(flt.date_from).format('YYYY-MM-DD'),
      $lt: moment(flt.date_till).format('YYYY-MM-DD') + '\ufff0'
    };
    const filter = {
      selector: {},
      fields: fields,
      skip: start,
      limit: count
    };

    const _index = eflt.custom_selection._index || _attr._index;
    // если вместо индекса нам подсунули промис...
    if(_index instanceof Promise) {
      return _index;
    }
    if(_index.fields) {
      for (let sfld of _index.fields) {
        if(sfld == 'date') {
          filter.selector.date = date;
        }
        else if(eflt.custom_selection[sfld]) {
          filter.selector[sfld] = eflt.custom_selection[sfld];
        }
      }
    }
    else {
      filter.selector.date = date;
      for (let sfld in eflt.custom_selection) {
        if(sfld[0] != '_') {
          filter.selector[sfld] = eflt.custom_selection[sfld];
        }
      }
    }

    if(flt.filter) {
      filter.selector.search = {$regex: flt.filter.toLowerCase()};
    }
    else if(_index.fields && _index.fields.indexOf('search') !== -1){
      filter.selector.search = {$ne: null};
    }

    if(_sort) {
      filter.sort = _sort;
    }

    if(_index.ddoc) {
      filter.use_index = _index.ddoc;
    }

    return filter;
  }

  /**
   * Устанавливает фокус в поле фильтра
   * @param evt {KeyboardEvent}
   * @return {Boolean}
   */
  body_keydown(evt) {
    const {wnd} = this;
    const {iface, job_prm} = $p;

    if(wnd && wnd.is_visible && wnd.is_visible()) {
      if(evt.ctrlKey && evt.keyCode == 70) { // фокус на поиск по {Ctrl+F}
        if(!iface.check_exit(wnd)) {
          setTimeout(() => {
            wnd.elmnts.filter.input_filter && job_prm.device_type == 'desktop' && wnd.elmnts.filter.input_filter.focus();
          });
          return iface.cancel_bubble(evt, true);
        }

      }
      else if(evt.shiftKey && evt.keyCode == 116) { // requery по {Shift+F5}
        if(!iface.check_exit(wnd)) {
          setTimeout(() => this.reload());
          return iface.cancel_bubble(evt, true);
        }

      }
      else if(evt.keyCode == 27) { // закрытие по {ESC}
        if(wnd instanceof dhtmlXWindowsCell && !iface.check_exit(wnd)) {
          setTimeout(() => wnd.close());
        }
      }
    }
  }

  /**
   *  обработчик нажатия кнопок командных панелей
   */
  toolbar_click(btn_id) {

    const {_attr, wnd, _mgr} = this;

    // если внешний обработчик вернул false - выходим
    if(_attr.toolbar_click && _attr.toolbar_click(btn_id, wnd, _mgr) === false) {
      return;
    }

    switch (btn_id) {
    case 'btn_select':
      this.select();
      break;

    case 'btn_new':
      _mgr.create({}, true)
        .then((o) => {
          if(_attr.on_new) {
            _attr.on_new(o, wnd);
          }
          else if($p.job_prm.keep_hash) {
            o.form_obj(wnd);
          }
          else {
            o._set_loaded(o.ref);
            $p.iface.set_hash(_mgr.class_name, o.ref);
          }
        });
      break;

    case 'btn_edit':
      const rId = wnd.elmnts.grid.getSelectedRowId();
      if(rId) {
        if(_attr.on_edit) {
          _attr.on_edit(_mgr, rId, wnd);
        }
        else if($p.job_prm.keep_hash) {
          _mgr.form_obj(wnd, {ref: rId});
        }
        else {
          $p.iface.set_hash(_mgr.class_name, rId);
        }
      }
      else {
        $p.msg.show_msg({
          type: 'alert-warning',
          text: $p.msg.no_selected_row.replace('%1', ''),
          title: $p.msg.main_title
        });
      }
      break;

    case 'btn_delete':
      this.mark_deleted();
      break;

    case 'btn_import':
      _mgr.import();
      break;

    case 'btn_export':
      _mgr.export(wnd.elmnts.grid.getSelectedRowId());
      break;

    case 'btn_requery':
      this.reload(true);
      break;

    default:
      btn_id.substr(0, 4) == 'prn_' && this.print(btn_id);

    }
  }

  input_filter_change(flt) {
    const {wnd, grid, has_tree} = this;
    if(wnd && wnd.elmnts) {
      if(has_tree) {
        if(flt.filter || flt.hide_tree) {
          wnd.elmnts.cell_tree.collapse();
        }
        else {
          wnd.elmnts.cell_tree.expand();
        }
      }
      this.reload();
    }
  }

  /**
   * выбор значения в гриде
   * @param rId - идентификтор строки грида или дерева
   */
  select(rId) {
    const {_attr, wnd, _pwnd, _mgr} = this;

    if(!rId) {
      rId = wnd.elmnts.grid.getSelectedRowId();
    }

    let folders;
    if(_attr.selection) {
      _attr.selection.forEach((sel) => {
        for (let key in sel) {
          if(key == 'is_folder') {
            folders = sel[key];
          }
        }
      });
    }

    // запрещаем выбирать папки
    if(wnd.elmnts.tree &&
      wnd.elmnts.tree.items[rId] &&
      wnd.elmnts.tree.getSelectedId() != rId) {
      wnd.elmnts.tree.selectItem(rId, true);
      return;
    }

    // запрещаем выбирать элементы, если в метаданных указано выбирать только папки
    // TODO: спозиционировать сообщение над выбранным элементом
    if(rId && folders === true && wnd.elmnts.grid.cells(rId, 0).cell.classList.contains('cell_ref_elm')) {
      $p.msg.show_msg($p.msg.select_grp);
      return;
    }


    if((!rId && wnd.elmnts.tree) || (wnd.elmnts.tree && wnd.elmnts.tree.getSelectedId() == rId)) {
      if(folders === false) {
        $p.msg.show_msg($p.msg.select_elm);
        return;
      }
      rId = wnd.elmnts.tree.getSelectedId();
    }

    if(rId) {
      if(_attr.on_edit) {
        _attr.on_edit(_mgr, rId, wnd);
      }
      else if(on_select) {
        _mgr.get(rId, true)
          .then((selv) => {
            wnd.close();
            on_select.call(_pwnd.grid || _pwnd, selv);
          });

      }
      else if($p.job_prm.keep_hash) {
        _mgr.form_obj(wnd, {ref: rId});
      }
      else {
        $p.iface.set_hash(_mgr.class_name, rId);
      }
    }
  }

  /**
   * Установка или снятие пометки удаления
   */
  mark_deleted() {
    const {wnd, _mgr} = this;
    const rId = wnd.elmnts.grid.getSelectedRowId();
    if(rId) {
      _mgr.get(rId, true, true)
        .then((o) => dhtmlx.confirm({
          title: $p.msg.main_title,
          text: o._deleted ? $p.msg.mark_undelete_confirm.replace('%1', o.presentation) : $p.msg.mark_delete_confirm.replace('%1', o.presentation),
          cancel: 'Отмена',
          callback: (btn) => btn && o.mark_deleted(!o._deleted)
        }));
    }
    else {
      $p.msg.show_msg({
        type: 'alert-warning',
        text: $p.msg.no_selected_row.replace('%1', ''),
        title: $p.msg.main_title
      });
    }
  }

  /**
   *  Печатает документ
   */
  print(pid) {
    const {wnd, _mgr} = this;
    const rId = wnd.elmnts.grid.getSelectedRowId();
    if(rId) {
      _mgr.print(rId, pid, wnd);
    }
    else {
      $p.msg.show_msg({
        type: 'alert-warning',
        text: $p.msg.no_selected_row.replace('%1', ''),
        title: $p.msg.main_title
      });
    }
  }

  reload(force, call) {
    if(this._loading) {
      this._need_reload = true;
    }
    this._loading = true;
    this.wnd.elmnts.grid.clearAndLoad('pouch', call);
  }

  custom_column_sort(ind, type, direction) {
    this._direction = direction === 'des' ? 'desc' : direction;
    this.reload();
    return false;
  }

  /**
   * освобождает переменные после закрытия формы
   */
  frm_unload(on_create) {
    if(this.body_keydown) {
      document.body.removeEventListener('keydown', this.body_keydown);
    }
    const {_attr} = this;
    if(_attr && _attr.on_close && !on_create) {
      _attr.on_close();
    }
    delete this.select;
    delete this.body_keydown;
  }

  frm_close() {
    const {_pwnd} = this;

    setTimeout(this.frm_unload.bind, 10);

    // если в родительском установлен обработчик выгрузки нашего - вызываем с контекстом грида
    if(_pwnd.on_unload) {
      _pwnd.on_unload.call(_pwnd.grid || _pwnd);
    }

    return true;
  }

};

/**
 * Форма выбора объекта данных
 * @method form_selection
 * @param pwnd {dhtmlXWindowsCell} - указатель на родительскую форму
 * @param attr {Object} - параметры инициализации формы
 * @param [attr.initial_value] {DataObj} - начальное значение выбора
 * @param [attr.parent] {DataObj} - начальное значение родителя для иерархических справочников
 * @param [attr.on_select] {Function} - callback при выборе значения
 * @param [attr.on_grid_inited] {Function} - callback после инициализации грида
 * @param [attr.on_new] {Function} - callback после создания нового объекта
 * @param [attr.on_edit] {Function} - callback перед вызовом редактора
 * @param [attr.on_close] {Function} - callback при закрытии формы
 */


export default ({classes}) => {
  classes.MangoSelection = MangoSelection;
  classes.DataManager.prototype.mango_selection = function (pwnd, attr) {
    return new MangoSelection(this, pwnd, attr);
  };
};
