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

export function prevent(evt) {
  evt.stopPropagation();
  try {
    evt.preventDefault();
  }
  catch(e) {}
}

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
    const {_manager} = _obj[_fld];
    owner.handleSelect(_manager.get());
  };

  handleOpenList = () => {

  };

  handleOpenObj = () => {

  };

  render() {
    const {props: {children, classes, ...props}, context: {owner}} = this;
    const {props: {_obj, _fld}, _meta} = owner;
    const {_manager} = _obj[_fld];
    const is_enm = $p.utils.is_enm_mgr(_manager);
    const footer = !is_enm || _meta.type.types.length > 1;
    const iconDisabled=!_obj[_fld] || _obj[_fld].empty();

    return <Paper {...props}>
      {children}
      {footer && <Divider/>}
      {footer && <Toolbar key="Toolbar" disableGutters onMouseDown={prevent} onTouchStart={prevent}>
        <Button
          size="small"
          className={classes.a}
          onClick={owner.handleOpenList}
          onTouchEnd={owner.handleOpenList}
          title={_manager.frm_selection_name}
        >Список</Button>
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

        {_meta.type.types.length > 1 && <IconButton title="Выбрать тип значения"><TitleIcon/></IconButton>}

        {!is_enm && _manager.acl.includes('v') && <IconButton
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
