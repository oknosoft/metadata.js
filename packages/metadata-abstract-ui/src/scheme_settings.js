/*
 * ### Менеджер настроек отчетов и динсписков
 *
 * @module scheme_settings
 *
 * Created 19.12.2016
 */

const DataFrame = require('dataframe');

class GridColumn {
  constructor(props) {
    for(const prop in props) {
      if(prop === 'width') {
        if(props.width !== '*') {
          this.width = parseInt(props.width, 10) || 140;
        }
      }
      else if(prop === 'sortable') {
        if(props[prop]) {
          this[prop] = true;
          if(props[prop].direction == 'desc') {
            this.sortDescendingFirst = true;
          }
        }
      }
      else {
        this[prop] = props[prop];
      }
    }
  }

  get _width() {
    return this.width || 200;
  }
}

export default function scheme_settings() {

  const {wsql, utils, cat, enm, dp, md, constructor} = this;
  const {CatManager, DataProcessorsManager, DataProcessorObj, CatObj, DocManager, TabularSectionRow} = constructor.classes || this;

  /**
   * Менеджер настроек отчетов и динсписков
   */
  class SchemeSettingsManager extends CatManager {

    /**
     * Корректирует метаданные
     */
    tune_meta() {
      const path = this._owner.formulas.predefined('components');
      if(path && !path.empty()) {
        const {fields} = this.metadata('fields');
        const choice = {name: 'parent', path}
        fields.formatter.choice_params = [choice];
        fields.editor.choice_params = [choice];
      }
    }

    /**
     * Возвращает промис с подходящими схемами
     * @param class_name
     * @async
     * @return {Array.<CatScheme_settings>}
     */
    find_schemas(class_name, sync) {
      const res = this.find_rows({obj: class_name})
        .sort((a, b) => {
          if(a.user > b.user) {
            return 1;
          }
          if (a.user < b.user) {
            return -1;
          }
          if (a.name.endsWith('main') && !b.name.endsWith('main')) {
            return -1;
          }
          if (b.name.endsWith('main') && !a.name.endsWith('main')) {
            return 1;
          }
          if(a.name > b.name) {
            return 1;
          }
          if (a.name < b.name) {
            return -1;
          }
          return 0;
        });
      return sync ? res : Promise.resolve(res);
    }

    /**
     * Возвращает объект текущих настроек
     * - если не существует ни одной настройки для _class_name_, создаёт элемент справочника _SchemeSettings_
     * - если в localstorage есть настройка для текущего пользователя, возвращает её
     *
     * @param class_name
     */
    get_scheme(class_name, sync) {
      // получаем сохраненную настройку
      const scheme_name = this.scheme_name(class_name);

      const fin_scheme = (data) => {
        // если существует с текущим пользователем, берём его, иначе - первый попавшийся
        if(data.length == 1) {
          return data[0].set_default();
        }
        else if(data.length) {
          const {current_user} = $p;
          if(!current_user || !current_user.name) {
            return data[0].set_default();
          }
          else {
            const {name} = current_user;
            for(const scheme of data) {
              if(scheme.user == name) {
                return scheme.set_default();
              }
            }
            return data[0].set_default();
          }
        }
        else {
          return create_scheme();
        }
      };
      const find_scheme = () => {
        
        if(sync) {
          return fin_scheme(this.find_schemas(class_name, sync));
        }

        return this.find_schemas(class_name)
          .then(fin_scheme)
          .catch((err) => {
            return create_scheme();
          });
      };

      let ref = wsql.get_user_param(scheme_name, 'string');

      function create_scheme() {
        if(!utils.is_guid(ref)) {
          ref = utils.generate_guid();
        }
        cat.scheme_settings.create({ref})
          .then((obj) => obj.fill_default(class_name).save())
          .then((obj) => obj.set_default());
      }

      if(ref) {
        // получаем по гвиду
        if(sync) {
          const scheme = cat.scheme_settings.get(ref);
          if(scheme && !scheme.is_new()) {
            return scheme;
          }
          else {
            return find_scheme();
          }
        }
        return cat.scheme_settings.get(ref, 'promise')
          .then((scheme) => {
            if(scheme && !scheme.is_new()) {
              return scheme;
            }
            else {
              return find_scheme();
            }
          })
          .catch((err) => find_scheme());
      }
      else {
        return find_scheme();
      }
    }

    /**
     * Имя сохраненных настроек
     * @param class_name
     */
    scheme_name(class_name) {
      return 'scheme_settings_' + class_name.replace(/\./g, '_');
    }

  }

  /**
   * Менеджер настроек отчетов и динсписков
   */
  class SchemeSelectManager extends DataProcessorsManager {

    /**
     * Экземпляр обработки для выбора варианта
     * @param scheme
     * @return {_obj, _meta}
     */
    dp(scheme) {

      // экземпляр обработки для выбора варианта
      const _obj = dp.scheme_settings.create();
      _obj.scheme = scheme;

      // корректируем метаданные поля выбора варианта
      const _meta = Object.assign({}, this.metadata('scheme'));
      _meta.choice_params = [{
        name: 'obj',
        path: scheme.obj,
      }];

      return {_obj, _meta};

    }
  }

  /**
   * Обработка выбора варианта настроек scheme_settings
   * @class
   * @extends DataProcessorObj
   */
  class DpScheme_settings extends DataProcessorObj {

    get scheme() {
      return this._getter('scheme');
    }

    set scheme(v) {
      this._setter('scheme', v);
    }
  }

  this.DpScheme_settings = DpScheme_settings;

  /**
   * Справочник _scheme_settings_
   * Настройки отчетов и списков
   * @class
   * @extends CatObj
   */
  class CatScheme_settings extends CatObj {

    constructor(attr, manager, loading) {

      // выполняем конструктор родительского объекта
      super(attr, manager, loading);

      this._search = '';

      // если указан стандартный период - заполняем
      !this.is_new() && this.set_standard_period();

    }

    load() {
      return super.load()
        .then(() => {
          if(!this.is_new()) {
            this.set_standard_period();
          }
          return this;
        })
    }

    save(post, operational, attachments, attr = {}) {
      if(!attr.db) {
        attr.db = this._manager.adapter.db({cachable: 'ram'});
      }
      return super.save(post, operational, attachments, attr);
    }

    set_standard_period(once) {
      const {_data, standard_period} = this;
      if(standard_period.empty() || (once && _data._standard_period_setted)) {
        return;
      }
      const {standard_period: period} = enm;
      const from = utils.moment();
      const till = from.clone();
      switch (standard_period) {
      case period.yesterday:
        this.date_from = from.subtract(1, 'days').startOf('day').toDate();
        this.date_till = till.subtract(1, 'days').endOf('day').toDate();
        break;
      case period.today:
        this.date_from = from.startOf('day').toDate();
        this.date_till = till.endOf('day').toDate();
        break;
      case period.tomorrow:
        this.date_from = from.add(1, 'days').startOf('day').toDate();
        this.date_till = till.add(1, 'days').endOf('day').toDate();
        break;
      case period.last7days:
        this.date_from = from.subtract(7, 'days').startOf('day').toDate();
        this.date_till = till.endOf('day').toDate();
        break;
      case period.lastTendays:
        const nf = from.clone();
        (nf.date() > 10) ? nf.subtract(10, 'days') : nf.subtract(1, 'month').endOf('month');
        const days_of_ten = 10 * Math.floor(nf.date() / 10);
        this.date_from = from.startOf('month').add(days_of_ten, 'days').toDate();
        const ed = from.clone();
        ed.add(9, 'days');
        this.date_till = (ed.month() > nf.month()) ? nf.endOf('month').toDate() : ed.endOf('day').toDate();
        break;
      case period.last30days:
        this.date_from = from.subtract(30, 'days').startOf('day').toDate();
        this.date_till = till.endOf('day').toDate();
        break;
      case period.last3Month:
        this.date_from = from.subtract(2, 'month').startOf('month').toDate();
        this.date_till = till.endOf('month').toDate();
        break;
      case period.last6Month:
        this.date_from = from.subtract(5, 'month').startOf('month').toDate();
        this.date_till = till.endOf('month').toDate();
        break;
      case period.lastWeek:
        this.date_from = from.subtract(1, 'weeks').startOf('week').toDate();
        this.date_till = till.subtract(1, 'weeks').endOf('week').toDate();
        break;
      case period.lastMonth:
        this.date_from = from.subtract(1, 'month').startOf('month').toDate();
        this.date_till = till.subtract(1, 'month').endOf('month').toDate();
        break;
      case period.lastQuarter:
        this.date_from = from.subtract(1, 'quarters').startOf('quarter').toDate();
        this.date_till = till.subtract(1, 'quarters').endOf('quarter').toDate();
        break;
      case period.lastHalfYear:
        this.date_from = (from.quarter() >= 3) ? from.startOf('year').toDate() :
          from.subtract(from.quarter() + 1, 'quarters').startOf('quarter').toDate();
        this.date_till = from.add(180, 'days').endOf('quarter').toDate();
        break;
      case period.lastYear:
        this.date_from = from.subtract(1, 'years').startOf('year').toDate();
        this.date_till = till.subtract(1, 'years').endOf('year').toDate();
        break;
      case period.next7Days:
        this.date_from = from.add(1, 'days').startOf('day').toDate();
        this.date_till = till.add(7, 'days').endOf('day').toDate();
        break;
      case period.nextTendays:
        const dot = 10 * Math.floor(from.date() / 10) + 10;
        const nf2 = from.clone().startOf('month').add(dot, 'days');
        this.date_from = (nf2.month() > from.month()) ? nf2.startOf('month').toDate() : nf2.startOf('day').toDate();
        const ed2 = nf2.clone();
        ed2.add(9, 'days');
        this.date_till = (ed2.month() > nf2.month()) ? nf2.endOf('month').toDate() : ed2.endOf('day').toDate();
        break;
      case period.nextWeek:
        this.date_from = from.add(1, 'weeks').startOf('week').toDate();
        this.date_till = till.add(1, 'weeks').endOf('week').toDate();
        break;
      case period.nextMonth:
        this.date_from = from.add(1, 'months').startOf('month').toDate();
        this.date_till = till.add(1, 'months').endOf('month').toDate();
        break;
      case period.nextQuarter:
        this.date_from = from.add(1, 'quarters').startOf('quarter').toDate();
        this.date_till = till.add(1, 'quarters').endOf('quarter').toDate();
        break;
      case period.nextHalfYear:
        this.date_from = (from.quarter() <= 2) ? from.startOf('year').add(7, 'month').startOf('quarter').toDate() :
          from.add(1, 'year').startOf('year').toDate();
        this.date_till = (till.quarter() <= 2) ? till.startOf('year').add(7, 'month').endOf('year').toDate() :
          till.add(1, 'year').startOf('year').add(5, 'month').endOf('quarter').toDate();
        break;
      case period.nextYear:
        this.date_from = from.add(1, 'years').startOf('year').toDate();
        this.date_till = till.add(1, 'years').endOf('year').toDate();
        break;
      case period.tillEndOfThisYear:
        this.date_from = from.startOf('day').toDate();
        this.date_till = till.endOf('year').toDate();
        break;
      case period.tillEndOfThisQuarter:
        this.date_from = from.startOf('day').toDate();
        this.date_till = till.endOf('quarter').toDate();
        break;
      case period.tillEndOfThisMonth:
        this.date_from = from.startOf('day').toDate();
        this.date_till = till.endOf('month').toDate();
        break;
      case period.tillEndOfThisHalfYear:
        this.date_from = from.startOf('day').toDate();
        this.date_till = (from.quarter() <= 2) ? from.startOf('year').add(5, 'month').endOf('quarter').toDate() : from.endOf('year').toDate();
        break;
      case period.tillEndOfThistendays:
        this.date_from = from.startOf('day').toDate();
        const dot2 = 10 * Math.floor(from.date() / 10) + 9;
        const this_end_days = from.clone().startOf('month').add(dot2, 'days');
        this.date_till = (this_end_days.month() > from.date()) ? from.endOf('month').toDate() : this_end_days.endOf('day').toDate();
        break;
      case period.tillEndOfThisweek:
        this.date_from = from.startOf('day').toDate();
        this.date_till = till.endOf('week').toDate();
        break;
      case period.fromBeginningOfThisYear:
        this.date_from = from.startOf('year').toDate();
        this.date_till = till.endOf('day').toDate();
        break;
      case period.fromBeginningOfThisQuarter:
        this.date_from = from.startOf('quarter').toDate();
        this.date_till = till.endOf('day').toDate();
        break;
      case period.fromBeginningOfThisMonth:
        this.date_from = from.startOf('month').toDate();
        this.date_till = till.endOf('day').toDate();
        break;
      case period.fromBeginningOfThisHalfYear:
        this.date_from = (from.quarter() <= 2) ? from.startOf('year').toDate : from.startOf('year').add(7, 'month').startOf('quarter').toDate();
        this.date_till = till.endOf('day').toDate();
        break;
      case period.fromBeginningOfThisTendays:
        const dot4 = 10 * Math.floor(from.date() / 10);
        this.date_from = from.startOf('month').add(dot4, 'days').toDate();
        this.date_till = till.endOf('day').toDate();
        break;
      case period.fromBeginningOfThisWeek:
        this.date_from = from.startOf('week').toDate();
        this.date_till = till.endOf('day').toDate();
        break;
      case period.thisTenDays:
        const dot5 = 10 * Math.floor(from.date() / 10);
        this.date_from = from.startOf('month').add(dot5, 'days').toDate();
        const dot6 = 10 * Math.floor(from.date() / 10) + 9;
        const this_end_days2 = from.clone().startOf('month').add(dot6, 'days');
        this.date_till = (this_end_days2.month() > from.date()) ? from.endOf('month').toDate() : this_end_days2.endOf('day').toDate();
        break;
      case period.thisWeek:
        this.date_from = from.startOf('week').toDate();
        this.date_till = till.endOf('week').toDate();
        break;
      case period.thisHalfYear:
        this.date_from = (from.quarter() <= 2) ? from.startOf('year').toDate : from.startOf('year').add(7, 'month').startOf('quarter').toDate();
        this.date_till = (from.quarter() <= 2) ? from.startOf('year').add(5, 'month').endOf('quarter').toDate() : from.endOf('year').toDate();
        break;
      case period.thisYear:
        this.date_from = from.startOf('year').toDate();
        this.date_till = till.endOf('year').toDate();
        break;
      case period.thisQuarter:
        this.date_from = from.startOf('quarter').toDate();
        this.date_till = till.endOf('quarter').toDate();
        break;
      case period.thisMonth:
        this.date_from = from.startOf('month').toDate();
        this.date_till = till.endOf('month').toDate();
        break;

      }
      _data._standard_period_setted = true;
    }

    get obj() {
      return this._getter('obj');
    }
    set obj(v) {
      this._setter('obj', v);
    }

    get user() {
      return this._getter('user');
    }
    set user(v) {
      this._setter('user', v);
    }

    get order() {
      return this._getter('order');
    }
    set order(v) {
      this._setter('order', v);
    }

    get formula() {
      return this._getter('formula');
    }
    set formula(v) {
      this._setter('formula', v);
    }

    get query() {
      return this._getter('query');
    }
    set query(v) {
      this._setter('query', v);
    }

    get tag() {
      return this._getter('tag');
    }
    set tag(v) {
      this._setter('tag', v);
    }

    get date_from() {
      return this._getter('date_from');
    }
    set date_from(v) {
      this._setter('date_from', v);
    }

    get date_till() {
      return this._getter('date_till');
    }
    set date_till(v) {
      this._setter('date_till', v);
    }

    get standard_period() {
      return this._getter('standard_period');
    }
    set standard_period(v) {
      this._setter('standard_period', v);
      !this._data._loading && this.set_standard_period();
    }

    get fields() {
      return this._getter_ts('fields');
    }
    set fields(v) {
      this._setter_ts('fields', v);
    }

    get sorting() {
      return this._getter_ts('sorting');
    }
    set sorting(v) {
      this._setter_ts('sorting', v);
    }

    get dimensions() {
      return this._getter_ts('dimensions');
    }
    set dimensions(v) {
      this._setter_ts('dimensions', v);
    }

    get resources() {
      return this._getter_ts('resources');
    }
    set resources(v) {
      this._setter_ts('resources', v);
    }

    get selection() {
      return this._getter_ts('selection');
    }
    set selection(v) {
      this._setter_ts('selection', v);
    }

    get params() {
      return this._getter_ts('params');
    }
    set params(v) {
      this._setter_ts('params', v);
    }

    get composition() {
      return this._getter_ts('composition');
    }
    set composition(v) {
      this._setter_ts('composition', v);
    }

    get conditional_appearance() {
      return this._getter_ts('conditional_appearance');
    }
    set conditional_appearance(v) {
      this._setter_ts('conditional_appearance', v);
    }

    /**
     * Заполняет настройки по метаданным
     *
     * @param class_name {String}
     */
    fill_default(class_name) {

      const {parts, _mgr, _meta} = this.child_meta(class_name);
      const columns = [];

      function add_column(fld, use) {
        const id = fld.id || fld;
        const fld_meta = _meta.fields[id] || _mgr.metadata(id);
        fld_meta && columns.push({
          field: id,
          caption: fld.caption || fld_meta.synonym,
          tooltip: fld_meta.tooltip,
          width: fld.width || fld_meta.width,
          use: use,
        });
      }

      // набираем поля
      if(parts.length < 3) {   // поля динсписка

        if(_meta.form && _meta.form.selection) {

          _meta.form.selection.cols.forEach(fld => {
            add_column(fld, true);
          });

        }
        else {

          if(_mgr instanceof CatManager) {
            if(_meta.code_length) {
              columns.push('id');
            }
            if(_meta.main_presentation_name) {
              columns.push('name');
            }
          }
          else if(_mgr instanceof DocManager) {
            columns.push('number_doc');
            columns.push('date');
          }

          columns.forEach((id) => {
            // id, synonym, tooltip, type, width
            add_column(id, true);
          });
        }

      }
      else { // поля табличной части

        for (let field in _meta.fields) {
          add_column(field, true);
        }
      }

      for (let field in _meta.fields) {
        if(!columns.some(function (column) {
            return column.field == field;
          })) {
          add_column(field, false);
        }
      }

      // заполняем табчасть доступных полей
      columns.forEach((column) => {
        this.fields.add(column);
      });

      // если для объекта определены показатели по умолчанию - используем
      const {resources} = _mgr.obj_constructor('', true).prototype;
      resources && resources.forEach((field) => this.resources.add({field}));

      this.obj = class_name;

      // наименование и период по умолчанию
      if(!this.name) {
        this.name = 'Основная';
        this.date_from = new Date((new Date()).getFullYear().toFixed() + '-01-01');
        this.date_till = utils.date_add_day(new Date(), 1);
      }

      if(!this.user) {
        this.user = $p.current_user.name;
      }

      return this;
    }

    /**
     * Расширенные метаданные по имени класса
     * @param class_name {String}
     * @return {{parts: (Array|*), _mgr: (DataManager|undefined|*), _meta: Object}}
     */
    child_meta(class_name) {
      if(!class_name) {
        class_name = this.obj;
      }
      const parts = class_name.split('.'),
        _mgr = md.mgr_by_class_name(class_name),
        _meta = parts.length < 3 ? _mgr.metadata() : _mgr.metadata(parts[2]);

      // добавляем предопределенные реквизиты
      if(parts.length < 3 && !_meta.fields._deleted) {
        const {fields} = _meta;
        fields._deleted = _mgr.metadata('_deleted');
        // для документов
        if(_mgr instanceof DocManager && !fields.date) {
          fields.posted = _mgr.metadata('posted');
          fields.date = _mgr.metadata('date');
          fields.number_doc = _mgr.metadata('number_doc');
        }
        // для справочникоа
        if(_mgr instanceof CatManager && !fields.name && !fields.id) {
          if(_meta.code_length) {
            fields.id = _mgr.metadata('id');
          }
          if(_meta.has_owners) {
            fields.owner = _mgr.metadata('owner');
          }
          fields.name = _mgr.metadata('name');
        }

      }
      if(parts.length > 2 && !_meta.fields.ref) {
        _meta.fields.ref = _mgr.metadata('ref');
      }
      return {parts, _mgr, _meta};
    }

    /**
     * Устанавливает текущую настройку по умолчанию
     */
    set_default() {
      wsql.set_user_param(this._manager.scheme_name(this.obj), this.ref);
      return this;
    }

    /**
     * Формирует манго селектор
     */
    mango_selector({columns, skip, limit, _owner}) {

      function format(date, end) {
        let d = utils.moment(date);
        if(end) {
          return d.endOf('day').format(moment._masks.iso);
        }
        return d.startOf('day').format(moment._masks.iso);
      }

      const res = {
        selector: {
          $and: [
            {class_name: {$eq: this.obj}}
          ]
        },
        fields: ['_id', 'posted'],
      };

      for (const column of (columns || this.columns())) {
        const fld = column.id || column.key;
        if(fld && !res.fields.includes(fld)) {
          res.fields.push(fld);
        }
      }

      if(this.standard_period.empty()) {
        this._search && res.selector.$and.push({search: {$regex: this._search}});
      }
      else {
        res.selector.$and.push({date: {$gte: format(this.date_from)}});
        res.selector.$and.push({date: {$lte: format(this.date_till, true)}});
        res.selector.$and.push({search: this._search ? {$regex: this._search} : {$gt: null}});
        res.use_index = ['mango', 'search'];
      }

      // пока сортируем только по дате
      this.sorting.find_rows({use: true, field: 'date'}, (row) => {
        let direction = row.direction.valueOf();
        if(!direction || direction == '_') {
          direction = 'asc';
        }
        res.sort = [{class_name: direction}, {date: direction}];
      });

      if(skip) {
        res.skip = skip;
      }

      if(limit) {
        res.limit = limit;
      }

      if(_owner && _owner.props) {
        const {input_by_string, has_owners, hierarchical, group_hierarchy, fields} = this.child_meta();
        if(hierarchical) {
          const _meta = fields && fields[_owner.props._fld];
          if((group_hierarchy && _owner.props._fld === 'parent') || (_meta && _meta.choice_groups_elm === 'grp')) {
            res.selector.$and.push({is_folder: true});
          }
          else if(_meta && _meta.choice_groups_elm === 'elm') {
            res.selector.$and.push({is_folder: false});
          }
        }
      }

      Object.defineProperty(res, '_mango', {value: true});

      return res;
    }

    /**
     * Дополняет селектор по отбору
     * @param selector
     */
    append_selection(selector) {
      if(selector.selector) {
        if(!selector.sort) {
          selector.sort = [];
        }
        this.sorting.find_rows({use: true}, ({field, direction}) => {
          selector.sort.push({[field]: direction.valueOf() || 'asc'});
        });
        selector = selector.selector;
      }
      if(!selector.$and) {
        selector.$and = [];
      }
      this.selection.find_rows({use: true}, ({left_value, left_value_type, right_value, right_value_type, comparison_type}) => {
        if(left_value_type === 'path'){
          if(right_value_type === 'boolean') {
            const val = Boolean(right_value);
            selector.$and.push({[left_value]: comparison_type == 'ne' ? {$ne: val} : val});
          }
          else if(right_value_type === 'calculated') {
            const val = $p.current_user && $p.current_user[right_value];
            selector.$and.push({[left_value]: comparison_type == 'ne' ? {$ne: val} : val});
          }
          else if(right_value_type.includes('.')){
            if((comparison_type == 'filled' || comparison_type == 'nfilled')){
              selector.$and.push({[left_value]: {[comparison_type.valueOf()]: true}});
            }
            else {
              selector.$and.push({[left_value]: {[`$${comparison_type.valueOf()}`]: right_value}});
            }
          }
          else if(right_value_type === 'number' && (comparison_type == 'filled' || comparison_type == 'nfilled')){
            selector.$and.push({[left_value]: {[comparison_type.valueOf()]: 0}});
          }
        }
      });
    }

    /**
     * Фильтрует внешнюю табчасть
     * @param collection {TabularSection}
     * @param parent
     * @param self
     * @return {Array|TabularSection}
     */
    filter(collection, parent = '', self = false) {
      // получаем активный отбор
      const _or = new Map();
      this.selection.find_rows({use: true}, (row) => {
        if(!_or.has(row.area)) {
          _or.set(row.area, []);
        }
        _or.get(row.area).push(row);
      });

      const res = [];
      collection.forEach((row) => {
        
        let ok = true;
        for(const grp of _or.values()) {
          let grp_ok = true;
          for (const crow of grp) {
            grp_ok = crow.check(row);
            if (!grp_ok) {
              break;
            }
          }
          ok = grp_ok;
          if (ok) {
            break;
          }
        }

        if (self) {
          !ok && res.push(row._obj);
        }
        else {
          ok && res.push(row);
        }
      });
      
      if(self){
        const {_obj} = collection;
        res.forEach((row) => {
          _obj.splice(_obj.indexOf(row), 1);
        });
        _obj.forEach((row, index) => row.row = index + 1);
        return collection;
      }
      else{
        return res;
      }
    }

    /**
     * Выполняет группировку записей внешней табчасти
     * помещяет результат в collection._rows
     * @param collection {TabularSection}
     */
    group_by(collection) {

      // grouping -  основные измерения
      const grouping = this.dims();

      // dims - конкатенация явных полей группировки с полями детальных записей
      const dims = this.dims();

      // ress - активные ресурсы - те, что есть в выводимых полях
      const ress = [];
      const resources = this.resources._obj.map(v => v.field);
      const {_manager} = collection._owner;
      const meta = _manager.metadata(collection._name || 'data').fields;
      const _columns = this.rx_columns({_obj: this, _mgr: _manager, mode: 'ts', fields: meta});
      _columns.forEach(({key}) => {
        if(dims.indexOf(key) == -1 && resources.indexOf(key) != -1) {
          ress.push(key);
        }
        else {
          // для базовой группировки, подмешиваем в измерения всё, что не ресурс
          dims.indexOf(key) == -1 && dims.push(key);
        }
      });

      // TODO сейчас поддержана только первая запись иерархии

      // TODO сейчас нет понятия детальных записей - всё сворачивается по измерениям

      // TODO сейчас группировка по набору полей не поддержана - группируем ступенькой по всем измерениям. нужная математика в DataFrame уже есть

      // поля группировки без пустых имён (без сводных итогов)
      const dflds = dims.filter(v => v);
      // поля к разыменованию через точку
      const rflds = dflds.filter(v => v.includes('.')).map(v => v.split('.'));
      // уточним сортировку
      let sortBy = '', sortDir = 'asc';
      this.sorting.find_rows({use: true}, ({field, direction}) => {
        if(sortBy) {
          sortBy += ',';
        }
        if(direction) {
          sortDir = direction.valueOf();
        }
        sortBy += field;
      });
      
      if(grouping.length) {

        // TODO: скомпилировать и подклеить агрегаты из схемы
        const reduce = function(row, memo) {
          for(const resource of ress){
            memo[resource] = (memo[resource] || 0) + row[resource];
          }
          return memo;
        };

        // если в измерениях есть точка - разыменовываем
        const rows = rflds.length ?  collection._obj.map(v => {
          const res = Object.assign(v);
          for(const [...flds] of rflds) {
            let tmp = v._row[flds[0]];
            for(let i = 1; i<flds.length; i++) {
              tmp = tmp[flds[i]];
            }
            res[flds.join('.')] = tmp;
          }
          return res;
        }) : collection._obj;

        const df = DataFrame({
          dimensions: dflds.map(v => ({value: v, title: v})),
          rows,
          reduce
        });

        
        
        const res = df.calculate({dimensions: dflds, sortBy, sortDir});

        // TODO в группировке может потребоваться разыменовать поля

        // TODO итоги надо считать не по всем русурсам

        // TODO итоги надо считать с учетом формулы

        // const sql = `select ${dflds}${ress.length ? ', ' : ' '}${
        //   ress.map(res => `sum(${res}) as ${res}`).join(', ')} INTO CSV("my.csv", {headers:true}) from ? ${dflds ? 'group by ROLLUP(' + dflds + ')' : ''}`;
        //
        // // TODO еще, в alasql есть ROLLUP, CUBE и GROUPING SETS - сейчас используем ROLLUP
        // const res = $p.wsql.alasql(sql, [collection._obj]);

        // складываем результат в иерархическую структуру
        const stack = []; // здесь храним родительские строки
        const col0 = _columns[0];
        const {is_data_obj, is_data_mgr, moment} = $p.utils;
        let prevLevel;    // предыдущий уровень группировки
        let index = 0;    // счетчик количества строк + id строки результирующего набора
        
        const cast_field = function (row, gdim, force) {

          const mgr = _manager.value_mgr(row, gdim, CatScheme_settings.cast_type(meta, gdim));
          const val = is_data_mgr(mgr) ? mgr.get(row[gdim]) : row[gdim];

          if(_columns.some(v => v.key === gdim)){
            row[gdim] = val;
          }
          else if(force){
            row[col0.key] = _manager.value_mgr(row, col0.key, CatScheme_settings.cast_type(meta, col0.key)) ?
              is_data_obj(val) ? val : {presentation: val instanceof Date ? moment(val).format(moment._masks[meta[gdim].type.date_part]) : val }
              :
              is_data_obj(val) ? val.toString() : val;
          }
        };

        const totals = !grouping[0];
        if(totals){
          grouping.splice(0, 1);
          const row = {
            row: (index++).toString(),
            children: [],
          };
          collection._rows.push(row);
          stack.push(row);
          row[col0.key] = col0._meta.type.is_ref ? {presentation: 'Σ'} : 'Σ';
        }
        else{
          stack.push({children: collection._rows});
        }

        for(const row of res) {

          // варианты:
          // - это подуровень группировки: добавляем к родителю, добавляем в stack, level растёт
          // - это очередная строка того же уровня: добавляем к родителю, level без изменений
          // - это следующее значение родителя: меняем в стеке, level без изменений
          // - этот уровень не нужен в результирующем наборе - пропускаем
          const level = stack.length - 1;
          const parent = stack[level];
          if(!prevLevel) {
            prevLevel = level;
          }

          // по числу не-null в измерениях, определяем уровень
          let lvl = row._level + 1;

          // если такой уровень не нужен - пропускаем
          if(lvl > grouping.length && lvl < dflds.length) {
            prevLevel = lvl;
            continue;
          }

          row.row = (index++).toString();

          if(lvl > level && lvl < dflds.length){
            parent.children.push(row);
            row.children = [];
            stack.push(row);
            cast_field(row, grouping[stack.length - 2], true);
          }
          else if(lvl < prevLevel) {
            stack.pop();
            stack[stack.length - 1].children.push(row);
            row.children = [];
            stack.push(row);
            cast_field(row, grouping[stack.length - 2], true);
          }
          else {
            parent.children.push(row);
            for(const gdim of dflds){
              cast_field(row, gdim);
            }
          }

          prevLevel = lvl;
        }

        collection._rows._count = index;

        if(totals){
          const row = collection._rows[0];
          row.children.reduce((memo, row) => reduce(row, memo), row);
        }

      }
      else {
        // или заполняем без группировки
        collection.group_by(dims, ress);
        for(const row of collection) {
          // если в измерениях есть точка - разыменовываем
          for(const [...flds] of rflds) {
            let tmp = row[flds[0]];
            for(let i = 1; i<flds.length; i++) {
              tmp = tmp[flds[i]];
            }
            row[flds.join('.')] = tmp;
          }
          collection._rows.push(row);
        }
        collection._rows._count = collection._rows.length;

        if(sortBy) {
          sortBy = sortBy.split(',');
          const fv = (v) => {
            return  sortBy.map((f) => {
              const tmp = v[f];
              return tmp ? tmp.valueOf() : '';
            })
              .join('');
          }
          collection._rows.sort((a, b) => {
            const va = fv(a), vb = fv(b);
            if(va > vb) {
              return sortDir === 'desc' ? -1 : 1;
            }
            if(vb > va) {
              return sortDir === 'desc' ? 1 : -1;
            }
            return 0;
          });
        }
      }

    }

    /**
     * Возвращает тип по метаданным поля с разыменованием через точку
     * @param meta {Object}
     * @param fld {String}
     * @returns {Object}
     */
    static cast_type(meta, fld) {
      if(meta[fld]) {
        return meta[fld].type;
      }
      const dims = fld.split('.');
      if(dims.length > 1 && meta[dims[0]]) {
        const {type} = meta[dims[0]];
        if(type.is_ref) {
          meta = md.get(type.types[0]);
          if(meta) {
            return CatScheme_settings.cast_type(meta.fields, dims.splice(1).join('.'));
          }
        }
      }
      return {types: ['string'], str_len: 100};
    }

    /**
     * Возвращает массив колонок для динсписка или табчасти
     * @param mode {String} - режим формирования колонок
     * @return {Array}
     */
    columns(mode) {

      const parts = this.obj.split('.'),
        _mgr = md.mgr_by_class_name(this.obj),
        _meta = parts.length < 3 ? _mgr.metadata() : _mgr.metadata(parts[2]),
        res = [];

      this.fields.find_rows({use: true}, (row) => {

        const fld_meta = _meta.fields[row.field] || _mgr.metadata(row.field);
        const column = new GridColumn(mode === 'ts' || mode === 'tabular' ?
          {
            key: row.field,
            name: row.caption,
            resizable: true,
            ctrl_type: row.ctrl_type,
            width: row.width,
            sortable: mode === 'tabular' || this.sorting.find({field: row.field}),
          }
          :
          {
            id: row.field,
            synonym: row.caption,
            tooltip: row.tooltip,
            type: fld_meta?.type || CatScheme_settings.cast_type(_meta.fields, row.field),
            ctrl_type: row.ctrl_type,
            width: row.width == '*' ? 250 : row.width,
          });
        if(!row.formatter.empty()) {
          column.formatter = row.formatter.execute();
        }
        if(!row.editor.empty()) {
          column.editor = row.editor.execute();
        }

        res.push(column);
      });
      return res;
    }

    /**
     * Фильтрует табчасть компоновки
     * не путать с фильтром внешних данных
     * @param collection
     * @param parent
     * @return {Array}
     */
    used(collection, parent) {
      const res = [];
      collection.find_rows({use: true}, ({field}) => res.push(field));
      return res;
    }

    /**
     * Возвращает массив измерений группировки
     * @param [parent] - родитель, для многоуровневой группировки
     * @return {Array}
     */
    dims(parent) {
      const res = [];
      for (const dims of this.used(this.dimensions, parent)) {
        for (const key of dims.split(',').map(v => v.trim())) {
          res.indexOf(key) == -1 && res.push(key);
        }
      }
      return res;
    }

    /**
     * Возвращает массив имён используемых колонок
     * @param [parent] - родитель, для многоуровневой группировки
     * @return {Array}
     */
    used_fields(parent) {
      return this.used(this.fields, parent);
    }

    /**
     * Возвращает массив элементов для поля выбора
     * @return {Array}
     */
    used_fields_list() {
      return this.fields._obj.map(({field, caption}) => ({
        id: field,
        value: field,
        text: caption,
        title: caption,
      }));
    }

    first_sorting(sortColumn, sortDirection) {
      let row;
      if(sortColumn) {
        this.sorting.forEach((srow) => {
          srow.use = false;
          if(srow.field === sortColumn) {
            row = srow;
          }
        });
        if(row && sortDirection.toLowerCase() !== 'none') {
          row.use = true;
          row.direction = sortDirection.toLowerCase();
        }
      }
      else {
        this.sorting.find_rows({use: true}, (srow) => {
          row = srow;
          return false;
        });
        return row ? {sortColumn: row.field, sortDirection: row.direction.valueOf().toUpperCase()} : {};
      }
    }

    /**
     * Возвращает или устанавливает режим источника данных
     * @param key {string} - ключ формы
     * @param {('ram'|'couchdb'|'pg'|'custom')} mode - имя режима
     * @return {string}
     */
    source_mode(key, mode) {
      if(mode) {
        if(wsql.get_user_param(key) !== mode) {
          wsql.set_user_param(key, mode);
        }
      }
      else {
        // если значение задано для ключа - его и используем
        mode = wsql.get_user_param(key);
        if(!mode) {
          const _mgr = md.mgr_by_class_name(this.obj);
          // если умолчание задано в менеджере класса, используем его
          if(_mgr && _mgr.source_mode) {
            mode = _mgr.source_mode;
          }
          // если класс живёт в ram, используем ram_indexer
          else if(_mgr && /ram$/.test(_mgr.cachable) || _mgr.direct_load) {
            mode = 'ram';
          }
          else {
            // для обычных документов используем couchdb
            mode = 'couchdb';
          }
        }
      }
      return mode;
    }
  }

  this.CatScheme_settings = CatScheme_settings;

  this.CatScheme_settingsDimensionsRow = class CatScheme_settingsDimensionsRow extends TabularSectionRow {

    get parent() {return this._getter('parent');}
    set parent(v) {this._setter('parent', v);}

    get use() {return this._getter('use');}
    set use(v) {this._setter('use', v);}

    get field() {return this._getter('field');}
    set field(v) {this._setter('field', v);}
  };

  this.CatScheme_settingsResourcesRow = class CatScheme_settingsResourcesRow extends this.CatScheme_settingsDimensionsRow {

    get use() {return true;}
    set use(v) {}

    get formula() {return this._getter('formula');}
    set formula(v) {this._setter('formula', v);}
  };

  this.CatScheme_settingsFieldsRow = class CatScheme_settingsFieldsRow extends this.CatScheme_settingsDimensionsRow {

    get width() {return this._getter('width');}
    set width(v) {this._setter('width', v);}

    get caption() {return this._getter('caption');}
    set caption(v) {this._setter('caption', v);}

    get tooltip() {return this._getter('tooltip');}
    set tooltip(v) {this._setter('tooltip', v);}

    get ctrl_type() {return this._getter('ctrl_type');}
    set ctrl_type(v) {this._setter('ctrl_type', v);}

    get formatter() {return this._getter('formatter');}
    set formatter(v) {this._setter('formatter', v);}

    get editor() {return this._getter('editor');}
    set editor(v) {this._setter('editor', v);}

  };

  this.CatScheme_settingsSortingRow = class CatScheme_settingsSortingRow extends this.CatScheme_settingsDimensionsRow {
    get direction() {return this._getter('direction');}
    set direction(v) {this._setter('direction', v);}
  };

  this.CatScheme_settingsSelectionRow = class CatScheme_settingsSelectionRow extends TabularSectionRow {

    get parent() {return this._getter('parent');}
    set parent(v) {this._setter('parent', v);}

    get use() {return this._getter('use');}
    set use(v) {this._setter('use', v);}

    get area() {return this._getter('area');}
    set area(v) {this._setter('area', v);}

    get left_value() {return this._getter('left_value');}
    set left_value(v) {this._setter('left_value', v);}

    get left_value_type() {return this._getter('left_value_type');}
    set left_value_type(v) {this._setter('left_value_type', v);}

    get comparison_type() {return this._getter('comparison_type');}
    set comparison_type(v) {this._setter('comparison_type', v);}

    get right_value() {return this._getter('right_value');}
    set right_value(v) {this._setter('right_value', v);}

    get right_value_type() {return this._getter('right_value_type');}
    set right_value_type(v) {this._setter('right_value_type', v);}

    check(row, formatter, key) {
      const {comparison_types: ct} = enm;
      let {left_value, left_value_type, right_value, right_value_type, comparison_type} = this;
      // получаем значение слева
      if(left_value_type === 'path'){
        const format = formatter && left_value === key;
        const path = left_value.split('.');
        left_value = row[path[0]];
        for(let i = 1; i < path.length; i++){
          left_value = left_value?.[path[i]];
        }
        if(format) {
          left_value = formatter({value: left_value, row, raw: true});
        }
      }
      else if(left_value_type && left_value_type !== 'string'){
        const mgr = md.mgr_by_class_name(left_value_type);
        left_value = mgr ? mgr.get(left_value) : utils.fetch_type(left_value, {types: [left_value_type]});
      }
      // получаем значение справа
      if(right_value_type === 'path'){
        const path = right_value.split('.');
        right_value = row[path[0]];
        for(let i = 1; i < path.length; i++){
          right_value = right_value?.[path[i]];
        }
      }
      else if(right_value_type && right_value_type !== 'string'){
        const mgr = md.mgr_by_class_name(right_value_type);
        if([ct.in, ct.inh, ct.nin, ct.ninh].includes(comparison_type)) {
          right_value = right_value
            .split(',')
            .map((ref) => mgr ? mgr.get(ref) : utils.fetch_type(ref, {types: [right_value_type]}));
        }
        else {
          right_value = mgr ? mgr.get(right_value) : utils.fetch_type(right_value, {types: [right_value_type]});
        }
      }
      return utils.check_compare(left_value, right_value, comparison_type, ct);
    }

  };

  this.CatScheme_settingsParamsRow = class CatScheme_settingsParamsRow extends TabularSectionRow {
    get param() {return this._getter('param');}
    set param(v) {this._setter('param', v);}

    get value() {return this._getter('value');}
    set value(v) {this._setter('value', v);}

    get value_type() {return this._getter('value_type');}
    set value_type(v) {this._setter('value_type', v);}

    get quick_access() {return this._getter('quick_access');}
    set quick_access(v) {this._setter('quick_access', v);}

    get output() {return this._getter('output');}
    set output(v) {this._setter('output', v);}
  };

  this.CatScheme_settingsCompositionRow = class CatScheme_settingsCompositionRow extends this.CatScheme_settingsDimensionsRow {

    get kind() {return this._getter('kind');}
    set kind(v) {this._setter('kind', v);}

    get definition() {return this._getter('definition');}
    set definition(v) {this._setter('definition', v);}

  };

  this.CatScheme_settingsConditional_appearanceRow = class CatScheme_settingsConditional_appearanceRow extends this.CatScheme_settingsSelectionRow {

    get columns() {return this._getter('columns');}
    set columns(v) {this._setter('columns', v);}

    get css() {return this._getter('css');}
    set css(v) {this._setter('css', v);}

  }

  cat.create('scheme_settings', SchemeSettingsManager);
  dp.create('scheme_settings', SchemeSelectManager);

};
