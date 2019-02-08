/**
 * ### Абстрактное поле ввода
 * Тип элемента управления вычисляется по метаданным поля
 *
 * @module AbstractField
 *
 */

import React, {} from 'react';
import PropTypes from 'prop-types';
import MComponent from '../common/MComponent';

export function suggestionText(suggestion) {
  const text = suggestion ? suggestion.presentation || suggestion.toString() : '';
  return text === '_' ? '' : text;
};

export class FieldWithMeta extends MComponent {

  static propTypes = {
    _obj: PropTypes.object.isRequired,  // DataObj, к реквизиту которого будет привязано поле
    _fld: PropTypes.string.isRequired,  // имя поля объекта - путь к данным
    _meta: PropTypes.object,            // метаданные поля - могут быть переопределены снаружи, если не указано, будут задейтвованы стандартные метаданные

    fullWidth: PropTypes.bool,          // растягивать по ширине
    label_position: PropTypes.object,   // положение заголовка, $p.enm.label_positions
    read_only: PropTypes.bool,          // поле только для чтения
    mandatory: PropTypes.bool,          // поле обязательно для заполнения
    multi: PropTypes.bool,              // множественный выбор - значение является массивом
    handleValueChange: PropTypes.func,  // обработчик при изменении значения в поле
  };

  constructor(props, context) {
    super(props, context);
    const {_obj, _fld, _meta} = props;
    this._meta = _meta || _obj._metadata(_fld) || {type: {types: ['string']}};
    if(this._meta.choice_type) {
      const {path} = this._meta.choice_type;
      const prm = _obj[path[path.length - 1]] || (_obj._owner && _obj._owner[path[path.length - 1]]);
      if(prm && !prm.empty()) {
        this._meta = Object.assign({}, this._meta, {type: prm.type});
        prm.choice_params.forEach(({name, path}) => {
          if(!this._meta.choice_params){
            this._meta.choice_params = [];
          }
          this._meta.choice_params.push({name, path});
        });
      }
    }
  }

}

export default class AbstractField extends FieldWithMeta {

  constructor(props, context) {
    super(props, context);
    const {_obj, _fld} = props;
    this.state = {value: _obj[_fld]};
    this.onChange = this.onChange.bind(this);
  }

  get isTabular() {
    const {props} = this;
    return props.hasOwnProperty('isTabular') ? props.isTabular : $p.utils.is_tabular(props._obj);
  }

  onChange({target}) {
    const {_obj, _fld, handleValueChange} = this.props;
    _obj[_fld] = target.value;
    handleValueChange && handleValueChange(target.value);
    this._mounted && this.setState({value: _obj[_fld]});
  };
};
