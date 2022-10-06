
import {meta as log} from './log';
import {meta as schemeSettings} from './schemeSettings';
import {meta as accounts} from './accounts';

const meta = [
  log,
  schemeSettings,
  accounts,
];

export const sysFields = ['zone','id','numberDoc','date','parent'];
export const sysObjs = [];

for(const curr of meta) {
  for(const cname in curr) {
    for(const name in curr[cname]) {
      sysObjs.push(`${cname}.${name}`);
    }
  }
}

export default meta;
