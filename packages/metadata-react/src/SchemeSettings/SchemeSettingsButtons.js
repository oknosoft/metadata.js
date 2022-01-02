/**
 * ### Кнопка открытия + строка поиска для сохраненных настроек
 *
 * Created 31.12.2016
 */

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import IconSettings from '@mui/icons-material/Settings';
import IconSettingsCancel from '@mui/icons-material/HighlightOff';
import IconSettingsDone from '@mui/icons-material/Done';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import SearchBox from './SearchBox';

export default class SchemeSettingsButtons extends PureComponent {

  static propTypes = {
    scheme: PropTypes.object.isRequired,
    handleSchemeChange: PropTypes.func.isRequired,
    handleSettingsOpen: PropTypes.func.isRequired,
    handleSettingsClose: PropTypes.func.isRequired,
    tabParams: PropTypes.object,                    // конструктор пользовательской панели параметров
    show_search: PropTypes.bool,                    // показывать поле поиска
    show_variants: PropTypes.bool,                  // показывать список вариантов настройки динсписка
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      menu_open: false,
      variants: [props.scheme],
    };

  }

  componentDidMount() {
    const {scheme: {obj, _manager}, show_variants} = this.props;
    show_variants && _manager.get_option_list({
      _mango: true,
      limit: 40,
      selector: {obj, user: {$in: ['', _manager.adapter.authorized]}}
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

  handleOk = () => {
    const {scheme, handleSchemeChange, handleSettingsClose} = this.props;
    handleSettingsClose();
    handleSchemeChange(scheme);
  };

  handleSchemeChange = (scheme) => {
    scheme._search = '';
    this.props.handleSchemeChange(scheme);
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

    return <Menu key="ssm" anchorEl={anchorEl} open={menu_open} onClose={this.handleMenuClose}>{menuitems}</Menu>;
  }

  render() {
    const {props, state} = this;
    const {menu_open} = state;
    const {scheme, show_search, show_variants, tabParams, classes, settings_open, hide_btn} = props;

    return [
      // Search box
      show_search && <SearchBox
        key="ss1"
        scheme={scheme}
        handleFilterChange={props.handleFilterChange}
        //isWidthUp={!hide_btn}
        isWidthUp={true}
      />,

      // Variants
      show_variants && scheme && <Button key="ss2" size="small" onClick={this.handleMenuOpen} style={{alignSelf: 'center'}}>{scheme.name}</Button>,
      show_variants && scheme && this.VariantsMenu(),

      // Кнопка открытия настроек
      !hide_btn && !settings_open && <IconButton key="ss3" title="Настройка списка" onClick={props.handleSettingsOpen}><IconSettings/></IconButton>,

      // Кнопки Ок или Отмена настроек
      !hide_btn && settings_open && <IconButton key="ss4" title="Применить настройки" onClick={this.handleOk}><IconSettingsDone/></IconButton>,
      !hide_btn && settings_open && <IconButton key="ss5" title="Скрыть настройки" onClick={props.handleSettingsClose}><IconSettingsCancel/></IconButton>

    ];
  }
}
