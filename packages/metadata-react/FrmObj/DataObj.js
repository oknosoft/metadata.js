import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Layout from '../FlexPanel/react-flex-layout/react-flex-layout';
import LayoutSplitter from '../FlexPanel/react-flex-layout/react-flex-layout-splitter';
import LoadingMessage from '../DumbLoader/LoadingMessage';

import Toolbar from './Toolbar';
import DataField from '../DataField';
import TabularSection from '../TabularSection';

import classes from './DataObj.scss';
import classnames from 'classnames';

import Paper from 'material-ui/Paper';

export default class DataObj extends Component {

  static PAPER_STYLE = {
    margin: '10px',
  };

  static PAPER_STYLE_FIELDS = {
    padding: '10px',
  };

  static PAPER_STYLE_TABULAR_SECTION = {
    height: '100%',
  };

  static propTypes = {
    _mgr: PropTypes.object,             // DataManager, с которым будет связан компонент
    _acl: PropTypes.string.isRequired,  // Права на чтение-изменение
    _meta: PropTypes.object,            // Здесь можно переопределить метаданные
    _layout: PropTypes.object,          // Состав и расположение полей, если не задано - рисуем типовую форму

    read_only: PropTypes.object,        // Элемент только для чтения

    handlers: PropTypes.object.isRequired, // обработчики редактирования объекта
  };

  constructor(props, context) {
    super(props, context);
    const {_mgr, _meta, match} = props;
    this._handlers = {
      handleSave: this.handleSave.bind(this),
      handleSend: this.handleSend.bind(this),
      handleMarkDeleted: this.handleMarkDeleted.bind(this),
      handlePrint: this.handlePrint.bind(this),
      handleAttachment: this.handleAttachment.bind(this),
      handleClose: this.handleClose.bind(this),
    };
    this.state = {_meta: _meta || _mgr.metadata()};
    _mgr.get(match.params.ref, 'promise').then((_obj) => {
      if(this._isMounted) {
        this.setState({_obj});
      }
      else {
        this.state._obj = _obj;
      }
    });
  }

  handleSave() {
    //this.props.handleSave(this.state._obj);
    const {_obj} = this.state;
    _obj && _obj.save();
  }

  handleSend() {
    this.props.handlers.handleSave(this.state._obj);
  }

  handleClose() {
    const {handlers, _mgr} = this.props;
    const {_obj} = this.state;
    handlers.handleNavigate(`/${_mgr.class_name}/list${_obj ? '/?ref=' + _obj.ref : ''}`);
  }

  handleMarkDeleted() {
  }

  handlePrint() {
  }

  handleAttachment() {
  }

  handleValueChange(_fld) {
    return (event, value) => {
      const {_obj, handlers} = this.props;
      const old_value = _obj[_fld];
      _obj[_fld] = (value || (event && event.target ? event.target.value : ''));
      handlers.handleValueChange(_fld, old_value);
    };
  }


  /**
   * Render part with fields.
   * @return {Element}
   */
  renderFields() {
    const elements = [];
    const {_meta, _obj} = this.state;

    for (const _fld in _meta.fields) {
      elements.push(
        <DataField key={`field_${_fld}`} _obj={_obj} _fld={_fld}/>
      );
    }

    return elements.length === 0 ? null :
      <Paper style={Object.assign({}, DataObj.PAPER_STYLE, DataObj.PAPER_STYLE_FIELDS)}>
        <div className={classes.fields}>
          {elements}
        </div>
      </Paper>;
  }

  /**
   * Render part with tabular sections.
   * @return {Element} [description]
   */
  renderTabularSections() {
    const elements = [];
    const {_meta, _obj} = this.state;
    const style = Object.assign({}, DataObj.PAPER_STYLE, DataObj.PAPER_STYLE_TABULAR_SECTION);

    for (const tabularSectionName in _meta.tabular_sections) {
      elements.push(
        <Paper key={tabularSectionName} style={style}>
          <TabularSection _obj={_obj} _tabular={tabularSectionName}/>
        </Paper>
      );
    }

    return elements.length === 0 ? null :
      <div className={classes.tabularSections}>
        {elements}
      </div>
      ;
  }


  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {

    if(!this.state._obj) {
      return <LoadingMessage/>;
    }

    return <div>
      <Toolbar {...this._handlers} />
      {this.renderFields()}
      {this.renderTabularSections()}
    </div>;
  }

}

