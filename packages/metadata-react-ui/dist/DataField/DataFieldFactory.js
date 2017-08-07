'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _DataCell = require('./DataCell');

var _DataCell2 = _interopRequireDefault(_DataCell);

var _FieldDate = require('./FieldDate');

var _FieldDate2 = _interopRequireDefault(_FieldDate);

var _FieldNumber = require('./FieldNumber');

var _FieldNumber2 = _interopRequireDefault(_FieldNumber);

var _FieldSelect = require('./FieldSelect');

var _FieldSelect2 = _interopRequireDefault(_FieldSelect);

var _FieldText = require('./FieldText');

var _FieldText2 = _interopRequireDefault(_FieldText);

var _FieldToggle = require('./FieldToggle');

var _FieldToggle2 = _interopRequireDefault(_FieldToggle);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This class provides static method for instancing DataField elements.
 */
class DataFieldFactory {
  /**
   * Mapping from string to data field constructor.
   * @return {DataField} Data field constructor.
   */
  static get _availableFields() {
    return {
      DataCell: _DataCell2.default,
      FieldDate: _FieldDate2.default,
      FieldNumber: _FieldNumber2.default,
      FieldSelect: _FieldSelect2.default,
      FieldText: _FieldText2.default,
      FieldToggle: _FieldToggle2.default
    };
  }

  /**
   * Get name of data field by his metadata type.
   * @return {string} Name of data field.
   */
  static get _dataFieldsByType() {
    return {
      'date': 'FieldDate',
      'number': 'FieldNumber',
      'string': 'FieldText',
      'boolean': 'FieldToggle'
    };
  }

  /**
   * Create DataField of specified type.
   * @param  {string} dataFieldType DataField class name.
   * @param  {object} props Props that will be passed to component.
   * @return {element} React element.
   */
  static create(dataFieldType, props = null) {
    dataFieldType;

    if (dataFieldType in DataFieldFactory._availableFields === false) {
      const fieldsString = DataFieldFactory.objectKeysToString(DataFieldFactory._availableFields);
      throw new Error(`Unknow field type: "${fieldsString}".\n\nAvaialbel fields:\n${fieldsString}`);
    }

    const elementType = DataFieldFactory._availableFields[dataFieldType];
    return _react2.default.createElement(elementType, props);
  }

  /**
   * [getClassNameForType description]
   * @param  {object} type Metadata of type.
   * @return {string} Class name of data field.
   */
  static getClassNameForType(type) {
    if (type.is_ref !== undefined && type.is_ref === true) {
      return 'FieldText';
    }

    /** @type {string} 1C data type. */
    const metadataType = type.types[0];
    if (metadataType in DataFieldFactory._dataFieldsByType === false) {
      const typesString = DataFieldFactory.objectKeysToString(DataFieldFactory._dataFieldsByType);
      throw new Error(`Metadata type "${metadataType}" doesn't exists.\n\nAvaialbeTypes:\n${typesString}`);
    }

    return DataFieldFactory._dataFieldsByType[metadataType];
  }

  static objectKeysToString(object) {
    return Object.keys(object).reduce((result, typeName) => result + '\t' + typeName + '\n', '');
  }
}
exports.default = DataFieldFactory;