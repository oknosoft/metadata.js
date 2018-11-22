import React from 'react';
import PropTypes from 'prop-types';
import MDNRComponent from '../common/MDNRComponent';

import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import cn from 'classnames';
import LoadingMessage from '../DumbLoader/LoadingMessage';
import DataListToolbar from '../DataList/DataListToolbar';
import SchemeSettingsTabs from '../SchemeSettings/SchemeSettingsTabs';
import Confirm from '../App/Confirm';
import withStyles from './styles';
import {withIface} from 'metadata-redux';
import control_by_type from 'metadata-abstract-ui/ui';
import Typography from '@material-ui/core/Typography/Typography';

class DataTree extends MDNRComponent {

  static COLUMN_DEFAULT_WIDTH = 220;

  constructor(props, context) {
    super(props, context);

    this.state = {
      selectedRow: 0,
      rowCount: 0,
      settings_open: false,
      no_rows: false,
      ref: '',
    };

    /** Set of tree rows. */
    this._list = [];

    this.handleManagerChange(props);
  }

  // при изменении менеджера данных
  handleManagerChange({_mgr, _meta, _ref}) {

    const {class_name} = _mgr;

    this._meta = _meta || _mgr.metadata();

    const newState = {ref: _ref || ''};

    if(this._mounted) {
      this.setState(newState);
    }
    else {
      Object.assign(this.state, newState);
    }

    $p.cat.scheme_settings.get_scheme(class_name).then(this.handleSchemeChange);

  }

  // обработчик выбора значения в списке
  handleSelect = () => {
    const {state: {selectedRow}, props: {handlers, _mgr}} = this;
    if(!selectedRow) {
      this.handleInfoText('Не выбрана строка');
    }
    else {
      const row = this._list[selectedRow];
      row && handlers.handleSelect && handlers.handleSelect(row, _mgr);
    }
  };

  // обработчик добавления элемента списка
  handleAdd = (event) => {
    const {handlers, _mgr} = this.props;
    handlers.handleAdd && handlers.handleAdd(_mgr, event);
  };


  // при изменении настроек или варианта компоновки
  handleSchemeChange = (scheme) => {
    scheme.set_default();
    scheme.set_standard_period();
    // пересчитываем и перерисовываем динсписок
    this.handleFilterChange(scheme, scheme.columns());
  };

  // при изменении параметров компоновки - схему не меняем, но выполняем пересчет
  handleFilterChange = (scheme, columns) => {

    const {state, props, _list, _mounted} = this;

    if(!(scheme instanceof $p.CatScheme_settings)) {
      scheme = state.scheme;
    }

    if(!columns) {
      columns = state.columns;
    }

    const newState = {scheme, columns};
    if(_mounted) {
      this.setState(newState, () => {
        this._loadMoreRows();
      });
    }
    else {
      Object.assign(state, newState);
      this._loadMoreRows();
    }

  };

  // обработчик печати теущей строки
  handlePrint = () => {
    const row = this._list[this.state.selectedRow];
    const {handlers, _mgr} = this.props;
    row && handlers.handlePrint && handlers.handlePrint(row, _mgr);
  };

  // обработчик вложений теущей строки
  handleAttachments = () => {
    const row = this._list[this.state.selectedRow];
    const {handlers, _mgr} = this.props;
    row && handlers.handleAttachments && handlers.handleAttachments(row, _mgr);
  };

  handleSettingsOpen = () => {
    this.setState({settings_open: true});
  };

  handleSettingsClose = () => {
    this.setState({settings_open: false});
  };

  handleInfoText = (info_text) => {
    if(typeof info_text !== 'string') {
      info_text = '';
    }
    this.setState({info_text});
  }

  get sizes() {
    let {context: {dnr}, props: {width, height}, state: {columns}} = this;

    if(!height) {
      height = dnr && parseInt(dnr.frameRect.height) - 26;
    }
    if(!height || height < 320) {
      height = 320;
    }
    if(!width) {
      width = dnr && parseInt(dnr.frameRect.width);
    }
    if(!width || width < 480) {
      width = 480;
    }

    // горизонтальная прокрутка
    const w2 = columns && columns.reduce((sum, val, index) => {
      return sum + this._getColumnWidth({index});
    }, 0)
    if(w2 > width) {
      width = w2;
    }

    return {width, height};
  }

  get ltitle() {
    const {_mgr} = this.props;
    return `${_mgr.metadata().list_presentation || _mgr.metadata().synonym} (дерево)`;
  }

  render() {
    const {state, props, context, _meta, sizes, _list} = this;
    const {columns, scheme, confirm_text, info_text, settings_open, rowCount} = state;
    const {_mgr: {RepParams}, classes, title, registerFilterChange, width, height, ...others} = props;

    if(!scheme) {
      return <LoadingMessage text="Чтение настроек компоновки..."/>;
    }
    else if(!columns || !columns.length) {
      return <LoadingMessage text="Ошибка настроек компоновки..."/>;
    }

    registerFilterChange && registerFilterChange(this.handleFilterChange);

    const show_grid = !settings_open || sizes.height > 572;

    const toolbar_props = {
      key: 'toolbar',
      scheme,
      ...others,
      settings_open,
      handleSelect: this.handleSelect,
      handleAdd: this.handleAdd,
      handlePrint: this.handlePrint,
      handleAttachments: this.handleAttachments,
      handleSettingsOpen: this.handleSettingsOpen,
      handleSettingsClose: this.handleSettingsClose,
      handleSchemeChange: this.handleSchemeChange,
      handleFilterChange: this.handleFilterChange,
    };


    return [

      // диалог предупреждений при удалении
      confirm_text && <Confirm
        key="confirm"
        title={_meta.synonym}
        text={confirm_text}
        handleOk={this._handleRemove}
        handleCancel={() => this.setState({confirm_text: ''})}
        open
      />,

      info_text && <Confirm
        key="confirm"
        title={_meta.synonym}
        text={info_text}
        handleOk={this.handleInfoText}
        handleCancel={this.handleInfoText}
        open
      />,

      // панель инструментов табчасти
      <DataListToolbar {...toolbar_props} />,

      // панель настроек компоновки
      settings_open && <AutoSizer key="tabs" disableHeight>
        {({width}) => (
          <SchemeSettingsTabs
            height={show_grid ? 272 : (sizes.height || 500) - 104}
            width={width}
            scheme={scheme}
            tabParams={RepParams && <RepParams scheme={scheme}/>}
            handleSchemeChange={this.handleSchemeChange}
          />
        )}
      </AutoSizer>,

      // собственно, дерево
      show_grid && <AutoSizer key="infinite" disableHeight>
        {({width}) => (
          <div>tree</div>
        )}
      </AutoSizer>
    ];
  }

  _getColumnWidth = ({index}) => {
    // todo: Take remaining space if width of column equal '*'
    const {columns} = this.state;
    if(isNaN(parseInt(columns[index].width, 10))) {
      return DataTree.COLUMN_DEFAULT_WIDTH;
    }
    else {
      return parseInt(columns[index].width, 10);
    }
  };

  _noContentRendered = () => {
    const {no_rows}  = this.state;
    return <LoadingMessage text={no_rows ? 'Записей не найдено...' : ''}
    />;
  };

  _formatter(rowData, columnIndex) {
    const {columns} = this.state;
    const {id, type} = columns[columnIndex];
    const v = rowData[id];

    switch (control_by_type(type, v)) {
    case 'ocombo':
      return this.props._mgr.value_mgr(rowData, id, type, false, v).get(v).presentation;

    case 'dhxCalendar':
      return $p.utils.moment(v).format($p.utils.moment._masks.date);

    case 'calck':
      return v;

    default:
      return v ? v.toString() : '';
    }
  }

  _loadMoreRows = () => {
    const {props: {_mgr, _owner, find_rows}, state: {scheme, columns, ref}, _list}  = this;

    const newState = {no_rows: false, network_error: null};
    this.setState(newState);

    // в зависимости от типа кеширования...
    if(/ram$/.test(_mgr.cachable)) {
      // фильтруем в озу
      const selector = _mgr.get_search_selector({
        _obj: _owner ? _owner._obj : null,
        _meta: _owner ? _owner._meta : {},
        search: scheme._search,
        top: 1000,
        skip: 0,
      });
      const rows = _mgr.find_rows(selector);
      return Promise.resolve(rows);
    }
    else {
      this.setState({network_error: 'err'});
    }

  };

}

DataTree.propTypes = {

  // данные
  _mgr: PropTypes.object.isRequired,    // Менеджер данных
  _acl: PropTypes.string,               // Права на чтение-изменение
  _meta: PropTypes.object,              // Описание метаданных. Если не указано, используем метаданные менеджера
  _ref: PropTypes.string,               // Ссылка, на которую надо спозиционироваться

  _owner: PropTypes.object,             // Поле - владелец. У него должны быть _obj, _fld и _meta
                                        // а внутри _meta могут быть choice_params и choice_links

  // настройки внешнего вида и поведения
  selectionMode: PropTypes.bool,       // Режим выбора из списка. Если истина - дополнительно рисуем кнопку выбора
  read_only: PropTypes.object,          // Элемент только для чтения
  denyAddDel: PropTypes.bool,           // Запрет добавления и удаления строк (скрывает кнопки в панели, отключает обработчики)
  show_search: PropTypes.bool,          // Показывать поле поиска
  show_variants: PropTypes.bool,        // Показывать список вариантов настройки динсписка
  modal: PropTypes.bool,                // Показывать список в модальном диалоге

  // Redux actions
  handlers: PropTypes.object.isRequired, // обработчики редактирования объекта

};


export default withStyles(withIface(DataTree));
