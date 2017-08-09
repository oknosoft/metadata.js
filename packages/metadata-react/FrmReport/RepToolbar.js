import React from "react";
import PropTypes from 'prop-types'
import MetaComponent from "../common/MetaComponent";

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from "material-ui/Toolbar";
import IconButton from "material-ui/IconButton";
import FlatButton from "material-ui/FlatButton";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";

import RunIcon from "material-ui-icons/PlayArrow";
import MoreVertIcon from "material-ui-icons/MoreVert";
import PrintIcon from "material-ui-icons/Print";
import CopyIcon from "material-ui-icons/ContentCopy";
import CloudDownloadIcon from "material-ui-icons/CloudDownload";
import FileDownloadIcon from "material-ui-icons/FileDownload";

import SchemeSettings from "../SchemeSettings";


export default class RepToolbar extends MetaComponent {

  static propTypes = {

    handleSave: PropTypes.func.isRequired,          // обработчик формирования отчета
    handlePrint: PropTypes.func.isRequired,         // обработчик открытия диалога печати
    handleClose: PropTypes.func.isRequired,         // команда закрытия формы

    handleSchemeChange: PropTypes.func.isRequired,  // обработчик при изменении настроек компоновки
    scheme: PropTypes.object.isRequired,            // значение настроек компоновки

    TabParams: PropTypes.func,                      // внешний компонент страницы параметров

    _obj: PropTypes.object,
    _tabular: PropTypes.string.isRequired,

  }

  constructor(props, context) {

    super(props, context);

    context.$p.UI.export_handlers.call(this);

  }

  render() {

    const {handleExportXLS, handleExportJSON, handleExportCSV, props} = this;
    const {handleSave, handleClose, handleSchemeChange, handlePrint, scheme, _obj, _tabular, TabParams} = props;

    return (

      <Toolbar>
        <ToolbarGroup className={"meta-toolbar-group"} firstChild={true}>

          <FlatButton
            label="Сформировать"
            onClick={handleSave}
            icon={<RunIcon />}
          />

        </ToolbarGroup>

        <ToolbarGroup className={"meta-toolbar-group"}>

          <SchemeSettings
            handleSchemeChange={handleSchemeChange}
            scheme={scheme}
            tabParams={
              TabParams ? <TabParams
                _obj={_obj}
                scheme={scheme}
              />
                : null
            }
            show_variants={true}
          />

          <IconMenu
            iconButtonElement={
              <IconButton touch={true} tooltip="Дополнительно" tooltipPosition="bottom-left">
                <MoreVertIcon />
              </IconButton>
            }
          >
            <MenuItem primaryText="Печать" leftIcon={<PrintIcon />} disabled onClick={handlePrint}/>
            <MenuItem primaryText="Копировать CSV" leftIcon={<CopyIcon />} onClick={handleExportCSV}/>
            <MenuItem primaryText="Копировать JSON" leftIcon={<CloudDownloadIcon />} onClick={handleExportJSON}/>
            <MenuItem primaryText="Экспорт в XLS" leftIcon={<FileDownloadIcon />} onClick={handleExportXLS}/>

          </IconMenu>

        </ToolbarGroup>

      </Toolbar>
    )
  }
}

