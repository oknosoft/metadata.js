
import {meta as log} from './log.js';
import schemeSettingsClasses, {meta as schemeSettings} from './schemeSettings.js';
import {meta as destinations} from './destinations.js';
import {meta as values} from './propertyValues.js';
import formulasClasses, {meta as formulas} from './formulas.js';
import {meta as servers} from './servers.js';
import propertiesClasses, {meta as properties} from './properties.js';
import predefinedElmntsClasses, {meta as predefinedElmnts} from './predefinedElmnts.js';
import accountsClasses, {meta as accounts} from './accounts.js';
import usersClasses, {meta as users} from './users.js';
import abonentsClasses, {meta as abonents} from './abonents.js';
import branchesClasses, {meta as branches} from './branches.js';

const meta = [
  log,
  schemeSettings,
  destinations,
  values,
  formulas,
  servers,
  properties,
  predefinedElmnts,
  accounts,
  users,
  abonents,
  branches,
];

/**
 * Виртуальные поля перечислений
 * @type {string[]}
 */
export const enmFields = {
  latin: {
    synonym: 'latin',
    type: {
      types: ['string'],
      strLen: 50
    }
  },
  name: {
    synonym: 'name',
    type: {
      types: ['string'],
      strLen: 50
    }
  },
  order: {
    synonym: 'order',
    type: {
      types: ['number'],
      digits: 3,
      fraction: 0
    }
  },
};

export const sysFields = ['zone','id','numberDoc','date','parent','owner'];

export const sysObjs = [];
export const sysClasses = [
  accountsClasses,
  usersClasses,
  abonentsClasses,
  branchesClasses,
  formulasClasses,
  propertiesClasses,
  predefinedElmntsClasses,
  schemeSettingsClasses,
];

for(const curr of meta) {
  for(const cname in curr) {
    for(const name in curr[cname]) {
      sysObjs.push(`${cname}.${name}`);
    }
  }
}

export default meta;
