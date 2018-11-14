/**
 * ### Переопределяет методы адаптера pouchdb
 *
 * @module pouchdb
 *
 * Created by Evgeniy Malyarov on 22.10.2017.
 */

export default (constructor) => {

  const {classes} = constructor;

  classes.AdapterPouch = class AdapterPouchSuperlogin extends classes.AdapterPouch {

    /**
     * Cерверные на старте создавать не надо, за исключением autologin
     */
    after_init() {
      const {props, local, remote, authorized, $p: {superlogin}} = this;
      const opts = {skip_setup: true, adapter: 'http'};

      // создаём анонимные базы либо с реквизитами авторизации из superlogin
      const bases = new Map();
      const check = [];

      props.autologin.forEach((name) => {
        if(!remote[name]) {
          bases.set(name, new PouchDB(authorized ? this.dbpath(name) : super.dbpath(name), opts));
          check.push(bases.get(name).info());
        }
      });

      return Promise.all(check)
        .catch(() => {
          // если проблемы с авторизацией, создаём анонимные базы
          const close = [];
          // закрываем текущие базы
          bases.forEach((value) => close.push(value.close()));

          return Promise.all(close)
            .then(() => superlogin.logout())
            .then(() => {
              bases.clear();
              check.length = [];
              props.autologin.forEach((name) => {
                if(!remote[name]) {
                  bases.set(name, new PouchDB(super.dbpath(name), opts));
                  check.push(bases.get(name).info());
                }
              });
            })
            .then(() => Promise.all(check));
        })
        .then(() => {
          bases.forEach((value, key) => remote[key] = value);
        })
        .then(() => {
          if(bases.get('ram')) {
            this.run_sync('ram')
              .then(() => {
                // широковещательное оповещение об окончании загрузки локальных данных
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
        })
        .then(() => this.emit_async('pouch_autologin', true));
    }

    recreate(name) {
      if(name === 'doc' || name === 'ram') {
        return;
      }
      const {remote} = this;
      const url = this.dbpath(name);
      if(url && (!remote[name] || remote[name].name !== url)) {
        remote[name] && remote[name].close();
        remote[name] = new PouchDB(url, {skip_setup: true, adapter: 'http'});
      }
    }

    /**
     * ### Создаёт базы remote и запускает репликацию
     * @method log_in
     * @return {Promise}
     */
    log_in(username, password) {

      const {props, local, remote, $p, authorized} = this;
      const {job_prm, wsql, aes, md, superlogin} = $p;

      const start = authorized ?
        superlogin.refresh()
          .catch(() => {
            superlogin.logout()
              .then(() => superlogin.login({username, password}));
          })
        :
        superlogin.login({username, password})
          .catch((err) => {
            this.emit('user_log_fault', {message: 'custom', text: err.message});
            return Promise.reject(err);
          });

      return start.then((session) => {
        // при пустой сесии, дальше не движемся
        if(!session) {
          const err = new Error('empty login or password');
          this.emit('user_log_fault', err);
          return Promise.reject(err);
        }

        // если уже авторизованы под тем же пользователем, выходим с успешным результатом
        if(this.props._auth) {
          if(this.props._auth.username == username) {
            return Promise.resolve();
          }
          else {
            const err = new Error('need logout first');
            this.emit('user_log_fault', err);
            return Promise.reject(err);
          }
        }

        // создаём недостающие базы
        super.after_init();

        // пересоздаём базы autologin
        for(const name of props.autologin) {
          this.recreate(name);
        }

        // дополнительные базы пользователя
        for(const id in session.userDBs) {
          this.recreate(id.replace(/.*_/, ''));
        }

        // сохраняем имя пользователя в localstorage
        if(wsql.get_user_param('user_name') != session.user_id) {
          wsql.set_user_param('user_name', session.user_id);
        }

        // излучаем событие
        this.emit_async('user_log_in', session.user_id);

        // запускаем синхронизацию для нужных баз
        return this.emit_promise('on_log_in')
          .then(() => this.after_log_in())
          .catch(err => {
            // излучаем событие
            this.emit('user_log_fault', err);
          });
      });
    }

    /**
     * ### Путь к базе couchdb
     * внешние плагины, например, superlogin, могут переопределить этот метод
     * @param name
     * @return {*}
     */
    dbpath(name) {
      let {$p: {superlogin}, props: {path, prefix, zone}} = this;
      let url = superlogin.getDbUrl(prefix + (name == 'meta' ? name : (zone + '_' + name)));
      let localhost = 'localhost:5984/' + prefix;
      if(!url) {
        url = superlogin.getDbUrl(name);
        if(url) {
          const regex = new RegExp(prefix + '$');
          path = path.replace(regex, '');
          localhost = localhost.replace(regex, '');
        }
      }
      if(!url) {
        url = superlogin.getDbUrl(prefix + zone + '_doc');
        const pos = url.indexOf(prefix + (name == 'meta' ? name : (zone + '_doc')));
        url = url.substr(0, pos) + prefix + (name == 'meta' ? name : (zone + '_' + name));
        localhost = 'localhost:5984/' + prefix;
      }
      if(url.indexOf(localhost) !== -1) {
        const https = path.indexOf('https://') !== -1;
        if(https){
          url = url.replace('http://', 'https://');
        }
        url = url.replace(localhost, path.substr(https ? 8 : 7));
      }
      return url;
    }

    /**
     * ### Информирует об авторизованности на сервере CouchDB
     *
     * @property authorized
     */
    get authorized() {
      const session = $p.superlogin.getSession();
      return session && session.user_id;
    }
  };

}
