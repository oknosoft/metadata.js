// @flow

import React from 'react';
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
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
};


const demoRegexp = /^demo='(.*)'$/;

type Props = {
  classes: Object,
  demos?: { [key: string]: any },
  markdown: string,
  // You can define the direction location of the markdown file.
  // Otherwise, we try to determine it with an heuristic.
  sourceLocation?: string,
  // корень расположения исходных текстов, например, 'https://github.com/oknosoft/flowcon/tree/master'
  sourceCodeRootUrl?: string,
  // заголовок в табе браузера
  title?: string,
  // суффикс проекта в заголовке
  subtitle?: string,
  // заголовок статьи
  h1?: string,
  // html meta description
  descr?: string,
  // показывать кнопки share соцсетей
  footer?: bool,
};

function MarkdownDocs(props: Props) {
  const {classes, demos, markdown, subtitle, sourceLocation: sourceLocationProp, title, htitle, h1, descr, footer, handleIfaceState} = props;
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
      </Helmet>

      {/*
        <div className={classes.header}>
          <Button component="a" href={`${sourceCodeRootUrl}${sourceLocation}`}>Edit this page</Button>
        </div>
      */}

      {
        h1 && <Typography key="h1" variant="display1" component="h1" color="primary">{h1}</Typography>
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

export default withStyles(styles)(withIface(MarkdownDocs));
