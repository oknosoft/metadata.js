/*!
 metadata-pouchdb v2.0.18-beta.4, built:2019-03-07
 © 2014-2019 Evgeniy Malyarov and the Oknosoft team http://www.oknosoft.ru
 metadata.js may be freely distributed under the MIT
 To obtain commercial license and technical support, contact info@oknosoft.ru
 */


'use strict';

const debug = require('debug')('wb:indexer');
function sort_fn(a, b) {
  if (a.date < b.date){
    return -1;
  }
  else if (a.date > b.date){
    return 1;
  }
  else{
    return 0;
  }
}
class RamIndexer {
  static waitError() {
    const err = new Error('Индекс прочитн не полностью, повторите запрос позже');
    err.status = 403;
    throw err;
  }
  static truth(fld, cond) {
    const blank = '00000000-0000-0000-0000-000000000000';
    if(cond === true || (cond && cond.hasOwnProperty('$ne') && !cond.$ne)) {
      return function (doc) {
        return doc[fld];
      };
    }
    else if(cond === false || (cond && cond.hasOwnProperty('$ne') && cond.$ne && typeof cond.$ne === 'boolean')) {
      return function (doc) {
        return !doc[fld];
      };
    }
    else if(cond && cond.hasOwnProperty('filled')) {
      return function (doc) {
        return doc[fld] && doc[fld] !== blank;
      };
    }
    else if(cond && cond.hasOwnProperty('nfilled')) {
      return function (doc) {
        return !doc[fld] || doc[fld] === blank;
      };
    }
    else if(cond && cond.hasOwnProperty('$ne')) {
      return function (doc) {
        return doc[fld] !== cond.$ne;
      };
    }
    else if(cond && cond.hasOwnProperty('$in')) {
      const acond = typeof cond.$in === 'string' ? cond.$in.split(',').map((v) => v.trim()) : cond.$in;
      return function (doc) {
        return acond.includes(doc[fld]);
      };
    }
    else if(cond && cond.hasOwnProperty('$nin')) {
      const acond = typeof cond.$nin === 'string' ? cond.$nin.split(',').map((v) => v.trim()) : cond.$nin;
      return function (doc) {
        return !acond.includes(doc[fld]);
      };
    }
    else {
      return function (doc) {
        return doc[fld] === cond;
      };
    }
  }
  constructor({fields, search_fields, mgr}) {
    this._fields = fields;
    this._search_fields = search_fields;
    this._mgrs = Array.isArray(mgr) ? mgr : [mgr];
    this._count = 0;
    this._ready = false;
    this._listeners = new Map();
    this._area = this._mgrs.length > 1;
    this.by_date = {};
  }
  sort() {
    debug('sorting');
    for(const date in this.by_date) {
      this.by_date[date].sort(sort_fn);
    }
    this._ready = true;
    debug('ready');
  }
  put(indoc, force) {
    const doc = {};
    if(this._area) {
      doc._area = indoc._area;
    }
    this._fields.forEach((fld) => {
      if(indoc.hasOwnProperty(fld)) {
        doc[fld] = indoc[fld];
      }
    });
    const date = doc.date.substr(0, 7);
    const arr = this.by_date[date];
    if(arr) {
      if(force || !arr.some((row) => {
        if(row._id === doc._id) {
          Object.assign(row, doc);
          return true;
        }
      })) {
        arr.push(doc);
        !force && arr.sort(sort_fn);
      }
    }
    else {
      this.by_date[date] = [doc];
    }
  }
  get_range(from, till, step, desc) {
    if(desc) {
      if(step) {
        let [year, month] = till.split('-');
        month = parseInt(month, 10) - step;
        while (month < 1) {
          year = parseInt(year, 10) - 1;
          month += 12;
        }
        till = `${year}-${month.pad(2)}`;
      }
      if(till < from) {
        return null;
      }
      let res = this.by_date[till];
      if(!res) {
        res = [];
      }
      return res;
    }
    else {
      if(step) {
        let [year, month] = from.split('-');
        month = parseInt(month, 10) + step;
        while (month > 12) {
          year = parseInt(year, 10) + 1;
          month -= 12;
        }
        from = `${year}-${month.pad(2)}`;
      }
      if(from > till) {
        return null;
      }
      let res = this.by_date[from];
      if(!res) {
        res = [];
      }
      return res;
    }
  }
  find({selector, sort, ref, limit, skip = 0}, auth) {
    if(!this._ready) {
      RamIndexer.waitError();
    }
    let dfrom, dtill, from, till, search;
    for(const row of selector.$and) {
      const fld = Object.keys(row)[0];
      const cond = Object.keys(row[fld])[0];
      if(fld === 'date') {
        if(cond === '$lt' || cond === '$lte') {
          dtill = row[fld][cond];
          till = dtill.substr(0,7);
        }
        else if(cond === '$gt' || cond === '$gte') {
          dfrom = row[fld][cond];
          from = dfrom.substr(0,7);
        }
      }
      else if(fld === 'search') {
        search = row[fld][cond] ? row[fld][cond].toLowerCase().split(' ') : [];
      }
    }
    if(sort && sort.length && sort[0][Object.keys(sort[0])[0]] === 'desc' || sort === 'desc') {
      sort = 'desc';
    }
    else {
      sort = 'asc';
    }
    const {_search_fields} = this;
    const {utils} = $p;
    let part,
      step = 0,
      flag = skip === 0 && utils.is_guid(ref),
      scroll = null,
      count = 0;
    const docs = [];
    function add(doc) {
      count++;
      if(flag && doc._id.endsWith(ref)) {
        scroll = count - 1;
        flag = false;
      }
      if(skip > 0) {
        return skip--;
      }
      if(limit > 0) {
        limit--;
        docs.push(doc);
      }
    }
    function check(doc) {
      if(doc.date < dfrom || doc.date > dtill) {
        return;
      }
      let ok = true;
      for(const word of search) {
        if(!word) {
          continue;
        }
        if(!_search_fields.some((fld) => {
          const val = doc[fld];
          return val && typeof val === 'string' && val.toLowerCase().includes(word);
        })){
          ok = false;
          break;
        }
      }
      ok && add(doc);
    }
    while((part = this.get_range(from, till, step, sort === 'desc'))) {
      step += 1;
      if(sort === 'desc') {
        for(let i = part.length - 1; i >= 0; i--){
          check(part[i]);
        }
      }
      else {
        for(let i = 0; i < part.length; i++){
          check(part[i]);
        }
      }
    }
    return {docs, scroll, flag, count};
  }
  init(bookmark, _mgr) {
    if(!_mgr) {
      return this._mgrs.reduce((sum, _mgr) => sum.then(() => this.init(bookmark, _mgr)), Promise.resolve())
        .then(() => {
          this.sort();
        });
    }
    if(!bookmark) {
      const listener = (change) => {
        if(!change) {
          return;
        }
        if(this._area) {
          change._area = _mgr.cachable;
        }
        this.put(change);
      };
      this._listeners.set(_mgr, listener);
      _mgr.on('change', listener);
      debug('start');
    }
    return _mgr.pouch_db.find({
      selector: {
        class_name: _mgr.class_name,
      },
      fields: this._fields,
      bookmark,
      limit: 10000,
    })
      .then(({bookmark, docs}) => {
        this._count += docs.length;
        debug(`received ${this._count}`);
        for(const doc of docs) {
          if(this._area) {
            doc._area = _mgr.cachable;
          }
          this.put(doc, true);
        }
        _mgr.adapter.emit('indexer_page', {indexer: this, bookmark: bookmark || '', _mgr});
        debug(`indexed ${this._count} ${bookmark.substr(10, 30)}`);
        return docs.length === 10000 && this.init(bookmark, _mgr);
      });
  }
  reset(mgrs) {
    for(const date in this.by_date) {
      this.by_date[date].length = 0;
    }
    for(const [_mgr, listener] of this._listeners) {
      _mgr.off('change', listener);
    }
    this._listeners.clear();
    this._mgrs.length = 0;
    mgrs && this._mgrs.push.apply(this._mgrs, mgrs);
    this._area = this._mgrs.length > 1;
  }
}

var proto = ({classes}) => {
	const {DataManager, DataObj, DocObj, TaskObj, BusinessProcessObj} = classes;
  classes.RamIndexer = RamIndexer;
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
				if (_manager.cachable == 'ram' || _manager.cachable == 'doc_ram') {
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
	});
};

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
    PouchDB = window.PouchDB = require('pouchdb-core').default
      .plugin(require('pouchdb-adapter-http').default)
      .plugin(require('pouchdb-replication').default)
      .plugin(require('pouchdb-mapreduce').default)
      .plugin(require('pouchdb-find').default)
      .plugin(require('pouchdb-adapter-idb').default);
  }
}
var PouchDB$1 = PouchDB;

function adapter({AbstracrAdapter}) {
  const fieldsToDelete = '_id,search,timestamp'.split(',');
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
        direct: wsql.get_user_param('zone', 'number') == job_prm.zone_demo ? false :
          (job_prm.hasOwnProperty('couch_direct') ? job_prm.couch_direct : wsql.get_user_param('couch_direct', 'boolean')),
        user_node: job_prm.user_node,
        noreplicate: job_prm.noreplicate,
        autologin: job_prm.autologin || [],
      });
      if(props.path && props.path.indexOf('http') != 0 && typeof location != 'undefined') {
        props.path = location.protocol + '//' + location.host + props.path;
      }
      if(job_prm.use_meta === false) {
        props.use_meta = false;
      }
      if(job_prm.use_ram === false) {
        props.use_ram = false;
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
      const pbases = ['doc', 'user'];
      if(props.use_ram !== false) {
        pbases.push('ram');
      }
      for (const name of pbases) {
        if(bases.indexOf(name) != -1) {
          Object.defineProperty(local, name, {
            get() {
              if(props.user_node) {
                return remote[name];
              }
              const dynamic_doc = wsql.get_user_param('dynamic_doc');
              if(dynamic_doc && name === 'doc' && props.direct) {
                return remote[dynamic_doc];
              }
              else {
                return local[`__${name}`] || remote[name];
              }
            }
          });
          if(props.user_node || (props.direct && name != 'ram' && name != 'user')) {
            local[`__${name}`] = null;
          }
          else {
            local[`__${name}`] = new PouchDB$1(props.prefix + props.zone + '_' + name, opts);
          }
        }
      }
      this.after_init( props.user_node ? bases : (props.autologin.length ? props.autologin : ['ram']));
    }
    after_init(bases, auth) {
      const {props, remote, $p: {md}} = this;
      const opts = {skip_setup: true, adapter: 'http'};
      if(auth) {
        opts.auth = auth;
      }
      else if(props.user_node) {
        opts.auth = props.user_node;
      }
      (bases || md.bases()).forEach((name) => {
        if((!auth && remote[name]) || name.match(/(e1cib|pgsql|github|user)/) || (name === 'ram' && props.use_ram === false)) {
          return;
        }
        remote[name] = new PouchDB$1(this.dbpath(name), opts);
      });
    }
    after_log_in() {
      const {props, local, remote, $p: {md, wsql}} = this;
      const try_auth = [];
      md.bases().forEach((dbid) => {
        if(dbid !== 'meta' &&
          local[dbid] && remote[dbid] && local[dbid] != remote[dbid] &&
          (dbid !== 'doc' || !wsql.get_user_param('dynamic_doc'))
        ) {
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
      const {props, local, remote, $p} = this;
      const {job_prm, wsql, aes, md, cat} = $p;
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
      let try_auth = (props.user_node || !remote.ram) ?
        Promise.resolve(true) :
        remote.ram.login(username, password)
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
            else if(role === 'direct' && !props.direct && props.zone != job_prm.zone_demo) {
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
            return true;
          })
          .catch((err) => {
            if(props.direct) {
              throw err;
            }
            return new Promise((resolve, reject) => {
              let count = 0;
              function props_by_user() {
                setTimeout(() => {
                  const {current_user} = $p;
                  if(current_user) {
                    if(current_user.push_only) {
                      props._push_only = true;
                    }
                    if(current_user.suffix) {
                      props._suffix = current_user.suffix;
                      while (props._suffix.length < 4) {
                        props._suffix = '0' + props._suffix;
                      }
                    }
                    resolve();
                  }
                  else {
                    if(count > 4) {
                      return reject();
                    }
                    count++;
                    props_by_user();
                  }
                }, 100 + count * 500);
              }              props_by_user();
            });
          });
      if(!props.user_node) {
        try_auth = try_auth
          .then((ram_logged_in) => {
            ram_logged_in && this.after_init(bases, {username, password});
            return ram_logged_in;
          })
          .then((ram_logged_in) => {
            let postlogin = Promise.resolve(ram_logged_in);
            if(!props.user_node) {
              bases.forEach((dbid) => {
                if(dbid !== 'meta' && dbid !== 'ram' && remote[dbid]) {
                  postlogin = postlogin
                    .then((ram_logged_in) => ram_logged_in && remote[dbid].info());
                }
              });
            }
            return postlogin;
          });
      }
      return try_auth.then((info) => {
        props._auth = {username};
        if(wsql.get_user_param('user_name') != username) {
          wsql.set_user_param('user_name', username);
        }
        if(info) {
          if(wsql.get_user_param('enable_save_pwd')) {
            if(aes.Ctr.decrypt(wsql.get_user_param('user_pwd')) != password) {
              wsql.set_user_param('user_pwd', aes.Ctr.encrypt(password));
            }
          }
          else if(wsql.get_user_param('user_pwd') != '') {
            wsql.set_user_param('user_pwd', '');
          }
          this.emit('user_log_in', username);
        }
        else {
          this.emit('user_log_stop', username);
        }
        return this.emit_promise('on_log_in').then(() => info);
      })
        .then((info) => {
          if(props._data_loaded && !props._doc_ram_loading) {
            if(props._doc_ram_loaded) {
              this.emit('pouch_doc_ram_loaded');
            }
            else {
              this.load_doc_ram();
            }
          }          return info && this.after_log_in();
        })
        .catch(err => {
          this.emit('user_log_fault', err);
        });
    }
    log_out() {
      const {props, local, remote, authorized, $p: {md}} = this;
      if(authorized) {
        for (const name in local.sync) {
          if(name != 'meta' && props.autologin.indexOf(name) === -1) {
            try {
              local.sync[name].removeAllListeners();
              local.sync[name].cancel();
              local.sync[name] = null;
            }
            catch (err) {
            }
          }
        }
        props._auth = null;
      }
      return Promise.all(md.bases().map((name) => {
        if(name != 'meta' && remote[name]) {
          let res = remote[name].logout && remote[name].logout();
          if(name != 'ram') {
            const dbpath = AdapterPouch.prototype.dbpath.call(this, name);
            if(remote[name].name !== dbpath) {
              const sub = remote[name].close()
                .then(() => {
                  remote[name].removeAllListeners();
                  if(props.autologin.indexOf(name) === -1) {
                    remote[name] = null;
                  }
                  else {
                    remote[name] = new PouchDB$1(dbpath, {skip_setup: true, adapter: 'http'});
                  }
                });
              res = res ? res.then(() => sub) : sub;
            }
          }
          return res;
        }
      }))
        .then(() => this.emit('user_log_out'));
    }
    load_data() {
      const {local, $p: {job_prm}} = this;
      const options = {
        limit: 700,
        include_docs: true,
      };
      const _page = {
        total_rows: 0,
        limit: options.limit,
        page: 0,
        start: Date.now(),
      };
      if(job_prm.second_instance) {
        return Promise.reject(new Error('second_instance'));
      }
      return new Promise((resolve, reject) => {
        let index;
        const processPage = (err, response) => {
          if(response) {
            _page.page++;
            _page.total_rows = response.total_rows;
            this.emit('pouch_data_page', Object.assign({}, _page));
            if(this.load_changes(response, options)) {
              fetchNextPage();
            }
            else {
              local._loading = false;
              this.call_data_loaded(_page);
              resolve();
            }
          }
          else if(err) {
            reject(err);
            this.emit('pouch_data_error', 'ram', err);
          }
        };
        const fetchNextPage = () => {
          if(index){
            local.ram.query('server/load_order', options, processPage);
          }
          else {
            local.ram.allDocs(options, processPage);
          }
        };
        local.ram.get('_design/server')
          .catch((err) => {
            if(err.status === 404) {
              return {views: {}}
            }
            else {
              reject(err);
            }
          })
          .then(({views}) => {
            if(views.load_order){
              index = true;
            }            return (Object.keys(views).length ? this.rebuild_indexes('ram') : Promise.resolve())
              .then(() => local.ram.info());
          })
          .then((info) => {
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
      const dbid = _mgr.cachable.replace('_remote', '').replace('_ram', '').replace('_doc', '');
      const {props, local, remote} = this;
      if(dbid.indexOf('remote') != -1 || (props.noreplicate && props.noreplicate.indexOf(dbid) != -1)) {
        return remote[dbid.replace('_remote', '')];
      }
      else {
        return local[dbid] || remote[dbid] || local.user;
      }
    }
    back_off (delay) {
      if (!delay) {
        return 1000 + Math.floor(Math.random() * 2000);
      }
      else if (delay >= 200000) {
        return 200000;
      }
      return delay * 3;
    }
    run_sync(id) {
      const {local, remote, $p: {wsql, job_prm, record_log}, props} = this;
      if(local.sync[id]) {
        return Promise.resolve(id);
      }
      const {_push_only, _user} = props;
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
          if(!_push_only && rinfo.data_size > (job_prm.data_size_sync_limit || 2e8)) {
            this.emit('pouch_sync_error', id, {data_size: rinfo.data_size});
            props.direct = true;
            wsql.set_user_param('couch_direct', true);
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
              batches_limit: 3,
              retry: true,
            };
            if(job_prm.pouch_filter && job_prm.pouch_filter[id]) {
              options.filter = job_prm.pouch_filter[id];
            }
            else if(id == 'meta') {
              options.filter = 'auth/meta';
            }
            const final_sync = (options) => {
              options.live = true;
              options.back_off_function = this.back_off;
              if(id == 'ram' || id == 'meta' || props.zone == job_prm.zone_demo) {
                local.sync[id] = sync_events(db_local.replicate.from(db_remote, options));
              }
              else if(_push_only) {
                if(options.filter) {
                  delete options.filter;
                  delete options.query_params;
                }
                local.sync[id] = sync_events(db_local.replicate.to(db_remote, Object.assign({}, options, {batch_size: 50})));
              }
              else {
                local.sync[id] = sync_events(db_local.sync(db_remote, options));
              }
            };
            const sync_events = (sync, options) => {
              sync.on('change', (change) => {
                if(change.pending > 10) {
                  change.db = id;
                  this.emit_async('repl_state', change);
                }
                change.update_only = id !== 'ram';
                this.load_changes(change);
                this.emit('pouch_sync_data', id, change);
              })
                .on('denied', (info) => {
                  this.emit('pouch_sync_denied', id, info);
                })
                .on('error', (err) => {
                  this.emit('pouch_sync_error', id, err);
                })
                .on('complete', (info) => {
                  info.db = id;
                  this.emit_async('repl_state', info);
                  sync.cancel();
                  sync.removeAllListeners();
                  if(options) {
                    final_sync(options);
                    this.rebuild_indexes(id)
                      .then(() => resolve(id));
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
            (job_prm.templates ? this.from_files(db_local, db_remote, options) : this.from_dump(db_local, db_remote, options))
              .then((synced) => {
                if(synced) {
                  final_sync(options);
                  if(typeof synced === 'number') {
                    this.rebuild_indexes(id)
                      .then(() => this.load_data());
                  }                }
                else {
                  sync_events(db_local.replicate.from(db_remote, options), options);
                }
              });
          });
        });
    }
    from_dump(local, remote, opts = {}) {
      const {utils} = this.$p;
      return local.get('_local/dumped')
        .then(() => true)
        .catch(() => remote.get('_local/dump'))
        .then(doc => {
          if(doc === true) {
            return doc;
          }
          const byteCharacters = atob(doc.dump);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const blob = new Blob([new Uint8Array(byteNumbers)], {type: 'application/zip'});
          return utils.blob_as_text(blob, 'array');
        })
        .then((uarray) => {
          if(uarray === true) {
            return uarray;
          }
          return ('JSZip' in window ? Promise.resolve() : utils.load_script('https://cdn.jsdelivr.net/jszip/2/jszip.min.js', 'script'))
            .then(() => {
              const zip = new JSZip(uarray);
              return zip.files.dump.asText();
            });
        })
        .then((text) => {
          if(text === true) {
            return text;
          }
          const opt = {
            proxy: remote.name,
            checkpoints: 'target',
            emit: (docs) => {
              this.emit('pouch_dumped', {db: local, docs});
              if(local.name.indexOf('ram') !== -1) {
                this.emit('pouch_data_page', {
                  total_rows: docs.length,
                  local_rows: 3,
                  docs_written: 3,
                  limit: 300,
                  page: 0,
                  start: Date.now(),
                });
              }
            }
          };
          if(remote.__opts.auth) {
            opt.auth = remote.__opts.auth;
          }
          if(opts.filter) {
            opt.filter = opts.filter;
          }
          if(opts.query_params) {
            opt.query_params = opts.query_params;
          }
          if(opts.selector) {
            opt.selector = opts.selector;
          }
          return (local.load ? Promise.resolve() : utils.load_script('/dist/pouchdb.load.js', 'script'))
            .then(() => {
              return local.load(text, opt);
            })
            .then(() => local.put({_id: '_local/dumped'}))
            .then(() => -1);
        })
        .catch((err) => {
          err.status !== 404 && console.log(err);
          return false;
        });
    }
    from_files(local, remote, opts = {}) {
      const li = local.name.lastIndexOf('_');
      const id = local.name.substr(li + 1);
      return fetch(`/${id}/00000.json`)
        .then((res) => res.json())
        .then((info) => {
          return local.get('_local/stamp')
            .then((doc) => {
              if(doc.stamp === info.stamp) {
                return true;
              }
              info._rev = doc._rev;
              return info;
            })
            .catch((err) => {
              return info;
            });
        })
        .then((info) => {
          if(info === true) {
            return info;
          }
          if(info) {
            return (local.load ? Promise.resolve() : this.$p.utils.load_script('/dist/pouchdb.load.js', 'script'))
              .then(() => info);
          }
        })
        .then((info) => {
          if(info === true) {
            return info;
          }
          if(info) {
            const {origin} = location;
            let series = Promise.resolve();
            const msg = {db: id, ok: true, docs_read: 0, pending: info.doc_count, start_time: new Date().toISOString()};
            this.emit_async('repl_state', msg);
            const opt = {
              proxy: remote.name,
              checkpoints: 'target',
              emit: (docs) => {
                this.emit('pouch_dumped', {db: local, docs});
              }
            };
            if(remote.__opts.auth) {
              opt.auth = remote.__opts.auth;
            }
            if(opts.filter) {
              opt.filter = opts.filter;
            }
            if(opts.query_params) {
              opt.query_params = opts.query_params;
            }
            if(opts.selector) {
              opt.selector = opts.selector;
            }
            for(let i = 1; i <= info.files; i++) {
              series = series.then(() => {
                return local.load(`${origin}/${id}/${i.pad(5)}.json`, opt);
              })
                .then((step) => {
                  msg.docs_read = (info.doc_count * i / info.files).round();
                  msg.pending = info.doc_count - msg.docs_read;
                  this.emit_async('repl_state', msg);
                });
            }
            return series
              .then(() => {
                info._id = '_local/stamp';
                return local.put(info);
              })
              .then(() => -1);
          }
        })
        .catch((err) => {
          return false;
        });
    }
    rebuild_indexes(id, silent) {
      const {local, remote} = this;
      const msg = {db: id, ok: true, docs_read: 0, pending: 0, start_time: new Date().toISOString()};
      let promises = Promise.resolve();
      return local[id] === remote[id] ?
        Promise.resolve() :
        local[id].allDocs({
          include_docs: true,
          startkey: '_design/',
          endkey : '_design/\u0fff',
          limit: 1000,
        })
          .then(({rows}) => {
            for(const {doc} of rows) {
              if(doc._id.indexOf('/server') !== -1 && id !== 'ram') {
                continue;
              }
              if(doc.views) {
                for(const name in doc.views) {
                  const view = doc.views[name];
                  const index = doc._id.replace('_design/', '') + '/' + name;
                  if(doc.language === 'javascript') {
                    promises = promises.then(() => {
                      if(silent) {
                        this.emit('rebuild_indexes', {id, index, start: true});
                      }
                      else {
                        msg.index = index;
                        this.emit('repl_state', msg);
                      }
                      return local[id].query(index, {limit: 1}).catch(() => null);
                    });
                  }
                  else {
                    const selector = {
                      limit: 1,
                      fields: ['_id'],
                      selector: {},
                      use_index: index.split('/'),
                    };
                    for(const fld of view.options.def.fields) {
                      selector.selector[fld] = '';
                    }
                    promises = promises.then(() => {
                      if(silent) {
                        this.emit('rebuild_indexes', {id, index, start: true});
                      }
                      else {
                        msg.index = index;
                        this.emit('repl_state', msg);
                      }
                      return local[id].find(selector).catch(() => null);
                    });
                  }
                }
              }
            }
            return promises.then(() => {
              msg.index = '';
              msg.end_time = new Date().toISOString();
              this.emit('repl_state', msg);
              this.emit('rebuild_indexes', {id, start: false, finish: true});
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
        if(!local.sync._page) {
          local.sync._page = page;
        }
        Promise.resolve().then(() => {
          this.emit(page.note = 'pouch_data_loaded', page);
          this.authorized && this.load_doc_ram();
        });
      }
      else if(!props._doc_ram_loaded && !props._doc_ram_loading && this.authorized) {
        this.load_doc_ram();
      }
    }
    reset_local_data() {
      const {local, remote} = this;
      const do_reload = () => {
        setTimeout(() => typeof location != 'undefined' && location.reload(true), 1000);
      };
      return this.log_out()
        .then(() => {
          return local.templates && local.templates.adapter === 'idb' && local.templates.destroy()
        })
        .then(() => {
          return remote.ram != local.ram && local.ram.destroy()
        })
        .then(() => {
          return remote.doc != local.doc && local.doc.destroy()
        })
        .then(do_reload)
        .catch(do_reload);
    }
    load_obj(tObj, attr) {
      const db = (attr && attr.db) || this.db(tObj._manager);
      if(!db) {
        return Promise.resolve(tObj);
      }
      return db.get(tObj._manager.class_name + '|' + tObj.ref)
        .then((res) => {
          for(const fld of fieldsToDelete) {
            delete res[fld];
          }
          tObj._data._loading = true;
          tObj._mixin(res);
          tObj._obj._rev = res._rev;
        })
        .catch((err) => {
          if(err.status != 404) {
            throw err;
          }
        })
        .then((res) => {
          return tObj;
        });
    }
    save_obj(tObj, attr) {
      const {_manager, _obj, _data, ref, class_name} = tObj;
      const db = attr.db || this.db(_manager);
      if(!_data || (_data._saving && !_data._modified) || !db) {
        return Promise.resolve(tObj);
      }
      if(_data._saving && _data._modified) {
        _data._saving++;
        if(_data._saving > 10) {
          return Promise.reject(new Error(`Циклическая перезапись`));
        }
        return new Promise((resolve, reject) => {
          setTimeout(() => resolve(this.save_obj(tObj, attr)), 200);
        });
      }
      _data._saving = 1;
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
        const getter = tObj.is_new() ? Promise.resolve(true) : db.get(tmp._id);
        getter.then((res) => {
          if(typeof res === 'object') {
            if(tmp._rev !== res._rev && _manager.metadata().check_rev !== false) {
              const {timestamp} = res;
              const err = new Error(`Объект ${timestamp && typeof timestamp.user === 'string' ?
                `изменил ${timestamp.user}<br/>${timestamp.moment}` : 'изменён другим пользователем'}`);
              err._rev = true;
              return reject(err);
            }
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
          return res;
        })
          .catch((err) => {
            return err && err.status !== 404 ? reject(err) : true;
          })
          .then((res) => res && db.put(tmp))
          .then((res) => {
            if(res) {
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
              _obj._rev = res.rev;
              resolve(tObj);
            }
          })
          .catch((err) => {
            err && err.status !== 404 && reject(err);
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
    load_array(_mgr, refs, with_attachments, db) {
      if(!refs || !refs.length) {
        return Promise.resolve(false);
      }
      if(!db) {
        db = this.db(_mgr);
      }
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
    load_view(_mgr, _view, options) {
      return new Promise((resolve, reject) => {
        const db = this.db(_mgr);
        if(!options) {
          options = {
            limit: 1000,
            include_docs: true,
            startkey: _mgr.class_name + '|',
            endkey: _mgr.class_name + '|\ufff0',
          };
        }
        function process_docs(err, result) {
          if(result) {
            if(result.rows.length) {
              options.startkey = result.rows[result.rows.length - 1].key;
              options.skip = 1;
              _mgr.load_array(result.rows.map(({doc}) => {
                doc.ref = doc._id.split('|')[1];
                delete doc._id;
                return doc;
              }), true);
              if(result.rows.length < options.limit) {
                resolve();
              }
              else {
                db.query(_view, options, process_docs);
              }
            }
            else {
              resolve();
            }
          }
          else if(err && err.status !== 404) {
            reject(err);
          }
        }
        db.query(_view, options, process_docs);
      });
    }
    load_doc_ram() {
      const {local, props, $p: {md}} = this;
      if(!local.doc){
        return;
      }
      const res = [];
      const {_m} = md;
      this.emit('pouch_doc_ram_start');
      props._doc_ram_loading = true;
      ['cat', 'cch', 'ireg'].forEach((kind) => {
        for (const name in _m[kind]) {
          (_m[kind][name].cachable === 'doc_ram' || _m[kind][name].cachable === 'templates_ram') && res.push(kind + '.' + name);
        }
      });
      return res.reduce((acc, name) => {
        return acc.then(() => {
          const opt = {
            include_docs: true,
            startkey: name + '|',
            endkey: name + '|\ufff0',
            limit: 10000,
          };
          const page = local.sync._page || {};
          const meta = md.get(name);
          this.emit('pouch_data_page', Object.assign(page, {synonym: meta.synonym}));
          return local[meta.cachable.replace(/_ram$/, '')].allDocs(opt).then((res) => {
            this.load_changes(res, opt);
          });
        });
      }, Promise.resolve())
        .catch((err) => {
          props._doc_ram_loading = false;
          this.emit('pouch_sync_error', 'doc', err);
          return {docs: []};
        })
        .then(() => {
          props._doc_ram_loading = false;
          props._doc_ram_loaded = true;
          this.emit('pouch_doc_ram_loaded');
        });
    }
    find_rows(_mgr, selection, db) {
      if(!db) {
        db = this.db(_mgr);
      }
      if(!db) {
        return Promise.resolve([]);
      }
      const err_handler = this.emit.bind(this, 'pouch_sync_error', _mgr.cachable);
      if(selection && selection._mango) {
        const sel = {};
        for(const fld in selection) {
          if(fld[0] !== '_') {
            sel[fld] = selection[fld];
          }
        }
        return db.find(sel)
          .then(({docs}) => {
            if(!docs) {
              docs = [];
            }
            for (const doc of docs) {
              doc.ref = doc._id.split('|')[1];
            }
            return selection._raw ? docs : _mgr.load_array(docs);
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
    attach_refresher(regex, timout = 500000) {
      if(this.props._refresher) {
        clearInterval(this.props._refresher);
      }
      setInterval(() => {
        if(this.authorized && this.remote.ram && this.remote.ram.adapter == 'http') {
          this.remote.ram.info()
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
};

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
