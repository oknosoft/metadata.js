import React, {Component} from 'react';
import PropTypes from 'prop-types';

import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'

import {Utils} from './utils';
import createSheet from './styles/base';

export class Styleable extends Component {

  constructor(props, context) {
    super(props, context);
    this.__ssv = {};
    this.__ssvh = false;
    this.__ssa = {target: '', mods: [], alter: {}};
    this.state = {};
  }

  getSheet(target, mods, alter) {
    var rebuild = false, i;

    mods = (typeof this['getSheetMods'] === 'function') ? this['getSheetMods'](mods || []) : mods || [];
    alter = alter || {};
    if(target != this.__ssa.target) {
      rebuild = true;
    }
    else {
      if(mods.length != this.__ssa.mods.length) {
        rebuild = true;
      }
      else if(mods.length != 0) {
        for (i = mods.length; --i >= 0;) {
          if(this.__ssa.mods.indexOf(mods[i]) == -1) {
            rebuild = true;
            break;
          }
        }
      }
      // TODO: check if alter has changed
    }

    if(rebuild) {
      this.__ssv = this.context.sheet(target, mods, alter);
      this.__ssvh = false;
      this.__ssa = {
        target: target,
        mods: Utils.merge(mods, []),
        alter: Utils.merge(alter, {})
      };
    }
    if((typeof this.state._hover === 'boolean')) {
      if(this.state._hover) {
        if(this.__ssvh || false) {
          return this.__ssvh;
        }
        if((this.__ssv.state || false) && (this.__ssv.state.hover || false)) {
          this.__ssvh = Utils.merge(this.__ssv, this.__ssv.state.hover);
          return this.__ssvh;
        }
      }
    }

    return this.__ssv;
  }

  static contextTypes = {
    sheet: PropTypes.func
  };

};

export class Transitions extends Styleable {

  getTransitionProps(pcType) {
    pcType = pcType || this.props.panelComponentType;

    var props = {},
      globals = (this.context && this.context.globals && this.context.globals[pcType]) ?
        this.context.globals[pcType] : {},
      transitionName = (typeof this.props.transitionName === 'string') ?
        this.props.transitionName : globals.transitionName || '';
    if(transitionName.length) {
      props = {
        transitionName: transitionName,
        transitionEnter: (typeof this.props.transitionEnter === 'boolean') ?
          this.props.transitionEnter : globals.transitionEnter || false,
        transitionLeave: (typeof this.props.transitionLeave === 'boolean') ?
          this.props.transitionLeave : globals.transitionLeave || false,
        transitionAppear: (typeof this.props.transitionAppear === 'boolean') ?
          this.props.transitionAppear : globals.transitionAppear || false,
        transitionComponent: (typeof this.props.transitionComponent !== 'undefined') ?
          this.props.transitionComponent : globals.transitionComponent || CSSTransitionGroup,
        transitionCustomProps: this.props.transitionCustomProps || globals.transitionCustomProps || {}
      };
    }
    else {
      props = {
        transitionName: 'none',
        transitionEnter: false,
        transitionLeave: false,
        transitionAppear: false,
        transitionComponent: CSSTransitionGroup,
        transitionCustomProps: {}
      };
    }
    return props;
  }

  static propTypes = {
    transitionName: PropTypes.string,
    transitionEnter: PropTypes.bool,
    transitionLeave: PropTypes.bool,
    transitionAppear: PropTypes.bool,
    /** React.addons.CSSTransitionGroup might not work well in some scenarios,
     * use this to specify another component.
     *
     * @see https://github.com/Khan/react-components/blob/master/js/timeout-transition-group.jsx
     * */
    transitionComponent: PropTypes.any,
    /** Additional props specific to transitionComponent. */
    transitionCustomProps: PropTypes.object
  };

}

export class Toolbar extends Component {

  static defaultProps = {
    panelComponentType: 'Toolbar'
  };

}

export class Content extends Component {

  static defaultProps = {
    panelComponentType: 'Content'
  };

}

export class Footer extends Component {

  static defaultProps = {
    panelComponentType: 'Footer'
  };

}

export class StyleableWithEvents extends Styleable {

  constructor(props, context) {
    super(props, context);
    this.listeners = {
      onMouseEnter: this.handleMouseEnter.bind(this),
      onMouseLeave: this.handleMouseLeave.bind(this)
    };
    Object.assign(this.state, {
      _hover: false,
      _focus: false
    });
  }

  static defaultProps = {
    onMouseEnter: false,
    onMouseLeave: false
  };

  handleMouseEnter(ev) {
    if(typeof this.props['onMouseEnter'] === 'function') this.props['onMouseEnter'](ev);

    this.setState({
      _hover: true
    });
  }

  handleMouseLeave(ev) {
    if(typeof this.props['onMouseLeave'] === 'function') this.props['onMouseLeave'](ev);

    this.setState({
      _hover: false
    });
  }
}

export class PanelWrapper extends Component {

  constructor(props, context) {
    super(props, context);
    const opts = {
      theme: props.theme,
      skin: props.skin,
      headerHeight: props.headerHeight,
      headerFontSize: props.headerFontSize,
      borderRadius: props.borderRadius,
      maxTitleWidth: props.maxTitleWidth,
      useAvailableHeight: props.useAvailableHeight,
      renderPanelBorder: props.renderPanelBorder,
      activeTabHeaderBorder: props.activeTabHeaderBorder
    };
    this._sheet = createSheet(opts);
    this.config = this._sheet('PanelWrapper').config;
    this.state = {
      selectedIndex: parseInt(props.selectedIndex || 0)
    };
  }

  componentWillReceiveProps(nextProps) {
    var sIndex = this.state.selectedIndex,
      resetIndex = false,
      numTabs = React.Children.count(nextProps.children);

    if(nextProps.selectedIndex != this.props.selectedIndex) {
      sIndex = nextProps.selectedIndex;
      resetIndex = true;
    }
    if(sIndex >= numTabs) {
      sIndex = Math.max(numTabs - 1, 0);
      resetIndex = true;
    }
    if(resetIndex) {
      this.setState({selectedIndex: parseInt(sIndex)});
    }
  }

  handleTabChange(index) {
    if(typeof this.props.onTabChange === 'function') {
      if(this.props.onTabChange(index, this) !== false) {
        this.setSelectedIndex(index);
      }
    }
    else {
      this.setSelectedIndex(index);
    }
  }

  getSelectedIndex() {
    return this.state.selectedIndex;
  }

  setSelectedIndex(index, callback) {
    this.setState({selectedIndex: parseInt(index)});
    this.forceUpdate(function () {
      if(typeof callback === 'function') {
        callback();
      }
    });
  }

  getChildContext() {
    return {
      selectedIndex: this.state.selectedIndex,
      sheet: this._sheet,
      onTabChange: this.handleTabChange,
      globals: this.props.globals,
      numTabs: React.Children.count(this.props.children)
    };
  }

  static propTypes = {
    transitionName: PropTypes.string,
    transitionEnter: PropTypes.bool,
    transitionLeave: PropTypes.bool,
    transitionAppear: PropTypes.bool,
    globals: PropTypes.object,
    /** React.addons.CSSTransitionGroup might not work well in some scenarios,
     * use this to specify another component.
     *
     * @see https://github.com/Khan/react-components/blob/master/js/timeout-transition-group.jsx
     * */
    transitionComponent: PropTypes.any,
    /** Additional props specific to transitionComponent. */
    transitionCustomProps: PropTypes.object,
    dragAndDropHandler: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool
    ])
  };

  static defaultProps = {
    'icon': false,
    'title': '',
    'selectedIndex': 0,
    /** Triggered before a change tab event propagated from within the Panel (e.g., user's click).
     *  Optionally, return false to stop it.
     */
    'onTabChange': null,
    'buttons': [],
    'leftButtons': [],
    'globals': {}
  };

  static childContextTypes = {
    selectedIndex: PropTypes.number,
    sheet: PropTypes.func,
    onTabChange: PropTypes.func,
    globals: PropTypes.object,
    numTabs: PropTypes.number
  };
}

export class TabWrapper extends Component {

  getChildContext() {
    const {index, tabKey} = this.props;
    return {index, tabKey};
  }

  static propTypes = {
    tabKey: PropTypes.any
  };

  static defaultProps = {
    panelComponentType: 'TabWrapper',
    icon: '',
    title: '',
    pinned: false,
    showToolbar: true,
    showFooter: true
  };

  static childContextTypes = {
    index: PropTypes.number,
    tabKey: PropTypes.any
  };

  static contextTypes = {
    selectedIndex: PropTypes.number
  };

  static observedProps = ['selectedIndex', 'index'];
}

export class Button extends StyleableWithEvents {

  constructor(props, context) {
    super(props, state);
    this.listeners.onClick = this._handleClick.bind(this);
    this.listeners.onDoubleClick = this._handleDoubleClick.bind(this);
    this.listeners.onContextMenu = this._handleContextMenu.bind(this);
    Object.assign(this.state, {
      visible: props.visible,
      enabled: props.enabled,
      active: props.active,
      highlighted: props.highlighted
    });
  }

  _handleDoubleClick(ev) {
    const {onDoubleClick} = this.props;
    if(typeof onDoubleClick === 'function' && onDoubleClick(ev, this) === false) return;

    if(typeof this['handleDoubleClick'] === 'function') {
      return this['handleDoubleClick'](ev);
    }
  }

  _handleClick(ev) {
    const {onClick} = this.props;
    if(typeof onClick === 'function' && onClick(ev, this) === false) return;

    if(typeof this['handleClick'] === 'function') {
      return this['handleClick'](ev);
    }
  }

  _handleContextMenu(ev) {
    const {onContextMenu} = this.props;
    if(typeof onContextMenu === 'function' && onContextMenu(ev, this) === false) return;

    if(typeof this['handleContextMenu'] === 'function') {
      return this['handleContextMenu'](ev);
    }
  }

  getSheetMods(otherMods) {
    var mods = otherMods || [];   //np
    if(this.state.active && mods.indexOf('active') == -1) mods.push('active');
    if(!this.state.visible && mods.indexOf('hidden') == -1) mods.push('hidden');
    if(!this.state.enabled && mods.indexOf('disabled') == -1) mods.push('disabled');
    if(this.state.highlighted && mods.indexOf('highlighted') == -1) mods.push('highlighted');

    return mods;
  }

  getChildContext() {
    return {
      btnTitle: this.props.title,
      btnVisible: this.state.visible,
      btnEnabled: this.state.enabled,
      btnActive: this.state.active
    };
  }

  static defaultProps = {
    name: 'default',
    title: '',
    visible: true,
    enabled: true,
    active: false,
    highlighted: false,
    onClick: false,
    onDoubleClick: false,
    onContextMenu: false,
    onChange: false
  };

  static childContextTypes = {
    btnTitle: PropTypes.string,
    btnVisible: PropTypes.bool,
    btnEnabled: PropTypes.bool,
    btnActive: PropTypes.bool
  };

  static contextTypes = {
    selectedIndex: PropTypes.number
  }
}
