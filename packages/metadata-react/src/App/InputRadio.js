/**
 * Выбор значения из радиосписка
 *
 * @module InputRadio
 *
 * Created by Evgeniy Malyarov on 16.11.2018.
 */

import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

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
