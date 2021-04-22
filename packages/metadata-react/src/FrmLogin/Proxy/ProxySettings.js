import React from 'react';
import PropTypes from 'prop-types';
import Autocomplete from '../../DataField/Autocomplete';

const abonents = [];
const branches = [];
const years = [2019, 2020, 2021].map((v) => ({value: v, name: v.toFixed()}));

function ProxySettings({user}) {
  if(!abonents.length) {
    for(const abonent of $p.cat.abonents) {
      abonents.push(abonent);
    }
  }

  if(!branches.length) {
    for(const branch of $p.cat.branches) {
      branches.push(branch);
    }
  }

  return <>
    <Autocomplete options={abonents} label="Абонент" />
    <Autocomplete options={years} label="Год" />
    <Autocomplete options={branches} label="Отдел" />
    <Autocomplete options={[]} disabled label="Олицетворение" />
  </>;
}

export default ProxySettings;
