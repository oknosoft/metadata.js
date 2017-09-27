/**
 * ### Выбор варианта сохраненных настроек
 * страница формы справочника SchemeSettings
 *
 * Created 19.12.2016
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import DataField from '../DataField';
import FieldSelect from '../DataField/FieldSelect';
import Divider from 'material-ui/Divider';
import SaveIcon from 'material-ui-icons/Save';
import CopyIcon from 'material-ui-icons/ContentCopy';

import {FormGroup} from 'material-ui/Form';

import styles from './styles/SchemeSettingsSelect.scss';
import withStyles from '../Header/toolbar';

class SchemeSettingsSelect extends Component {

  static propTypes = {
    scheme: PropTypes.object.isRequired,
    handleSchemeChange: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = $p.dp.scheme_settings.dp(props.scheme);
  }

  handleSave = () => {
    const {scheme, handleSchemeChange} = this.props;
    scheme.save().then(() => {
      handleSchemeChange(scheme);
    });
  };

  handleCreate = () => {
    const {scheme, handleSchemeChange} = this.props;
    const proto = Object.assign({}, scheme._obj);
    proto.name = proto.name.replace(/[0-9]/g, '') + Math.floor(10 + Math.random() * 21);
    proto.ref = '';

    scheme._manager.create(proto).then((scheme) => {
      handleSchemeChange(scheme);
    });
  };

  handleNameChange = () => {
    this.fld_scheme.forceUpdate();
  };

  render() {

    const {state, props, handleCreate, handleSave, handleNameChange} = this;
    const {_obj, _meta} = state;
    const {scheme, classes, handleSchemeChange} = props;

    return (
      <div>
        <Toolbar disableGutters className={classes.bar}>

          <IconButton title="Сохранить вариант настроек" onClick={handleSave}><SaveIcon/></IconButton>
          <IconButton title="Создать копию настроек" onClick={handleCreate}><CopyIcon/></IconButton>

          <Typography type="title" color="inherit" className={props.classes.flex}> </Typography>

          <Typography type="caption">Настройка</Typography>
          <div style={{width: 200}}>
            <FieldSelect
              ref={(el) => this.fld_scheme = el}
              _obj={_obj}
              _fld="scheme"
              _meta={_meta}
              handleValueChange={handleSchemeChange}/>
          </div>
        </Toolbar>

        <FormGroup style={{margin: 16}}>
          <DataField _obj={scheme} _fld="name" fullWidth handleValueChange={handleNameChange}/>
          <DataField _obj={scheme} _fld="query" fullWidth/>
          <DataField _obj={scheme} _fld="standard_period" fullWidth/>
        </FormGroup>


      </div>
    );

  }
};

export default withStyles(SchemeSettingsSelect);
