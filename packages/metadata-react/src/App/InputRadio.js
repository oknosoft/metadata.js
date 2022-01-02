/**
 * Выбор значения из радиосписка
 *
 * @module InputRadio
 *
 * Created by Evgeniy Malyarov on 16.11.2018.
 */

import React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

export default class InputRadio extends React.Component {

  constructor(props) {
    super(props);
    this.state = {value: props.value};
  }

  render() {

    const {state: {value}, props: {list, handleChange}} = this;

    return <FormControl component="fieldset">
      <RadioGroup
        value={value}
        onChange={({target}) => {
          this.setState({ value: target.value });
          handleChange(target.value);
        }}
      >
        {list.map((v, index) => <FormControlLabel
          key={`r-${index}`}
          value={v.value || v.ref || v}
          control={<Radio/>}
          label={v.text || v.presentation || v.value || v}
        />)}
      </RadioGroup>
    </FormControl>
  }
};
