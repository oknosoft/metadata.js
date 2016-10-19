import React, { Component, PropTypes } from 'react';
import classes from './DataField.scss'

import VirtualizedSelect from 'react-virtualized-select'

export default class FieldSelect extends Component {

  static propTypes = {
    _obj: PropTypes.object.isRequired,
    _fld: PropTypes.string.isRequired,
    _meta: PropTypes.object,
    handleValueChange: PropTypes.func
  }

  constructor (props) {
    super(props)

    this.state = {
      clearable: true,
      disabled: false,
      githubUsers: [],
      multi: false,
      searchable: true,
      selectedCreatable: null,
    }

    this._loadGithubUsers = ::this._loadGithubUsers

  }

  _goToGithubUser (value) {
    window.open(value.html_url)
  }

  _loadGithubUsers (input) {

    return this.props._obj[this.props._fld]._manager.get_option_list({
      presentation: {like: input}
    })
      .then((githubUsers) => {
        this.setState({ githubUsers })

        return { options: githubUsers }
      })
  }

  render() {
    return (

      <div className={classes.field}>
        <div className={classes.label}>{this.props._meta.synonym}</div>
        <div className={classes.dataselect}>
          <VirtualizedSelect
            name={this.props._meta.name}
            async
            backspaceRemoves={false}
            labelKey='presentation'
            valueKey='ref'
            loadOptions={this._loadGithubUsers}
            minimumInput={0}
            onChange={(selectedGithubUser) => this.setState({ selectedGithubUser })}
            onValueClick={this._goToGithubUser}
            options={this.state.githubUsers}
            value={this.state.selectedGithubUser}

          />
        </div>
      </div>

    );
  }
}

