/**
 * ### React-component _Поле списка_
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2019
 *
 * @module DataListField
 *
 * Created 09.01.2017
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import classnames from 'classnames';
import withStyles from './styles';

class DataListField extends Component {

  static propTypes = {
    _tabular: PropTypes.object.isRequired,  // TabularSection, к которой будет привязано поле
    _fld: PropTypes.string.isRequired,      // имя колонки табчасти - путь к данным
    _meta: PropTypes.object,                // метаданные поля - могут быть переопределены снаружи, если не указано, будут задейтвованы стандартные метаданные

    read_only: PropTypes.bool,              // поле только для чтения
    handleValueChange: PropTypes.func,      // обработчик при изменении значения в поле

    classes: PropTypes.object,
  };

  constructor(props, context) {

    super(props, context);

    const {_fld, _tabular} = props;

    this._meta = props._meta || _tabular._metadata(_fld);
    this._mgr = _tabular._owner._manager.value_mgr({}, _fld, this._meta.fields[_fld].type, false);

    this.state = {
      value: _tabular.unload_column(_fld).map((v) => v.ref),
      options: []
    };
  }

  componentDidMount() {
    this.loadOptions(this.state.value);
  }

  loadOptions(value) {
    const {item, bold} = this.props.classes;
    this._mgr.get_option_list()
      .then((options) => this.setState({
        value,
        options: options.map(({ref, presentation}) => <MenuItem
          key={ref}
          value={ref}
          className={classnames(item, (value.indexOf(ref) !== -1) && bold)}
        >
          {presentation}
        </MenuItem>)
      })
      );
  }


  handleChange = ({target: {value}}) => {
    const {handleValueChange, _fld, _tabular} = this.props;
    this.loadOptions(value);

    // удаляем-добавляем строки в _tabular
    _tabular.load(value.map((row) => ({[_fld]: row})));

    if(handleValueChange) {
      handleValueChange(value);
    }
  };

  render() {

    const {props, state, _meta, handleChange} = this;
    const {options, value} = state;

    return <FormControl>
      <InputLabel>{_meta.tooltip || _meta.synonym}</InputLabel>
      <Select
        multiple
        value={value}
        onChange={handleChange}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 240,
              width: 200,
            },
          },
        }}
      >
        {options}
      </Select>
    </FormControl>;

  }
}

export default withStyles(DataListField);
