/**
 * # body of the popup
 *
 * @module PaperComponent
 *
 * Created 30.04.2021.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import OpenInNew from '@material-ui/icons/OpenInNew';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import TitleIcon from '@material-ui/icons/Title';
import ClearIcon from '@material-ui/icons/Clear';

import {withStyles} from '@material-ui/styles';

const styles = theme => ({
  flex: {
    flex: 1,
    whiteSpace: 'noWrap',
  },
  a: {
    whiteSpace: 'noWrap',
    textDecoration: 'underline',
    textTransform: 'none',
    fontSize: 'inherit',
    cursor: 'pointer',
    color: '#0b0080'
  },
});


class PaperComponent extends React.Component {

  clear = () => {
    const {owner} = this.context;
    const {props: {_obj, _fld}} = owner;
    const {_manager} = _obj[_fld] || {};
    _manager && owner.handleSelect(_manager.get());
  };

  handleOpenList = () => {

  };

  handleOpenObj = () => {

  };

  handleSelectType = () => {
    const {owner} = this.context;
    const {props: {_obj, _fld}, _meta} = this.context.owner;
    const {md, ui, utils} = $p;
    const list = [];
    for(const type of _meta.type.types) {
      const mgr = md.mgr_by_class_name(type);
      if(mgr) {
        list.push({ref: type, text: mgr.metadata().synonym || mgr.metadata().name});
      }
    }
    if(!list.length) {
      list.push('Нет ссылочных типов в метаданных поля')
    }
    ui.dialogs.input_value({list, title: 'Укажите тип значения'})
      .then((ref) => {
        if(ref) {
          owner.handleSelect(md.mgr_by_class_name(ref).get());
        }
      });
  };

  render() {
    const {props: {children, classes, ...props}, context: {owner}} = this;
    const {props: {_obj, _fld}, _meta} = owner;
    const value = _obj[_fld];
    const {_manager} = value || {};
    const {ui: {prevent}, utils} = $p;
    const is_enm = utils.is_enm_mgr(_manager);
    const footer = !is_enm || _meta.type.types.length > 1;
    const iconDisabled= !value || value.empty();

    return <Paper {...props}>
      {children}
      {footer && <Divider/>}
      {footer && <Toolbar key="Toolbar" disableGutters onMouseDown={prevent} onTouchStart={prevent}>
        {_manager ? <Button
          size="small"
          className={classes.a}
          onClick={owner.handleOpenList}
          onTouchEnd={owner.handleOpenList}
          title={_manager.frm_selection_name}>Список</Button>
          :
          <Button
            size="small"
            className={classes.a}
            onClick={this.handleSelectType}
            onTouchEnd={this.handleSelectType}
            title={'Составной тип значения'}><TitleIcon/>Выбрать тип</Button>
        }
        <Typography
          variant="h6"
          color="inherit"
          className={classes.flex}
        > </Typography>

        {props.btns}

        <IconButton
          title="Очистить"
          disabled={iconDisabled || _meta.disable_clear}
          onClick={this.clear}
          onTouchEnd={this.clear}
        ><ClearIcon/></IconButton>

        {!is_enm && _manager && _manager.acl.includes('v') && <IconButton
          title={_manager.frm_obj_name}
          disabled={iconDisabled}
          onClick={owner.handleOpenObj}
          onTouchEnd={owner.handleOpenObj}
        ><OpenInNew/></IconButton>}

      </Toolbar>}
    </Paper>;
  }

}

PaperComponent.contextTypes = {
  owner: PropTypes.object,
};

export default withStyles(styles)(PaperComponent);
