"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expandFilteredNodes = exports.filterTree = exports.findNode = exports.defaultMatcher = undefined;

var _simpleAssign = require("simple-assign");

var _simpleAssign2 = _interopRequireDefault(_simpleAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Helper functions for filtering
var defaultMatcher = exports.defaultMatcher = function defaultMatcher(filterText, node) {
  return node.name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1;
};

var findNode = exports.findNode = function findNode(node, filter, matcher) {
  return matcher(filter, node) || // i match
  node.children && // or i have decendents and one of them match
  node.children.length && !!node.children.find(function (child) {
    return findNode(child, filter, matcher);
  });
};

var filterTree = exports.filterTree = function filterTree(node, filter) {
  var matcher = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultMatcher;

  // If im an exact match then all my children get to stay
  if (matcher(filter, node) || !node.children) {
    return node;
  }
  // If not then only keep the ones that match or have matching descendants
  var filtered = node.children.filter(function (child) {
    return findNode(child, filter, matcher);
  }).map(function (child) {
    return filterTree(child, filter, matcher);
  });
  return (0, _simpleAssign2.default)({}, node, { children: filtered });
};

var expandFilteredNodes = exports.expandFilteredNodes = function expandFilteredNodes(node, filter) {
  var matcher = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultMatcher;

  var children = node.children;
  if (!children || children.length === 0) {
    return (0, _simpleAssign2.default)({}, node, { toggled: false });
  }
  var childrenWithMatches = node.children.filter(function (child) {
    return findNode(child, filter, matcher);
  });
  var shouldExpand = childrenWithMatches.length > 0;
  // If im going to expand, go through all the matches and see if thier children need to expand
  if (shouldExpand) {
    children = childrenWithMatches.map(function (child) {
      return expandFilteredNodes(child, filter, matcher);
    });
  }
  return (0, _simpleAssign2.default)({}, node, {
    children: children,
    toggled: shouldExpand
  });
};