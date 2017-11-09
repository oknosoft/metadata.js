(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("prop-types"), require("react-dom"), require("metadata-external/react-data-grid"), require("react-contextmenu"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "prop-types", "react-dom", "metadata-external/react-data-grid", "react-contextmenu"], factory);
	else if(typeof exports === 'object')
		exports["ReactDataGrid"] = factory(require("react"), require("prop-types"), require("react-dom"), require("metadata-external/react-data-grid"), require("react-contextmenu"));
	else
		root["ReactDataGrid"] = factory(root["React"], root["PropTypes"], root["ReactDOM"], root["metadata-external/react-data-grid"], root["react-contextmenu"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_7__, __WEBPACK_EXTERNAL_MODULE_21__, __WEBPACK_EXTERNAL_MODULE_22__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(34);


/***/ }),
/* 1 */,
/* 2 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ }),
/* 8 */,
/* 9 */
/***/ (function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }),
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_21__;

/***/ }),
/* 22 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_22__;

/***/ }),
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	// Wrapper HOC used when having an editor which is a redux container.
	// Required since react-data-grid requires access to getInputNode, getValue,
	// howvever when doing this.getEditor() in react-data-grid we get a react
	// componenet wrapped by the redux connect function and thus wont have access
	// to the required methods.
	module.exports = function (ContainerEditor) {
	  return function (_Component) {
	    _inherits(ContainerEditorWrapper, _Component);

	    function ContainerEditorWrapper() {
	      _classCallCheck(this, ContainerEditorWrapper);

	      return _possibleConstructorReturn(this, _Component.apply(this, arguments));
	    }

	    ContainerEditorWrapper.prototype.getInputNode = function getInputNode() {
	      return this.editorRef.getInputNode();
	    };

	    ContainerEditorWrapper.prototype.getValue = function getValue() {
	      return this.editorRef.getValue();
	    };

	    ContainerEditorWrapper.prototype.render = function render() {
	      var _this2 = this;

	      return _react2['default'].createElement(ContainerEditor, _extends({ refCallback: function refCallback(ref) {
	          _this2.editorRef = ref;
	        } }, this.props));
	    };

	    return ContainerEditorWrapper;
	  }(_react.Component);
	};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _propTypes = __webpack_require__(3);

	var _propTypes2 = _interopRequireDefault(_propTypes);

	var _reactDom = __webpack_require__(7);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var React = __webpack_require__(2);

	var _require = __webpack_require__(21),
	    EditorBase = _require.editors.EditorBase;

	var DropDownEditor = function (_EditorBase) {
	  _inherits(DropDownEditor, _EditorBase);

	  function DropDownEditor() {
	    _classCallCheck(this, DropDownEditor);

	    return _possibleConstructorReturn(this, _EditorBase.apply(this, arguments));
	  }

	  DropDownEditor.prototype.getInputNode = function getInputNode() {
	    return _reactDom2['default'].findDOMNode(this);
	  };

	  DropDownEditor.prototype.onClick = function onClick() {
	    this.getInputNode().focus();
	  };

	  DropDownEditor.prototype.onDoubleClick = function onDoubleClick() {
	    this.getInputNode().focus();
	  };

	  DropDownEditor.prototype.render = function render() {
	    return React.createElement(
	      'select',
	      { style: this.getStyle(), defaultValue: this.props.value, onBlur: this.props.onBlur, onChange: this.onChange },
	      this.renderOptions()
	    );
	  };

	  DropDownEditor.prototype.renderOptions = function renderOptions() {
	    var options = [];
	    this.props.options.forEach(function (name) {
	      if (typeof name === 'string') {
	        options.push(React.createElement(
	          'option',
	          { key: name, value: name },
	          name
	        ));
	      } else {
	        options.push(React.createElement(
	          'option',
	          { key: name.id, value: name.value, title: name.title },
	          name.text || name.value
	        ));
	      }
	    }, this);
	    return options;
	  };

	  return DropDownEditor;
	}(EditorBase);

	DropDownEditor.propTypes = {
	  options: _propTypes2['default'].arrayOf(_propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].shape({
	    id: _propTypes2['default'].string,
	    title: _propTypes2['default'].string,
	    value: _propTypes2['default'].string,
	    text: _propTypes2['default'].string
	  })])).isRequired
	};

	module.exports = DropDownEditor;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(21),
	    _require$editors = _require.editors,
	    SimpleTextEditor = _require$editors.SimpleTextEditor,
	    CheckboxEditor = _require$editors.CheckboxEditor;

	var Editors = {
	  //AutoComplete: require('./AutoCompleteEditor'),
	  DropDownEditor: __webpack_require__(29),
	  ContainerEditorWrapper: __webpack_require__(28),
	  SimpleTextEditor: SimpleTextEditor,
	  CheckboxEditor: CheckboxEditor
	};

	module.exports = Editors;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _propTypes = __webpack_require__(3);

	var _propTypes2 = _interopRequireDefault(_propTypes);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	// Used for displaying the value of a dropdown (using DropDownEditor) when not editing it.
	// Accepts the same parameters as the DropDownEditor.
	var React = __webpack_require__(2);

	var DropDownFormatter = function (_React$Component) {
	  _inherits(DropDownFormatter, _React$Component);

	  function DropDownFormatter() {
	    _classCallCheck(this, DropDownFormatter);

	    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
	  }

	  DropDownFormatter.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
	    return nextProps.value !== this.props.value;
	  };

	  DropDownFormatter.prototype.render = function render() {
	    var value = this.props.value;
	    var option = this.props.options.filter(function (v) {
	      return v === value || v.value === value;
	    })[0];
	    if (!option) {
	      option = value;
	    }
	    var title = option.title || option.value || option;
	    var text = option.text || option.value || option;
	    return React.createElement(
	      'div',
	      { title: title },
	      text
	    );
	  };

	  return DropDownFormatter;
	}(React.Component);

	DropDownFormatter.propTypes = {
	  options: _propTypes2['default'].arrayOf(_propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].shape({
	    id: _propTypes2['default'].string,
	    title: _propTypes2['default'].string,
	    value: _propTypes2['default'].string,
	    text: _propTypes2['default'].string
	  })])).isRequired,
	  value: _propTypes2['default'].string.isRequired
	};


	module.exports = DropDownFormatter;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _propTypes = __webpack_require__(3);

	var _propTypes2 = _interopRequireDefault(_propTypes);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var React = __webpack_require__(2);

	__webpack_require__(42);

	var PendingPool = {};
	var ReadyPool = {};

	var ImageFormatter = function (_React$Component) {
	  _inherits(ImageFormatter, _React$Component);

	  function ImageFormatter() {
	    var _temp, _this, _ret;

	    _classCallCheck(this, ImageFormatter);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
	      ready: false
	    }, _this._load = function (src) {
	      var imageSrc = src;
	      if (ReadyPool[imageSrc]) {
	        _this.setState({ value: imageSrc });
	        return;
	      }

	      if (PendingPool[imageSrc]) {
	        PendingPool[imageSrc].push(_this._onLoad);
	        return;
	      }

	      PendingPool[imageSrc] = [_this._onLoad];

	      var img = new Image();
	      img.onload = function () {
	        PendingPool[imageSrc].forEach(function (callback) {
	          callback(imageSrc);
	        });
	        delete PendingPool[imageSrc];
	        img.onload = null;
	        imageSrc = undefined;
	      };
	      img.src = imageSrc;
	    }, _this._onLoad = function (src) {
	      if (_this._isMounted && src === _this.props.value) {
	        _this.setState({
	          value: src
	        });
	      }
	    }, _temp), _possibleConstructorReturn(_this, _ret);
	  }

	  ImageFormatter.prototype.componentWillMount = function componentWillMount() {
	    this._load(this.props.value);
	  };

	  ImageFormatter.prototype.componentDidMount = function componentDidMount() {
	    this._isMounted = true;
	  };

	  ImageFormatter.prototype.componentWillUnmount = function componentWillUnmount() {
	    this._isMounted = false;
	  };

	  ImageFormatter.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
	    if (nextProps.value !== this.props.value) {
	      this.setState({ value: null });
	      this._load(nextProps.value);
	    }
	  };

	  ImageFormatter.prototype.render = function render() {
	    var style = this.state.value ? { backgroundImage: 'url(' + this.state.value + ')' } : undefined;

	    return React.createElement('div', { className: 'react-grid-image', style: style });
	  };

	  return ImageFormatter;
	}(React.Component);

	ImageFormatter.propTypes = {
	  value: _propTypes2['default'].string.isRequired
	};


	module.exports = ImageFormatter;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	// not including this
	// it currently requires the whole of moment, which we dont want to take as a dependency
	var ImageFormatter = __webpack_require__(32);
	var DropDownFormatter = __webpack_require__(31);

	var Formatters = {
	  ImageFormatter: ImageFormatter,
	  DropDownFormatter: DropDownFormatter
	};

	module.exports = Formatters;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var Editors = __webpack_require__(30);
	var Formatters = __webpack_require__(33);
	//const Toolbar = require('./toolbars/Toolbar');
	//const ToolsPanel = require('./toolbars');
	//const Data = require('./data');
	var Menu = __webpack_require__(37);
	//const Draggable = require('./draggable');
	//const DraggableHeader = require('./draggable-header');
	//const Filters = require('./cells/headerCells/filters');
	//const { RowComparer: rowComparer } = require('metadata-external/react-data-grid');
	//const performance = require('./performance');
	//const Utils = { rowComparer, performance };

	window.ReactDataGridPlugins = { Editors: Editors, Formatters: Formatters, Menu: Menu };
	module.exports = { Editors: Editors, Formatters: Formatters, Menu: Menu };

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _propTypes = __webpack_require__(3);

	var _propTypes2 = _interopRequireDefault(_propTypes);

	var _reactContextmenu = __webpack_require__(22);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ReactDataGridContextMenu = function (_React$Component) {
	  _inherits(ReactDataGridContextMenu, _React$Component);

	  function ReactDataGridContextMenu() {
	    _classCallCheck(this, ReactDataGridContextMenu);

	    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
	  }

	  ReactDataGridContextMenu.prototype.render = function render() {
	    return _react2['default'].createElement(
	      _reactContextmenu.ContextMenu,
	      { identifier: 'reactDataGridContextMenu' },
	      this.props.children
	    );
	  };

	  return ReactDataGridContextMenu;
	}(_react2['default'].Component);

	ReactDataGridContextMenu.propTypes = {
	  children: _propTypes2['default'].node
	};

	exports['default'] = ReactDataGridContextMenu;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _propTypes = __webpack_require__(3);

	var _propTypes2 = _interopRequireDefault(_propTypes);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var MenuHeader = function (_React$Component) {
	  _inherits(MenuHeader, _React$Component);

	  function MenuHeader() {
	    _classCallCheck(this, MenuHeader);

	    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
	  }

	  MenuHeader.prototype.render = function render() {
	    return _react2['default'].createElement(
	      'div',
	      { className: 'react-context-menu-header' },
	      this.props.children
	    );
	  };

	  return MenuHeader;
	}(_react2['default'].Component);

	MenuHeader.propTypes = {
	  children: _propTypes2['default'].any
	};

	exports['default'] = MenuHeader;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.ContextMenuLayer = exports.connect = exports.SubMenu = exports.monitor = exports.MenuItem = exports.MenuHeader = exports.ContextMenu = undefined;

	var _reactContextmenu = __webpack_require__(22);

	var _ContextMenu = __webpack_require__(35);

	var _ContextMenu2 = _interopRequireDefault(_ContextMenu);

	var _MenuHeader = __webpack_require__(36);

	var _MenuHeader2 = _interopRequireDefault(_MenuHeader);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	exports.ContextMenu = _ContextMenu2['default'];
	exports.MenuHeader = _MenuHeader2['default'];
	exports.MenuItem = _reactContextmenu.MenuItem;
	exports.monitor = _reactContextmenu.monitor;
	exports.SubMenu = _reactContextmenu.SubMenu;
	exports.connect = _reactContextmenu.connect;
	exports.ContextMenuLayer = _reactContextmenu.ContextMenuLayer;

/***/ }),
/* 38 */,
/* 39 */,
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(9)();
	// imports


	// module
	exports.push([module.id, ".react-grid-image{background:#efefef;background-size:100%;display:inline-block;height:40px;width:40px}", ""]);

	// exports


/***/ }),
/* 41 */,
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(40);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(10)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../node_modules/css-loader/index.js!./react-data-grid-image.css", function() {
				var newContent = require("!!../node_modules/css-loader/index.js!./react-data-grid-image.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ })
/******/ ])
});
;