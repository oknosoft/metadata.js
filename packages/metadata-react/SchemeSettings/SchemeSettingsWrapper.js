/**
 * ### Контейнер сохраненных настроек
 * Кнопка открытия + диалог
 *
 * @module SchemeSettingsWrapper
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

import Dialog from '../Dialog';
import {getTabsContent, SchemeSettingsTabs} from './SchemeSettingsTabs';
import styles from './styles/SchemeSettingsWrapper.scss';

export default class SchemeSettingsWrapper extends Component {

  static propTypes = {
    scheme: PropTypes.object.isRequired,
    handleSchemeChange: PropTypes.func.isRequired,
    tabParams: PropTypes.object,                    // конструктор пользовательской панели параметров
    show_search: PropTypes.bool,                    // показывать поле поиска
    show_variants: PropTypes.bool,                  // показывать список вариантов настройки динсписка
  }

  constructor(props, context) {
    super(props, context);
    const {scheme} = props;

    this.state = {
      scheme,
      dialog_open: false,
      menu_open: false,
      fullscreen: false,
      variants: [scheme]
    }

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
  }

  handleDialogClose = () => {
    this.setState({
      dialog_open: false
    });
  }

  handleMenuOpen = (event) => {
    this.setState({menu_open: true, anchorEl: event.currentTarget});
  }

  handleMenuClose = () => {
    this.setState({
      menu_open: false
    });
  }

  handleOk = () => {
    this.handleDialogClose();
    this.props.handleSchemeChange(this.state.scheme);
  }

  handleSchemeChange = (scheme) => {
    this.props.handleSchemeChange(scheme);
    this.setState({scheme});
  }

  handleSearchChange = (event, newValue) => {

  }

  componentDidMount = () => {
    if(this.searchInput) {
      this.searchInput.input.placeholder = 'Найти...';
    }
  }

  handleFullscreenClick() {
    this.setState({
      fullscreen: !this.state.fullscreen
    });
  }

  Variants() {
    const {variants, scheme, menu_open, anchorEl} = this.state;
    const menuitems = variants.map((v, index) => <MenuItem
      selected = {v == scheme}
      key = {v.ref}
      onClick = {() => {
        this.handleSchemeChange(variants[index]);
        this.handleMenuClose();
      }}
    >{v.name}</MenuItem>);

    return <div>
      <Button onClick={this.handleMenuOpen} >{scheme.name}</Button>
      <Menu anchorEl={anchorEl} open={menu_open} onRequestClose={this.handleMenuClose}>
        {menuitems}
      </Menu>
    </div>
  }

  render() {
    const {props, state, handleDialogOpen, handleOk, handleDialogClose, handleSchemeChange, handleSearchChange} = this;
    const {dialog_open, menu_open, scheme} = state;
    const {show_search, show_variants, tabParams} = props;

    const actions = [
      <Button
        key={0}
        raised
        onClick={handleDialogClose}>Отмена</Button>,

      <Button
        key={1}
        raised
        onClick={handleOk}>Применить</Button>,
    ];


    return (
      <div style={{display: 'inherit'}}>
        {/* Search box */}
        {show_search ? <TextField
          name="search"
          ref={(search) => {
            this.searchInput = search;
          }}
          width={300}
          underlineShow={false}
          className={styles.searchBox}
          onChange={handleSearchChange}
          disabled/> : null
        }


        {/* Variants */
          show_variants && scheme && this.Variants()
        }


        {/* Show list configuration button */}
        <IconButton title="Настройка списка" onClick={handleDialogOpen}>
          <IconSettings/>
        </IconButton>

        <Dialog
          title={'Настройка моего списка'}
          actions={actions}
          tabs={getTabsContent(scheme, handleSchemeChange, tabParams)}
          resizable={true}
          visible={dialog_open}
          width={700}
          height={500}
          fullscreen={this.state.fullscreen}
          onFullScreenClick={() => this.handleFullscreenClick()}
          onCloseClick={this.handleDialogClose}/>
      </div>
    );
  }
}
