import React from 'react';
import PropTypes from 'prop-types';
import Autocomplete from '../../DataField/Autocomplete';


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
    if(abonent) {
      abonent = cat.abonents.by_id(abonent);
    }

    const branches = [];
    for(const branch of cat.branches) {
      branches.push(branch);
    }

    const years = [2019, 2020, 2021].map((v) => ({value: v, name: v.toFixed()}));
    let year = parseInt(sessionStorage.getItem('year'), 10);
    if(!year) {
      year = (new Date()).getFullYear();
    }
    if(year) {
      year = years.find((v) => v.value === year) || years[years.length - 1];
    }

    this.state = {abonents, abonent, branches, years, year};

  }

  abonent_change = (e, abonent) => {
    this.setState({abonent});
    sessionStorage.setItem('zone', abonent.id);
  };

  year_change = (e, year) => {
    this.setState({year});
    sessionStorage.setItem('year', year.value);
  };

  render() {
    const {abonents, abonent, years, year, branches, branche} = this.state;
    return <>
      <Autocomplete options={abonents} value={abonent} onChange={this.abonent_change} label="Абонент" />
      <Autocomplete options={years} value={year} onChange={this.year_change} label="Год" />
      <Autocomplete options={branches} label="Отдел" />
      <Autocomplete options={[]} disabled label="Олицетворение" />
    </>;
  }
}



export default ProxySettings;
