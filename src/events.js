/**
 * Содержит методы обработки событий __при запуске__ программы, __перед закрытием__,<br />
 * при обновлении файлов __ApplicationCache__, а так же, при переходе в __offline__ и __online__
 *
 *	События развиваются в такой последовательности:
 *
 *	1) выясняем, совместим ли браузер. В зависимости от параметров url и параметров по умолчанию,
 *	 может произойти переход в ChromeStore или другие действия
 *
 *	2) анализируем AppCache, при необходимости обновляем скрипты и перезагружаем страницу
 *
 * 	3) инициализируем $p.wsql и комбинируем параметры работы программы с параметрами url
 *
 * 	4) если режим работы предполагает использование построителя, подключаем слушатель его событий.
 *	 по событию построителя "ready", выполняем метод initMainLayout() объекта $p.iface.
 *	 Метод initMainLayout() переопределяется во внешним, по отношению к ядру, модуле
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module common
 * @submodule events
 */

/**
 * ### Обработчики событий приложения
 *
 * Cм. так же, модули {{#crossLinkModule "events"}}{{/crossLinkModule}} и {{#crossLinkModule "events_browser"}}{{/crossLinkModule}}
 *
 * @class AppEvents
 * @static
 * @menuorder 30
 * @tooltip Движок событий
 */
function AppEvents() {

	// если мы внутри браузера и загружен dhtmlx, переносим в AppEvents свойства dhx4
	if(typeof window !== "undefined" && window.dhx4){
		for(var p in dhx4){
			this[p] = dhx4[p];
			delete dhx4[p];
		}
		window.dhx4 = this;

	}else{
		AppEvents.do_eventable(this);
	}

}

/**
 * ### Добавляет объекту методы генерации и обработки событий
 *
 * @method
 * @for AppEvents
 * @static
 */
AppEvents.do_eventable = function (obj) {

	function attach(name, func) {
		name = String(name).toLowerCase();
		if (!this._evnts.data[name])
			this._evnts.data[name] = {};
		var eventId = $p.generate_guid();
		this._evnts.data[name][eventId] = func;
		return eventId;
	}

	function detach(eventId) {
		for (var a in this._evnts.data) {
			var k = 0;
			for (var b in this._evnts.data[a]) {
				if (b == eventId) {
					this._evnts.data[a][b] = null;
					delete this._evnts.data[a][b];
				} else {
					k++;
				}
			}
			if (k == 0) {
				this._evnts.data[a] = null;
				delete this._evnts.data[a];
			}
		}
	}

	function call(name, params) {
		name = String(name).toLowerCase();
		if (this._evnts.data[name] == null)
			return true;
		var r = true;
		for (var a in this._evnts.data[name]) {
			r = this._evnts.data[name][a].apply(this, params) && r;
		}
		return r;
	}

	function ontimer() {

		for(var name in this._evnts.evnts){
			var l = this._evnts.evnts[name].length;
			if(l){
				for(var i=0; i<l; i++){
					this.emit(name, this._evnts.evnts[name][i]);
				}
				this._evnts.evnts[name].length = 0;
			}
		}

		this._evnts.timer = 0;
	}

	obj.__define({

		_evnts: {
			value: {
				data: {},
				timer: 0,
				evnts: {}
			}
		},

		on: {
			value: attach
		},

		attachEvent: {
			value: attach
		},

		off: {
			value: detach
		},

		detachEvent: {
			value: detach
		},

		checkEvent: {
			value: function(name) {
				name = String(name).toLowerCase();
				return (this._evnts.data[name] != null);
			}
		},

		callEvent: {
			value: call
		},

		emit: {
			value: call
		},

		emit_async: {
			value: function callEvent(name, params){

				if(!this._evnts.evnts[name])
					this._evnts.evnts[name] = [];

				this._evnts.evnts[name].push(params);

				if(this._evnts.timer)
					clearTimeout(this._evnts.timer);

				this._evnts.timer = setTimeout(ontimer.bind(this), 4);
			}
		}

	});
};

