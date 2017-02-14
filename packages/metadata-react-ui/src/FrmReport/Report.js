import React, {PropTypes} from "react";
import MetaComponent from "../common/MetaComponent";
import DumbLoader from "../DumbLoader";

import RepToolbar from "./RepToolbar";
import RepTabularSection from "./RepTabularSection";


export default class Report extends MetaComponent {

  static propTypes = {
    _obj: PropTypes.object,               // объект данных - отчет DataProcessorObj
    _tabular: PropTypes.string,           // имя табчасти, в которой живут данные отчета
    _acl: PropTypes.string.isRequired,    // права текущего пользователя

    TabParams: PropTypes.func,            // внешний компонент страницы параметров - транслируется в RepToolbar

    handlePrint: PropTypes.func,          // внешний обработчик печати
    handleSchemeChange: PropTypes.func,   // внешний обработчик при изменении настроек компоновки

  }

  constructor(props, context) {

    super(props, context);

    const {$p} = context;
    const {_obj} = props;
    const _tabular = props._tabular || "data";

    this.state = {
      _tabular,
      _meta: _obj._metadata(_tabular),
    };

    $p.cat.scheme_settings.get_scheme(_obj._manager.class_name + `.${_tabular}`)
      .then(this.handleSchemeChange)

  }

  handleSave = () => {

    const {scheme} = this.state;

    this.props._obj.calculate(this.state._columns)
      .then(() => {
        this.refs.data.setState({groupBy: scheme.dims()})
      })
  }

  handlePrint = () => {

  }

  // обработчик при изменении настроек компоновки
  handleSchemeChange = (scheme) => {

    const {props, state} = this;
    const {_obj, handleSchemeChange} = props;
    const _columns = scheme.rx_columns({
      mode: "ts",
      fields: state._meta.fields,
      _obj: _obj
    });

    if(handleSchemeChange){
      handleSchemeChange.call(this, scheme);
    }

    this.setState({
      scheme,
      _columns
    });
  }

  render() {

    const {props, state, handleSave, handlePrint, handleSchemeChange} = this;
    const {_obj, height, width, handleClose, TabParams} = props;
    const {_columns, scheme, _tabular} = state;

    if (!scheme) {
      return <DumbLoader title="Чтение настроек компоновки..."/>
    }
    else if (!_obj) {
      return <DumbLoader title="Чтение объекта данных..."/>
    }
    else if (!_columns || !_columns.length) {
      return <DumbLoader title="Ошибка настроек компоновки..."/>
    }

    return (

      <div>

        <RepToolbar
          handleSave={handleSave}
          handlePrint={handlePrint}
          handleClose={handleClose}

          _obj={_obj}
          _tabular={_tabular}
          _columns={_columns}

          TabParams={TabParams}

          scheme={scheme}
          handleSchemeChange={handleSchemeChange}

        />

        <div className="meta-padding-8" style={{width: width - 20, height: height - 50}}>

          <RepTabularSection
            ref="data"
            _obj={_obj}
            _tabular={_tabular}
            _columns={_columns}
            minHeight={height - 60}
          />

        </div>

      </div>

    );
  }
}

