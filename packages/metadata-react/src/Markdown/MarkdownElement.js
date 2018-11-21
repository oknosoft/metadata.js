import React from 'react';
import PropTypes from 'prop-types';

import marked from 'marked';
import Diagrams from '../Diagrams/Diagrams';

import classNames from 'classnames';
import withStyles from './styles';
import {withIface} from 'metadata-redux';

// const renderer = new marked.Renderer();
// renderer.html = function(html) {
//   if(/^<div>.*<\/div>$/.test(html)) {
//     html = html.replace(/^<div>/, '').replace(/<\/div>$/, '');
//     if(/^<Diagrams/.test(html)) {
//       const xml = new DOMParser().parseFromString(html,"text/xml");
//       const elm = xml && xml.firstElementChild;
//       if(elm) {
//         const {diagrams, grid} = elm.attributes;
//         return ReactDOMServer.renderToString(
//           React.createElement(Diagrams, {
//             diagrams: diagrams ? JSON.parse(diagrams.nodeValue) : [],
//             grid: grid && grid.nodeValue || '1'
//           })
//         );
//       }
//     }
//   }
//   return html;
// }

// renderer.heading = (text, level) => {
//   const escapedText = text
//     .toLowerCase()
//     .replace(/=&gt;|&lt;| \/&gt;|<code>|<\/code>/g, '')
//     .replace(/[^\w]+/g, '-');
//
//   return (
//     `
//     <h${level}>
//       <a class="anchor-link" id="${escapedText}"></a>${text}` +
//     `<a class="anchor-link-style" href="#${escapedText}">
//         <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M46.9 13.9c-.5-.6-1.2-.94-2.07-.94h-6.67l1.86-8.98c.17-.85 0-1.7-.52-2.3-.48-.6-1.2-.94-2.07-.94-1.6 0-3.2 1.27-3.54 2.93l-.5 2.42c0 .07-.07.13-.07.2l-1.37 6.62H20.7l1.88-8.96c.16-.85 0-1.7-.53-2.3-.48-.6-1.2-.94-2.07-.94-1.65 0-3.2 1.27-3.56 2.93l-.52 2.58v.08l-1.37 6.64H7.3c-1.67 0-3.22 1.3-3.58 2.96-.16.86 0 1.7.52 2.3.48.6 1.2.93 2.07.93h6.97l-2 9.65H4c-1.67 0-3.22 1.27-3.56 2.94-.2.8 0 1.67.5 2.27.5.6 1.2.93 2.08.93H10l-1.84 9.05c-.2.84 0 1.67.52 2.3.5.6 1.25.92 2.08.92 1.66 0 3.2-1.3 3.55-2.94l1.94-9.33h11.22l-1.87 9.05c-.15.84.03 1.67.53 2.3.5.6 1.2.92 2.07.92 1.65 0 3.22-1.3 3.56-2.94l1.9-9.33h7c1.6 0 3.2-1.28 3.53-2.93.2-.87 0-1.7-.52-2.3-.48-.62-1.2-.96-2.05-.96h-6.7l2.02-9.65h6.93c1.67 0 3.22-1.27 3.56-2.92.2-.85 0-1.7-.5-2.3l-.04.03zM17.53 28.77l1.95-9.65H30.7l-1.97 9.66H17.5h.03z"/></g></svg>
//       </a></h${level}>
//   `
//   );
// };

// marked.setOptions({
//   // gfm: true,
//   // tables: true,
//   // breaks: false,
//   // pedantic: false,
//   // sanitize: false,
//   // smartLists: true,
//   // smartypants: false,
//   renderer,
// });

function render(text) {
  const res = [];
  let prev = 0;
  text.replace(/<Diagrams[\s\S]*?\/>/g, (str, offset) => {
    res.push(<div
      key={`md-${res.length + 1}`}
      dangerouslySetInnerHTML={{__html: marked(text.substr(prev, offset - prev))}}
    />);

    const xml = new DOMParser().parseFromString(str,"text/xml");
    const elm = xml && xml.firstElementChild;
    if(elm) {
      const {charts, grid} = elm.attributes;
      res.push(<Diagrams
        key={`md-${res.length + 1}`}
        charts={charts ? JSON.parse(charts.nodeValue) : []}
        grid={grid && grid.nodeValue || '1'}
      />);
    }
    prev = offset + str.length;
  });
  if(prev < text.length) {
    res.push(<div
      key={`md-${res.length + 1}`}
      dangerouslySetInnerHTML={{__html: marked(text.substr(prev))}}
    />);
  }
  return res;
}

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
      {...other}
    >
      {render(text)}
    </div>
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
