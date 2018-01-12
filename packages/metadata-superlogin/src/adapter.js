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
     * Cерверные на старте создавать не надо
     */
    after_init() {

    }

    /**
     * ### Создаёт базы remote и запускает репликацию
     * @method log_in
     * @return {Promise}
     */
    log_in(username, password) {

      const {props, local, remote, $p} = this;
      const {job_prm, wsql, aes, md, superlogin} = $p;

      const start = superlogin.getSession() ? Promise.resolve(superlogin.getSession()) : superlogin.login({username, password})
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

        // создаём базы
        super.after_init();

        // сохраняем имя пользователя в localstorage
        if(wsql.get_user_param('user_name') != session.user_id) {
          wsql.set_user_param('user_name', session.user_id);
        }

        // излучаем событие
        this.emit_async('user_log_in', session.user_id);

        // запускаем синхронизацию для нужных баз
        return this.after_log_in()
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
      const {$p, props: {path, prefix, zone}} = this;
      let url = $p.superlogin.getDbUrl(prefix + (name == 'meta' ? name : (zone + '_' + name)));
      if(/localhost:5984/.test(url)) {
        url = url.replace('localhost:5984', 'localhost:5984');
      }
      return url;
    }

    /**
     * ### Информирует об авторизованности на сервере CouchDB
     *
     * @property authorized
     */
    get authorized() {
      return !!this.$p.superlogin.getSession();
    }
  };

}
