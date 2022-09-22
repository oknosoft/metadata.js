/**
 * Переопределяет методы менеджеров данных
 *
 * @module proto
 *
 */

import RamIndexer from './ram_indexer'

export default ({classes}) => {

	const {DataManager, DataObj, DocObj, TaskObj, BusinessProcessObj} = classes;

	// RamIndexer в classes
  classes.RamIndexer = RamIndexer;

	// методы в прототип DataObj
  DataObj.prototype.new_number_doc = function new_number_doc(prefix) {
    if (!this._metadata().code_length) {
      return Promise.resolve(this);
    }

    const {organization, manager, responsible, _manager} = this;
    const {utils} = _manager._owner.$p;

    if(this.date === utils.blank.date) {
      this.date = new Date();
    }
    const year = (this.date instanceof Date) ? this.date.getFullYear() : 0

    let current_user;
    if(responsible && !responsible.empty()) {
      current_user = responsible;
    }
    else if(manager && !manager.empty()) {
      current_user = manager;
    }
    else {
      current_user = _manager._owner.$p.current_user;
    }

    // если не указан явно, рассчитываем префикс по умолчанию
    if (!prefix) {
      prefix = ((current_user && current_user.prefix) || '') + ((organization && organization.prefix) || '');
    }

    let part = '',
      code_length = this._metadata().code_length - prefix.length;

    // для кешируемых в озу, вычисляем без индекса
    if (_manager.cachable == 'ram') {
      return Promise.resolve(this.new_cat_id(prefix));
    }

    return _manager.pouch_db.query('doc/number_doc',
      {
        limit: 1,
        include_docs: false,
        startkey: [_manager.class_name, year, prefix + '\ufff0'],
        endkey: [_manager.class_name, year, prefix],
        descending: true,
      })
      .then((res) => {
        if(res.rows.length) {
          const num0 = res.rows[0].key[2];
          for (let i = num0.length - 1; i >= prefix.length; i--) {
            if(isNaN(parseInt(num0[i]))) {
              break;
            }
            part = num0[i] + part;
          }
          part = (parseInt(part || 0) + 1).toFixed(0);
        }
        else {
          part = '1';
        }
        while (part.length < code_length) {
          part = '0' + part;
        }

        if (this instanceof DocObj || this instanceof TaskObj || this instanceof BusinessProcessObj){
          this.number_doc = prefix + part;
        }
        else{
          this.id = prefix + part;
        }
        return this;
      });
  };

  DataObj.prototype.new_cat_id = function new_cat_id(prefix) {
    const {organization, _manager} = this;
    const {current_user, wsql} = _manager._owner.$p;

    if (!prefix)
      prefix = ((current_user && current_user.prefix) || '') +
        (organization && organization.prefix ? organization.prefix : (wsql.get_user_param('zone') + '-'));

    let code_length = this._metadata().code_length - prefix.length,
      field = (this instanceof DocObj || this instanceof TaskObj || this instanceof BusinessProcessObj) ? 'number_doc' : 'id',
      part = '',
      res = wsql.alasql('select top 1 ' + field + ' as id from ? where ' + field + ' like "' + prefix + '%" order by ' + field + ' desc', [_manager.alatable]);

    if (res.length) {
      const num0 = res[0].id || '';
      for (let i = num0.length - 1; i > 0; i--) {
        if (isNaN(parseInt(num0[i])))
          break;
        part = num0[i] + part;
      }
      part = (parseInt(part || 0) + 1).toFixed(0);
    } else {
      part = '1';
    }
    while (part.length < code_length){
      part = '0' + part;
    }
    this[field] = prefix + part;
    return this;
  };

	// методы в прототип DataManager
	Object.defineProperties(DataManager.prototype, {

		/**
		 * Возвращает базу PouchDB, связанную с объектами данного менеджера
		 * @property pouch_db
		 * @for DataManager
		 */
		pouch_db: {
      get () {
        const cachable = this.cachable.replace('_ram', '').replace('_doc', '');
        const {adapter} = this;
        if(cachable.indexOf('remote') != -1) {
          return adapter.remote[cachable.replace('_remote', '')];
        }
        else {
          return adapter.local[cachable] || adapter.remote[cachable];
        }
      }
    },

	})

}
