'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.MetaEventEmitter = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * ### MetaEventEmitter будет прототипом менеджеров данных
 */
var MetaEventEmitter = exports.MetaEventEmitter = function (_EventEmitter) {
	_inherits(MetaEventEmitter, _EventEmitter);

	function MetaEventEmitter() {
		_classCallCheck(this, MetaEventEmitter);

		return _possibleConstructorReturn(this, (MetaEventEmitter.__proto__ || Object.getPrototypeOf(MetaEventEmitter)).apply(this, arguments));
	}

	_createClass(MetaEventEmitter, [{
		key: 'on',


		/**
   * Расширяем метод _on_, чтобы в него можно было передать объект
   * @param type
   * @param listener
   */
		value: function on(type, listener) {

			if (arguments.length > 1 || (typeof type === 'undefined' ? 'undefined' : _typeof(type)) != 'object') {
				_get(MetaEventEmitter.prototype.__proto__ || Object.getPrototypeOf(MetaEventEmitter.prototype), 'on', this).call(this, type, listener);
			} else {
				for (var fld in type) {
					if (type.hasOwnProperty(fld)) _get(MetaEventEmitter.prototype.__proto__ || Object.getPrototypeOf(MetaEventEmitter.prototype), 'on', this).call(this, fld, type[fld]);
				}
			}
		}
	}]);

	return MetaEventEmitter;
}(_events2.default);

var AbstracrAdapter = function (_MetaEventEmitter) {
	_inherits(AbstracrAdapter, _MetaEventEmitter);

	function AbstracrAdapter($p) {
		_classCallCheck(this, AbstracrAdapter);

		var _this2 = _possibleConstructorReturn(this, (AbstracrAdapter.__proto__ || Object.getPrototypeOf(AbstracrAdapter)).call(this));

		Object.defineProperty(_this2, '$p', { value: $p });
		return _this2;
	}

	/**
  * ### Читает объект из pouchdb
  *
  * @method load_obj
  * @param tObj {DataObj} - объект данных, который необходимо прочитать - дозаполнить
  * @return {Promise.<DataObj>} - промис с загруженным объектом
  */


	_createClass(AbstracrAdapter, [{
		key: 'load_obj',
		value: function load_obj(tObj) {

			return Promise.resolve(tObj);
		}

		/**
   * Загружает объекты из базы данных по массиву ссылок
   *
   * @method load_array
   * @param _mgr {DataManager}
   * @param refs {Array}
   * @param with_attachments {Boolean}
   * @return {*}
   */

	}, {
		key: 'load_array',
		value: function load_array(_mgr, refs, with_attachments) {

			return Promise.resolve([]);
		}

		/**
   * ### Записывает объект в pouchdb
   *
   * @method save_obj
   * @param tObj {DataObj} - записываемый объект
   * @param attr {Object} - ополнительные параметры записи
   * @return {Promise.<DataObj>} - промис с записанным объектом
   */

	}, {
		key: 'save_obj',
		value: function save_obj(tObj, attr) {

			return Promise.resolve(tObj);
		}

		/**
   * ### Возвращает набор данных для дерева динсписка
   *
   * @method get_tree
   * @param _mgr {DataManager}
   * @param attr
   * @return {Promise.<Array>}
   */

	}, {
		key: 'get_tree',
		value: function get_tree(_mgr, attr) {

			return Promise.resolve([]);
		}

		/**
   * ### Возвращает набор данных для динсписка
   *
   * @method get_selection
   * @param _mgr {DataManager}
   * @param attr
   * @return {Promise.<Array>}
   */

	}, {
		key: 'get_selection',
		value: function get_selection(_mgr, attr) {
			return Promise.resolve([]);
		}

		/**
   * ### Найти строки
   * Возвращает массив дата-объектов, обрезанный отбором _selection_<br />
   * Eсли отбор пустой, возвращаются все строки из PouchDB.
   *
   * @method find_rows
   * @param _mgr {DataManager}
   * @param selection {Object|function} - в ключах имена полей, в значениях значения фильтра или объект {like: "значение"} или {not: значение}
   * @param [selection._top] {Number}
   * @param [selection._skip] {Number}
   * @param [selection._raw] {Boolean} - если _истина_, возвращаются сырые данные, а не дата-объекты
   * @param [selection._total_count] {Boolean} - если _истина_, вычисляет общее число записей под фильтром, без учета _skip и _top
   * @return {Promise.<Array>}
   */

	}, {
		key: 'find_rows',
		value: function find_rows(_mgr, selection) {

			return Promise.resolve([]);
		}
	}]);

	return AbstracrAdapter;
}(MetaEventEmitter);

exports.default = AbstracrAdapter;
