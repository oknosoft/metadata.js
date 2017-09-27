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

        const {organization, _manager} = this;
        const {current_user, utils} = _manager._owner.$p;

        if(this.date === utils.blank.date) {
          this.date = new Date();
        }
        const year = (this.date instanceof Date) ? this.date.getFullYear() : 0

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
						if (res.rows.length) {
							const num0 = res.rows[0].key[2];
							for (let i = num0.length - 1; i > 0; i--) {
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

						if (this instanceof DocObj || this instanceof TaskObj || this instanceof BusinessProcessObj)
              this.number_doc = prefix + part;
						else
              this.id = prefix + part;

						return this;

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
					for (let i = num0.length - 1; i > 0; i--) {
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

		pouch_find_rows: {
			value: function (selection) {
				return this.adapter.find_rows(this, selection);
			}
		},

		pouch_load_view: {
			value: function (view) {
				return this.adapter.load_view(this, view);
			}
		},

		pouch_load_array: {
			value: function (refs, with_attachments) {
				return this.adapter.load_array(this, refs, with_attachments);
			}
		},

		/**
		 * ### Возвращает набор данных для динсписка
		 *
		 * @method pouch_selection
		 * @for DataManager
		 * @param attr
		 * @return {Promise.<Array>}
		 */
		pouch_selection: {
			value: function (attr) {
				return this.adapter.get_selection(this, attr);
			}
		},

		/**
		 * ### Возвращает набор данных для дерева динсписка
		 *
		 * @method pouch_tree
		 * @for DataManager
		 * @param attr
		 * @return {Promise.<Array>}
		 */
		pouch_tree: {
			value: function (attr) {
				return this.adapter.get_tree(this, attr);
			}
		},

		/**
		 * ### Сохраняет присоединенный файл
		 *
		 * @method save_attachment
		 * @for DataManager
		 * @param ref
		 * @param att_id
		 * @param attachment
		 * @param type
		 * @return {Promise}
		 * @async
		 */
		save_attachment: {
			value: function (ref, att_id, attachment, type) {
				return this.adapter.save_attachment(this, att_id, attachment, type);
			}
		},

		/**
		 * Получает присоединенный к объекту файл
		 * @param ref
		 * @param att_id
		 * @return {Promise}
		 */
		get_attachment: {
			value: function (ref, att_id) {
				return this.adapter.get_attachment(this, ref, att_id);
			}
		},

		/**
		 * Удаляет присоединенный к объекту файл
		 * @param ref
		 * @param att_id
		 * @return {Promise}
		 */
		delete_attachment: {
			value: function (ref, att_id) {
				return this.adapter.delete_attachment(this, ref, att_id);
			}
		}

	})

}
