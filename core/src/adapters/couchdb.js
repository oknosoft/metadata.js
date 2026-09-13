import {own} from '../meta/symbols';
import {AbstractAdapter} from './abstract';

class CouchdbError extends TypeError {
  constructor(message, reason, status) {
    super(message);
    this.reason = reason;
    this.status = status;
  }
}

export class CouchdbAdapter extends AbstractAdapter {

  constructor(owner, name) {
    super(owner);
    const {jobPrm} = owner[own];
    this.name = `${jobPrm.couchPath}${jobPrm.zone}_${name}`;
  }

  /**
   * @summary Читает объект из внешней базы
   *
   * @param {DataObj} obj - объект данных, который необходимо прочитать - дозаполнить
   * @return {Promise.<DataObj>} - промис с загруженным объектом
   */
  loadObj(obj) {
    const {fetch, [own]: {utils}} = this[own];
    const parts = obj.className.split('.');
    return fetch(`${this.name}/${parts[0]}.${utils.snakeCase(parts[1])}|${obj.uid}`)
      .then(async res => {
        if(res.status === 200) {
          return res.json();
        }
        else {
          const raw = await res.json();
          throw new CouchdbError(raw.error, raw.reason, res.status);
        }
      })
      .then(raw => {
        utils.mixin(obj, raw, null, ['_id', 'class_name', 'ref', 'uid', 'timestamp']);
        return obj;
      })
  }

}
