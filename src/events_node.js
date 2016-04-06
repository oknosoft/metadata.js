/**
 * Аналог dhx4.attachEvent / dhx4.callEvent для NodeJS
 * Created 16.01.2016<br />
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 * @module events_node
 */

(function(obj) {

	obj._evnts = { data: {} };

	obj.attachEvent = function(name, func) {
		name = String(name).toLowerCase();
		if (!this._evnts.data[name]) this._evnts.data[name] = {};
		var eventId = $p.generate_guid();
		this._evnts.data[name][eventId] = func;
		return eventId;
	}

	obj.detachEvent = function(eventId) {
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

	obj.checkEvent = function(name) {
		name = String(name).toLowerCase();
		return (this._evnts.data[name] != null);
	}

	obj.callEvent = function(name, params) {
		name = String(name).toLowerCase();
		if (this._evnts.data[name] == null) return true;
		var r = true;
		for (var a in this._evnts.data[name]) {
			r = this._evnts.data[name][a].apply(this, params) && r;
		}
		return r;
	}

	obj.detachAllEvents = function() {
		for (var a in this._evnts.data) {
			for (var b in this._evnts.data[a]) {
				this._evnts.data[a][b] = null;
				delete this._evnts.data[a][b];
			}
			this._evnts.data[a] = null;
			delete this._evnts.data[a];
		}
	}

	obj = null;

})($p.eve);