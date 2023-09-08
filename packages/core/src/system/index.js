
import {meta as log} from './log';
import {meta as schemeSettings} from './schemeSettings';
import accountsClasses, {meta as accounts} from './accounts';
import usersClasses, {meta as users} from './users';
import abonentsClasses, {meta as abonents} from './abonents';

const meta = [
  log,
  schemeSettings,
  accounts,
  users,
  abonents,
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
];

for(const curr of meta) {
  for(const cname in curr) {
    for(const name in curr[cname]) {
      sysObjs.push(`${cname}.${name}`);
    }
  }
}

export default meta;
