/**
 *
 * @module InputCheckbox
 *
 */

import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

export default class InputCheckbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { list: props.list, isChecked: !!props.list.find(el => el.checked)};
  }

  render() {
    const {
      state: { list, isChecked },
    } = this;

    const handleChange = (event) => {
      list.find((item) => {
        if (item.value === event.target.value) {
          item.checked = !item.checked;
          this.setState({ list });
          return true;
        }
      });
      if (list.find(item=>item.checked)){
        this.setState({isChecked: true})
      }else{
        this.setState({isChecked: false})
      }
    };

    const handleClick = () => {
      let newList;
      if (isChecked){
        newList = list.map(item => ({ ...item, checked: false }))
      } else {
        newList = list.map(item => ({ ...item, checked: true }))
      }
      this.setState({ list: newList, isChecked: !isChecked })
    }

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
        <Box sx={{ pt: 1 }}>
          <Button color="primary" onClick={handleClick}>
            {isChecked ? "Снять выбор" : "Выбрать все"}
          </Button>
        </Box>
      </FormControl>
    );
  }
}
