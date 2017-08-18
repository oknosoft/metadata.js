import React from "react";

import {Toolbar as MToolbar, Content as MContent, Footer as MFooter} from './mixins'

export class Toolbar extends MToolbar {
  render () {
    return React.createElement("div", {}, this.props.children );
  }
}

export class Content extends MContent {
  render () {
    return React.createElement("div", {}, this.props.children );
  }
}

export class Footer extends MFooter {
  render () {
    return React.createElement("div", {}, this.props.children );
  }
}


// var PanelAddons = {};
//
// var ReactPanels = {
//   Panel: Panel,
//   FloatingPanel: FloatingPanel,
//   ReactPanel: ReactPanel,
//   Tab: Tab,
//   Mixins: Mixins,
//   Toolbar: Toolbar,
//   Content: Content,
//   Footer: Footer,
//   ToggleButton: ToggleButton,
//   Button: Button,
//   addons: PanelAddons,
//   DragAndDropHandler: DragAndDropHandler
// };
