"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Компонент с привязкой контекста metaengine
 *
 * @module Component
 *
 * Created 11.01.2017
 */

class MetaComponent extends _react.Component {}
exports.default = MetaComponent;
MetaComponent.contextTypes = {
  $p: _propTypes2.default.object.isRequired
};
