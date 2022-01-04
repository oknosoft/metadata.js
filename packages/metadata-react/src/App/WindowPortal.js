/**
 * Рендерит children в новое окно
 *
 * @module WindowPortal
 *
 * Created by Evgeniy Malyarov on 05.03.2020.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

function copyStyles(sourceDoc, targetDoc) {
  Array.from(sourceDoc.styleSheets).forEach(styleSheet => {
    if(styleSheet.cssRules) { // true for inline styles
      const newStyleEl = targetDoc.createElement('style');

      Array.from(styleSheet.cssRules).forEach(cssRule => {
        newStyleEl.appendChild(targetDoc.createTextNode(cssRule.cssText));
      });

      targetDoc.head.appendChild(newStyleEl);
    }
    else if(styleSheet.href) { // true for stylesheets loaded from a URL
      const newLinkEl = targetDoc.createElement('link');

      newLinkEl.rel = 'stylesheet';
      newLinkEl.href = styleSheet.href;
      targetDoc.head.appendChild(newLinkEl);
    }
  });
}


export default class WindowPortal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.externalWindow = null;
    this.state = {containerEl: null};
  }

  componentDidMount() {

    // Create a new window, a div, and append it to the window
    // The div **MUST** be created by the window it is to be
    // appended to or it will fail in Edge with a "Permission Denied"
    // or similar error.
    // See: https://github.com/rmariuzzo/react-new-window/issues/12#issuecomment-386992550
    this.externalWindow = window.open('', '', 'menubar=no,toolbar=no,location=no,status=no,dialog=yes,minimizable=yes');
    if(this.externalWindow) {
      const containerEl = this.externalWindow.document.createElement('div');
      this.externalWindow.document.body.appendChild(containerEl);

      this.externalWindow.document.title = this.props.title || 'Документ';

      // update the state in the parent component if the user closes the
      // new window
      this.externalWindow.addEventListener('beforeunload', () => {
        if(this.externalWindow) {
          this.externalWindow = null;
          Promise.resolve().then(() => this.props.handleClose());
        }
      });

      this.setState({containerEl}, () => {
        this.externalWindow && !this.skip_css && this.copyStyles();
        if(this.props.print) {
          setTimeout(() => this.externalWindow && this.externalWindow.print(), 1000);
        }
      });
    }
    // else {
    //   // обработать ошибку открытия окна
    // }
  }

  componentWillUnmount() {
    // This will fire when this.state.showWindowPortal in the parent component becomes false
    // So we tidy up by just closing the window
    this.externalWindow && this.externalWindow.close();
  }

  print = () => {
    return Promise.resolve().then(() => this.externalWindow && this.externalWindow.print());
  }

  skipCss = () => {
    this.skip_css = true;
  };

  copyStyles = () => {
    this.externalWindow && Promise.resolve().then(() => {
      copyStyles(document, this.externalWindow.document);
    });
  };

  render() {
    // The first render occurs before componentDidMount (where we open
    // the new window), so our container may be null, in this case
    // render nothing.
    const {containerEl} = this.state;
    if (!containerEl) {
      return null;
    }

    const {Component, children, obj, attr} = this.props;

    // Append props.children to the container <div> in the new window
    return ReactDOM.createPortal(Component ?
      <Component print={this.print} obj={obj} attr={attr} skipCss={this.skipCss} copyStyles={this.copyStyles}/> : children, containerEl);
  }
}

WindowPortal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  print: PropTypes.bool,
  children: PropTypes.node,
  Component: PropTypes.elementType,
  obj: PropTypes.object,
  attr: PropTypes.object,
};
