export default (constructor) => {

	const {DataManager, DataObj, DocObj, TaskObj, BusinessProcessObj} = constructor.classes;

	// методы в прототип DataObj
	Object.defineProperties(DataObj.prototype, {

		/**
		 * Устанавливает новый номер документа или код справочника
		 */
		new_number_doc: {

			value: function (prefix) {

				if (!this._metadata().code_length) {
					return Promise.resolve(this);
				}

				// если не указан явно, рассчитываем префикс по умолчанию
				const {date, organization, _manager} = this;
				const {current_user} = _manager._owner.$p;

				if (!prefix) {
					prefix = ((current_user && current_user.prefix) || '') + ((organization && organization.prefix) || '');
				}

				let obj = this,
					part = '',
					year = (date instanceof Date) ? date.getFullYear() : 0,
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
						if (res.rows.length) {
							const num0 = res.rows[0].key[2];
							for (var i = num0.length - 1; i > 0; i--) {
								if (isNaN(parseInt(num0[i])))
									break;
								part = num0[i] + part;
							}
							part = (parseInt(part || 0) + 1).toFixed(0);
						} else {
							part = '1';
						}
						while (part.length < code_length)
							part = '0' + part;

						if (obj instanceof DocObj || obj instanceof TaskObj || obj instanceof BusinessProcessObj)
							obj.number_doc = prefix + part;
						else
							obj.id = prefix + part;

						return obj;

					});
			},
		},

		new_cat_id: {

			value: function (prefix) {

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
					for (var i = num0.length - 1; i > 0; i--) {
						if (isNaN(parseInt(num0[i])))
							break;
						part = num0[i] + part;
					}
					part = (parseInt(part || 0) + 1).toFixed(0);
				} else {
					part = '1';
				}
				while (part.length < code_length)
					part = '0' + part;

				this[field] = prefix + part;

				return this;
			},
		},
	});

	// методы в прототип DataManager
	Object.defineProperties(DataManager.prototype, {

		/**
		 * Возвращает базу PouchDB, связанную с объектами данного менеджера
		 * @property pouch_db
		 * @for DataManager
		 */
		pouch_db: {
			get: function () {
				const cachable = this.cachable.replace("_ram", "");
				const {pouch} = this._owner.$p.adapters;
				if(cachable.indexOf("remote") != -1)
					return pouch.remote[cachable.replace("_remote", "")];
				else
					return pouch.local[cachable] || pouch.remote[cachable];
			}
		},

	})

}
