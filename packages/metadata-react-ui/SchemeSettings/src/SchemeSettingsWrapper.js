/**
 * ### Контейнер сохраненных настроек
 * Кнопка открытия + диалог
 *
 * @module SchemeSettingsWrapper
 *
 * Created 31.12.2016
 */

import React, {Component, PropTypes} from "react";
import IconButton from "material-ui/IconButton";
import IconSettings from "material-ui/svg-icons/action/settings";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import SchemeSettingsTabs from "./SchemeSettingsTabs";


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

    const {scheme} = props

    this.state = {
      scheme,
      open: false,
      variants: [scheme]
    }

    scheme._manager.get_option_list({
      _top: 40,
      obj: scheme.obj,
    })
      .then((variants) => {
        this.setState({variants})
      })

  }

  handleOpen = () => {
    this.setState({open: true});
  }

  handleClose = () => {
    this.setState({open: false});
  }

  handleOk = () => {
    this.handleClose();
    this.props.handleSchemeChange(this.state.scheme);
  }

  handleSchemeChange = (scheme) => {
    this.props.handleSchemeChange(scheme)
    this.setState({scheme});
  }

  handleSearchChange = (event, newValue) => {

  }

  handleVariantChange = (event, index, value) => {

    const {_manager} = this.state.scheme;
    this.handleSchemeChange(_manager.get(value));

  }

  componentDidMount = () => {
    if(this.searchInput){
      this.searchInput.input.placeholder = "Найти..."
    }
  }

  render() {

    const {props, state, handleOpen, handleOk, handleClose, handleSchemeChange, handleSearchChange, handleVariantChange} = this;
    const {open, scheme, variants} = state
    const {show_search, show_variants, tabParams} = props

    const actions = [
      <FlatButton
        label="Применить"
        primary={true}
        keyboardFocused={true}
        onTouchTap={handleOk}
      />,
      <FlatButton
        label="Отмена"
        secondary={true}
        onTouchTap={handleClose}
      />,
    ];

    const menuitems = [];
    if(show_variants && scheme){
      variants.forEach((v) => {
        menuitems.push(<MenuItem value={v.ref} key={v.ref} primaryText={v.name} />);
      })
    }

    return (

      <div>

        {show_search ?
            <TextField
              name="search"
              ref={(search) => {this.searchInput = search;}}
              width={300}
              underlineShow={false}
              style={{backgroundColor: 'white', height: 36, top: -6, padding: 6}}
              onChange={handleSearchChange}
              disabled
            />
          :
          null
        }

        {
          show_variants && scheme ?
            <DropDownMenu
              ref={(ref) => {
                if(ref){
                  const {style} = ref.rootNode.firstChild.children[1];
                  style.lineHeight = '36px';
                  style.top = '6px';
                }
              }}
              maxHeight={300}
              value={scheme.ref}
              onChange={handleVariantChange}>
              {menuitems}
            </DropDownMenu>
            :
            null
        }

        <IconButton touch={true} tooltip="Настройка списка" onTouchTap={handleOpen}>
          <IconSettings />
        </IconButton>

        <Dialog
          title="Настройка списка"
          actions={actions}
          modal={false}
          autoScrollBodyContent={true}
          open={open}
          onRequestClose={handleClose}
        >

          <SchemeSettingsTabs
            handleSchemeChange={handleSchemeChange}
            scheme={scheme}
            tabParams={tabParams}
          />

        </Dialog>

      </div>
    )
  }

}
