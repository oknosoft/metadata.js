// @flow

import React from 'react';
import kebabCase from 'lodash/kebabCase';
import warning from 'warning';
import Helmet from 'react-helmet';
import {withStyles} from 'material-ui/styles';
//import Button from 'material-ui/Button';
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
  // суффикс проекта в заголовке
  subtitle?: string,
};

function MarkdownDocs(props: Props) {
  const {classes, demos, markdown, subtitle, sourceLocation: sourceLocationProp} = props;
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

  return (
    <AppContent className={classes.root}>
      <Helmet title={`${getTitle(markdown)} - ${subtitle || 'metadata.js'}`} />

      {/*
        <div className={classes.header}>
          <Button component="a" href={`${sourceCodeRootUrl}${sourceLocation}`}>
            {'Edit this page'}
          </Button>
        </div>
      */}

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
    </AppContent>
  );
}

export default withStyles(styles)(MarkdownDocs);
