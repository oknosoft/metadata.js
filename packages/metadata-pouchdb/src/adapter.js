/**
 * Содержит методы и подписки на события PouchDB
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2017
 * @module common
 * @submodule pouchdb
 */

/**
 * ### PouchDB для хранения данных в idb браузера и синхронизации с CouchDB
 */

import PouchDB from './pouchdb';


function adapter({AbstracrAdapter}) {

  /**
   * ### Интерфейс локальной и сетевой баз данных PouchDB
   * Содержит абстрактные методы методы и подписки на события PouchDB, отвечает за авторизацию, синхронизацию и доступ к данным в IndexedDB и на сервере
   *
   * @class AdapterPouch
   * @static
   * @menuorder 34
   * @tooltip Данные pouchdb
   */
  return class AdapterPouch extends AbstracrAdapter {

    constructor($p) {

      super($p);

      const t = this;
      const _paths = {};
      let _local, _remote, _auth, _data_loaded;

      Object.defineProperties(this, {

        init: {
          value: function (wsql, job_prm) {
            Object.assign(_paths, {
              path: wsql.get_user_param('couch_path', 'string') || job_prm.couch_path || '',
              zone: wsql.get_user_param('zone', 'number'),
              prefix: job_prm.local_storage_prefix,
              suffix: wsql.get_user_param('couch_suffix', 'string') || '',
              direct: job_prm.couch_direct || wsql.get_user_param('couch_direct', 'boolean'),
              user_node: job_prm.user_node,
              noreplicate: job_prm.noreplicate,
            });
            if(_paths.path && _paths.path.indexOf('http') != 0 && typeof location != 'undefined') {
              _paths.path = location.protocol + '//' + location.host + _paths.path;
            }
            if(_paths.suffix) {
              while (_paths.suffix.length < 4) {
                _paths.suffix = '0' + _paths.suffix;
              }
            }
          },
        },

        /**
         * ### Локальные базы PouchDB
         *
         * @property local
         * @type {{ram: PouchDB, doc: PouchDB, meta: PouchDB, sync: {}}}
         */
        local: {
          get: function () {
            if(!_local) {
              const opts = {auto_compaction: true, revs_limit: 2};
              const bases = this.$p.md.bases();

              _local = {
                sync: {},
                meta: new PouchDB(_paths.prefix + 'meta', opts),
              };

              for (const name of ['ram', 'doc', 'user']) {
                if(bases.indexOf(name) != -1) {
                  // в Node, локальные базы - это алиасы удалённых
                  // если direct, то все базы, кроме ram, так же - удалённые
                  if(_paths.user_node || (_paths.direct && name != 'ram')) {
                    _local[name] = this.remote[name];
                  }
                  else {
                    _local[name] = new PouchDB(_paths.prefix + _paths.zone + '_' + name, opts);
                  }
                }
              }
              if(_paths.path && !_local._meta) {
                _local._meta = new PouchDB(_paths.path + 'meta', {skip_setup: true});
                setTimeout(() => t.run_sync('meta'));
              }

            }
            return _local;
          },
        },

        /**
         * ### Базы PouchDB на сервере
         *
         * @property remote
         * @type {{ram: PouchDB, doc: PouchDB}}
         */
        remote: {
          get: function () {
            if(!_remote) {

              const opts = {skip_setup: true, adapter: 'http'};

              if(_paths.user_node) {
                opts.auth = _paths.user_node;
              }

              _remote = {};

              const {superlogin, md} = this.$p;

              function dbpath(name) {
                if(superlogin) {
                  return superlogin.getDbUrl(_paths.prefix + (name == 'meta' ? name : (_paths.zone + '_' + name)));
                }
                else {
                  if(name == 'meta') {
                    return _paths.path + 'meta';
                  }
                  else if(name == 'ram') {
                    return _paths.path + _paths.zone + '_ram';
                  }
                  else {
                    return _paths.path + _paths.zone + '_' + name + (_paths.suffix ? '_' + _paths.suffix : '');
                  }
                }
              }

              md.bases().forEach((name) => {
                if(name == 'e1cib' || name == 'pgsql') {
                  return;
                }
                _remote[name] = new PouchDB(dbpath(name), opts);
              });

            }
            return _remote;
          },
        },

        /**
         * Возвращает базу PouchDB, связанную с объектами данного менеджера
         * @method db
         * @param _mgr {DataManager}
         * @return {PouchDB}
         */
        db: {
          value: function (_mgr) {
            const dbid = _mgr.cachable.replace('_remote', '').replace('_ram', '');
            if(dbid.indexOf('remote') != -1 || (
                _paths.noreplicate && _paths.noreplicate.indexOf(dbid) != -1
              )) {
              return this.remote[dbid.replace('_remote', '')];
            }
            else {
              return this.local[dbid] || this.remote[dbid];
            }
          },
        },

        /**
         * ### Выполняет авторизацию и запускает репликацию
         * @method log_in
         * @param username {String}
         * @param password {String}
         * @return {Promise}
         */
        log_in: {
          value: function (username, password) {

            const {job_prm, wsql, aes, md} = this.$p;

            // реквизиты гостевого пользователя для демобаз
            if(username == undefined && password == undefined) {
              if(job_prm.guests && job_prm.guests.length) {
                username = job_prm.guests[0].username;
                password = aes.Ctr.decrypt(job_prm.guests[0].password);
              }
              else {
                return Promise.reject(new Error('username & password not defined'));
              }
            }

            if(_auth) {
              if(_auth.username == username) {
                return Promise.resolve();
              }
              else {
                return Promise.reject(new Error('need logout first'));
              }
            }

            // если мы в браузере - авторизуемся во всех базах, в node - мы уже авторизованы
            const try_auth = [];
            if(!_paths.user_node) {
              md.bases().forEach((name) => {
                if(t.remote[name]) {
                  try_auth.push(this.remote[name].login(username, password));
                }
              });
            }

            return Promise.all(try_auth)
              .then(() => {

                _auth = {username};

                // сохраняем имя пользователя в базе
                if(wsql.get_user_param('user_name') != username) {
                  wsql.set_user_param('user_name', username);
                }

                // если настроено сохранение пароля - сохраняем и его
                if(wsql.get_user_param('enable_save_pwd')) {
                  if(aes.Ctr.decrypt(wsql.get_user_param('user_pwd')) != password) {
                    wsql.set_user_param('user_pwd', aes.Ctr.encrypt(password));   // сохраняем имя пользователя в базе
                  }
                }
                else if(wsql.get_user_param('user_pwd') != '') {
                  wsql.set_user_param('user_pwd', '');
                }

                // излучаем событие
                //t.emit('user_log_in', username)
                t.emit_async('user_log_in', username);

                // запускаем синхронизацию для нужных баз
                try_auth.length = 0;
                md.bases().forEach((dbid) => {
                  if(t.local[dbid] && t.remote[dbid] && t.local[dbid] != t.remote[dbid]) {
                    if(_paths.noreplicate && _paths.noreplicate.indexOf(dbid) != -1) {
                      return;
                    }
                    try_auth.push(t.run_sync(dbid));
                  }
                });
                return Promise.all(try_auth);
              })
              .then(() => {
                // широковещательное оповещение об окончании загрузки локальных данных
                if(t.local._loading) {
                  return new Promise((resolve, reject) => {
                    t.once('pouch_data_loaded', resolve);
                  });
                }
                else if(!_paths.user_node) {
                  return t.call_data_loaded();
                }
              })
              .catch(err => {
                // излучаем событие
                t.emit('user_log_fault', err);
              });
          },
        },

        /**
         * ### Останавливает синхронизацию и снимает признак авторизованности
         * @method log_out
         */
        log_out: {
          value: function () {

            if(_auth) {
              const {doc, ram} = _local.sync;
              if(doc) {
                try {
                  doc.cancel();
                  doc.removeAllListeners();
                }
                catch (err) {
                }
              }
              if(ram) {
                try {
                  ram.cancel();
                  ram.removeAllListeners();
                }
                catch (err) {
                }
              }
              _auth = null;
            }

            return Promise.all(this.$p.md.bases().map((id) => {
              if(id != 'meta' && _remote && _remote[id] && _remote[id] != _local[id]) {
                return _remote[id].logout();
              }
            }))
              .then(() => t.emit('user_log_out'));
          },
        },


        /**
         * ### Загружает условно-постоянные данные из базы ram в alasql
         * Используется при инициализации данных на старте приложения
         *
         * @method load_data
         */
        load_data: {
          value: function () {

            const {job_prm} = this.$p;
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

            // бежим по всем документам из ram
            return new Promise((resolve, reject) => {

              function fetchNextPage() {
                t.local.ram.allDocs(options, (err, response) => {

                  if(response) {
                    // широковещательное оповещение о загрузке порции локальных данных
                    _page.page++;
                    _page.total_rows = response.total_rows;
                    _page.duration = Date.now() - _page.start;

                    t.emit('pouch_data_page', Object.assign({}, _page));

                    if(t.load_changes(response, options)) {
                      fetchNextPage();
                    }
                    // широковещательное оповещение об окончании загрузки локальных данных
                    else {
                      t.call_data_loaded(_page);
                      resolve();
                    }
                  }
                  else if(err) {
                    reject(err);
                    // широковещательное оповещение об ошибке загрузки
                    t.emit('pouch_data_error', 'ram', err);
                  }
                });
              }

              t.local.ram.info().then((info) => {
                if(info.doc_count >= (job_prm.pouch_ram_doc_count || 10)) {
                  // широковещательное оповещение о начале загрузки локальных данных
                  t.emit('pouch_load_start', Object.assign(_page, {local_rows: info.doc_count}));
                  t.local._loading = true;
                  fetchNextPage();
                }
                else {
                  t.emit('pouch_no_data', info);
                  resolve();
                }
              });
            });

          },
        },

        /**
         * ### Информирует об авторизованности на сервере CouchDB
         *
         * @property authorized
         */
        authorized: {
          get: function () {
            return _auth && _auth.username;
          },
        },

        /**
         * ### Информирует о загруженности данных
         *
         * @property data_loaded
         */
        data_loaded: {
          get: function () {
            return !!_data_loaded;
          },
        },

        call_data_loaded: {
          value: function (page) {
            if(!_data_loaded) {
              _data_loaded = true;
              if(!page) {
                page = _local.sync._page || {};
              }
              // информируем мир о загруженности данных
              Promise.resolve().then(() => this.emit(page.note = 'pouch_data_loaded', page));
              // пытаемся загрузить load_doc_ram
              this.authorized && this.load_doc_ram();
            }
          },
        },

      });

    }

    sync_events(sync, options) {

    }

    /**
     * ### Запускает процесс синхронизвации
     *
     * @method run_sync
     * @param local {PouchDB}
     * @param remote {PouchDB}
     * @param id {String}
     * @return {Promise.<TResult>}
     */
    run_sync(id) {

      const {local, remote, $p} = this;
      const {wsql, job_prm} = $p;
      const db_local = local[id];
      const db_remote = id == 'meta' ? local._meta : remote[id];
      let linfo, _page;

      return db_local.info()
        .then((info) => {
          linfo = info;
          return db_remote.info();
        })
        .then((rinfo) => {

          // для базы "ram", сервер мог указать тотальную перезагрузку данных
          // в этом случае - очищаем базы и перезапускаем браузер
          if(id == 'ram') {
            return db_remote.get('data_version')
              .then((v) => {
                if(v.version != wsql.get_user_param('couch_ram_data_version')) {
                  // если это не первый запуск - перезагружаем
                  if(wsql.get_user_param('couch_ram_data_version')) {
                    rinfo = this.reset_local_data();
                  }
                  // сохраняем версию в localStorage
                  wsql.set_user_param('couch_ram_data_version', v.version);
                }
                return rinfo;
              })
              .catch(this.$p.record_log)
              .then(() => rinfo);
          }

          return rinfo;
        })
        .then((rinfo) => {

          if(!rinfo) {
            return;
          }

          if(id == 'ram' && linfo.doc_count < (job_prm.pouch_ram_doc_count || 10)) {
            // широковещательное оповещение о начале загрузки локальных данных
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

            // если указан клиентский или серверный фильтр - подключаем
            if(job_prm.pouch_filter && job_prm.pouch_filter[id]) {
              options.filter = job_prm.pouch_filter[id];
            }
            else if(id == 'meta') {
              // если для базы meta фильтр не задан, используем умолчание
              options.filter = 'auth/meta';
            }

            const sync_events = (sync, options) => {

              sync.on('change', (change) => {
                // yo, something changed!
                if(id == 'ram') {
                  this.load_changes(change);

                  if(linfo.doc_count < (job_prm.pouch_ram_doc_count || 10)) {

                    // широковещательное оповещение о загрузке порции данных
                    _page.page++;
                    _page.docs_written = change.docs_written;
                    _page.duration = Date.now() - _page.start;

                    this.emit('pouch_data_page', Object.assign({}, _page));
                  }
                }
                else {
                  // если прибежали изменения базы doc - обновляем только те объекты, которые уже прочитаны в озу
                  change.update_only = true;
                  this.load_changes(change);
                }

                this.emit('pouch_sync_data', id, change);

              })
                .on('denied', (info) => {
                  // a document failed to replicate, e.g. due to permissions
                  this.emit('pouch_sync_denied', id, info);

                })
                .on('error', (err) => {
                  // if(err.result && !err.result.errors.length && sync){
                  //   sync.emit('complete');
                  // }
                  // else{
                  //   // totally unhandled error (shouldn't happen)
                  //   this.emit('pouch_sync_error', id, err);
                  // }
                  // totally unhandled error (shouldn't happen)
                  this.emit('pouch_sync_error', id, err);
                })
                .on('complete', (info) => {
                  // handle complete

                  sync.cancel();
                  sync.removeAllListeners();

                  if(options) {
                    options.live = true;

                    // ram и meta синхронизируем в одну сторону, doc в демо-режиме, так же, в одну сторону
                    if(id == 'ram' || id == 'meta' || wsql.get_user_param('zone') == job_prm.zone_demo) {
                      local.sync[id] = sync_events(db_local.replicate.from(db_remote, options));
                    }
                    else {
                      local.sync[id] = sync_events(db_local.sync(db_remote, options));
                    }

                    resolve(id);
                  }
                });

              if(id == 'ram') {
                sync.on('paused', (info) => {
                  // replication was paused, usually because of a lost connection
                  this.emit('pouch_sync_paused', id, info);

                })
                  .on('active', (info) => {
                    // replication was resumed
                    this.emit('pouch_sync_resumed', id, info);
                  });
              }

              return sync;
            };

            sync_events(db_local.replicate.from(db_remote, options), options);

          });

        });
    }

    /**
     * ### Уничтожает локальные данные
     * Используется при изменении структуры данных на сервере
     *
     * @method reset_local_data
     */
    reset_local_data() {
      const {doc, ram} = this.local;
      const do_reload = () => {
        setTimeout(() => typeof location != 'undefined' && location.reload(true), 1000);
      };

      return this.log_out()
        .then(ram.destroy.bind(ram))
        .then(doc.destroy.bind(doc))
        .then(do_reload)
        .catch(do_reload);
    }

    /**
     * ### Читает объект из pouchdb
     *
     * @method load_obj
     * @param tObj {DataObj} - объект данных, который необходимо прочитать - дозаполнить
     * @return {Promise.<DataObj>} - промис с загруженным объектом
     */
    load_obj(tObj) {

      const db = this.db(tObj._manager);
      return db.get(tObj._manager.class_name + '|' + tObj.ref)
        .then((res) => {
          delete res._id;
          delete res._rev;
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

    /**
     * ### Записывает объект в pouchdb
     *
     * @method save_obj
     * @param tObj {DataObj} - записываемый объект
     * @param attr {Object} - ополнительные параметры записи
     * @return {Promise.<DataObj>} - промис с записанным объектом
     */
    save_obj(tObj, attr) {

      const {_manager, _obj, _data, ref, class_name} = tObj;

      if(!_data || (_data._saving && !_data._modified)) {
        return Promise.resolve(tObj);
      }
      // TODO: опасное место с гонками при одновременной записи
      if(_data._saving && _data._modified) {
        return new Promise((resolve, reject) => {
          setTimeout(() => resolve(this.save_obj(tObj, attr)), 100);
        });
      }
      _data._saving = true;

      const db = this.db(_manager);

      // подмешиваем class_name
      const tmp = Object.assign({_id: class_name + '|' + ref, class_name}, _obj);

      // формируем строку поиска
      if(this.$p.utils.is_doc_obj(tObj) || _manager.build_search) {
        if(_manager.build_search) {
          _manager.build_search(tmp, tObj);
        }
        else {
          tmp.search = (_obj.number_doc + (_obj.note ? ' ' + _obj.note : '')).toLowerCase();
        }
      }

      delete tmp.ref;
      if(attr.attachments) {
        tmp._attachments = attr.attachments;
      }

      return new Promise((resolve, reject) => {
        const getter = tObj.is_new() ? Promise.resolve() : db.get(tmp._id);
        getter.then((res) => {
          if(res) {
            tmp._rev = res._rev;
            for (var att in res._attachments) {
              if(!tmp._attachments) {
                tmp._attachments = {};
              }
              if(!tmp._attachments[att]) {
                tmp._attachments[att] = res._attachments[att];
              }
            }
          }
        })
          .catch((err) => {
            err && err.status != 404 && reject(err);
          })
          .then(() => {
            return db.put(tmp);
          })
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

    /**
     * ### Возвращает набор данных для дерева динсписка
     *
     * @method pouch_tree
     * @param _mgr {DataManager}
     * @param attr {Object}
     * @return {Promise.<Array>}
     */
    get_tree(_mgr, attr) {
      return this.find_rows(_mgr, {
        is_folder: true,
        _raw: true,
        _top: attr.count || 300,
        _skip: attr.start || 0
      })
        .then((rows) => {
          rows.sort((a, b) => {
            if(a.parent == $p.utils.blank.guid && b.parent != $p.utils.blank.guid) {
              return -1;
            }
            if(b.parent == $p.utils.blank.guid && a.parent != $p.utils.blank.guid) {
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
        .then((ares) => $p.iface.data_to_tree.call(_mgr, ares, attr));
    }

    /**
     * ### Возвращает набор данных для динсписка
     *
     * @method get_selection
     * @param _mgr {DataManager}
     * @param attr
     * @return {Promise.<Array>}
     */
    get_selection(_mgr, attr) {

      const {utils, classes} = this.$p;
      const db = this.db(_mgr);
      const cmd = attr.metadata || _mgr.metadata();
      const flds = ['ref', '_deleted']; // поля запроса
      const selection = {
        _raw: true,
        _total_count: true,
        _top: attr.count || 30,
        _skip: attr.start || 0,
      };   // условие см. find_rows()
      const ares = [];


      // набираем поля
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
        if(cmd['hierarchical'] && cmd['group_hierarchy']) {
          flds.push('is_folder');
        }
        else {
          flds.push('0 as is_folder');
        }

        if(cmd['main_presentation_name']) {
          flds.push('name as presentation');
        }
        else {
          if(cmd['code_length']) {
            flds.push('id as presentation');
          }
          else {
            flds.push('... as presentation');
          }
        }

        if(cmd['has_owners']) {
          flds.push('owner');
        }

        if(cmd['code_length']) {
          flds.push('id');
        }

      }

      // набираем условие
      // фильтр по дате
      if(_mgr.metadata('date') && (attr.date_from || attr.date_till)) {

        if(!attr.date_from) {
          attr.date_from = new Date('2017-01-01');
        }
        if(!attr.date_till) {
          attr.date_till = $p.utils.date_add_day(new Date(), 1);
        }

        selection.date = {between: [attr.date_from, attr.date_till]};
      }

      // фильтр по родителю
      if(cmd['hierarchical'] && attr.parent) {
        selection.parent = attr.parent;
      }

      // добавляем условия из attr.selection
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

      // прибиваем фильтр по дате, если он встроен в ключ
      if(selection._key && selection._key._drop_date && selection.date) {
        delete selection.date;
      }

      // строковый фильтр по полям поиска, если он не описан в ключе
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

      // обратная сортировка по ключу, если есть признак сортировки в ключе и 'des' в атрибутах
      if(selection._key && selection._key._order_by) {
        selection._key._order_by = attr.direction;
      }

      // фильтр по владельцу
      //if(cmd["has_owners"] && attr.owner)
      //	selection.owner = attr.owner;

      return this.find_rows(_mgr, selection)
        .then((rows) => {

          if(rows.hasOwnProperty('_total_count') && rows.hasOwnProperty('rows')) {
            attr._total_count = rows._total_count;
            rows = rows.rows;
          }

          rows.forEach((doc) => {

            // наполняем
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

    /**
     * Загружает объекты из PouchDB по массиву ссылок
     *
     * @param _mgr {DataManager}
     * @param refs {Array}
     * @param with_attachments {Boolean}
     * @return {*}
     */
    load_array(_mgr, refs, with_attachments) {

      if(!refs.length) {
        return Promise.resolve(false);
      }

      const options = {
          limit: refs.length + 1,
          include_docs: true,
          keys: refs.map((v) => _mgr.class_name + '|' + v),
        },
        db = this.db(_mgr);

      if(with_attachments) {
        options.attachments = true;
        options.binary = true;
      }

      return db.allDocs(options).then((result) => this.load_changes(result, {}));
    }

    /**
     * Загружает объекты из PouchDB, обрезанные по view
     */
    load_view(_mgr, _view) {

      var doc, res = [],
        db = this.db(_mgr),
        options = {
          limit: 1000,
          include_docs: true,
          startkey: _mgr.class_name + '|',
          endkey: _mgr.class_name + '|\ufff0',
        };

      return new Promise((resolve, reject) => {

        function process_docs(err, result) {

          if(result) {

            if(result.rows.length) {

              options.startkey = result.rows[result.rows.length - 1].key;
              options.skip = 1;

              result.rows.forEach((rev) => {
                doc = rev.doc;
                let key = doc._id.split('|');
                doc.ref = key[1];
                // наполняем
                res.push(doc);
              });

              _mgr.load_array(res);
              res.length = 0;

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

    /**
     * ### Загружает объекты с типом кеширования doc_ram в ОЗУ
     * @method load_doc_ram
     */
    load_doc_ram() {
      const res = [];
      const {_m} = this.$p.md;
      ['cat', 'cch', 'ireg'].forEach((kind) => {
        for (let name in _m[kind]) {
          if(_m[kind][name].cachable == 'doc_ram') {
            res.push(kind + '.' + name);
          }
        }
      });
      return this.local.doc.find({
        selector: {class_name: {$in: res}},
        limit: 10000,
      })
        .then((data) => this.load_changes(data))
        .then(() => this.emit('pouch_doc_ram_loaded'));
    }

    /**
     * ### Найти строки
     * Возвращает массив дата-объектов, обрезанный отбором _selection_<br />
     * Eсли отбор пустой, возвращаются все строки из PouchDB.
     *
     * @method pouch_find_rows
     * @param _mgr {DataManager}
     * @param selection {Object|function} - в ключах имена полей, в значениях значения фильтра или объект {like: "значение"} или {not: значение}
     * @param [selection._top] {Number}
     * @param [selection._skip] {Number}
     * @param [selection._raw] {Boolean} - если _истина_, возвращаются сырые данные, а не дата-объекты
     * @param [selection._total_count] {Boolean} - если _истина_, вычисляет общее число записей под фильтром, без учета _skip и _top
     * @return {Promise.<Array>}
     */
    find_rows(_mgr, selection) {

      const db = this.db(_mgr);

      // если указан MangoQuery, выполняем его без лишних церемоний
      if(selection && selection._mango) {
        return db.find(selection)
          .then(({docs}) => {
            if(!docs) {
              docs = [];
            }
            for (const doc of docs) {
              doc.ref = doc._id.split('|')[1];
            }
            return docs;
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

      // если сказано посчитать все строки...
      if(_total_count) {

        calc_count = true;
        _total_count = 0;

        // если нет фильтра по строке или фильтр растворён в ключе
        if(Object.keys(selection).length <= 1) {

          // если фильтр в ключе, получаем все строки без документов
          if(selection._key && selection._key.hasOwnProperty('_search')) {
            options.include_docs = false;
            options.limit = 100000;

            return db.query(_view, options)
              .then((result) => {

                result.rows.forEach((row) => {

                  // фильтруем
                  if(!selection._key._search || row.key[row.key.length - 1].toLowerCase().indexOf(selection._key._search) != -1) {

                    _total_count++;

                    // пропукскаем лишние (skip) элементы
                    if(skip) {
                      skip_count++;
                      if(skip_count < skip) {
                        return;
                      }
                    }

                    // ограничиваем кол-во возвращаемых элементов
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
              .then((result) => {
                return {
                  rows: result.rows.map((row) => {

                    var doc = row.doc;

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

      // бежим по всем документам из ram
      return new Promise((resolve, reject) => {

        function process_docs(err, result) {

          if(result) {

            if(result.rows.length) {

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

                // фильтруем
                if(!utils._selection.call(_mgr, doc, selection)) {
                  return;
                }

                if(calc_count) {
                  _total_count++;
                }

                // пропукскаем лишние (skip) элементы
                if(skip) {
                  skip_count++;
                  if(skip_count < skip) {
                    return;
                  }
                }

                // ограничиваем кол-во возвращаемых элементов
                if(top) {
                  top_count++;
                  if(top_count > top) {
                    return;
                  }
                }

                // наполняем
                res.push(doc);
              });

              if(top && top_count > top && !calc_count) {
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
          else if(err) {
            reject(err);
          }
        }

        function fetch_next_page() {

          if(_view) {
            db.query(_view, options, process_docs);
          }
          else {
            db.allDocs(options, process_docs);
          }
        }

        fetch_next_page();
      });
    }

    /**
     * ### Сохраняет присоединенный файл
     *
     * @method save_attachment
     * @param _mgr {DataManager}
     * @param ref
     * @param att_id
     * @param attachment
     * @param type
     * @return {Promise}
     * @async
     */
    save_attachment(_mgr, ref, att_id, attachment, type) {

      if(!type) {
        type = {type: 'text/plain'};
      }

      if(!(attachment instanceof Blob) && type.indexOf('text') == -1) {
        attachment = new Blob([attachment], {type: type});
      }

      // получаем ревизию документа
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

    /**
     * Получает присоединенный к объекту файл
     * @param _mgr {DataManager}
     * @param ref
     * @param att_id
     * @return {Promise}
     */
    get_attachment(_mgr, ref, att_id) {

      return this.db(_mgr).getAttachment(_mgr.class_name + '|' + this.$p.utils.fix_guid(ref), att_id);

    }

    /**
     * Удаляет присоединенный к объекту файл
     * @param _mgr {DataManager}
     * @param ref
     * @param att_id
     * @return {Promise}
     */
    delete_attachment(_mgr, ref, att_id) {

      // получаем ревизию документа
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
          return db.removeAttachment(ref, att_id, _rev);
        });
    }

    /**
     * ### Загружает в менеджер изменения или полученные через allDocs данные
     *
     * @method load_changes
     * @param changes
     * @param options
     * @return {boolean}
     */
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

    /**
     * Формирует архив полной выгрузки базы для сохранения в файловой системе клиента
     * @method backup_database
     * @param [do_zip] {Boolean} - указывает на необходимость архивировать стоки таблиц в озу перед записью файла
     * @async
     */
    backup_database(do_zip) {

      // получаем строку create_tables

      // получаем строки для каждой таблицы

      // складываем все части в файл
    }

    /**
     * Восстанавливает базу из архивной копии
     * @method restore_database
     * @async
     */
    restore_database(do_zip) {

      // получаем строку create_tables

      // получаем строки для каждой таблицы

      // складываем все части в файл
    }

  };
}

export default (constructor) => {

  const {classes} = constructor;
  classes.PouchDB = PouchDB;
  classes.AdapterPouch = adapter(classes);


}

