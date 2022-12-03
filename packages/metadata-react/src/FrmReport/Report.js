import React from 'react';
import PropTypes from 'prop-types';
import MDNRComponent from '../common/MDNRComponent';

import LoadingMessage from '../DumbLoader/LoadingMessage';
import RepToolbar from './RepToolbar';
import RepTabularSection from './RepTabularSection';
import SchemeSettingsTabs from '../SchemeSettings/SchemeSettingsTabs';
import {Helmet} from 'react-helmet';

export class Report extends MDNRComponent {

  constructor(props, context) {

    super(props, context);
    const {_mgr, _meta, _obj, scheme} = props;
    const _tabular = props._tabular || _mgr._tabular || 'data';

    this.state = {
      _obj: _obj || _mgr.create(),
      _meta: _meta || _mgr.metadata(_tabular),
      _tabular,
      settings_open: false,
    };

    (scheme ? Promise.resolve(scheme) : $p.cat.scheme_settings.get_scheme(_mgr.class_name + `.${_tabular}`))
      .then(this.handleSchemeChange)
      .then(() => {
        if(props.autoexec) {
          Promise.resolve().then(() => this.handleSave());
        }
      });

    props.registerRep && props.registerRep(this);

  }

  handleSave = () => {
    const {_obj, scheme} = this.state;
    if(scheme && !scheme.empty()){
      if(_obj.scheme !== scheme){
        _obj.scheme = scheme;
      }
      return _obj.calculate().then(() => {
        const {_result} = this;
        _result && _result.expandRoot && _result.expandRoot();
      });
    }
    else{
      return Promise.reject(new Error('Пустая схема компоновки'));
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
    const {_obj, _meta} = state;
    const {handleSchemeChange, handleColumns, read_only} = props;
    const _columns = scheme.rx_columns({
      mode: 'ts',
      fields: _meta.fields,
      _obj,
      read_only,
    });

    if(!$p.utils.equals(_columns, this.state._columns) || state.scheme !== scheme) {
      handleColumns && handleColumns(_columns);
      // если задан, выполняем внешний обработчик при смене схемы
      handleSchemeChange && handleSchemeChange(this, scheme);
      // обновляем state, shouldComponentUpdate берём из MDNRComponent
      this.setState({scheme, _columns}, () => this.shouldComponentUpdate(props));
    }
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

    const pheight = props.height || props.minHeight || 500;
    const show_grid = !settings_open || pheight > 572;

    return [

      !props.ignoreTitle && <Helmet key="helmet" title={props.title}>
        <meta name="description" content="Отчет" />
        <meta property="og:title" content={props.title} />
        <meta property="og:description" content="Отчет" />
      </Helmet>,

      !props.hideToolbar && <RepToolbar
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
        height={show_grid ? 272 : pheight - 104}
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
        _columns={_columns.filter(v => v.width !== -1)}
        scheme={scheme}
        minHeight={pheight - 52 - (settings_open ? 320 : 0)}
        hideHeader={props.hideHeader}
      />
    ];
  }
}

Report.propTypes = {
  _mgr: PropTypes.object.isRequired,    // менеджер отчета
  _obj: PropTypes.object,               // объект данных - отчет DataProcessorObj
  _meta: PropTypes.object,              // метаданные можно переопределить
  _tabular: PropTypes.string,           // имя табчасти, в которой живут данные отчета
  _acl: PropTypes.string,               // права текущего пользователя
  read_only: PropTypes.bool,            // морозит ячейки
  autoexec: PropTypes.bool,             // запускает формирование отчета после монтирования компонента
  ignoreTitle: PropTypes.bool,          // запрет установки заголовка приложения

  handlePrint: PropTypes.func,          // внешний обработчик печати
  handleSchemeChange: PropTypes.func,   // внешний обработчик при изменении настроек компоновки
  handleColumns: PropTypes.func,        // внешний обработчик при расчете свойств колонок - чтобы переопределить editors и formatters
  registerRep: PropTypes.func,          // регистрация ссылки на объект отчета в родительском компоненте
  ToolbarExt: PropTypes.func,

};

export default Report;

