/**
 * ### Контейнер с динамической подгрузкой данных
 *
 * @module InfiniteList
 *
 * Created by Evgeniy Malyarov on 18.09.2017.
 */

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {InfiniteLoader, List, AutoSizer} from 'react-virtualized';
import {ListItem, ListItemIcon, ListItemText} from 'material-ui/List';
import classnames from 'classnames';

const limit = 30;
const rowHeight = 32;

function prevent(evt) {
  evt.stopPropagation();
  evt.preventDefault();
}

export default class InfiniteList extends PureComponent {

  static propTypes = {
    _mgr: PropTypes.object.isRequired,  // Менеджер данных
    _acl: PropTypes.string,             // Права на чтение-изменение
    _obj: PropTypes.object.isRequired,  // DataObj, к реквизиту которого будет привязано поле
    _fld: PropTypes.string.isRequired,  // имя поля объекта - путь к данным
    _meta: PropTypes.object,            // Описание метаданных. Если не указано, используем метаданные менеджера
    search: PropTypes.string,           // Строка поиска
    selectedItem: PropTypes.number,     // Текущий выделенный элемент
    handleSelect: PropTypes.func,       // обработчик при изменении значения в поле
  };

  constructor(props, context) {
    super(props, context);
    const val = props._obj[props._fld];
    this.list = [];
    if(val && !val.empty()){
      this.list.push(val);
    }
    this.search = props.search;
    this.state = {
      totalRows: 2,
      selectedItem: -1,
    };
    // для перечислений заполняем сразу
    if(props.is_enm){
      if(this.list.length){
        this.state.totalRows = 1;
      }
      else{
        this.loadMoreRows({startIndex: 0, stopIndex: 999});
      }
    }
  }

  componentDidMount() {
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  componentWillReceiveProps(nextProps) {
    if(this.updateTimer) {
      clearTimeout(this.updateTimer);
    }
    if(this.props.search != nextProps.search) {
      this.updateTimer = setTimeout(() => {
        this.list.length = 0;
        this.setState({totalRows: this.state.totalRows <= 1 ? 2 : 1});
      }, 10);
    }
  }

  isRowLoaded = ({index}) => {
    return !!this.list[index];
  };

  loadMoreRows = ({startIndex, stopIndex}) => {
    const {_mgr, _obj, _fld, _meta, search} = this.props;
    const {totalRows} = this.state;
    const increment = Math.max(limit, stopIndex - startIndex + 1);
    const select = _mgr.get_search_selector({_obj, _meta, search, top: increment, skip: startIndex});

    const update_state = (length) => {
      // обновляем состояние - изменилось количество записей
      const rowsCount = startIndex + length + (length < increment ? 0 : increment );
      if(totalRows != rowsCount) {
        if(this._mounted) {
          this.setState({totalRows: rowsCount});
        }
        else {
          this.state.totalRows = rowsCount;
        }
      }
    };

    // если объекты живут в ram
    if(_mgr.cachable == 'ram' || _mgr.cachable == 'doc_ram') {
      let added = 0;
      _mgr.find_rows(select, (o) => {
        // если значение уже есть в коллекции - пропускаем
        if(this.list.indexOf(o) === -1) {
          this.list.push(o);
          added++;
        }
      });
      return Promise.resolve(update_state(added));
    }
    // будем делать запрос к couchdb
    else {
      // готовим фильтры для запроса couchdb
      let fun = 'doc/by_id';
      Object.assign(select, {
        include_docs: true,
        skip: startIndex,
        limit: increment
      });

      const filter = that.get_filter(start, count);

      return _mgr.pouch_db.find(filter)
        .then(({data}) => {
          // обновляем массив результата
          for (let i = 0; i < data.rows.length; i++) {
            if(!list._data[i + startIndex]) {
              list._data[i + startIndex] = data.rows[i].doc;
            }
          }
          update_state(this.list.length);

        });
    }

  };

  next(evt) {
    let {selectedItem} = this.state;
    if(selectedItem < this.list.length - 1){
      selectedItem++;
    }
    this.setState({selectedItem});
    this.listContainer.forceUpdateGrid();
    prevent(evt);
  }

  prev(evt) {
    let {selectedItem} = this.state;
    if(selectedItem >= 0){
      selectedItem--;
    }
    this.setState({selectedItem});
    this.listContainer.forceUpdateGrid();
    prevent(evt);
  }

  handleSelect = (evt) => {
    const value = this.list[this.state.selectedItem];
    prevent(evt);
    value && this.props.handleSelect(value);
  };


  /**
   *
   * @param index {Number} - Index of row
   * @param isScrolling {Boolean} - The List is currently being scrolled
   * @param isVisible {Boolean} - This row is visible within the List (eg it is not an overscanned row)
   * @param key {String} - Unique key within array of rendered rows
   * @param parent {Object} - Reference to the parent List (instance)
   * @param style {Object} - Style object to be applied to row (to position it)
   * @return {Object}
   */
  rowRenderer = ({index, isScrolling, isVisible, key, parent, style}) => {
    const {suggestionText, classes} = this.props;
    const suggestion = this.list[index];

    return (
      <ListItem
        button
        key={key}
        className={classnames({[classes.suggestion]: true, [classes.suggestionSelected]: index == this.state.selectedItem})}
        style={style}
        onClick={this.handleSelect}
        onMouseOver ={() => {
          this.setState({selectedItem: index})
        }}
      >
        {suggestion && !isScrolling && isVisible ?
          <ListItemText primary={suggestionText(suggestion)}/>
          :
          <div className={classes.placeholder} style={{width: 10 + Math.random() * 80}}/>
        }
      </ListItem>
    );
  };

  listRenderer = ({onRowsRendered, registerChild}) => {
    const {totalRows} = this.state;
    const rowCount = Math.min(this.list.length || 1, totalRows) + 0.6;
    const height = rowCount < 7 ? rowCount * rowHeight : 220;
    return <List
      ref={(el) => registerChild(this.listContainer = el)}
      height={height}
      onRowsRendered={onRowsRendered}
      rowCount={totalRows}
      rowHeight={rowHeight}
      rowRenderer={this.rowRenderer}
      width={300}
      containerStyle={{}}
    />;
  };

  render() {
    return <InfiniteLoader
      isRowLoaded={this.isRowLoaded}
      loadMoreRows={this.loadMoreRows}
      rowCount={this.state.totalRows}
      minimumBatchSize={limit}
    >
      {this.listRenderer}
    </InfiniteLoader>;
  }
}
