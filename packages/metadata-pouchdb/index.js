/*!
 metadata-pouchdb v2.0.16-beta.48, built:2018-02-05
 © 2014-2018 Evgeniy Malyarov and the Oknosoft team http://www.oknosoft.ru
 metadata.js may be freely distributed under the MIT
 To obtain commercial license and technical support, contact info@oknosoft.ru
 */


'use strict';

var proto = (constructor) => {
	const {DataManager, DataObj, DocObj, TaskObj, BusinessProcessObj} = constructor.classes;
	Object.defineProperties(DataObj.prototype, {
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
        const year = (this.date instanceof Date) ? this.date.getFullYear() : 0;
				if (!prefix) {
					prefix = ((current_user && current_user.prefix) || '') + ((organization && organization.prefix) || '');
				}
				let part = '',
					code_length = this._metadata().code_length - prefix.length;
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
							for (let i = num0.length - 1; i > prefix.length; i--) {
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
						if (this instanceof DocObj || this instanceof TaskObj || this instanceof BusinessProcessObj){
              this.number_doc = prefix + part;
            }
						else{
              this.id = prefix + part;
            }
						return this;
					});
			}
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
				while (part.length < code_length){
          part = '0' + part;
        }
				this[field] = prefix + part;
				return this;
			}
		},
	});
	Object.defineProperties(DataManager.prototype, {
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
	});
}

let PouchDB;
if(typeof process !== 'undefined' && process.versions && process.versions.node) {
  PouchDB = require('pouchdb-core')
    .plugin(require('pouchdb-adapter-http'))
    .plugin(require('pouchdb-replication'))
    .plugin(require('pouchdb-mapreduce'))
    .plugin(require('pouchdb-find'))
    .plugin(require('pouchdb-adapter-memory'));
}
else {
  if(window.PouchDB) {
    PouchDB = window.PouchDB;
  }
  else {
    const ua = (typeof navigator !== 'undefined' && navigator.userAgent) ? navigator.userAgent.toLowerCase() : '';
    PouchDB = window.PouchDB = require('pouchdb-core').default
      .plugin(require('pouchdb-adapter-http').default)
      .plugin(require('pouchdb-replication').default)
      .plugin(require('pouchdb-mapreduce').default)
      .plugin(require('pouchdb-find').default)
      .plugin(ua.match('safari') && !ua.match('chrome') ? require('pouchdb-adapter-websql').default : require('pouchdb-adapter-idb').default);
  }
}
var PouchDB$1 = PouchDB;

function adapter({AbstracrAdapter}) {
  const fieldsToDelete = '_id,_rev,search,timestamp'.split(',');
  return class AdapterPouch extends AbstracrAdapter {
    constructor($p) {
      super($p);
      this.props = {
        _data_loaded: false,
        _doc_ram_loading: false,
        _doc_ram_loaded: false,
        _auth: null,
        _suffix: '',
        _user: '',
        _push_only: false,
      };
      this.local = {_loading: false, sync: {}};
      this.remote = {};
    }
    init(wsql, job_prm) {
      const {props, local, remote, $p: {md}} = this;
      Object.assign(props, {
        path: wsql.get_user_param('couch_path', 'string') || job_prm.couch_path || '',
        zone: wsql.get_user_param('zone', 'number'),
        prefix: job_prm.local_storage_prefix,
        direct: job_prm.hasOwnProperty('couch_direct') ? job_prm.couch_direct : wsql.get_user_param('couch_direct', 'boolean'),
        user_node: job_prm.user_node,
        noreplicate: job_prm.noreplicate,
      });
      if(props.path && props.path.indexOf('http') != 0 && typeof location != 'undefined') {
        props.path = location.protocol + '//' + location.host + props.path;
      }
      if(job_prm.use_meta === false) {
        props.use_meta = false;
      }
      const opts = {auto_compaction: true, revs_limit: 3};
      const bases = md.bases();
      if(props.use_meta !== false) {
        local.meta = new PouchDB$1(props.prefix + 'meta', opts);
        if(props.path) {
          remote.meta = new PouchDB$1(props.path + 'meta', {skip_setup: true});
          setTimeout(() => this.run_sync('meta'));
        }
      }
      for (const name of ['ram', 'doc', 'user']) {
        if(bases.indexOf(name) != -1) {
          if(props.user_node || (props.direct && name != 'ram')) {
            Object.defineProperty(local, name, {
              get: function () {
                return remote[name];
              }
            });
          }
          else {
            local[name] = new PouchDB$1(props.prefix + props.zone + '_' + name, opts);
          }
        }
      }
      this.after_init( props.user_node ? bases : ['ram']);
    }
    after_init(bases) {
      const {props, remote, $p: {md}} = this;
      const opts = {skip_setup: true, adapter: 'http'};
      if(props.user_node) {
        opts.auth = props.user_node;
      }
      (bases || md.bases()).forEach((name) => {
        if(remote[name] || name == 'e1cib' || name == 'pgsql' || name == 'github') {
          return;
        }
        remote[name] = new PouchDB$1(this.dbpath(name), opts);
      });
    }
    after_log_in() {
      const {props, local, remote, $p: {md}} = this;
      const try_auth = [];
      md.bases().forEach((dbid) => {
        if(dbid !== 'meta' && local[dbid] && remote[dbid] && local[dbid] != remote[dbid]) {
          if(props.noreplicate && props.noreplicate.indexOf(dbid) != -1) {
            return;
          }
          try_auth.push(this.run_sync(dbid));
        }
      });
      return Promise.all(try_auth)
        .then(() => {
          if(local._loading) {
            return new Promise((resolve, reject) => {
              this.once('pouch_data_loaded', resolve);
            });
          }
          else if(!props.user_node) {
            return this.call_data_loaded();
          }
        });
    }
    log_in(username, password) {
      const {props, local, remote, $p: {job_prm, wsql, aes, md, cat}} = this;
      if(username == undefined && password == undefined) {
        if(job_prm.guests && job_prm.guests.length) {
          username = job_prm.guests[0].username;
          password = aes.Ctr.decrypt(job_prm.guests[0].password);
        }
        else {
          const err = new Error('empty login or password');
          this.emit('user_log_fault', err);
          return Promise.reject(err);
        }
      }
      else if(!username || !password){
        const err = new Error('empty login or password');
        this.emit('user_log_fault', err);
        return Promise.reject(err);
      }
      if(props._auth) {
        if(props._auth.username == username) {
          return Promise.resolve();
        }
        else {
          const err = new Error('need logout first');
          this.emit('user_log_fault', err);
          return Promise.reject(err);
        }
      }
      const bases = md.bases();
      let try_auth = props.user_node ? Promise.resolve() : remote.ram.login(username, password)
        .then(({roles}) => {
          const suffix = /^suffix:/;
          const ref = /^ref:/;
          roles.forEach((role) => {
            if(suffix.test(role)) {
              props._suffix = role.substr(7);
            }
            else if(ref.test(role)) {
              props._user = role.substr(4);
            }
            else if(role === 'direct' && !props.direct) {
              props.direct = true;
              wsql.set_user_param('couch_direct', true);
            }
            else if(role === 'push_only' && !props._push_only) {
              props._push_only = true;
            }
          });
          if(props._push_only && props.direct) {
            props.direct = false;
            wsql.set_user_param('couch_direct', false);
          }
          if(props._suffix) {
            while (props._suffix.length < 4) {
              props._suffix = '0' + props._suffix;
            }
          }
          this.after_init(bases);
        });
      if(!props.user_node) {
        bases.forEach((dbid) => {
          if(dbid !== 'meta' && dbid !== 'ram' && remote[dbid]) {
            try_auth = try_auth
              .then(() => remote[dbid].login(username, password))
              .then(() => remote[dbid].info());
          }
        });
      }
      return try_auth.then(() => {
          props._auth = {username};
          if(wsql.get_user_param('user_name') != username) {
            wsql.set_user_param('user_name', username);
          }
          if(wsql.get_user_param('enable_save_pwd')) {
            if(aes.Ctr.decrypt(wsql.get_user_param('user_pwd')) != password) {
              wsql.set_user_param('user_pwd', aes.Ctr.encrypt(password));
            }
          }
          else if(wsql.get_user_param('user_pwd') != '') {
            wsql.set_user_param('user_pwd', '');
          }
          this.emit_async('user_log_in', username);
          props._data_loaded && !props._doc_ram_loading && !props._doc_ram_loaded && this.load_doc_ram();
          return this.after_log_in();
        })
        .catch(err => {
          this.emit('user_log_fault', err);
        });
    }
    log_out() {
      const {props, local, remote, authorized, $p: {md}} = this;
      if(authorized) {
        for (const name in local.sync) {
          if(name != 'meta') {
            try {
              local.sync[name].cancel();
              doc.removeAllListeners();
            }
            catch (err) {
            }
          }
        }
        props._auth = null;
      }
      return Promise.all(md.bases().map((id) => id != 'meta' && remote[id] && remote[id].logout && remote[id].logout()))
        .then(() => this.emit('user_log_out'));
    }
    load_data() {
      const {local, $p: {job_prm}} = this;
      const options = {
        limit: 800,
        include_docs: true,
      };
      const _page = {
        total_rows: 0,
        limit: options.limit,
        page: 0,
        start: Date.now(),
      };
      return new Promise((resolve, reject) => {
        const fetchNextPage = () => {
          local.ram.allDocs(options, (err, response) => {
            if(response) {
              _page.page++;
              _page.total_rows = response.total_rows;
              _page.duration = Date.now() - _page.start;
              this.emit('pouch_data_page', Object.assign({}, _page));
              if(this.load_changes(response, options)) {
                fetchNextPage();
              }
              else {
                this.call_data_loaded(_page);
                resolve();
              }
            }
            else if(err) {
              reject(err);
              this.emit('pouch_data_error', 'ram', err);
            }
          });
        };
        local.ram.info().then((info) => {
          if(info.doc_count >= (job_prm.pouch_ram_doc_count || 10)) {
            this.emit('pouch_load_start', Object.assign(_page, {local_rows: info.doc_count}));
            local._loading = true;
            fetchNextPage();
          }
          else {
            this.emit('pouch_no_data', info);
            resolve();
          }
        });
      });
    }
    dbpath(name) {
      const {props: {path, zone, _suffix}} = this;
      if(name == 'meta') {
        return path + 'meta';
      }
      else if(name == 'ram') {
        return path + zone + '_ram';
      }
      else {
        return path + zone + '_' + name + (_suffix ? '_' + _suffix : '');
      }
    }
    db(_mgr) {
      const dbid = _mgr.cachable.replace('_remote', '').replace('_ram', '');
      const {props, local, remote} = this;
      if(dbid.indexOf('remote') != -1 || (props.noreplicate && props.noreplicate.indexOf(dbid) != -1)) {
        return remote[dbid.replace('_remote', '')];
      }
      else {
        return local[dbid] || remote[dbid];
      }
    }
    run_sync(id) {
      const {local, remote, $p: {wsql, job_prm, record_log}, props: {_push_only, _user}} = this;
      const db_local = local[id];
      const db_remote = remote[id];
      let linfo, _page;
      return db_local.info()
        .then((info) => {
          linfo = info;
          return db_remote.info();
        })
        .then((rinfo) => {
          if(id == 'ram') {
            return db_remote.get('data_version')
              .then((v) => {
                if(v.version != wsql.get_user_param('couch_ram_data_version')) {
                  if(wsql.get_user_param('couch_ram_data_version')) {
                    rinfo = this.reset_local_data();
                  }
                  wsql.set_user_param('couch_ram_data_version', v.version);
                }
                return rinfo;
              })
              .catch(record_log)
              .then(() => rinfo);
          }
          return rinfo;
        })
        .then((rinfo) => {
          if(!rinfo) {
            return;
          }
          if(id == 'ram' && linfo.doc_count < (job_prm.pouch_ram_doc_count || 10)) {
            _page = {
              total_rows: rinfo.doc_count,
              local_rows: linfo.doc_count,
              docs_written: 0,
              limit: 300,
              page: 0,
              start: Date.now(),
            };
            this.emit('pouch_load_start', _page);
          }
          return new Promise((resolve, reject) => {
            const options = {
              batch_size: 200,
              batches_limit: 6,
              retry: true,
            };
            if(job_prm.pouch_filter && job_prm.pouch_filter[id]) {
              options.filter = job_prm.pouch_filter[id];
            }
            else if(id == 'meta') {
              options.filter = 'auth/meta';
            }
            const sync_events = (sync, options) => {
              sync.on('change', (change) => {
                if(id == 'ram') {
                  this.load_changes(change);
                  if(linfo.doc_count < (job_prm.pouch_ram_doc_count || 10)) {
                    _page.page++;
                    _page.docs_written = change.docs_written;
                    _page.duration = Date.now() - _page.start;
                    this.emit('pouch_data_page', Object.assign({}, _page));
                  }
                }
                else {
                  change.update_only = true;
                  this.load_changes(change);
                }
                this.emit('pouch_sync_data', id, change);
              })
                .on('denied', (info) => {
                  this.emit('pouch_sync_denied', id, info);
                })
                .on('error', (err) => {
                  this.emit('pouch_sync_error', id, err);
                })
                .on('complete', (info) => {
                  sync.cancel();
                  sync.removeAllListeners();
                  if(options) {
                    options.live = true;
                    if(id == 'ram' || id == 'meta' || wsql.get_user_param('zone') == job_prm.zone_demo) {
                      local.sync[id] = sync_events(db_local.replicate.from(db_remote, options));
                    }
                    else if(_push_only) {
                      if(options.filter) {
                        delete options.filter;
                        delete options.query_params;
                      }
                      local.sync[id] = sync_events(db_local.replicate.to(db_remote, options));
                    }
                    else {
                      local.sync[id] = sync_events(db_local.sync(db_remote, options));
                    }
                    resolve(id);
                  }
                });
              if(id == 'ram') {
                sync
                  .on('paused', (info) => this.emit('pouch_sync_paused', id, info))
                  .on('active', (info) => this.emit('pouch_sync_resumed', id, info));
              }
              return sync;
            };
            if(_push_only && !options.filter && id !== 'ram' && id !== 'meta') {
              options.filter = 'auth/push_only';
              options.query_params = {user: _user};
            }
            sync_events(db_local.replicate.from(db_remote, options), options);
          });
        });
    }
    call_data_loaded(page) {
      const {local, props} = this;
      if(!props._data_loaded) {
        props._data_loaded = true;
        if(!page) {
          page = local.sync._page || {};
        }
        Promise.resolve().then(() => {
          this.emit(page.note = 'pouch_data_loaded', page);
          this.authorized && this.load_doc_ram();
        });
      }
    }
    reset_local_data() {
      const {local, remote} = this;
      const do_reload = () => {
        setTimeout(() => typeof location != 'undefined' && location.reload(true), 1000);
      };
      return this.log_out()
        .then(() => remote.ram != local.ram && local.ram.destroy())
        .then(() => remote.doc != local.doc && local.doc.destroy())
        .then(do_reload)
        .catch(do_reload);
    }
    load_obj(tObj) {
      const db = this.db(tObj._manager);
      return db.get(tObj._manager.class_name + '|' + tObj.ref)
        .then((res) => {
          for(const fld of fieldsToDelete) {
            delete res[fld];
          }
          tObj._data._loading = true;
          tObj._mixin(res);
        })
        .catch((err) => {
          if(err.status != 404) {
            throw err;
          }
          else {
            this.$p.record_log(db.name + ':' + tObj._manager.class_name + '|' + tObj.ref);
          }
        })
        .then((res) => {
          return tObj;
        });
    }
    save_obj(tObj, attr) {
      const {_manager, _obj, _data, ref, class_name} = tObj;
      if(!_data || (_data._saving && !_data._modified)) {
        return Promise.resolve(tObj);
      }
      if(_data._saving && _data._modified) {
        return new Promise((resolve, reject) => {
          setTimeout(() => resolve(this.save_obj(tObj, attr)), 100);
        });
      }
      _data._saving = true;
      const db = this.db(_manager);
      const tmp = Object.assign({_id: class_name + '|' + ref, class_name}, _obj);
      const {utils, wsql} = this.$p;
      if(utils.is_doc_obj(tObj) || _manager.build_search) {
        if(_manager.build_search) {
          _manager.build_search(tmp, tObj);
        }
        else {
          tmp.search = ((_obj.number_doc || '') + (_obj.note ? ' ' + _obj.note : '')).toLowerCase();
        }
      }
      tmp.timestamp = {
        user: this.authorized || wsql.get_user_param('user_name'),
        moment: utils.moment().format("YYYY-MM-DDTHH:mm:ss ZZ"),
      };
      delete tmp.ref;
      if(attr.attachments) {
        tmp._attachments = attr.attachments;
      }
      return new Promise((resolve, reject) => {
        const getter = tObj.is_new() ? Promise.resolve() : db.get(tmp._id);
        getter.then((res) => {
          if(res) {
            tmp._rev = res._rev;
            for (let att in res._attachments) {
              if(!tmp._attachments) {
                tmp._attachments = {};
              }
              if(!tmp._attachments[att]) {
                tmp._attachments[att] = res._attachments[att];
              }
            }
          }
        })
          .catch((err) => err && err.status != 404 && reject(err))
          .then(() => db.put(tmp))
          .then(() => {
            tObj.is_new() && tObj._set_loaded(tObj.ref);
            if(tmp._attachments) {
              if(!tObj._attachments) {
                tObj._attachments = {};
              }
              for (var att in tmp._attachments) {
                if(!tObj._attachments[att] || !tmp._attachments[att].stub) {
                  tObj._attachments[att] = tmp._attachments[att];
                }
              }
            }
            _data._saving = false;
            resolve(tObj);
          })
          .catch((err) => {
            _data._saving = false;
            err && err.status != 404 && reject(err);
          });
      });
    }
    get_tree(_mgr, attr) {
      return this.find_rows(_mgr, {
        is_folder: true,
        _raw: true,
        _top: attr.count || 300,
        _skip: attr.start || 0
      })
        .then((rows) => {
          rows.sort((a, b) => {
            const {guid} = this.$p.utils.blank;
            if(a.parent == guid && b.parent != guid) {
              return -1;
            }
            if(b.parent == guid && a.parent != guid) {
              return 1;
            }
            if(a.name < b.name) {
              return -1;
            }
            if(a.name > b.name) {
              return 1;
            }
            return 0;
          });
          return rows.map((row) => ({
            ref: row.ref,
            parent: row.parent,
            presentation: row.name
          }));
        })
        .then((ares) => this.$p.iface.data_to_tree.call(_mgr, ares, attr));
    }
    get_selection(_mgr, attr) {
      const {utils, classes} = this.$p;
      const db = this.db(_mgr);
      const cmd = attr.metadata || _mgr.metadata();
      const flds = ['ref', '_deleted'];
      const selection = {
        _raw: true,
        _total_count: true,
        _top: attr.count || 30,
        _skip: attr.start || 0,
      };
      const ares = [];
      if(cmd.form && cmd.form.selection) {
        cmd.form.selection.fields.forEach((fld) => flds.push(fld));
      }
      else if(_mgr instanceof classes.DocManager) {
        flds.push('posted');
        flds.push('date');
        flds.push('number_doc');
      }
      else if(_mgr instanceof classes.TaskManager) {
        flds.push('name as presentation');
        flds.push('date');
        flds.push('number_doc');
        flds.push('completed');
      }
      else if(_mgr instanceof classes.BusinessProcessManager) {
        flds.push('date');
        flds.push('number_doc');
        flds.push('started');
        flds.push('finished');
      }
      else {
        if(cmd.hierarchical && cmd.group_hierarchy) {
          flds.push('is_folder');
        }
        else {
          flds.push('0 as is_folder');
        }
        if(cmd.main_presentation_name) {
          flds.push('name as presentation');
        }
        else {
          if(cmd.code_length) {
            flds.push('id as presentation');
          }
          else {
            flds.push('... as presentation');
          }
        }
        if(cmd.has_owners) {
          flds.push('owner');
        }
        if(cmd.code_length) {
          flds.push('id');
        }
      }
      if(_mgr.metadata('date') && (attr.date_from || attr.date_till)) {
        if(!attr.date_from) {
          attr.date_from = new Date('2017-01-01');
        }
        if(!attr.date_till) {
          attr.date_till = $p.utils.date_add_day(new Date(), 1);
        }
        selection.date = {between: [attr.date_from, attr.date_till]};
      }
      if(cmd.hierarchical && attr.parent) {
        selection.parent = attr.parent;
      }
      if(attr.selection) {
        if(Array.isArray(attr.selection)) {
          attr.selection.forEach((asel) => {
            for (const fld in asel) {
              if(fld[0] != '_' || fld == '_view' || fld == '_key') {
                selection[fld] = asel[fld];
              }
            }
          });
        }
        else {
          for (const fld in attr.selection) {
            if(fld[0] != '_' || fld == '_view' || fld == '_key') {
              selection[fld] = attr.selection[fld];
            }
          }
        }
      }
      if(selection._key && selection._key._drop_date && selection.date) {
        delete selection.date;
      }
      if(attr.filter && (!selection._key || !selection._key._search)) {
        if(cmd.input_by_string.length == 1) {
          selection[cmd.input_by_string] = {like: attr.filter};
        }
        else {
          selection.or = [];
          cmd.input_by_string.forEach((ifld) => {
            const flt = {};
            flt[ifld] = {like: attr.filter};
            selection.or.push(flt);
          });
        }
      }
      if(selection._key && selection._key._order_by) {
        selection._key._order_by = attr.direction;
      }
      return this.find_rows(_mgr, selection)
        .then((rows) => {
          if(rows.hasOwnProperty('_total_count') && rows.hasOwnProperty('rows')) {
            attr._total_count = rows._total_count;
            rows = rows.rows;
          }
          rows.forEach((doc) => {
            const o = {};
            flds.forEach((fld) => {
              let fldsyn;
              if(fld == 'ref') {
                o[fld] = doc[fld];
                return;
              }
              else if(fld.indexOf(' as ') != -1) {
                fldsyn = fld.split(' as ')[1];
                fld = fld.split(' as ')[0].split('.');
                fld = fld[fld.length - 1];
              }
              else {
                fldsyn = fld;
              }
              const mf = _mgr.metadata(fld);
              if(mf) {
                if(mf.type.date_part) {
                  o[fldsyn] = $p.moment(doc[fld]).format($p.moment._masks[mf.type.date_part]);
                }
                else if(mf.type.is_ref) {
                  if(!doc[fld] || doc[fld] == $p.utils.blank.guid) {
                    o[fldsyn] = '';
                  }
                  else {
                    var mgr = _mgr.value_mgr(o, fld, mf.type, false, doc[fld]);
                    if(mgr) {
                      o[fldsyn] = mgr.get(doc[fld]).presentation;
                    }
                    else {
                      o[fldsyn] = '';
                    }
                  }
                }
                else if(typeof doc[fld] === 'number' && mf.type.fraction_figits) {
                  o[fldsyn] = doc[fld].toFixed(mf.type.fraction_figits);
                }
                else {
                  o[fldsyn] = doc[fld];
                }
              }
            });
            ares.push(o);
          });
          return $p.iface.data_to_grid.call(_mgr, ares, attr);
        })
        .catch($p.record_log);
    }
    load_array(_mgr, refs, with_attachments) {
      if(!refs || !refs.length) {
        return Promise.resolve(false);
      }
      const db = this.db(_mgr);
      const options = {
        limit: refs.length + 1,
        include_docs: true,
        keys: refs.map((v) => _mgr.class_name + '|' + v),
      };
      if(with_attachments) {
        options.attachments = true;
        options.binary = true;
      }
      return db.allDocs(options).then((result) => this.load_changes(result, {}));
    }
    load_view(_mgr, _view) {
      return new Promise((resolve, reject) => {
        const db = this.db(_mgr);
        const options = {
          limit: 1000,
          include_docs: true,
          startkey: _mgr.class_name + '|',
          endkey: _mgr.class_name + '|\ufff0',
        };
        function process_docs(err, result) {
          if(result) {
            if(result.rows.length) {
              options.startkey = result.rows[result.rows.length - 1].key;
              options.skip = 1;
              _mgr.load_array(result.rows.map(({doc}) => {
                doc.ref = doc._id.split('|')[1];
                return doc;
              }));
              db.query(_view, options, process_docs);
            }
            else {
              resolve();
            }
          }
          else if(err) {
            reject(err);
          }
        }
        db.query(_view, options, process_docs);
      });
    }
    load_doc_ram() {
      const {local, props} = this;
      if(!local.doc){
        return;
      }
      const res = [];
      const {_m} = this.$p.md;
      props._doc_ram_loading = true;
      ['cat', 'cch', 'ireg'].forEach((kind) => {
        for (const name in _m[kind]) {
          _m[kind][name].cachable === 'doc_ram' && res.push(kind + '.' + name);
        }
      });
      return local.doc.find({
        selector: {class_name: {$in: res}},
        limit: 10000,
      })
        .catch((err) => {
          this.emit('pouch_sync_error', 'doc', err);
          return {docs: []};
        })
        .then((data) => this.load_changes(data))
        .then(() => {
          props._doc_ram_loading = false;
          props._doc_ram_loaded = true;
          this.emit('pouch_doc_ram_loaded');
        });
    }
    find_rows(_mgr, selection) {
      const db = this.db(_mgr);
      if(!db) {
        return Promise.resolve([]);
      }
      const err_handler = this.emit.bind(this, 'pouch_sync_error', _mgr.cachable);
      if(selection && selection._mango) {
        const {selector} = selection;
        if(db.adapter == 'idb' && selector.date && selector.date.$and){
          selector.date = selector.date.$and[0];
        }
        return db.find(selection)
          .then(({docs}) => {
            if(!docs) {
              docs = [];
            }
            for (const doc of docs) {
              doc.ref = doc._id.split('|')[1];
            }
            return docs;
          })
          .catch((err) => {
            err_handler(err);
            return [];
          });
      }
      const {utils} = this.$p;
      const res = [];
      const options = {
        limit: 100,
        include_docs: true,
        startkey: _mgr.class_name + '|',
        endkey: _mgr.class_name + '|\ufff0',
      };
      let doc, _raw, _view, _total_count, top, calc_count, top_count = 0, skip = 0, skip_count = 0;
      if(selection) {
        if(selection._top) {
          top = selection._top;
          delete selection._top;
        }
        else {
          top = 300;
        }
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
          if(selection._key._order_by == 'des') {
            options.startkey = selection._key.endkey || selection._key + '\ufff0';
            options.endkey = selection._key.startkey || selection._key;
            options.descending = true;
          }
          else {
            options.startkey = selection._key.startkey || selection._key;
            options.endkey = selection._key.endkey || selection._key + '\ufff0';
          }
        }
        if(typeof selection._skip == 'number') {
          skip = selection._skip;
          delete selection._skip;
        }
        if(selection._attachments) {
          options.attachments = true;
          options.binary = true;
          delete selection._attachments;
        }
      }
      if(_total_count) {
        calc_count = true;
        _total_count = 0;
        if(Object.keys(selection).length <= 1) {
          if(selection._key && selection._key.hasOwnProperty('_search')) {
            options.include_docs = false;
            options.limit = 100000;
            return db.query(_view, options)
              .then((result) => {
                result.rows.forEach((row) => {
                  if(!selection._key._search || row.key[row.key.length - 1].toLowerCase().indexOf(selection._key._search) != -1) {
                    _total_count++;
                    if(skip) {
                      skip_count++;
                      if(skip_count < skip) {
                        return;
                      }
                    }
                    if(top) {
                      top_count++;
                      if(top_count > top) {
                        return;
                      }
                    }
                    res.push(row.id);
                  }
                });
                delete options.startkey;
                delete options.endkey;
                if(options.descending) {
                  delete options.descending;
                }
                options.keys = res;
                options.include_docs = true;
                return db.allDocs(options);
              })
              .catch((err) => {
                err_handler(err);
                return {rows: []};
              })
              .then((result) => {
                return {
                  rows: result.rows.map(({doc}) => {
                    doc.ref = doc._id.split('|')[1];
                    if(!_raw) {
                      delete doc._id;
                      delete doc._rev;
                    }
                    return doc;
                  }),
                  _total_count: _total_count,
                };
              });
          }
        }
      }
      return new Promise((resolve, reject) => {
        function process_docs(result) {
          if(result && result.rows.length) {
            options.startkey = result.rows[result.rows.length - 1].key;
            options.skip = 1;
            result.rows.forEach((rev) => {
              doc = rev.doc;
              let key = doc._id.split('|');
              doc.ref = key[1];
              if(!_raw) {
                delete doc._id;
                delete doc._rev;
              }
              if(!utils._selection.call(_mgr, doc, selection)) {
                return;
              }
              if(calc_count) {
                _total_count++;
              }
              if(skip) {
                skip_count++;
                if(skip_count < skip) {
                  return;
                }
              }
              if(top) {
                top_count++;
                if(top_count > top) {
                  return;
                }
              }
              res.push(doc);
            });
            if((result.rows.length < options.limit) || top && top_count > top && !calc_count) {
              resolve(_raw ? res : _mgr.load_array(res));
            }
            else {
              fetch_next_page();
            }
          }
          else {
            if(calc_count) {
              resolve({
                rows: _raw ? res : _mgr.load_array(res),
                _total_count: _total_count,
              });
            }
            else {
              resolve(_raw ? res : _mgr.load_array(res));
            }
          }
        }
        function fetch_next_page() {
          (_view ? db.query(_view, options) : db.allDocs(options))
            .catch((err) => {
              err_handler(err);
              reject(err);
            })
            .then(process_docs);
        }
        fetch_next_page();
      });
    }
    save_attachment(_mgr, ref, att_id, attachment, type) {
      if(!type) {
        type = {type: 'text/plain'};
      }
      if(!(attachment instanceof Blob) && type.indexOf('text') == -1) {
        attachment = new Blob([attachment], {type: type});
      }
      var _rev,
        db = this.db(_mgr);
      ref = _mgr.class_name + '|' + this.$p.utils.fix_guid(ref);
      return db.get(ref)
        .then((res) => {
          if(res) {
            _rev = res._rev;
          }
        })
        .catch((err) => {
          if(err.status != 404) {
            throw err;
          }
        })
        .then(() => {
          return db.putAttachment(ref, att_id, _rev, attachment, type);
        });
    }
    get_attachment(_mgr, ref, att_id) {
      return this.db(_mgr).getAttachment(_mgr.class_name + '|' + this.$p.utils.fix_guid(ref), att_id);
    }
    delete_attachment(_mgr, ref, att_id) {
      let _rev,
        db = this.db(_mgr);
      ref = _mgr.class_name + '|' + this.$p.utils.fix_guid(ref);
      return db.get(ref)
        .then((res) => {
          if(res) {
            _rev = res._rev;
          }
        })
        .catch((err) => {
          if(err.status != 404) {
            throw err;
          }
        })
        .then(() => {
          return db.removeAttachment(ref, att_id, _rev);
        });
    }
    load_changes(changes, options) {
      let docs, doc, res = {}, cn, key, {$p} = this;
      if(!options) {
        if(changes.direction) {
          if(changes.direction != 'pull') {
            return;
          }
          docs = changes.change.docs;
        }
        else {
          docs = changes.docs;
        }
      }
      else {
        docs = changes.rows;
      }
      if(docs.length > 0) {
        if(options) {
          options.startkey = docs[docs.length - 1].key;
          options.skip = 1;
        }
        docs.forEach((rev) => {
          doc = options ? rev.doc : rev;
          if(!doc) {
            if((rev.value && rev.value.deleted)) {
              doc = {
                _id: rev.id,
                _deleted: true,
              };
            }
            else if(rev.error) {
              return;
            }
          }
          key = doc._id.split('|');
          if(key[0] === 'system') {
            return !options && this.emit('system', key[1], doc);
          }
          cn = key[0].split('.');
          doc.ref = key[1];
          delete doc._id;
          delete doc._rev;
          if(!res[cn[0]]) {
            res[cn[0]] = {};
          }
          if(!res[cn[0]][cn[1]]) {
            res[cn[0]][cn[1]] = [];
          }
          res[cn[0]][cn[1]].push(doc);
        });
        for (let mgr in res) {
          for (cn in res[mgr]) {
            if($p[mgr] && $p[mgr][cn]) {
              $p[mgr][cn].load_array(res[mgr][cn], changes.update_only ? 'update_only' : true);
            }
          }
        }
        return true;
      }
      return false;
    }
    attach_refresher(regex, timout = 600000) {
      if(this.props._refresher) {
        clearInterval(this.props._refresher);
      }
      setInterval(() => {
        if(this.authorized && this.remote.ram && this.remote.ram.adapter == 'http') {
          this.remote.ram.getSession()
            .then(response => {
              response = null;
            })
            .catch(err => {
              err = null;
            });
        }
      }, timout);
    }
    backup_database(do_zip) {
    }
    restore_database(do_zip) {
    }
    get authorized() {
      const {_auth} = this.props;
      return _auth && _auth.username;
    }
  };
}
var adapter$1 = (constructor) => {
  const {classes} = constructor;
  classes.PouchDB = PouchDB$1;
  classes.AdapterPouch = adapter(classes);
}

const plugin = {
	proto(constructor) {
		proto(constructor);
		adapter$1(constructor);
	},
	constructor(){
		const {AdapterPouch} = this.classes;
		this.adapters.pouch = new AdapterPouch(this);
	}
};

module.exports = plugin;
//# sourceMappingURL=index.js.map
