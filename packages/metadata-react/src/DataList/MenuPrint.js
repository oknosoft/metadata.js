/**
 * Каскадер печатных форм
 *
 * @module MenuPrint
 *
 * Created by Evgeniy Malyarov on 15.05.2019.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PrintIcon from '@material-ui/icons/Print';
import ChevronLeft from '@material-ui/icons/ChevronLeft';


class MenuPrint extends React.Component {

  state = {anchorEl: null, plates: []};

  componentDidMount() {
    const {_mgr} = this.props.scheme.child_meta();
    _mgr && _mgr.printing_plates()
      .then((plates) => {
        const groups = new Map();
        for(const key in plates) {
          const plate = plates[key];
          const group = plate.name.indexOf('/') !== -1 ? plate.name.substr(plate.name.indexOf('/')).trim() : 'Общее';
          if(!groups.get(group)) {
            groups.set(group, []);
          }
          groups.get(group).push(plate);
        }
        plates = [];
        groups.forEach((value, name) => plates.push({name, value}));
        this.setState({plates});
      });
  }

  openSubMenu = event => {
    this.setState({anchorEl: event.currentTarget});
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  renderItems(plates) {
    const {handlePrint} = this.props;
    if(plates.length === 1) {
      return plates[0].value.map((v) => <MenuItem key={v.ref} onClick={() => handlePrint(v)}>{v.name}</MenuItem>)
    }
  }

  render() {
    const {anchorEl, plates} = this.state;
    return [
      <MenuItem key="open_print" onClick={this.openSubMenu}>
        <ListItemIcon><PrintIcon/></ListItemIcon>Печать</MenuItem>,
      <Menu key="print_menu"
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            onClose={this.handleClose}>
        {this.renderItems(plates)}
      </Menu>
    ];
  }
}

MenuPrint.propTypes = {
  scheme: PropTypes.object.isRequired,            // значение настроек компоновки
  handlePrint: PropTypes.func.isRequired,         // обработчик открытия диалога печати
};

export default MenuPrint;
