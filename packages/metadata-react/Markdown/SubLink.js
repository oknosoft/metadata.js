/**
 * Дополнительная ссылка
 *
 * @module SubLink
 *
 * Created by Evgeniy Malyarov on 13.09.2018.
 */

import React from 'react';
import Link from '@material-ui/icons/Link';
import { withStyles } from '@material-ui/core/styles';

const anchorLinkStyle = (theme) => ({
    anchor: {
      opacity: 0.4,
      marginLeft: theme.spacing.unit,
      color: theme.palette.text.secondary,
      // To prevent the link to get the focus.
      //display: 'none',
      '&:hover': {
        //display: 'inline-block',
        opacity: 1,
        // color: theme.palette.text.hint,
        // '&:hover': {
        //   color: theme.palette.text.secondary,
        // },
        '& svg': {
          //width: size,
          fill: 'currentColor',
        },
      },
    }
});

function SubLink ({url, onClick, classes}) {
  return <a href={url}
            className={classes.anchor}
            onClick={onClick}
            title="Прямая ссылка"><Link /></a>;
};

export default withStyles(anchorLinkStyle)(SubLink);
