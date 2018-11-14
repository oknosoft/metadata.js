import React from 'react';
import PropTypes from 'prop-types';
import MDNRComponent from '../common/MDNRComponent';

import LoadingMessage from '../DumbLoader/LoadingMessage';
import RepToolbar from './RepToolbar';
import RepTabularSection from './RepTabularSection';
import SchemeSettingsTabs from '../SchemeSettings/SchemeSettingsTabs';
import Helmet from 'react-helmet';
import {withIface} from 'metadata-redux';

class Report extends MDNRComponent {

  static propTypes = {
    _mgr: PropTypes.object.isRequired,    // менеджер отчета
    _obj: PropTypes.object,               // объект данных - отчет DataProcessorObj
    _tabular: PropTypes.string,           // имя табчасти, в которой живут данные отчета
    _acl: PropTypes.string.isRequired,    // права текущего пользователя

    handlePrint: PropTypes.func,          // внешний обработчик печати
    handleSchemeChange: PropTypes.func,   // внешний обработчик при изменении настроек компоновки
    ToolbarExt: PropTypes.func,

  };

  constructor(props, context) {

    super(props, context);
    const {_mgr, _meta, _obj} = props;
    const _tabular = props._tabular || _mgr._tabular || 'data';

    this.state = {
      _obj: _obj || _mgr.create(),
      _meta: _meta || _mgr.metadata(_tabular),
      _tabular,
      settings_open: false,
    };

    $p.cat.scheme_settings.get_scheme(_mgr.class_name + `.${_tabular}`)
      .then(this.handleSchemeChange);

  }

  handleSave = () => {
    const {_obj, _columns, _tabular, scheme} = this.state;
    if(scheme && !scheme.empty()){
      if(_obj.scheme !== scheme){
        _obj.scheme = scheme;
      }
      _obj.calculate().then(() => this._result.expandRoot());
    }
    else{
      $p.record_log({class: 'info', note: 'Пустая схема компоновки', obj: this.props._mgr.class_name});
    }
  };

  handlePrint = () => {

  };

  handleClose = () => {

  };

  handleSettingsOpen = () => {
    this.setState({settings_open: true});
  };

  handleSettingsClose = () => {
    this.setState({settings_open: false});
  };

  // обработчик при изменении настроек компоновки
  handleSchemeChange = (scheme) => {

    const {props, state} = this;
    const {handleSchemeChange} = props;
    const {_obj, _meta, _tabular} = state;
    const _columns = scheme.rx_columns({mode: 'ts', fields: _meta.fields, _obj});

    // в этом методе
    handleSchemeChange && handleSchemeChange(this, scheme);

    // обновляем state, shouldComponentUpdate берём из MDNRComponent
    this.setState({scheme, _columns}, () => this.shouldComponentUpdate(props));

  };

  get ltitle() {
    const {_mgr} = this.props;
    const {scheme} = this.state;
    return _mgr.metadata().synonym + (scheme && scheme.name ? ` (${scheme.name})` : '');
  }

  render() {

    const {props, state} = this;
    const {_obj, _columns, _tabular, scheme, settings_open} = state;
    const {RepParams} = _obj._manager;

    if(!scheme) {
      return <LoadingMessage text="Чтение настроек компоновки..."/>;
    }
    else if(!_obj) {
      return <LoadingMessage text="Чтение объекта данных..."/>;
    }
    else if(!_columns || !_columns.length) {
      return <LoadingMessage text="Ошибка настроек компоновки..."/>;
    }

    const show_grid = !settings_open || (props.height || 500) > 572;

    return [
      <Helmet key="helmet" title={props.title}>
        <meta name="description" content="Отчет" />
        <meta property="og:title" content={props.title} />
        <meta property="og:description" content="Отчет" />
      </Helmet>,

      <RepToolbar
        key="toolbar"
        _obj={_obj}
        _tabular={_tabular}
        _columns={_columns}
        scheme={scheme}
        settings_open={settings_open}
        ToolbarExt={props.ToolbarExt}
        handleSettingsOpen={this.handleSettingsOpen}
        handleSettingsClose={this.handleSettingsClose}
        handleSchemeChange={this.handleSchemeChange}
        handleSave={this.handleSave}
        handlePrint={this.handlePrint}
        handleClose={this.handleClose}
      />,

      settings_open && <SchemeSettingsTabs
        key="tabs"
        height={show_grid ? 272 : (props.height || 500) - 104}
        width={props.width}
        scheme={scheme}
        tabParams={RepParams && <RepParams _obj={_obj} scheme={scheme}/>}
        handleSchemeChange={this.handleSchemeChange}
      />,

      show_grid && <RepTabularSection
        key="tabular"
        ref={(el) => this._result = el}
        _obj={_obj}
        _tabular={_tabular}
        _columns={_columns}
        scheme={scheme}
        minHeight={(props.height || 500) - 52 - (settings_open ? 320 : 0)}
      />
    ];
  }
}

export default withIface(Report);

