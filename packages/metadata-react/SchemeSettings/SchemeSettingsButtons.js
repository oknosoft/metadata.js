/**
 * ### Кнопка открытия + строка поиска для сохраненных настроек
 *
 * Created 31.12.2016
 */

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import IconSettings from 'material-ui-icons/Settings';
import IconSettingsCancel from 'material-ui-icons/HighlightOff';
import IconSettingsDone from 'material-ui-icons/Done';

import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Menu, {MenuItem} from 'material-ui/Menu';
import Typography from 'material-ui/Typography';

import SearchBox from './SearchBox';

export default class SchemeSettingsButtons extends PureComponent {

  static propTypes = {
    scheme: PropTypes.object.isRequired,
    handleSchemeChange: PropTypes.func.isRequired,
    tabParams: PropTypes.object,                    // конструктор пользовательской панели параметров
    show_search: PropTypes.bool,                    // показывать поле поиска
    show_variants: PropTypes.bool,                  // показывать список вариантов настройки динсписка
  };

  constructor(props, context) {
    super(props, context);
    const {scheme} = props;

    this.state = {
      menu_open: false,
      variants: [scheme]
    };

    scheme._manager.get_option_list({
      _top: 40,
      obj: scheme.obj,
    })
      .then((variants) => {
        this.setState({variants});
      });
  }


  handleMenuOpen = (event) => {
    this.setState({menu_open: true, anchorEl: event.currentTarget});
  };

  handleMenuClose = () => {
    this.setState({menu_open: false});
  };

  // handleOk = () => {
  //   this.props.handleSchemeChange(this.props.scheme);
  // };

  handleSchemeChange = (scheme) => {
    scheme._search = '';
    this.props.handleSchemeChange(scheme);
  };

  handleSearchChange = (event) => {
    this.props.scheme._search = event.target.value;
    this._timer && clearTimeout(this._timer);
    this._timer = setTimeout(this.handleSearchTimer, 600);
    this.forceUpdate();
  };

  handleSearchTimer = () => {
    this.props.handleFilterChange();
  };

  VariantsMenu() {
    const {variants, menu_open, anchorEl} = this.state;
    const menuitems = variants.map((v, index) => <MenuItem
      selected={v == this.props.scheme}
      key={v.ref}
      onClick={() => {
        this.handleSchemeChange(variants[index]);
        this.handleMenuClose();
      }}
    >{v.name}</MenuItem>);

    return <Menu key="ssm" anchorEl={anchorEl} open={menu_open} onRequestClose={this.handleMenuClose}>{menuitems}</Menu>;
  }

  render() {
    const {props, state} = this;
    const {menu_open} = state;
    const {scheme, show_search, show_variants, tabParams, classes, settings_open} = props;

    return [
      // Search box
      show_search && <SearchBox key="ss1" value={scheme._search || ''} onChange={this.handleSearchChange}/>,

      // Variants
      show_variants && scheme && <Button key="ss2" dense onClick={this.handleMenuOpen} style={{alignSelf: 'center'}}>{scheme.name}</Button>,
      show_variants && scheme && this.VariantsMenu(),

      // Кнопка открытия настроек
      !settings_open && <IconButton key="ss3" title="Настройка списка" onClick={props.handleSettingsOpen}><IconSettings/></IconButton>,

      // Кнопки Ок или Отмена настроек
      settings_open && <IconButton key="ss4" title="Применить настройки" onClick={props.handleSettingsClose}><IconSettingsDone/></IconButton>,
      settings_open && <IconButton key="ss5" title="Скрыть настройки" onClick={props.handleSettingsClose}><IconSettingsCancel/></IconButton>

    ];
  }
}
