import React from 'react';
import PropTypes from 'prop-types';
import MDNRComponent from '../common/MDNRComponent';

import FormGroup from '@material-ui/core/FormGroup';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

// окно диалога, чтобы показать всплывающие формы
import Dialog from '../App/Dialog';

import LoadingMessage from '../DumbLoader/LoadingMessage';
import DataObjToolbar from './DataObjToolbar';
import DataField from '../DataField';
import FieldSelect from '../DataField/FieldSelect';
import FieldSelectStatic from '../DataField/FieldSelectStatic';
import TabularSection from '../TabularSection';
import FrmAttachments from '../FrmAttachments';

export function renderItems(items, customComponents) {
  const {props: {_mgr, classes}, state: {_obj, _meta}} = this;

  return items.map((item, index) => {

    if(Array.isArray(item)) {
      return renderItems.call(this, item, customComponents);
    }

    const {element, fld, light, cond_value, items, ...props} = item;

    if(_obj.is_folder && fld && !['id', 'name', 'owner', 'parent'].includes(fld)) {
      return null;
    }

    switch (element) {
    case 'DataField':
      return <DataField key={`fld_${index}`} _obj={_obj} _fld={fld} _meta={_meta.fields[item.fld]} {...props}/>;
    case 'FieldSelect':
      return <FieldSelect key={`fld_${index}`} _obj={_obj} _fld={fld} _meta={_meta.fields[item.fld]} {...props}/>;
    case 'FieldSelectStatic':
      return <FieldSelectStatic key={`fld_${index}`} _obj={_obj} _fld={fld} _meta={_meta.fields[item.fld]} {...props}/>;
    case 'FormGroup':
      return <FormGroup key={`grp_${index}`} className={classes.spaceLeft} {...props}>{renderItems.call(this, items, customComponents)}</FormGroup>;
    case 'Divider':
      return <Divider light={light} key={`dv_${index}`}/>;
    case 'TabularSection':
      return <div key={`ts_${index}`} style={{height: 320}}>
        <TabularSection _obj={_obj} _tabular={fld} {...props}/>
      </div>;
    case 'Tabs':
      return <AppBar position="static" color="default">
        <Tabs key={`tabs_${index}`} value={_obj[fld]} onChange={this.handleValueChange(fld)} {...props}>
          {renderItems.call(this, items, customComponents)}
        </Tabs>
      </AppBar>;
    case 'Tab':
      return <Tab key={`tab_${index}`} value={cond_value !== undefined ? cond_value : index} {...props}/>;
    case 'Condition':
      return _obj[fld] == cond_value && renderItems.call(this, items, customComponents);
    default:
      const Cmp = customComponents && customComponents[element];
      return Cmp ?
        <Cmp key={`fld_${index}`} _obj={_obj} _fld={fld} _meta={_meta.fields[item.fld]} {...props}/>
        :
        <div key={index}>{`${element}: не реализовано в текущей версии`}</div>;
    }
  });
};

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

    _mgr.get(match.params.ref, 'promise')
      .then((_obj) => _obj.load_linked_refs())
      .then((_obj) => {
        this.setState({_obj}, () => this.shouldComponentUpdate(this.props));
      });

    _mgr.on({update: this.onDataChange, mixin: this.onDataChange});
  }

  componentWillUnmount() {
    this.props._mgr.off({update: this.onDataChange, mixin: this.onDataChange});
    this.state._obj && this.state._obj.is_new() && this.state._obj.unload();
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
    const {base} = $p.job_prm;
    handlers.handleNavigate(`${base || ''}/${_mgr.class_name}/list${_obj ? '/?ref=' + _obj.ref : ''}`);
  }

  handleSaveClose() {
    this.handleSave()
      .then((err) => typeof err !== 'object' && this.handleClose());
  }

  handleMarkDeleted() {
  }

  handlePrint = (model) => {
    const {_obj} = this.state;
    _obj && _obj._manager.print(_obj, model);
  };

  handleAttachments() {
    this.setState({_attachments: true})
  }

  handleCloseAttachments() {
    this.setState({_attachments: false})
  }

  handleValueChange(_fld) {
    return (event, value) => {
      const {state: {_obj}, props: {handlers}} = this;
      const old_value = _obj[_fld];
      _obj[_fld] = (value || (event && event.target ? event.target.value : ''));
      handlers.handleValueChange && handlers.handleValueChange(_fld, old_value);
    };
  }

  onDataChange = (obj, fields) => {
    if(($p.utils.is_tabular(obj) && obj._owner._owner === this.state._obj) || (obj === this.state._obj)) {
      if(this.shouldComponentUpdate(this.props)) {
        this.forceUpdate();
      }
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
      const exclude = ['predefined_name'];
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
        if(_meta.has_owners) {
          elements.push(<DataField _obj={_obj} key={`field_owner`} _fld="owner"/>);
          exclude.push('owner');
        }
        if(_meta.hierarchical) {
          elements.push(<DataField _obj={_obj} key={`field_parent`} _fld="parent"/>);
          exclude.push('parent');
        }
      }
      for (const _fld in _meta.fields) {
        !exclude.includes(_fld) && elements.push(<DataField fullWidth key={`field_${_fld}`} _obj={_obj} _fld={_fld}/>);
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
    if(_obj && _obj.is_folder) {
      ltitle += ' (Группа)';
    }
    if(_obj && _obj._modified && ltitle[ltitle.length - 1] !== '*') {
      ltitle += ' *';
    }
    return ltitle;
  }

  get Toolbar() {
    return DataObjToolbar;
  }

  render() {
    const {props: {_mgr, classes}, state: {_obj, _meta, _attachments}, context, _handlers, Toolbar} = this;
    const toolbar_props = Object.assign({
      closeButton: !context.dnr,
      posted: _obj && _obj.posted,
      deleted: _obj && _obj.deleted,
      postable: !!(_meta.posted || _mgr.metadata('posted')),
      deletable: !_meta.read_only,
      _obj,
    }, _handlers);

    return _obj ?
      [
        <Toolbar key="toolbar" {...toolbar_props} />,

        _meta.form && _meta.form.obj && _meta.form.obj.items ?
          renderItems.call(this, _meta.form.obj.items, context.customComponents)
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
        </Dialog>,

        <div key="bottom" style={{marginBottom: 8}} />,
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

