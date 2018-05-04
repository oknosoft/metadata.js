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


class Attachments extends MDNRComponent {

  constructor(props, context) {
    super(props, context);
    this.state = {_obj: props._obj};
    this.input = null;
  }

  fileChange = ({target}) => {
    if(target.files.length) {
      let res;
      const {_obj} = this.state;
      const {utils, job_prm, msg} = $p;
      (utils.mime_lookup ? Promise.resolve() : import('metadata-core/src/mime').then((module) => {
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
          const {handleIfaceState} = this.props;
          handleIfaceState && handleIfaceState({
            component: '',
            name: 'alert',
            value: {open: true, title: msg.file_download, text: err.message}
          });
        });
    }
  };

  handleAdd = () => {
    this.input && this.input.click();
  };

  handleSelect = (name) => {
    this.setState({name});
  }

  handleDownload = () => {
    const {name, _obj} = this.state;
    if(name) {
      const url = `${_obj._manager.pouch_db.name}/${_obj.class_name}|${_obj.ref}/${name}`;
      window.open(url, '_blank');
    }
  }

  render() {
    const {state: {_obj}, context, props} = this;
    const tbProps = {
      closeButton: !context.dnr,
      handleAdd: this.handleAdd,
      handleDelete: () => {},
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
        <AttachmentsList key="data" {...listProps} />
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
