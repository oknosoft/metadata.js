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
  }

  render() {
    const {state: {_obj}, context, props} = this;
    const tbProps = {
      closeButton: !context.dnr,
      handleAdd: () => {},
      handleDelete: () => {},
      handleDownload: () => {},
      handleClose: props.handleClose,
    };
    const listProps = {
      _obj: _obj,
      handleSelect: () => {},
      handleDownload: () => {},
    };

    return _obj ?
      [
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
  handlers: PropTypes.object,         // обработчики редактирования объекта
};

export default Attachments;
