import DataCell from './DataCell'
import FieldDate from './FieldDate'
import FieldNumber from './FieldNumber'
import FieldSelect from './FieldSelect'
import FieldText from './FieldText'
import FieldToggle from './FieldToggle'
import React from "react";

/**
 * This class provides static method for instancing DataField elements.
 */
export default class DataFieldFactory {
  /**
   * Mapping from string to data field constructor.
   * @return {DataField} Data field constructor.
   */
  static get _availableFields () {
    return {
      DataCell,
      FieldDate,
      FieldNumber,
      FieldSelect,
      FieldText,
      FieldToggle
    };
  }

  /**
   * Get name of data field by his metadata type.
   * @return {string} Name of data field.
   */
  static get _dataFieldsByType() {
    return {
      "date": "FieldDate",
      "number": "FieldNumber",
      "string": "FieldText",
      "boolean": "FieldToggle"
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

    if ((dataFieldType in DataFieldFactory._availableFields) === false) {
      const fieldsString = DataFieldFactory.objectKeysToString(DataFieldFactory._availableFields);
      throw new Error(`Unknow field type: "${fieldsString}".\n\nAvaialbel fields:\n${fieldsString}`);
    }

    const elementType = DataFieldFactory._availableFields[dataFieldType];
    return React.createElement(elementType, props);
  }

  /**
   * [getClassNameForType description]
   * @param  {object} type Metadata of type.
   * @return {string} Class name of data field.
   */
  static getClassNameForType(type) {
    if (type.is_ref !== undefined && type.is_ref === true) {
      return "FieldText";
    }

    /** @type {string} 1C data type. */
    const metadataType = type.types[0];
    if ((metadataType in DataFieldFactory._dataFieldsByType) === false) {
      const typesString = DataFieldFactory.objectKeysToString(DataFieldFactory._dataFieldsByType);
      throw new Error(`Metadata type "${metadataType}" doesn't exists.\n\nAvaialbeTypes:\n${typesString}`);
    }

    return DataFieldFactory._dataFieldsByType[metadataType];
  }

  static objectKeysToString(object) {
    return Object.keys(object).reduce((result, typeName) => (result + "\t" + typeName + "\n"), "");
  }
}