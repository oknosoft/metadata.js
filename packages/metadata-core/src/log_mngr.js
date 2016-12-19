/**
 * ### Журнал регистрации
 *
 * @module log_mngr
 *
 * Created 19.12.2016
 */

function log_mngr($p) {

	/**
	 * ### Журнал событий
	 * Хранит и накапливает события сеанса
	 * Является наследником регистра сведений
	 * @extends InfoRegManager
	 * @class LogManager
	 * @static
	 */
	class LogManager extends classes.InfoRegManager{

		constructor() {
			super("ireg.log");
		}

		/**
		 * Добавляет запись в журнал
		 * @param msg {String|Object|Error} - текст + класс события
		 * @param [msg.obj] {Object} - дополнительный json объект
		 */
		record(msg){

			if(msg instanceof Error){
				if(console)
					console.log(msg);
				msg = {
					class: "error",
					note: msg.toString()
				}
			}else if(typeof msg == "object" && !msg.class && !msg.obj){
				msg = {
					class: "obj",
					obj: msg,
					note: msg.note
				};
			}else if(typeof msg != "object")
				msg = {note: msg};

			msg.date = Date.now() + wsql.time_diff;

			// уникальность ключа
			if(!this.smax)
				this.smax = alasql.compile("select MAX(`sequence`) as `sequence` from `ireg_log` where `date` = ?");
			var res = this.smax([msg.date]);
			if(!res.length || res[0].sequence === undefined)
				msg.sequence = 0;
			else
				msg.sequence = parseInt(res[0].sequence) + 1;

			// класс сообщения
			if(!msg.class)
				msg.class = "note";

			wsql.alasql("insert into `ireg_log` (`ref`, `date`, `sequence`, `class`, `note`, `obj`) values (?,?,?,?,?,?)",
				[msg.date + "¶" + msg.sequence, msg.date, msg.sequence, msg.class, msg.note, msg.obj ? JSON.stringify(msg.obj) : ""]);

		}

		/**
		 * Сбрасывает события на сервер
		 * @method backup
		 * @param [dfrom] {Date}
		 * @param [dtill] {Date}
		 */
		backup(dfrom, dtill){

		}

		/**
		 * Восстанавливает события из архива на сервере
		 * @method restore
		 * @param [dfrom] {Date}
		 * @param [dtill] {Date}
		 */
		restore(dfrom, dtill){

		}

		/**
		 * Стирает события в указанном диапазоне дат
		 * @method clear
		 * @param [dfrom] {Date}
		 * @param [dtill] {Date}
		 */
		clear(dfrom, dtill){

		}

		show(pwnd) {

		}

		get(ref, force_promise, do_not_create) {

			if(typeof ref == "object")
				ref = ref.ref || "";

			if(!this.by_ref[ref]){

				if(force_promise === false)
					return undefined;

				var parts = ref.split("¶");
				wsql.alasql("select * from `ireg_log` where date=" + parts[0] + " and sequence=" + parts[1])
					.forEach(row => new RegisterRow(row, this));
			}

			return force_promise ? Promise.resolve(this.by_ref[ref]) : this.by_ref[ref];
		}

		get_sql_struct(attr){

			if(attr && attr.action == "get_selection"){
				var sql = "select * from `ireg_log`";
				if(attr.date_from){
					if (attr.date_till)
						sql += " where `date` >= ? and `date` <= ?";
					else
						sql += " where `date` >= ?";
				}else if (attr.date_till)
					sql += " where `date` <= ?";

				return sql;

			}else
				return classes.InfoRegManager.prototype.get_sql_struct.call(this, attr);
		}

		caption_flds(attr) {

			var _meta = (attr && attr.metadata) || this.metadata(),
				acols = [];

			if(_meta.form && _meta.form[attr.form || 'selection']) {
				acols = _meta.form[attr.form || 'selection'].cols;

			}else{
				acols.push(new Col_struct("date", "200", "ro", "left", "server", "Дата"));
				acols.push(new Col_struct("class", "100", "ro", "left", "server", "Класс"));
				acols.push(new Col_struct("note", "*", "ro", "left", "server", "Событие"));
			}

			return acols;
		}

		data_to_grid(data, attr) {
			var xml = "<?xml version='1.0' encoding='UTF-8'?><rows total_count='%1' pos='%2' set_parent='%3'>"
					.replace("%1", data.length).replace("%2", attr.start)
					.replace("%3", attr.set_parent || "" ),
				caption = this.caption_flds(attr);

			// при первом обращении к методу добавляем описание колонок
			xml += caption.head;

			data.forEach(row => {
				xml += "<row id=\"" + row.ref + "\"><cell>" +
					moment(row.date - wsql.time_diff).format("DD.MM.YYYY HH:mm:ss") + "." + row.sequence + "</cell>" +
					"<cell>" + (row.class || "") + "</cell><cell>" + (row.note || "") + "</cell></row>";
			});

			return xml + "</rows>";
		}

	}

	/**
	 * ### Регистр сведений log
	 * Журнал событий
	 * @class IregLog
	 * @extends RegisterRow
	 * @constructor
	 */
	$p.IregLog = class IregLog extends classes.RegisterRow {

		get date(){return this._getter('date')}
		set date(v){this._setter('date',v)}

		get sequence(){return this._getter('sequence')}
		set sequence(v){this._setter('sequence',v)}

		get class(){return this._getter('class')}
		set class(v){this._setter('class',v)}

		get note(){return this._getter('note')}
		set note(v){this._setter('note',v)}

		get obj(){return this._getter('obj')}
		set obj(v){this._setter('obj',v)}

	}

	// публикуем конструктор журнала регистрации
	Object.defineProperties(classes, {

		LogManager: { value: LogManager }

	})

	// создаём менеджер журнала регистрации
	Object.defineProperty($p.ireg, 'log', {
		value: new LogManager('ireg.log')
	})

}