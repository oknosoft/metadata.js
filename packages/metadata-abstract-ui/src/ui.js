
/**
 * ### Возвращает имя типа элемента управления для типа поля
 * TODO: перенести этот метод в плагин
 *
 * @method control_by_type
 * @param type
 * @return {*}
 */
export default function control_by_type (type, val, list) {
  let ft;

  if(Array.isArray(list) && list.length) {
    ft = "dselect";
  }
  else if (type.types.includes("boolean") && (typeof val == "boolean" || type.types.length === 1)) {
    ft = "ch";
  }
  else if (typeof val == "number" && type.digits) {
    ft = "calck";
  }
  else if (val instanceof Date && type.date_part) {
    ft = "dhxCalendar";
  }
  else if (type.is_ref) {
    ft = type.types.length == 1 && $p.utils.is_enm_mgr(type._mgr) ? "oselect" : "ocombo";
  }
  else if (type.date_part) {
    ft = "dhxCalendar";
  }
  else if (type.digits) {
    ft = "calck";
  }
  else if (type.types[0] == "boolean") {
    ft = "ch";
  }
  else if (type.hasOwnProperty("str_len") && (type.str_len >= 100 || type.str_len == 0)) {
    ft = "txt";
  }
  else {
    ft = "ed";
  }
  return ft;
}
