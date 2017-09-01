/**
 * ### Абстрактное поле ввода
 * Тип элемента управления вычисляется по метаданным поля
 *
 * @module AbstractField
 *
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class AbstractField extends Component {

  static propTypes = {
    _obj: PropTypes.object.isRequired,  // DataObj, к реквизиту которого будет привязано поле
    _fld: PropTypes.string.isRequired,  // имя поля объекта - путь к данным
    _meta: PropTypes.object,            // метаданные поля - могут быть переопределены снаружи, если не указано, будут задейтвованы стандартные метаданные

    label_position: PropTypes.object,   // положение заголовка, $p.enm.label_positions
    read_only: PropTypes.bool,          // поле только для чтения
    mandatory: PropTypes.bool,          // поле обязательно для заполнения
    multi: PropTypes.bool,              // множественный выбор - значение является массивом
    handleValueChange: PropTypes.func,   // обработчик при изменении значения в поле
  };

  constructor(props, context) {
    super(props, context);
    this._meta = props._meta || props._obj._metadata(props._fld);
  }

  get isTabular() {
    return $p.utils.is_tabular(this.props._obj);
  }
}
