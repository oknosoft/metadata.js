/**
 *
 * @module InputCheckbox
 *
 */

import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";

export default class InputCheckbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { list: props.list };
  }

  render() {
    const {
      state: { list },
    } = this;

    const handleChange = (event) => {
      list.find((item) => {
        if (item.value === event.target.value) {
          item.checked = !item.checked;
          this.setState({ list });
          return true;
        }
      });
    };

    return (
      <FormControl component="fieldset">
        {list.map((item, index) => (
          <FormControlLabel
            key={`r-${index}`}
            control={
              <Checkbox
                value={item.value}
                checked={item.checked}
                onChange={handleChange}
              />
            }
            label={item.text || item.presentation || item.value || v}
          />
        ))}
      </FormControl>
    );
  }
}
