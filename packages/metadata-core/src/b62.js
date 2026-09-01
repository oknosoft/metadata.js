
// алфавит преобразования
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
// префикс сдвига
const addPrefix = 0b10n << 128n;
// коэффициенты декодирования
const mul = Array.from({length: 22}, (v, index) => 62n ** BigInt(index)).reverse();
// коэффициенты алфавита
const nums = {};
for(let i=0; i<63; i++) {
  const char = alphabet[i];
  nums[char] = BigInt(i);
}

export const b62 = {
  /**
   * @summary Кодирует строку uuid в base62id
   * @param {String} str
   * @return {String}
   */
  encode(str) {
    let value = addPrefix | BigInt('0x' + str.replace(/-/g, ''));
    const chars = new Array(22);
    for(let i=21; i>-1; i--) {
      chars[i] = alphabet[value % 62n];
      value /= 62n;
    }
    return chars.join('');
  },

  /**
   * @summary Декодирует строку base62id в uuid
   * @param {String} str
   * @return {String}
   */
  decode(str) {
    let value = 0n;
    for(let i=21; i>=0; i--) {
      value += nums[str[i]] * mul[i];
    }
    const clean = value.toString(16).substring(1); // remove prefix
    return `${clean.slice(0, 8)}-${clean.slice(8, 12)}-${clean.slice(12, 16)}-${clean.slice(16, 20)}-${clean.slice(20)}`;
  },

  /**
   * @summary Пустой идентификатор в формате base62id
   */
  nil: 'Fa84QWiAxLXUJaHZmEVPEG',

  /**
   * @summary Проверяет, является ли значение пустым идентификатором
   * @param v
   * @return {boolean}
   */
  emptyGuid(v) {
    const uid = v?.valueOf();
    if(typeof uid === 'string') {
      const {length} = uid;
      return  uid.substring(length - 22) === this.nil;
    }
    return false;
  }
};
