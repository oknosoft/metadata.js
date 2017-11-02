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
    log_in() {

      const {props, local, remote, $p} = this;
      const {job_prm, wsql, aes, md, superlogin} = $p;

      // при пустой сесии, дальше не движемся
      if(!superlogin._session) {
        return Promise.reject(new Error('Empty superlogin session'));
      }

      // если уже авторизованы под тем же пользователем, выходим с успешным результатом
      if(this.props._auth) {
        if(this.props._auth.username == username) {
          return Promise.resolve();
        }
        else {
          return Promise.reject(new Error('need logout first'));
        }
      }

      // создаём базы
      super.after_init();

      // сохраняем имя пользователя в localstorage
      if(wsql.get_user_param('user_name') != superlogin._session.user_id) {
        wsql.set_user_param('user_name', superlogin._session.user_id);
      }

      // излучаем событие
      this.emit_async('user_log_in', superlogin._session.user_id);

      // запускаем синхронизацию для нужных баз
      return this.after_log_in()
        .catch(err => {
          // излучаем событие
          this.emit('user_log_fault', err);
        });
    }

    /**
     * ### Путь к базе couchdb
     * внешние плагины, например, superlogin, могут переопределить этот метод
     * @param name
     * @return {*}
     */
    dbpath(name) {
      const {$p, props} = this;
      const {superlogin} = $p;
      return $p.superlogin.getDbUrl(props.prefix + (name == 'meta' ? name : (props.zone + '_' + name)));
    }

    /**
     * ### Информирует об авторизованности на сервере CouchDB
     *
     * @property authorized
     */
    get authorized() {
      return !!this.$p.superlogin._session;
    }
  }

}
