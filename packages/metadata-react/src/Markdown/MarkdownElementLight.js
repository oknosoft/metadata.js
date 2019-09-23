import React from 'react';
import PropTypes from 'prop-types';

import marked from 'marked';

import classNames from 'classnames';
import withStyles from './styles';
import {withIface} from 'metadata-redux';

function MarkdownElement(props) {
  const { classes, className, text, mdtitle, title, handleNavigate, handleIfaceState, disconnect, CustomBtn, ...other } = props;

  function anchorCkick(evt) {
    if(evt.target.tagName === 'A') {
      const url = new URL(evt.target.href);
      if(url.origin === location.origin) {
        evt.preventDefault();
        evt.stopPropagation();
        handleNavigate(url.pathname);
      }
      else if(!evt.target.target) {
        evt.target.target = '_blank';
      }
    }
  }

  /* eslint-disable react/no-danger */
  return (
    <div
      className={classNames(classes.root, 'markdown-body', className)}
      onClick={anchorCkick}
      title={mdtitle || title}
      dangerouslySetInnerHTML={{__html: marked(text)}}
      {...other}
    />
  );
  /* eslint-enable */
}

MarkdownElement.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  text: PropTypes.string.isRequired,
  handleNavigate: PropTypes.func.isRequired,

}

export default withStyles(withIface(MarkdownElement));
