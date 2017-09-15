/**
 * ### Контейнер сохраненных настроек
 * Кнопка открытия + диалог
 *
 * Created 31.12.2016
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import IconSettings from 'material-ui-icons/Settings';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Menu, {MenuItem} from 'material-ui/Menu';

// окно диалога, чтобы показать всплывающие формы
import DnR from '../DnR/Dialog'

import SchemeSettingsTabs from './SchemeSettingsTabs';
import SearchBox from './SearchBox';

export default class SchemeSettingsWrapper extends Component {

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
      scheme,
      dialog_open: false,
      menu_open: false,
      fullscreen: false,
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

  handleDialogOpen = () => {
    this.setState({
      dialog_open: true
    });
  };

  handleDialogClose = () => {
    this.setState({
      dialog_open: false
    });
  };

  handleMenuOpen = (event) => {
    this.setState({menu_open: true, anchorEl: event.currentTarget});
  };

  handleMenuClose = () => {
    this.setState({
      menu_open: false
    });
  };

  handleOk = () => {
    this.handleDialogClose();
    this.props.handleSchemeChange(this.state.scheme);
  };

  handleSchemeChange = (scheme) => {
    this.props.handleSchemeChange(scheme);
    this.setState({scheme});
  };

  handleSearchChange = (event, newValue) => {

  };

  handleFullscreenClick() {
    this.setState({
      fullscreen: !this.state.fullscreen
    });
  }

  Variants() {
    const {variants, scheme, menu_open, anchorEl} = this.state;
    const menuitems = variants.map((v, index) => <MenuItem
      selected={v == scheme}
      key={v.ref}
      onClick={() => {
        this.handleSchemeChange(variants[index]);
        this.handleMenuClose();
      }}
    >{v.name}</MenuItem>);

    return <Menu anchorEl={anchorEl} open={menu_open} onRequestClose={this.handleMenuClose}>{menuitems}</Menu>;
  }

  render() {
    const {props, state, handleDialogOpen, handleOk, handleDialogClose, handleSchemeChange, handleSearchChange} = this;
    const {dialog_open, menu_open, scheme} = state;
    const {show_search, show_variants, tabParams} = props;

    return (
      <div style={{display: 'inline-flex', alignItems: 'baseline'}}>
        {/* Search box */
          show_search && <SearchBox onChange={handleSearchChange}/>
        }


        {/* Variants */
          show_variants && scheme && <Button dense onClick={this.handleMenuOpen} style={{alignSelf: 'center'}}>{scheme.name}</Button>
        }
        {/* Variants */
          show_variants && scheme && this.Variants()
        }


        {/* List configuration button */}
        <IconButton title="Настройка списка" onClick={handleDialogOpen}>
          <IconSettings/>
        </IconButton>

        {dialog_open && <DnR title={`${scheme.name} (вариант настроек)`} onClose={handleDialogClose} minHeight={433} initialHeight={440}>
          <SchemeSettingsTabs
            scheme={scheme}
            handleSchemeChange={handleSchemeChange}
            tabParams={tabParams}
            handleDialogClose={handleDialogClose}
            handleOk={handleOk}
          />
        </DnR>}

      </div>
    );
  }
}
