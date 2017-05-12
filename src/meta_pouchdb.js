/**
 * Дополняет классы {{#crossLink "DataObj"}}{{/crossLink}} и {{#crossLink "DataManager"}}{{/crossLink}} методами чтения,<br />
 * записи и синхронизации с базами PouchDB
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module  metadata
 * @submodule meta_pouchdb
 * @requires common
 */



DataManager.prototype.__define({

	/**
	 * Загружает объекты из PouchDB по массиву ссылок
	 */
	pouch_load_array: {
		value: function (refs, with_attachments) {

			var options = {
				limit : refs.length + 1,
				include_docs: true,
				keys: refs.map(function (v) {
					return this.class_name + "|" + v;
				}.bind(this))
			};
			if(with_attachments){
				options.attachments = true;
				options.binary = true;
			}

			return this.pouch_db.allDocs(options)
				.then(function (result) {
					return $p.wsql.pouch.load_changes(result, {});
				})
		}
	},

	/**
	 * Загружает объекты из PouchDB, обрезанные по view
	 */
	pouch_load_view: {
		value: function (_view) {

			var t = this, doc, res = [],
				options = {
					limit : 1000,
					include_docs: true,
					startkey: t.class_name + "|",
					endkey: t.class_name + '|\uffff'
				};

			return new Promise(function(resolve, reject){

				function process_docs(err, result) {

					if (result) {

						if (result.rows.length){

							options.startkey = result.rows[result.rows.length - 1].key;
							options.skip = 1;

							result.rows.forEach(function (rev) {
								doc = rev.doc;
								key = doc._id.split("|");
								doc.ref = key[1];
								// наполняем
								res.push(doc);
							});

							t.load_array(res);
							res.length = 0;

							t.pouch_db.query(_view, options, process_docs);

						}else{
							resolve();
						}

					} else if(err){
						reject(err);
					}
				}

				t.pouch_db.query(_view, options, process_docs);

			});
		}
	},

	/**
	 * Возвращает базу PouchDB, связанную с объектами данного менеджера
	 * @property pouch_db
	 * @for DataManager
	 */
	pouch_db: {
		get: function () {
		  const cachable = this.cachable.replace("_ram", "");
			if(cachable.indexOf("remote") != -1)
				return $p.wsql.pouch.remote[cachable.replace("_remote", "")];
			else
				return $p.wsql.pouch.local[cachable] || $p.wsql.pouch.remote[cachable];
		}
	},

	/**
	 * ### Найти строки
	 * Возвращает массив дата-объектов, обрезанный отбором _selection_<br />
	 * Eсли отбор пустой, возвращаются все строки из PouchDB.
	 *
	 * @method pouch_find_rows
	 * @for DataManager
	 * @param selection {Object|function} - в ключах имена полей, в значениях значения фильтра или объект {like: "значение"} или {not: значение}
	 * @param [selection._top] {Number}
	 * @param [selection._skip] {Number}
	 * @param [selection._raw] {Boolean} - если _истина_, возвращаются сырые данные, а не дата-объекты
	 * @param [selection._total_count] {Boolean} - если _истина_, вычисляет общее число записей под фильтром, без учета _skip и _top
	 * @return {Promise.<Array>}
	 */
	pouch_find_rows: {
		value: function (selection) {

			var t = this, doc, res = [],
				_raw, _view, _total_count, top, calc_count,
				top_count = 0, skip = 0, skip_count = 0,
				options = {
					limit : 100,
					include_docs: true,
					startkey: t.class_name + "|",
					endkey: t.class_name + '|\uffff'
				};

			if(selection){

				if(selection._top){
					top = selection._top;
					delete selection._top;
				}else
					top = 300;

				if(selection._raw) {
					_raw = selection._raw;
					delete selection._raw;
				}

				if(selection._total_count) {
					_total_count = selection._total_count;
					delete selection._total_count;
				}

				if(selection._view) {
					_view = selection._view;
					delete selection._view;
				}

				if(selection._key) {

					if(selection._key._order_by == "des"){
						options.startkey = selection._key.endkey || selection._key + '\uffff';
						options.endkey = selection._key.startkey || selection._key;
						options.descending = true;
					}else{
						options.startkey = selection._key.startkey || selection._key;
						options.endkey = selection._key.endkey || selection._key + '\uffff';
					}
				}

				if(typeof selection._skip == "number") {
					skip = selection._skip;
					delete selection._skip;
				}

				if(selection._attachments) {
					options.attachments = true;
					options.binary = true;
					delete selection._attachments;
				}

			}

			// если сказано посчитать все строки...
			if(_total_count){

				calc_count = true;
				_total_count = 0;

				// если нет фильтра по строке или фильтр растворён в ключе
				if(Object.keys(selection).length <= 1){

					// если фильтр в ключе, получаем все строки без документов
					if(selection._key && selection._key.hasOwnProperty("_search")){
						options.include_docs = false;
						options.limit = 100000;

						return t.pouch_db.query(_view, options)
							.then(function (result) {

								result.rows.forEach(function (row) {

									// фильтруем
									if(!selection._key._search || row.key[row.key.length-1].toLowerCase().indexOf(selection._key._search) != -1){

										_total_count++;

										// пропукскаем лишние (skip) элементы
										if(skip) {
											skip_count++;
											if (skip_count < skip)
												return;
										}

										// ограничиваем кол-во возвращаемых элементов
										if(top) {
											top_count++;
											if (top_count > top)
												return;
										}

										res.push(row.id);
									}
								});

								delete options.startkey;
								delete options.endkey;
								if(options.descending)
									delete options.descending;
								options.keys = res;
								options.include_docs = true;

								return t.pouch_db.allDocs(options);

							})
							.then(function (result) {
								return {
									rows: result.rows.map(function (row) {

										var doc = row.doc;

										doc.ref = doc._id.split("|")[1];

										if(!_raw){
											delete doc._id;
											delete doc._rev;
										}

										return doc;
									}),
									_total_count: _total_count
								};
							})
					}

				}

			}

			// бежим по всем документам из ram
			return new Promise(function(resolve, reject){

				function process_docs(err, result) {

					if (result) {

						if (result.rows.length){

							options.startkey = result.rows[result.rows.length - 1].key;
							options.skip = 1;

							result.rows.forEach(function (rev) {
								doc = rev.doc;

								key = doc._id.split("|");
								doc.ref = key[1];

								if(!_raw){
									delete doc._id;
									delete doc._rev;
								}

								// фильтруем
								if(!$p._selection.call(t, doc, selection))
									return;

								if(calc_count)
									_total_count++;

								// пропукскаем лишние (skip) элементы
								if(skip) {
									skip_count++;
									if (skip_count < skip)
										return;
								}

								// ограничиваем кол-во возвращаемых элементов
								if(top) {
									top_count++;
									if (top_count > top)
										return;
								}

								// наполняем
								res.push(doc);
							});

							if(top && top_count > top && !calc_count) {
								resolve(_raw ? res : t.load_array(res));

							}else
								fetch_next_page();

						}else{
							if(calc_count){
								resolve({
									rows: _raw ? res : t.load_array(res),
									_total_count: _total_count
								});
							}else
								resolve(_raw ? res : t.load_array(res));
						}

					} else if(err){
						reject(err);
					}
				}

				function fetch_next_page() {

					if(_view){
            t.pouch_db.query(_view, options, process_docs);
          }
					else{
            t.pouch_db.allDocs(options, process_docs);
          }
				}

				fetch_next_page();

			});

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

			var t = this,
				cmd = attr.metadata || t.metadata(),
				flds = ["ref", "_deleted"], // поля запроса
				selection = {
					_raw: true,
					_total_count: true,
					_top: attr.count || 30,
					_skip: attr.start || 0
				},   // условие см. find_rows()
				ares = [], o, mf, fldsyn;

			// набираем поля
			if(cmd.form && cmd.form.selection){
				cmd.form.selection.fields.forEach(function (fld) {
					flds.push(fld);
				});

			}else if(t instanceof DocManager){
				flds.push("posted");
				flds.push("date");
				flds.push("number_doc");

			}else if(t instanceof TaskManager){
				flds.push("name as presentation");
				flds.push("date");
				flds.push("number_doc");
				flds.push("completed");

			}else if(t instanceof BusinessProcessManager){
				flds.push("date");
				flds.push("number_doc");
				flds.push("started");
				flds.push("finished");

			}else{

				if(cmd["hierarchical"] && cmd["group_hierarchy"])
					flds.push("is_folder");
				else
					flds.push("0 as is_folder");

				if(cmd["main_presentation_name"])
					flds.push("name as presentation");
				else{
					if(cmd["code_length"])
						flds.push("id as presentation");
					else
						flds.push("'...' as presentation");
				}

				if(cmd["has_owners"])
					flds.push("owner");

				if(cmd["code_length"])
					flds.push("id");

			}

			// набираем условие
			// фильтр по дате
			if(_md.get(t.class_name, "date") && (attr.date_from || attr.date_till)){

				if(!attr.date_from)
					attr.date_from = new Date("2015-01-01");
				if(!attr.date_till)
					attr.date_till = $p.utils.date_add_day(new Date(), 1);

				selection.date = {between: [attr.date_from, attr.date_till]};

			}

			// фильтр по родителю
			if(cmd["hierarchical"] && attr.parent)
				selection.parent = attr.parent;

			// добавляем условия из attr.selection
			if(attr.selection){
				if(Array.isArray(attr.selection)){
					attr.selection.forEach(function (asel) {
						for(fldsyn in asel)
							if(fldsyn[0] != "_" || fldsyn == "_view" || fldsyn == "_key")
								selection[fldsyn] = asel[fldsyn];
					});
				}else
					for(fldsyn in attr.selection)
						if(fldsyn[0] != "_" || fldsyn == "_view" || fldsyn == "_key")
							selection[fldsyn] = attr.selection[fldsyn];
			}

			// прибиваем фильтр по дате, если он встроен в ключ
			if(selection._key && selection._key._drop_date && selection.date) {
				delete selection.date;
			}

			// строковый фильтр по полям поиска, если он не описан в ключе
			if(attr.filter && (!selection._key || !selection._key._search)) {
				if(cmd.input_by_string.length == 1)
					selection[cmd.input_by_string] = {like: attr.filter};
				else{
					selection.or = [];
					cmd.input_by_string.forEach(function (ifld) {
						var flt = {};
						flt[ifld] = {like: attr.filter};
						selection.or.push(flt);
					});
				}
			}

			// обратная сортировка по ключу, если есть признак сортировки в ключе и 'des' в атрибутах
			if(selection._key && selection._key._order_by){
				selection._key._order_by = attr.direction;
			}

			// фильтр по владельцу
			//if(cmd["has_owners"] && attr.owner)
			//	selection.owner = attr.owner;

			return t.pouch_find_rows(selection)
				.then(function (rows) {

					if(rows.hasOwnProperty("_total_count") && rows.hasOwnProperty("rows")){
						attr._total_count = rows._total_count;
						rows = rows.rows
					}

					rows.forEach(function (doc) {

						// наполняем
						o = {};
						flds.forEach(function (fld) {

							if(fld == "ref") {
								o[fld] = doc[fld];
								return;
							}else if(fld.indexOf(" as ") != -1){
								fldsyn = fld.split(" as ")[1];
								fld = fld.split(" as ")[0].split(".");
								fld = fld[fld.length-1];
							}else
								fldsyn = fld;

							mf = _md.get(t.class_name, fld);
							if(mf){

								if(mf.type.date_part)
									o[fldsyn] = $p.moment(doc[fld]).format($p.moment._masks[mf.type.date_part]);

								else if(mf.type.is_ref){
									if(!doc[fld] || doc[fld] == $p.utils.blank.guid)
										o[fldsyn] = "";
									else{
										var mgr	= _md.value_mgr(o, fld, mf.type, false, doc[fld]);
										if(mgr)
											o[fldsyn] = mgr.get(doc[fld]).presentation;
										else
											o[fldsyn] = "";
									}
								}else if(typeof doc[fld] === "number" && mf.type.fraction_figits)
									o[fldsyn] = doc[fld].toFixed(mf.type.fraction_figits);

								else
									o[fldsyn] = doc[fld];
							}
						});
						ares.push(o);
					});

					return $p.iface.data_to_grid.call(t, ares, attr);
				})
				.catch($p.record_log);

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

			return this.pouch_find_rows({
				is_folder: true,
				_raw: true,
				_top: attr.count || 300,
				_skip: attr.start || 0
			})
				.then(function (rows) {
					rows.sort(function (a, b) {
						if (a.parent == $p.utils.blank.guid && b.parent != $p.utils.blank.guid)
							return -1;
						if (b.parent == $p.utils.blank.guid && a.parent != $p.utils.blank.guid)
							return 1;
						if (a.name < b.name)
							return -1;
						if (a.name > b.name)
							return 1;
						return 0;
					});
					return rows.map(function (row) {
						return {
							ref: row.ref,
							parent: row.parent,
							presentation: row.name
						}
					});
				})
				.then($p.iface.data_to_tree);
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

			if(!type)
				type = {type: "text/plain"};

			if(!(attachment instanceof Blob) && type.indexOf("text") == -1)
				attachment = new Blob([attachment], {type: type});

			// получаем ревизию документа
			var _rev,
				db = this.pouch_db;
			ref = this.class_name + "|" + $p.utils.fix_guid(ref);

			return db.get(ref)
				.then(function (res) {
					if(res)
						_rev = res._rev;
				})
				.catch(function (err) {
					if(err.status != 404)
						throw err;
				})
				.then(function () {
					return db.putAttachment(ref, att_id, _rev, attachment, type);
				});

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

			return this.pouch_db.getAttachment(this.class_name + "|" + $p.utils.fix_guid(ref), att_id);

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

			// получаем ревизию документа
			var _rev,
				db = this.pouch_db;
			ref = this.class_name + "|" + $p.utils.fix_guid(ref);

			return db.get(ref)
				.then(function (res) {
					if(res)
						_rev = res._rev;
				})
				.catch(function (err) {
					if(err.status != 404)
						throw err;
				})
				.then(function () {
					return db.removeAttachment(ref, att_id, _rev);
				});
		}
	}

});

DataObj.prototype.__define({

	/**
	 * Устанавливает новый номер документа или код справочника
	 */
	new_number_doc: {

		value: function (prefix) {

			if(!this._metadata.code_length)
				return;

			// если не указан явно, рассчитываем префикс по умолчанию
			if(!prefix)
				prefix = (($p.current_acl && $p.current_acl.prefix) || "") +
					(this.organization && this.organization.prefix ? this.organization.prefix : ($p.wsql.get_user_param("zone") + "-"));

			var obj = this,
				part = "",
				year = (this.date instanceof Date) ? this.date.getFullYear() : 0,
				code_length = this._metadata.code_length - prefix.length;

			// для кешируемых в озу, вычисляем без индекса
			if(this._manager.cachable == "ram")
				return Promise.resolve(this.new_cat_id(prefix));

			return obj._manager.pouch_db.query("doc/number_doc",
				{
					limit : 1,
					include_docs: false,
					startkey: [obj.class_name, year, prefix + '\uffff'],
					endkey: [obj.class_name, year, prefix],
					descending: true
				})
				.then(function (res) {
					if(res.rows.length){
						var num0 = res.rows[0].key[2];
						for(var i = num0.length-1; i>0; i--){
							if(isNaN(parseInt(num0[i])))
								break;
							part = num0[i] + part;
						}
						part = (parseInt(part || 0) + 1).toFixed(0);
					}else{
						part = "1";
					}
					while (part.length < code_length)
						part = "0" + part;

					if(obj instanceof DocObj || obj instanceof TaskObj || obj instanceof BusinessProcessObj)
						obj.number_doc = prefix + part;
					else
						obj.id = prefix + part;

					return obj;

				});
		}
	},

	new_cat_id: {

		value: function (prefix) {

			if(!prefix)
				prefix = (($p.current_acl && $p.current_acl.prefix) || "") +
					(this.organization && this.organization.prefix ? this.organization.prefix : ($p.wsql.get_user_param("zone") + "-"));

			var code_length = this._metadata.code_length - prefix.length,
				field = (this instanceof DocObj || this instanceof TaskObj || this instanceof BusinessProcessObj) ? "number_doc" : "id",
				part = "",
				res = $p.wsql.alasql("select top 1 " + field + " as id from ? where " + field + " like '" + prefix + "%' order by " + field + " desc", [this._manager.alatable]);

			if(res.length){
				var num0 = res[0].id || "";
				for(var i = num0.length-1; i>0; i--){
					if(isNaN(parseInt(num0[i])))
						break;
					part = num0[i] + part;
				}
				part = (parseInt(part || 0) + 1).toFixed(0);
			}else{
				part = "1";
			}
			while (part.length < code_length)
				part = "0" + part;

			this[field] = prefix + part;

			return this;
		}
	}
});
