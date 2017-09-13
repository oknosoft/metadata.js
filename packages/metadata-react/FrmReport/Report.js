import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DumbLoader from '../DumbLoader';

import RepToolbar from './RepToolbar';
import RepTabularSection from './RepTabularSection';

import withIface from 'metadata-redux/src/withIface';


class Report extends Component {

  static propTypes = {
    _mgr: PropTypes.object.isRequired,    // менеджер отчета
    _obj: PropTypes.object,               // объект данных - отчет DataProcessorObj
    _tabular: PropTypes.string,           // имя табчасти, в которой живут данные отчета
    _acl: PropTypes.string.isRequired,    // права текущего пользователя

    handlePrint: PropTypes.func,          // внешний обработчик печати
    handleSchemeChange: PropTypes.func,   // внешний обработчик при изменении настроек компоновки

  };

  constructor(props, context) {

    super(props, context);
    const {_mgr, _meta, _obj} = props;
    const _tabular = props._tabular || _mgr._tabular || 'data';

    this.state = {
      _obj: _obj || _mgr.create(),
      _meta: _meta || _mgr.metadata(_tabular),
      _tabular,
    };

    $p.cat.scheme_settings.get_scheme(_mgr.class_name + `.${_tabular}`)
      .then(this.handleSchemeChange);

  }

  componentDidMount() {
    this.shouldComponentUpdate(this.props, this.state);
  }

  shouldComponentUpdate({handleIfaceState, title, _mgr}, {scheme}) {
    const ltitle = _mgr.metadata().synonym + (scheme && scheme.name ? ` (${scheme.name})` : '');
    if (title != ltitle) {
      handleIfaceState({
        component: '',
        name: 'title',
        value: ltitle,
      });
      return false;
    }
    return true;
  }

  handleSave = () => {
    const {_obj, _columns, scheme} = this.state;
    if(scheme && !scheme.empty()){
      if(_obj.scheme !== scheme){
        _obj.scheme = scheme;
      }
      _obj.calculate().then(() => this._result.forceUpdate());
    }
    else{
      $p.record_log({class: 'info', note: 'Пустая схема компоновки', obj: this.props._mgr.class_name});
    }
  };

  handlePrint = () => {

  };

  handleClose = () => {

  };

  // обработчик при изменении настроек компоновки
  handleSchemeChange = (scheme) => {

    const {props, state} = this;
    const {handleSchemeChange} = props;
    const {_obj, _meta} = state;
    const _columns = scheme.rx_columns({mode: 'ts', fields: _meta.fields, _obj});

    // в этом методе
    handleSchemeChange && handleSchemeChange(this, scheme);

    // в случае непустого результата - чистим
    if(_obj.data && _obj.data.count()){
      _obj.data.clear();
      if(_obj.data._rows){
        _obj.data._rows.length = 0;
      }
    }

    // обновляем state
    this.setState({scheme, _columns});

  };

  render() {

    const {props, state, handleClose, handleSave, handlePrint, handleSchemeChange} = this;
    const {_obj, _columns, scheme, _tabular} = state;

    if(!scheme) {
      return <DumbLoader title="Чтение настроек компоновки..."/>;
    }
    else if(!_obj) {
      return <DumbLoader title="Чтение объекта данных..."/>;
    }
    else if(!_columns || !_columns.length) {
      return <DumbLoader title="Ошибка настроек компоновки..."/>;
    }

    return <div>

      <RepToolbar
        _obj={_obj}
        _tabular={_tabular}
        scheme={scheme}
        handleSchemeChange={handleSchemeChange}
        handleSave={handleSave}
        handlePrint={handlePrint}
        handleClose={handleClose}
      />

      <RepTabularSection
        ref={(el) => this._result = el}
        _obj={_obj}
        _tabular={_tabular}
        _columns={_columns}
        scheme={scheme}
        minHeight={(props.height || 500) - 52}
      />

    </div>;
  }
}

export default withIface(Report);

