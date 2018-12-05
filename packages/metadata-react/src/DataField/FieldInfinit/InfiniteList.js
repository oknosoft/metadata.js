/**
 * ### Контейнер с динамической подгрузкой данных
 *
 * @module InfiniteList
 *
 * Created by Evgeniy Malyarov on 18.09.2017.
 */

import React from 'react';
import PropTypes from 'prop-types';
import InfiniteLoader from 'react-virtualized/dist/es/InfiniteLoader';
import List from 'react-virtualized/dist/es/List';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import cn from 'classnames';
import MComponent from '../../common/MComponent';
import {suggestionText} from '../AbstractField';

const limit = 30;
const rowHeight = 32;

export function prevent(evt) {
  evt.stopPropagation();
  try {
    evt.preventDefault();
  }
  catch(e) {

  }
}

const ontouch = {
  onTouchStart: 'onMouseDown',
  onTouchEnd: 'onClick',
  onTouchMove: 'onMouseMove',
};

function touches(itemProps) {
  for(const on in ontouch) {
    itemProps[on] = function(evt) {
      itemProps[ontouch[on]](evt);
      prevent(evt);
    };
  }
  return itemProps;
}

export default class InfiniteList extends MComponent {

  static propTypes = {
    _mgr: PropTypes.object.isRequired,  // Менеджер данных
    _acl: PropTypes.string,             // Права на чтение-изменение
    _obj: PropTypes.object.isRequired,  // DataObj, к реквизиту которого будет привязано поле
    _fld: PropTypes.string.isRequired,  // имя поля объекта - путь к данным
    _meta: PropTypes.object,            // Описание метаданных. Если не указано, используем метаданные менеджера
    search: PropTypes.string,           // Строка поиска
    highlightedIndex: PropTypes.number,
    selectedItem: PropTypes.object,     // Текущий выделенный элемент
    getItemProps: PropTypes.func,
    getMenuProps: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    this.list = [];
    if(props.selectedItem && !props.selectedItem.empty()){
      this.list.push(props.selectedItem);
    }
    this.state = {
      totalRows: props.is_enm && this.list.length ? 1 : 2,
      //selectedItem: this.list.length ? 0 : -1,
    };
  }

  componentDidMount() {
    super.componentDidMount();
    this.loadMoreRows({startIndex: 0, stopIndex: 99});
  }

  componentWillReceiveProps(nextProps) {
    if(this.updateTimer) {
      clearTimeout(this.updateTimer);
    }
    if(this.props.search !== nextProps.search) {
      this.updateTimer = setTimeout(() => {
        this.list.length = 0;
        this.setState({totalRows: this.state.totalRows <= 1 ? 2 : 1});
      }, 10);
    }
    else if(this.props.highlightedIndex !== nextProps.highlightedIndex) {
      this.listContainer && this.listContainer.forceUpdateGrid();
    }
  }

  isRowLoaded = ({index}) => {
    return !!this.list[index];
  };

  loadMoreRows = ({startIndex, stopIndex}) => {

    const {props, state, list} = this;
    const {_mgr, _obj, _fld, _meta, search} = props;
    const {totalRows} = state;
    const increment = Math.max(limit, stopIndex - startIndex + 1);
    const select = _mgr.get_search_selector({_obj, _meta, search, top: increment, skip: startIndex});

    const update_state = (added) => {
      // обновляем состояние - изменилось количество записей
      const rowsCount = list.length + (added < increment ? 0 : increment);
      this.setState({totalRows: rowsCount});
    };

    // если объекты живут в ram
    let added = 0;
    if(/ram$/.test(_mgr.cachable)) {
      _mgr.find_rows(select, (o) => {
        // если значение уже есть в коллекции - пропускаем
        if(list.indexOf(o) === -1) {
          list.push(o);
          added++;
        }
      });
      return Promise.resolve(update_state(added));
    }
    // будем делать запрос к couchdb
    else {

      const class_name_length = _mgr.class_name.length + 1;

      return _mgr.pouch_db.find(select)
        .then(({docs}) => {
          // обновляем массив результата
          for (let i = 0; i < docs.length; i++) {
            if(!list[i + startIndex]) {
              list[i + startIndex] = {presentation: docs[i].name, ref: docs[i]._id.substr(class_name_length)};
            }
          }
          update_state(docs.length);
        });
    }

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
    const {classes, selectedItem, highlightedIndex, getItemProps} = this.props;
    const item = this.list[index];

    return (
      <ListItem
        button
        className={cn({
          [classes.suggestion]: true,
          [classes.suggestionSelected]: index === highlightedIndex,
        })}
        {...touches(getItemProps({key, index, style, item: item || {}}))}
      >
        {item && !isScrolling && isVisible ?
          <ListItemText
            primaryTypographyProps={{
              className: item === selectedItem ? classes.suggestionCurrent : ''
            }}
            primary={suggestionText(item)}/>
          :
          <div className={classes.placeholder} style={{width: 10 + Math.random() * 80}}/>
        }
      </ListItem>
    );
  };

  listRenderer = ({onRowsRendered, registerChild}) => {
    const {totalRows} = this.state;
    const rowCount = Math.min(this.list.length || 1, totalRows) + 1;
    const height = rowCount < 7 ? rowCount * rowHeight : 220;
    //containerStyle={rowCount < 7 && {overflow: 'hidden'}}
    return <List
      ref={(el) => registerChild(this.listContainer = el)}
      height={height}
      onRowsRendered={onRowsRendered}
      rowCount={totalRows}
      rowHeight={rowHeight}
      rowRenderer={this.rowRenderer}

      width={300}
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
