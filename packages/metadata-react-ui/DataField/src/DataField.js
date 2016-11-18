import React, { Component, PropTypes } from 'react';

import FieldSelect from './FieldSelect'
import FieldText from './FieldText'

export default class DataField extends Component {

  static contextTypes = {
    $p: React.PropTypes.object.isRequired
  }

  static propTypes = {
    _obj: PropTypes.object.isRequired,
    _fld: PropTypes.string.isRequired,
    _meta: PropTypes.object,
    handleValueChange: PropTypes.func
  }

  static labelPosition = {
    auto: 'auto',
    hide: 'hide',
    left: 'left',
    right: 'right',
    top: 'top',
    bottom: 'bottom'
  }

  static fieldKind = {
    input: 'input',   // поле ввода
    label: 'label',   // поле надписи
    toggle: 'toggle', // поле переключателя
    image: 'image',   // поле картинки
    text: 'text'      // многострочный редактор текста
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
    const { _obj, _fld, handleValueChange } = this.props;
    const _val = _obj[_fld];
    const subProps = {
      _meta: _meta,
      _obj: _obj,
      _fld: _fld,
      _val: _val,
      handleValueChange: handleValueChange
    }

    switch ($p.rx_control_by_type(this.state._meta.type, _val)){

      case 'ocombo':
        return <FieldSelect {...subProps} />

      default:
        return <FieldText {...subProps} />

    }

    ;
  }
}
