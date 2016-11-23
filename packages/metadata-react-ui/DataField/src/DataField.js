import React, { Component, PropTypes } from 'react';

import FieldSelect from './FieldSelect'
import FieldText from './FieldText'

import classes from "./DataField.scss"


export default class DataField extends Component {

  static contextTypes = {
    $p: React.PropTypes.object.isRequired
  }

  static propTypes = {
    _obj: PropTypes.object.isRequired,  // DataObj, к полю которого будет привязано поле
    _fld: PropTypes.string.isRequired,  // имя поля объекта - путь к данным
    _meta: PropTypes.object,            // метаданные поля - могут быть переопределены снаружи, если не указано, будут задейтвованы стандартные метаданные

    label_position: PropTypes.string,   // положение заголовка, перечислимый тип $p.UI.LABEL_POSITIONS
    handleValueChange: PropTypes.func   // обработчик при изменении значения в поле
  }

  constructor (props) {

    super(props);

    this.state = {
      _meta: props._meta || props._obj._metadata(props._fld)
    }
  }

  render() {

    const { $p } = this.context;
    const { _meta } = this.state;
    const { _obj, _fld, handleValueChange, label_position } = this.props;
    const _val = _obj[_fld];
    const subProps = {
      _meta: _meta,
      _obj: _obj,
      _fld: _fld,
      _val: _val,
      handleValueChange: handleValueChange
    }

    let control

    switch ($p.UI.control_by_type(this.state._meta.type, _val)){

      case 'ocombo':
        control = <FieldSelect {...subProps} />;
        break;

      default:
        control = <FieldText {...subProps} />

    }

    if(label_position == $p.UI.LABEL_POSITIONS.hide){
      return control

    }else{
      return (
        <div className={classes.field}>
          <div className={classes.label}>{_meta.synonym}</div>
          <div className={classes.data}>
            {control}
          </div>
        </div>
        )
    }
  }
}
