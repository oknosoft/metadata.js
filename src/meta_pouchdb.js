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

DataManager.prototype.pouch_selection = function (attr) {

	var t = this,
		cmd = t.metadata(),
		flds = ["ref", "_deleted"], // поля запроса
		selection = [],             // условие см. find_rows()
		ares = [], doc, key, o, mf;

	// выполняет фильтрацию по дате
	function between(obj){
		return true;
	}

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
	if(_md.get(t.class_name, "date") && (attr.date_from || attr.date_till)){

		if(!attr.date_from)
			attr.date_from = new Date("2015-01-01");
		if(!attr.date_till)
			attr.date_till = $p.date_add_day(new Date(), 1);

		selection.push(between);
	}

	if(cmd["hierarchical"] && attr.parent){
		selection.push({parent: attr.parent});
	}

	if(cmd["has_owners"] && attr.owner){
		selection.push({owner: attr.owner});
	}

	// строковый фильтр по полям поиска
	if(attr.filter){
		// selection.push({filter: attr.filter});
	}

	return $p.wsql.pouch.local.doc.allDocs({
		limit : 100,
		//skip: 0,
		include_docs: true,
		startkey: t.class_name,
		endkey: t.class_name + '\uffff'
	})
		.then(function (result) {
			// handle result
			result.rows.forEach(function (rev) {
				doc = rev.doc;

				// фильтруем
				key = doc._id.split("|");
				doc.ref = key[1];

				// наполняем
				o = {};
				flds.forEach(function (fld) {

					var fldsyn;

					if(fld == "ref") {
						o[fld] = doc[fld];
						return;
					}else if(fld.indexOf(" as ") != -1){
						fldsyn = fld.split(" as ")[1];
						fld = fld.split(" as ")[0].split(".");
						fld = fld[fld.length-1];
					};

					mf = _md.get(t.class_name, fld);
					if(mf){

						if(mf.type.date_part)
							o[fld] = $p.dateFormat(doc[fld], $p.dateFormat.masks[mf.type.date_part]);

						else if(mf.type.is_ref){
							if(!doc[fld] || doc[fld] == $p.blank.guid)
								o[fld] = "";
							else{
								var mgr	= _md.value_mgr(o, fld, mf.type, false, doc[fld]);
								if(mgr)
									o[fld] = mgr.get(doc[fld]).presentation;
								else
									o[fld] = "";
							}
						}else
							o[fld] = doc[fld];
					}
				});
				ares.push(o);
			});

			return $p.iface.data_to_grid.call(t, ares, attr);

		})
		.catch($p.record_log);

};
