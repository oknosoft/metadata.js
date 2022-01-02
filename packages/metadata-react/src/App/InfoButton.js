/**
 * Кнопка командной панели для вывода сообщений
 */

import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';

export default function InfoButton({text, title = 'Информация'}) {
  return <IconButton color="primary" onClick={() => $p.ui.dialogs.alert({title, markdown: text})}>
    <InfoIcon/>
  </IconButton>;
};

InfoButton.propTypes = {
  title: PropTypes.node,
  text: PropTypes.string,
};
