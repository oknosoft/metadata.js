import React from 'react';
import PropTypes from 'prop-types';
import Autocomplete from '../../DataField/Autocomplete';

const branch_filter = (options, {inputValue}) => {
  const text = inputValue.trim().toLowerCase();
  return options.filter(({suffix, name}) => suffix.includes(text) || name.toLowerCase().includes(text))
};

class ProxySettings extends React.Component {

  constructor(props, context) {
    super(props, context);

    const {wsql, cat} = $p;

    const abonents = [];
    for(const abonent of cat.abonents) {
      abonents.push(abonent);
    }
    let abonent = parseInt(sessionStorage.getItem('zone'), 10);
    if(!abonent) {
      abonent = parseInt(wsql.get_user_param('zone'), 10);
    }
    abonent = abonent ? cat.abonents.by_id(abonent) : cat.abonents.get();

    let impersonation = sessionStorage.getItem('impersonation') || null;
    if(impersonation) {
      impersonation = cat.users.get(impersonation);
    }
    const users = [];
    for(const user of cat.users) {
      users.push(user);
    }

    const {branches, branch} = this.branch_by_abonent(abonent);
    const {years, year} = this.year_by_abonent(abonent);
    this.state = {abonents, abonent, branches, branch, years, year, users, impersonation};

  }

  set_reset() {
    this.props.set_reset();
  }

  abonent_change = (e, abonent) => {
    const {current_user} = $p;
    if(current_user && !current_user.subscribers.find({abonent})) {
      return;
    }
    sessionStorage.setItem('zone', abonent.id);
    const {branches, branch} = this.branch_by_abonent(abonent);
    const {years, year} = this.year_by_abonent(abonent);
    this.setState({abonent, years, branches});
    this.year_change(e, year);
    this.branch_change(e, branch);
    this.set_reset();
  };

  year_change = (e, year) => {
    this.setState({year});
    sessionStorage.setItem('year', year.value);
    this.set_reset();
  };

  branch_change = (e, branch) => {
    const abranches = this.abranches();
    if(!branch || !abranches.size || abranches.has(branch)) {
      this.setState({branch});
      sessionStorage.setItem('branch', branch ? branch.valueOf() : '');
      this.set_reset();
    }
  };

  user_change = (e, user) => {
    this.setState({impersonation: user});
    sessionStorage.setItem('impersonation', user ? user.valueOf() : '');
    this.set_reset();
  };

  year_by_abonent(abonent) {
    const yset = new Set([(new Date()).getFullYear()]);
    const years = [];
    abonent.servers.forEach(({key}) => {
      yset.add(key);
    });
    for(const v of yset) {
      years.push({value: v, name: v.toFixed()});
    }
    years.sort((a, b) => a.value - b.value);

    //.map((v) => ());
    let year = parseInt(sessionStorage.getItem('year'), 10);
    if(!year) {
      year = years[years.length - 1];
    }
    else {
      year = years.find((v) => v.value === year) || years[years.length - 1];
    }

    return {years, year};
  }

  abranches(abonent) {
    const {current_user} = $p;
    const abranches = new Set();
    if(!abonent) {
      abonent = this.state.abonent;
    }
    if(current_user) {
      current_user.subscribers.find_rows({abonent}, (row) => {
        if(!row.branch.empty()) {
          abranches.add(row.branch);
          for(const branch of row.branch._children()) {
            abranches.add(branch);
          }
        }
      });
    }
    return abranches;
  }

  users_enabled(abonent) {
    const {current_user} = $p;
    if(current_user) {
      if(current_user.roles.includes('impersonation')) {
        return true;
      }
      for(const row of current_user.subscribers) {
        if(row.abonent == abonent && row.roles.includes('impersonation')) {
          return true;
        }
      }
    }
  }

  branch_by_abonent(abonent) {
    const {current_user, cat} = $p;
    const ref = sessionStorage.getItem('branch');

    const abranches = this.abranches(abonent);
    const branches = abranches.size ? Array.from(abranches) : cat.branches.alatable
      .filter(({owner, ref}) => owner == abonent)
      .map(({ref}) => cat.branches.get(ref));

    let branch = ref && branches.length ? (cat.branches.by_ref[ref] || branches[0]) : cat.branches.get();
    if(abranches.size && !abranches.has(branch)) {
      branch = branches[0];
    }

    return {branches, branch};
  }

  render() {
    const {abonents, abonent, years, year, branches, branch, users, impersonation} = this.state;
    return <>
      <Autocomplete options={abonents} value={abonent} onChange={this.abonent_change} label="Абонент" />
      <Autocomplete options={years} value={year} onChange={this.year_change} label="Год" title="База архива" />
      <Autocomplete
        options={branches}
        value={(!branch || branch.empty()) ? null : branch}
        disableClearable={false}
        filterOptions={branch_filter}
        onChange={this.branch_change}
        label="Отдел"
        title="Отдел абонента"
      />
      {(this.users_enabled(abonent) || impersonation) && <Autocomplete
        options={users}
        value={impersonation}
        disableClearable={false}
        onChange={this.user_change}
        label="Вход от имени"
        title="Олицетворение"
      />}
    </>;
  }
}



export default ProxySettings;
