import React from 'react';
import PropTypes from 'prop-types';
import MDNRComponent from '../common/MDNRComponent';

import FormGroup from '@material-ui/core/FormGroup';
import Divider from '@material-ui/core/Divider';

// окно диалога, чтобы показать всплывающие формы
import Dialog from '../App/Dialog';

import LoadingMessage from '../DumbLoader/LoadingMessage';
import DataObjToolbar from './DataObjToolbar';
import DataField from '../DataField';
import TabularSection from '../TabularSection';
import FrmAttachments from '../FrmAttachments';

class DataObj extends MDNRComponent {

  constructor(props, context) {
    super(props, context);
    const {_mgr, _meta} = props;
    this._handlers = {
      handleSave: this.handleSave.bind(this),
      handlePost: this.handlePost.bind(this),
      handleMarkDeleted: this.handleMarkDeleted.bind(this),
      handlePrint: this.handlePrint.bind(this),
      handleAttachments: this.handleAttachments.bind(this),
      handleCloseAttachments: this.handleCloseAttachments.bind(this),
      handleClose: this.handleClose.bind(this),
      handleSaveClose: this.handleSaveClose.bind(this),
    };
    this.state = {
      _meta: _meta || _mgr.metadata(),
      _obj: null,
      _attachments: false,
    };

  }

  componentDidMount() {
    const {_mgr, match} = this.props;

    _mgr.get(match.params.ref, 'promise').then((_obj) => {
      this.setState({_obj}, () => this.shouldComponentUpdate(this.props));
    });

    _mgr.on('update', this.onDataChange);
  }

  componentWillUnmount() {
    this.props._mgr.off('update', this.onDataChange);
    this.state._obj.is_new() && this.state._obj.unload();
  }

  handlePost() {
    return this.handleSave(true);
  }

  handleSave(post) {
    const {_obj} = this.state;
    return !_obj ? Promise.resolve() : _obj.save(typeof post === 'boolean' ? post : void 0)
      .then(() => this.shouldComponentUpdate(this.props))
      .catch((err) => {
        // показываем диалог
        this.props.handleIfaceState({
          component: '',
          name: 'alert',
          value: {open: true, title: _obj.presentation, text: err.reason || err.message}
        });
        return err;
      });
  }

  handleClose() {
    const {handlers, _mgr} = this.props;
    const {_obj} = this.state;
    handlers.handleNavigate(`/${_mgr.class_name}/list${_obj ? '/?ref=' + _obj.ref : ''}`);
  }

  handleSaveClose() {
    this.handleSave()
      .then((err) => typeof err !== 'object' && this.handleClose());
  }

  handleMarkDeleted() {
  }

  handlePrint() {
  }

  handleAttachments() {
    this.setState({_attachments: true})
  }

  handleCloseAttachments() {
    this.setState({_attachments: false})
  }

  handleValueChange(_fld) {
    return (event, value) => {
      const {_obj, handlers} = this.props;
      const old_value = _obj[_fld];
      _obj[_fld] = (value || (event && event.target ? event.target.value : ''));
      handlers.handleValueChange(_fld, old_value);
    };
  }

  onDataChange = (obj, fields) => {
    if(obj === this.state._obj && this.shouldComponentUpdate(this.props)) {
      this.forceUpdate();
    }
  }


  /**
   * Render part with fields.
   * @return {Element}
   */
  renderFields() {
    const elements = [];
    const {struct} = this.props;
    const {_meta, _obj} = this.state;

    if(!struct) {
      if(_obj instanceof $p.classes.DocObj) {
        elements.push(
          <FormGroup row key={`group_sys`}>
            <DataField _obj={_obj} key={`field_number_doc`} _fld="number_doc"/>
            <DataField _obj={_obj} key={`field_date`} _fld="date"/>
          </FormGroup>);
      }
      else if(_obj instanceof $p.classes.CatObj) {
        _meta.code_length && elements.push(<DataField _obj={_obj} key={`field_id`} _fld="id"/>);
        _meta.main_presentation_name && elements.push(<DataField _obj={_obj} key={`field_name`} _fld="name"/>);
        _meta.has_owners && elements.push(<DataField _obj={_obj} key={`field_owner`} _fld="owner"/>);
      }
      for (const _fld in _meta.fields) {
        _fld != 'predefined_name' && elements.push(<DataField fullWidth key={`field_${_fld}`} _obj={_obj} _fld={_fld}/>);
      }
    }

    return elements.length === 0 ? null : <FormGroup>{elements}</FormGroup>;
  }

  /**
   * Render part with tabular sections.
   * @return {Element} [description]
   */
  renderTabularSections() {
    const elements = [];
    const {_meta, _obj} = this.state;

    for (const ts in _meta.tabular_sections) {
      if(elements.length || Object.keys(_meta.fields).length) {
        elements.push(<Divider light key={`dv_${ts}`}/>);
      }
      elements.push(<div key={`ts_${ts}`} style={{height: 300}}>
        <TabularSection _obj={_obj} _tabular={ts}/>
      </div>);
    }

    return elements.length === 0 ? null : <FormGroup>{elements}</FormGroup>;
  }

  get ltitle() {
    const {_meta, _obj} = this.state;
    let ltitle = (_obj && _obj.presentation) || _meta.obj_presentation || _meta.synonym;
    if(_obj && _obj._modified && ltitle[ltitle.length - 1] !== '*') {
      ltitle += ' *';
    }
    return ltitle;
  }

  renderItems(items) {
    const {props: {_mgr, classes}, state: {_obj, _meta}} = this;

    return items.map((item, index) => {

      if(Array.isArray(item)) {
        return this.renderItems(item);
      }

      const {element, fld, ...props} = item;

      if(element === 'DataField') {
        return <DataField key={index} _obj={_obj} _fld={fld} _meta={_meta.fields[item.fld]} {...props}/>;
      }

      if(element === 'FormGroup') {
        return <FormGroup key={index} className={classes.spaceLeft} {...props}>{this.renderItems(item.items)}</FormGroup>;
      }

      return <div key={index}>Не реализовано в текущей версии</div>;
    });
  }

  render() {
    const {props: {_mgr, classes}, state: {_obj, _meta, _attachments}, context, _handlers} = this;
    const toolbar_props = Object.assign({
      closeButton: !context.dnr,
      posted: _obj && _obj.posted,
      deleted: _obj && _obj.deleted,
      postable: !!(_meta.posted || _mgr.metadata('posted')),
      deletable: true,
    }, _handlers)

    return _obj ?
      [
        <DataObjToolbar key="toolbar" {...toolbar_props} />,

        _meta.form && _meta.form.obj ?
          this.renderItems(_meta.form.obj.items)
          :
          <FormGroup key="data" className={classes.spaceLeft}>
            {this.renderFields()}
            {this.renderTabularSections()}
          </FormGroup>,

        _attachments && <Dialog key="attachments"
          open
          noSpace
          title={`Вложения /${this.ltitle}/`}
          onClose={_handlers.handleCloseAttachments}
        >
          <FrmAttachments _obj={_obj} handleClose={_handlers.handleCloseAttachments}/>
        </Dialog>
      ]
      :
      <LoadingMessage/>;
  }

}

DataObj.propTypes = {
  _mgr: PropTypes.object,             // DataManager, с которым будет связан компонент
  _acl: PropTypes.string,             // Права на чтение-изменение
  _meta: PropTypes.object,            // Здесь можно переопределить метаданные
  match: PropTypes.object,            // match роутера, из него добываем ref, можно передать fake-объект со ссылкой

  read_only: PropTypes.object,        // Элемент только для чтения

  handlers: PropTypes.object.isRequired, // обработчики редактирования объекта
};

export default DataObj;

