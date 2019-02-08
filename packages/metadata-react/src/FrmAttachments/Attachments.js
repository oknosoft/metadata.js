/**
 * Панель вложений
 *
 * @module Attachments
 *
 * Created by Evgeniy Malyarov on 03.05.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

import MDNRComponent from '../common/MDNRComponent';
import LoadingMessage from '../DumbLoader/LoadingMessage';
import AttachmentsToolbar from './AttachmentsToolbar';
import AttachmentsList from './AttachmentsList';
import Dialog from '../App/Dialog';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

class Attachments extends MDNRComponent {

  constructor(props, context) {
    super(props, context);
    this.state = {
      _obj: props._obj,
      dialog: null,
    };
    this.input = null;
  }

  fileChange = ({target}) => {
    if(target.files.length) {
      let res;
      const {_obj} = this.state;
      const {utils, job_prm, msg} = $p;
      (utils.mime_lookup ? Promise.resolve() : import('metadata-core/lib/mime.min').then((module) => {
        module.default.constructor.call($p);
      }))
        .then(() => {
          for(let i = 0; i < target.files.length; i++) {
            const file = target.files[i];
            if(file.size > job_prm.attachment_max_size) {
              throw new Error(msg.file_size + (job_prm.attachment_max_size / 1000000).round() + 'Mb');
            }
            if(res) {
              res = res.then(() => _obj.save_attachment(file.name, file, utils.mime_lookup(file.name.substr(file.name.lastIndexOf('.') + 1))));
            }
            else {
              res = _obj.save_attachment(file.name, file, utils.mime_lookup(file.name.substr(file.name.lastIndexOf('.') + 1)));
            }
          }
          return res;
        })
        .then(() => _obj.load())
        .then(() => this.forceUpdate())
        .catch((err) => {
          // показываем диалог
          this.setState({dialog: {
              title: msg.file_download,
              message: err.message,
            }});
        });
    }
  };

  handleAdd = () => {
    this.input && this.input.click();
  };

  handleDelete = () => {
    const {name} = this.state;
    if(name) {
      this.setState({dialog: {
          title: 'Удаление файла',
          name: name,
          message: `Удалить вложение "${name}"?`,
        }});
    }
    else {
      this.setState({dialog: {
          title: $p.msg.file_download,
          message: $p.msg.file_select,
        }});
    }
  }

  handleDeleteFinish = () => {
    const {name, _obj} = this.state;
    _obj.delete_attachment(name)
      .then(() => this.setState({dialog: null}))
      .catch((err) => {
        // показываем диалог
        this.setState({dialog: {
            title: $p.msg.file_download,
            message: err.message,
          }});
      });
  }

  handleCloseDialog = () => {
    this.setState({dialog: null});
  }

  handleSelect = (name) => {
    this.setState({name});
  }

  handleDownload = () => {
    const {name, _obj} = this.state;
    if(name) {
      const url = `${_obj._manager.pouch_db.name}/${_obj.class_name}|${_obj.ref}/${name}`;
      window.open(url, '_blank');
    }
    else {
      this.setState({dialog: {
          title: $p.msg.file_download,
          message: $p.msg.file_select,
        }});
    }
  }

  render() {
    const {state: {_obj, dialog}, context, props} = this;
    const tbProps = {
      closeButton: !context.dnr,
      handleAdd: this.handleAdd,
      handleDelete: this.handleDelete,
      handleDownload: this.handleDownload,
      handleClose: props.handleClose,
    };
    const listProps = {
      _obj: _obj,
      handleSelect: this.handleSelect,
      handleDownload: this.handleDownload,
    };

    return _obj ?
      [
        <input key="input" ref={(el) => this.input = el} onChange={this.fileChange} type="file" multiple="1" style={{display: 'none'}} />,
        <AttachmentsToolbar key="toolbar" {...tbProps} />,
        <AttachmentsList key="data" {...listProps} />,
        dialog && <Dialog
          key="dialog"
          open
          title={dialog.title}
          onClose={this.handleCloseDialog}
          actions={dialog.name ?
            [
              <Button key="cancel" onClick={this.handleCloseDialog} color="primary">Отмена</Button>,
              <Button key="ok" onClick={this.handleDeleteFinish} color="primary">Ок</Button>
            ]
            :
            <Button key="ok" onClick={this.handleCloseDialog} color="primary">Ок</Button>
          }
        >
          <Typography color="primary">{dialog.message}</Typography>
        </Dialog>
      ]
      :
      <LoadingMessage/>;
  }

}

Attachments.propTypes = {
  _obj: PropTypes.object,             // если объект не указан, получаем его по ссылке
  _mgr: PropTypes.object,             // DataManager, с которым будет связан компонент
  _acl: PropTypes.string,             // права на чтение-изменение
  match: PropTypes.object,            // match роутера, из него добываем ref, можно передать fake-объект со ссылкой
  read_only: PropTypes.object,        // элемент только для чтения
  handleClose: PropTypes.func,
  handleIfaceState: PropTypes.func,
};

export default Attachments;
