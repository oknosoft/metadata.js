/**
 * Дополняет классы {{#crossLink "DataObj"}}{{/crossLink}} и {{#crossLink "DataManager"}}{{/crossLink}} методами чтения,<br />
 * записи и синхронизации с базами PouchDB
 *
 * &copy; http://www.oknosoft.ru 2014-2016
 * @author  Evgeniy Malyarov
 *
 * @module  metadata
 * @submodule meta_pouchdb
 * @requires common
 */



DataManager.prototype.__define({

	pouch_load_array: {
		value: function (refs) {

			return this.pouch_db.allDocs({
					limit : refs.length + 1,
					include_docs: true,
					keys: refs.map(function (v) {
						return this.class_name + "|" + v;
					}.bind(this))
				})
				.then(function (result) {
					return $p.wsql.pouch.load_changes(result, {});
				})
		}
	},

	/**
	 * Возвращает базу PouchDB, связанную с объектами данного менеджера
	 */
	pouch_db: {
		get: function () {
			return $p.wsql.pouch.local[this.cachable] || $p.wsql.pouch.remote[this.cachable];
		}
	},

	/**
	 * ### Найти строки
	 * Возвращает массив дата-объектов, обрезанный отбором _selection_<br />
	 * Eсли отбор пустой, возвращаются все строки из PouchDB.
	 * Имеет смысл для объектов, у которых _cachable = "ram"_
	 * @param selection {Object|function} - в ключах имена полей, в значениях значения фильтра или объект {like: "значение"} или {not: значение}
	 * @param [selection._top] {Number}
	 * @param [selection._skip] {Number}
	 * @param [selection._raw] {Boolean} - если _истина_, возвращаются сырые данные, а не дата-объекты
	 * @return {Promise.<Array>}
	 */
	pouch_find_rows: {
		value: function (selection) {

			var t = this, doc, res = [],
				_raw,
				top, top_count = 0,
				skip = 0, skip_count = 0,
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

				if(typeof selection._skip == "number") {
					skip = selection._skip;
					delete selection._skip;
				}
			}


			// бежим по всем документам из ram
			return new Promise(function(resolve, reject){

				function fetchNextPage() {

					t.pouch_db.allDocs(options, function (err, result) {

						if (result) {

							if (result.rows.length){

								options.startkey = result.rows[result.rows.length - 1].key;
								options.skip = 1;

								result.rows.forEach(function (rev) {
									doc = rev.doc;

									key = doc._id.split("|");
									doc.ref = key[1];

									// фильтруем
									if(!$p._selection.call(t, doc, selection))
										return;

									// пропукскаем лишние (skip) элементы
									if(skip) {
										skip_count++;
										if (skip_count < skip)
											return;
									}

									// ограничиваем кол-во возвращаемых элементов
									if(top) {
										top_count++;
										if (top_count >= top)
											return;
									}

									// наполняем
									res.push(doc);
								});

								if(top && top_count >= top) {
									resolve(_raw ? res : t.load_array(res));
								}else
									fetchNextPage();

							}else{
								resolve(_raw ? res : t.load_array(res));
							}

						} else if(err){
							reject(err);
						}

					});
				}

				fetchNextPage();

			});


		}
	},

	/**
	 * Возвращает набор данных для динсписка
	 * @param attr
	 * @return {Promise.<Array>}
	 */
	pouch_selection: {
		value: function (attr) {

			var t = this,
				cmd = t.metadata(),
				flds = ["ref", "_deleted"], // поля запроса
				selection = {
					_raw: true,
					_top: attr.count || 30,
					_skip: attr.start || 0
				},   // условие см. find_rows()
				ares = [], o, mf, fldsyn;

			// TODO: реализовать top и skip

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
					attr.date_till = $p.date_add_day(new Date(), 1);

				selection.date = {between: [attr.date_from, attr.date_till]};
			}
			// строковый фильтр по полям поиска
			if(attr.filter){
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
			// фильтр по родителю
			if(cmd["hierarchical"] && attr.parent)
				selection.parent = attr.parent;

			// добавляем условия из attr.selection
			if(attr.selection){
				if(Array.isArray(attr.selection)){
					attr.selection.forEach(function (asel) {
						for(fldsyn in asel)
							if(fldsyn[0] != "_")
								selection[fldsyn] = asel[fldsyn];
					});
				}else
					for(fldsyn in attr.selection)
						if(fldsyn[0] != "_")
							selection[fldsyn] = attr.selection[fldsyn];
			}
			// фильтр по владельцу
			//if(cmd["has_owners"] && attr.owner)
			//	selection.owner = attr.owner;

			return t.pouch_find_rows(selection)
				.then(function (rows) {

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
									o[fldsyn] = $p.dateFormat(doc[fld], $p.dateFormat.masks[mf.type.date_part]);

								else if(mf.type.is_ref){
									if(!doc[fld] || doc[fld] == $p.blank.guid)
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
	 * Сохраняет присоединенный файл
	 * @param ref
	 * @param att_id
	 * @param attachment
	 * @param type
	 * @return {Promise}
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
			ref = this.class_name + "|" + $p.fix_guid(ref);

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

			return this.pouch_db.getAttachment(this.class_name + "|" + $p.fix_guid(ref), att_id);

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
			ref = this.class_name + "|" + $p.fix_guid(ref);

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
