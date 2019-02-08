import React from 'react';
import PropTypes from 'prop-types';
import kebabCase from 'lodash/kebabCase';
import warning from 'warning';
import Helmet from 'react-helmet';
import withStyles from '@material-ui/core/styles/withStyles';
import {withIface} from 'metadata-redux';
import Typography from '@material-ui/core/Typography';

import AppContent from '../App/AppContent';
import MarkdownElement from './MarkdownElement';
//import Demo from 'docs/src/modules/components/Demo';
import {getHeaders, getContents, getTitle} from './parseMarkdown';

const styles = {
  root: {
    marginBottom: 100,
  },
  header: {
    display: 'flex',
  },
  width: {
    width: '100%',
  }
};

const demoRegexp = /^demo='(.*)'$/;

function MarkdownDocs(props) {
  const {classes, demos, markdown, subtitle, sourceLocation: sourceLocationProp, title, htitle, h1, img,
    descr, canonical, footer, handleIfaceState, TopButton} = props;
  const contents = getContents(markdown);
  const headers = getHeaders(markdown);

  let sourceLocation = sourceLocationProp || '/about';

  if(!sourceLocationProp) {
    // Hack for handling the nested demos
    if(sourceLocation.indexOf('/demos') === 0) {
      const token = sourceLocation.split('/');
      token.push(token[token.length - 1]);
      sourceLocation = token.join('/');
    }

    if(headers.filename) {
      sourceLocation = headers.filename;
    }

    if(!sourceLocation) {
      sourceLocation = `/src/pages/${sourceLocation}`;
    }
  }

  const ltitle = htitle || `${getTitle(markdown)}${subtitle ? ' - ' + subtitle : ''}`;
  if (title != ltitle) {
    handleIfaceState({
      component: '',
      name: 'title',
      value: ltitle,
    });
  }

  return (
    <AppContent className={classes.root}>
      <Helmet title={ltitle}>
        <meta name="description" content={descr || h1} />
        {canonical && <link rel="canonical" href={canonical} />}
        <meta property="og:title" content={ltitle} />
        <meta property="og:description" content={descr || h1} />
        {img && <meta property="og:image" content={img} />}
      </Helmet>

      {/*
        <div className={classes.header}>
          <Button component="a" href={`${sourceCodeRootUrl}${sourceLocation}`}>Edit this page</Button>
        </div>
      */}

      {
        h1 && <div className={classes.header}>
          <Typography key="h1" variant="h4" component="h1" color="primary" className={classes.width}>{h1}</Typography>
          {TopButton}
        </div>
      }

      {contents.map(content => {
        const match = content.match(demoRegexp);

        if(match && demos) {
          const name = match[1];
          warning(demos && demos[name], `Missing demo: ${name}.`);
          //return <Demo key={content} js={demos[name].js} raw={demos[name].raw}/>;
        }

        return <MarkdownElement key={content} text={content}/>;
      })}

      {headers.components.length > 0 ? (
        <MarkdownElement
          text={`
## API

${headers.components
            .map(component => `- [&lt;${component} /&gt;](/api/${kebabCase(component)})`)
            .join('\n')}
          `}
        />
      ) : null}

      {
        footer
      }

    </AppContent>
  );
}

MarkdownDocs.propTypes = {
  classes: PropTypes.object.isRequired,
  demos: PropTypes.any,
  markdown: PropTypes.string.isRequired,
  sourceLocation: PropTypes.string,     // You can define the direction location of the markdown file. Otherwise, we try to determine it with an heuristic.
  sourceCodeRootUrl: PropTypes.string,  // корень расположения исходных текстов, например, 'https://github.com/oknosoft/flowcon/tree/master'
  title: PropTypes.string,              // заголовок в табе браузера
  subtitle: PropTypes.string,           // суффикс проекта в заголовке
  h1: PropTypes.string,                 // заголовок статьи
  descr: PropTypes.string,              // html meta description
  footer: PropTypes.node,               // кнопки share соцсетей, прочие элементы в подвале
}

export default withStyles(styles)(withIface(MarkdownDocs));
