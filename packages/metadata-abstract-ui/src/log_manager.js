/**
 *
 * ### Метаданные журнала регистрации
 *
 * @module log_manager
 *
 * Created 08.01.2017
 */

export default function log_manager() {

  const {classes} = this;
  const {InfoRegManager, RegisterRow} = classes;

  /**
   * ### Журнал событий
   * Хранит и накапливает события сеанса
   * Является наследником регистра сведений
   * @extends InfoRegManager
   * @class LogManager
   * @static
   */
  class LogManager extends InfoRegManager {

    constructor(owner) {
      super(owner, 'ireg.log');

      this._stamp = Date.now();
      // раз в полторы минуты, пытаемся сбросить данные на сервер
      setInterval(this.backup.bind(this, 'stamp'), 90000);

    }

    /**
     * Добавляет запись в журнал
     * @param msg {String|Object|Error} - текст + класс события
     * @param [msg.obj] {Object} - дополнительный json объект
     */
    record(msg) {

      const {wsql} = this._owner.$p;

      if(msg instanceof Error) {
        if(console) {
          console.log(msg);
        }
        msg = {
          class: 'error',
          note: msg.toString(),
        };
      }
      else if(typeof msg == 'object' && !msg.class && !msg.obj) {
        msg = {
          class: 'obj',
          obj: msg,
          note: msg.note,
        };
      }
      else if(typeof msg != 'object') {
        msg = {note: msg};
      }

      if(wsql.alasql.databases.dbo.tables.ireg_log) {
        msg.date = Date.now() + wsql.time_diff;

        // уникальность ключа
        if(!this.smax){
          this.smax = wsql.alasql.compile('select MAX(`sequence`) as `sequence` from `ireg_log` where `date` = ?');
        }
        const res = this.smax([msg.date]);
        if(!res.length || res[0].sequence === undefined) {
          msg.sequence = 0;
        }
        else {
          msg.sequence = parseInt(res[0].sequence) + 1;
        }

        // класс сообщения
        if(!msg.class) {
          msg.class = 'note';
        }

        wsql.alasql('insert into `ireg_log` (`ref`, `date`, `sequence`, `class`, `note`, `obj`) values (?,?,?,?,?,?)',
          [msg.date + '¶' + msg.sequence, msg.date, msg.sequence, msg.class, msg.note, msg.obj ? JSON.stringify(msg.obj) : '']);
      }

    }

    /**
     * Сбрасывает события на сервер
     * @method backup
     * @param [dfrom] {Date}
     * @param [dtill] {Date}
     */
    backup(dfrom, dtill) {
      const {wsql, adapters: {pouch}, utils: {moment}} = this._owner.$p;

      if(dfrom === 'stamp' && pouch.authorized) {
        dfrom = this._stamp;
        if(!pouch.remote.log) {
          const {__opts} = (pouch.remote.ram || pouch.remote.remote || pouch.remote.doc);
          pouch.remote.log = new classes.PouchDB(__opts.name.replace(/(ram|remote|doc)$/, 'log'),
            {skip_setup: true, adapter: 'http', auth: __opts.auth});
        }

        if(!this._rows){
          this._rows = wsql.alasql.compile('select * from `ireg_log` where `date` >= ?');
        }

        const _stamp = Date.now();
        const rows = this._rows([this._stamp + wsql.time_diff]);
        for(const row of rows) {
          row._id = `${moment(row.date - wsql.time_diff).format('YYYYMMDDHHmmssSSS') + row.sequence}|${pouch.props._suffix || '0000'}|${pouch.authorized}`;
          if(row.obj) {
            row.obj = JSON.parse(row.obj);
          }
          else{
            delete row.obj;
          }
          delete row.ref;
          delete row.user;
          delete row._deleted;
        }
        rows.length && pouch.remote.log.bulkDocs(rows)
          .then((result) => {
            this._stamp = _stamp;
          }).catch((err) => {
            console.log(err);
          });
      }

    }

    /**
     * Восстанавливает события из архива на сервере
     * @method restore
     * @param [dfrom] {Date}
     * @param [dtill] {Date}
     */
    restore(dfrom, dtill) {

    }

    /**
     * Стирает события в указанном диапазоне дат
     * @method clear
     * @param [dfrom] {Date}
     * @param [dtill] {Date}
     */
    clear(dfrom, dtill) {

    }

    show(pwnd) {

    }

    get(ref, force_promise, do_not_create) {

      if(typeof ref == 'object') {
        ref = ref.ref || '';
      }

      if(!this.by_ref[ref]) {

        if(force_promise === false) {
          return undefined;
        }

        var parts = ref.split('¶');
        this._owner.$p.wsql.alasql('select * from `ireg_log` where date=' + parts[0] + ' and sequence=' + parts[1])
          .forEach(row => new RegisterRow(row, this));
      }

      return force_promise ? Promise.resolve(this.by_ref[ref]) : this.by_ref[ref];
    }

    get_sql_struct(attr) {

      if(attr && attr.action == 'get_selection') {
        var sql = 'select * from `ireg_log`';
        if(attr.date_from) {
          if(attr.date_till) {
            sql += ' where `date` >= ? and `date` <= ?';
          }
          else {
            sql += ' where `date` >= ?';
          }
        }
        else if(attr.date_till) {
          sql += ' where `date` <= ?';
        }

        return sql;

      }
      else {
        return InfoRegManager.prototype.get_sql_struct.call(this, attr);
      }
    }

  }

  /**
   * ### Регистр сведений log
   * Журнал событий
   * @class IregLog
   * @extends RegisterRow
   * @constructor
   */
  this.IregLog = class IregLog extends RegisterRow {

    get date() {return this._getter('date')}
    set date(v) {this._setter('date', v)}

    get sequence() {return this._getter('sequence')}
    set sequence(v) {this._setter('sequence', v)}

    get class() {return this._getter('class')}
    set class(v) {this._setter('class', v)}

    get note() {return this._getter('note')}
    set note(v) {this._setter('note', v)}

    get obj() {return this._getter('obj')}
    set obj(v) {this._setter('obj', v)}

    get user() {return this._getter('obj')}
    set user(v) {this._setter('obj', v)}

  };

  // публикуем конструкторы системных менеджеров
  classes.LogManager = LogManager;

  // создаём менеджер журнала регистрации
  this.ireg.create('log', LogManager);

}
