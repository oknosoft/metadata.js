/**
 * ### Табличный документ
 * DEPRECATED - в новых проектах не использовать
 *
 * @module spreadsheet
 *
 * Created by Evgeniy Malyarov on 11.07.2019.
 */

/**
 * Объект для построения печатных форм и отчетов
 *
 * @param [attr] {Object} - размер листа, ориентация, поля и т.д.
 * @constructor
 */
class SpreadsheetDocument {

  constructor(attr, events) {
    this._attr = {
      orientation: "portrait",
      title: "",
      content: document.createElement("DIV"),
      head: document.createElement("HEAD"),
      blank: "",
    };

    if(attr && typeof attr === "string"){
      this.content = attr;
    }
    else if(typeof attr === "object"){
      this._mixin(attr);
    }
    attr = null;

    this._events = {

      /**
       * ### При заполнении макета
       * Возникает перед заполнением параметров макета. В обработчике можно дополнить, изменить или рассчитать любые массивы или поля
       *
       * @event fill_template
       */
      fill_template: null,

    };
    if(events && typeof events === "object"){
      this._events._mixin(events);
    }
  }

  clear_head() {
    while (this._attr.head.firstChild) {
      this._attr.head.removeChild(this._attr.head.firstChild);
    }
  }

  clear() {
    while (this._attr.content.firstChild) {
      this._attr.content.removeChild(this._attr.content.firstChild);
    }
  }

  /**
   * Добавляем элементы в заголовок
   */
  put_head(tag, attr) {
    let elm;
    if(tag instanceof HTMLElement){
      elm = document.createElement(tag.tagName);
      elm.innerHTML = tag.innerHTML;
      if(!attr)
        attr = tag.attributes;
    }else{
      elm = document.createElement(tag);
    }
    if(attr){
      Object.keys(attr).forEach(function (key) {
        elm.setAttribute(attr[key].name || key, attr[key].value || attr[key]);
      });
    }
    this._attr.head.appendChild(elm);
  }

  /**
   * Выводит область ячеек в табличный документ
   */
  put(range, attr) {
    let elm;
    if(range instanceof HTMLElement){
      elm = document.createElement(range.tagName);
      elm.innerHTML = range.innerHTML;
      if(!attr)
        attr = range.attributes;
    }else{
      elm = document.createElement("DIV");
      elm.innerHTML = range;
    }
    if(attr){
      Object.keys(attr).forEach(function (key) {
        //if(key == "id" || attr[key].name == "id")
        //	return;
        elm.setAttribute(attr[key].name || key, attr[key].value || attr[key]);
      });
    }
    this._attr.content.appendChild(elm);
  }

  /**
   * Добавляет область и заполняет её данными
   * @method append
   * @param template {HTMLElement}
   * @param data {Object}
   */
  append(template, data) {

    if(this._events.fill_template){
      data = this._events.fill_template(template, data);
    }

    switch (template.attributes.kind && template.attributes.kind.value){

    case 'row':
      this.draw_rows(template, data);
      break;

    case 'table':
      this.draw_table(template, data);
      break;

    default:
      this.put(dhx4.template(template.innerHTML, data), template.attributes);
      break;
    }
  }

  draw_table(template, data) {

    const tabular = template.attributes.tabular && template.attributes.tabular.value;
    if(!tabular){
      console.error('Не указана табличная часть в шаблоне ' + template.id);
      return;
    }
    const rows = data[tabular];
    if(!Array.isArray(rows)){
      console.error('В данных отсутствует массив ' + tabular);
      return;
    }

    // контейнер таблицы
    const cont = document.createElement('div');

    // заполняем контейнер по шаблону
    cont.innerHTML = template.innerHTML;

    // собственно, таблица
    const table = cont.querySelector('table');

    // шаблон строки таблицы
    const tpl_row = table.querySelector('[name=row]');

    // удаляем пустую строку из итоговой таблицы
    if(tpl_row){
      tpl_row.parentElement.removeChild(tpl_row);
    }
    else{
      console.error('Отсутствует <TR name="row"> в шаблоне таблицы');
      return;
    }

    // находим все шаблоны группировок
    const tpl_grouping = table.querySelector('tbody').querySelectorAll('tr');

    // удаляем шаблоны группировок из итоговой таблицы
    tpl_grouping.forEach((elm) => elm.parentElement.removeChild(elm));


    // подвал таблицы
    const tfoot = table.querySelector("tfoot");
    if(tfoot){
      tfoot.parentElement.removeChild(tfoot);
      tfoot.innerHTML = dhx4.template(tfoot.innerHTML, data);
      table.appendChild(tfoot);
    }

    // есть ли итоги

    function put_rows(rows) {
      rows.forEach((row) => {
        const table_row = document.createElement("TR");
        table_row.innerHTML = dhx4.template(tpl_row.innerHTML, row);
        table.appendChild(table_row);
      });
    }

    // есть ли группировка + цикл по табчасти
    const grouping = data._grouping && data._grouping.find_rows({use: true, parent: tabular});
    if(grouping && grouping.length === 1 && tpl_grouping.length){

      const gfield = grouping[0].field;

      $p.wsql.alasql("select distinct `"+gfield+"` from ? order by `"+gfield+"`", [rows])
        .forEach((group) => {
          const table_row = document.createElement("TR");
          table_row.innerHTML = dhx4.template(tpl_grouping[0].innerHTML, group);
          table.appendChild(table_row);
          put_rows(rows.filter((row) => row[gfield] == group[gfield]));
        })
    }
    else{
      put_rows(rows);
    }

    // собственно, вывод табличной части в отчет
    this.put(cont.innerHTML, cont.attributes);
  }

  draw_rows(template, data) {

    const tabular = template.attributes.tabular && template.attributes.tabular.value;
    if(!tabular){
      console.error('Не указана табличная часть в шаблоне ' + template.id);
      return;
    }
    const rows = data[tabular];
    if(!Array.isArray(rows)){
      console.error('В данных отсутствует массив ' + tabular);
      return;
    }

    // цикл по табчасти - выводим строку
    for(const row of rows){
      this.put(dhx4.template(template.innerHTML.replace(/<!---/g, '').replace(/--->/g, ''), row), template.attributes);
    }
  }

  /**
   * Копирование элемента
   */
  copy_element(elem) {
    const elm = document.createElement(elem.tagName);
    elm.innerHTML = elem.innerHTML;
    const attr = elem.attributes;
    Object.keys(attr).forEach((key) => elm.setAttribute(attr[key].name || key, attr[key].value || attr[key]));
    return elm;
  }

  /**
   * Возвращает objectURL шаблона пустой страницы
   */
  get blankURL() {
    if(!this._blob) {
      if(this.blank) {
        this._blob = new Blob([this.blank], {type: 'text/html'});
      }
      else {
        this._blob = $p.injected_data['view_blank.html'] instanceof Blob ?
          $p.injected_data['view_blank.html'] :
          new Blob([$p.injected_data['view_blank.html']], {type: 'text/html'});
      }
    }
    return URL.createObjectURL(this._blob);
  }

  /**
   * Показывает отчет в отдельном окне
   */
  print() {

    const doc = this,
      url = this.blankURL;

    try{

      const wnd_print = window.open(url, '_blank',
        'fullscreen,menubar=no,toolbar=no,location=no,status=no,directories=no,resizable=yes,scrollbars=yes');

      if (wnd_print.outerWidth < screen.availWidth || wnd_print.outerHeight < screen.availHeight){
        wnd_print.moveTo(0,0);
        wnd_print.resizeTo(screen.availWidth, screen.availHeight);
      }

      wnd_print.onload = function() {
        URL.revokeObjectURL(url);
        // копируем элементы из head
        for (let i = 0; i < doc.head.children.length; i++) {
          wnd_print.document.head.appendChild(doc.copy_element(doc.head.children[i]));
        }
        // копируем элементы из content
        if (doc.innerContent) {
          for (let i = 0; i < doc.content.children.length; i++) {
            wnd_print.document.body.appendChild(doc.copy_element(doc.content.children[i]));
          }
        } else {
          wnd_print.document.body.appendChild(doc.content);
        }
        if(doc.title){
          wnd_print.document.title = doc.title;
        }
        setTimeout(() => wnd_print.print(), 200);
      };

      return wnd_print;
    }
    catch(err){
      URL.revokeObjectURL(url);
      $p.msg.show_msg({
        title: $p.msg.bld_title,
        type: "alert-error",
        text: err.message.match("outerWidth") ?
          "Ошибка открытия окна печати<br />Вероятно, в браузере заблокированы всплывающие окна" : err.message
      });
    }
  }

  /**
   * Сохраняет печатную форму в файл
   */
  save_as(filename) {

    const doc = this,
      url = this.blankURL;

    try{
      const wnd_print = window.open(url, '_blank',
        'fullscreen,menubar=no,toolbar=no,location=no,status=no,directories=no,resizable=yes,scrollbars=yes');

      if (wnd_print.outerWidth < screen.availWidth || wnd_print.outerHeight < screen.availHeight){
        wnd_print.moveTo(0,0);
        wnd_print.resizeTo(screen.availWidth, screen.availHeight);
      }

      wnd_print.onload = function() {
        URL.revokeObjectURL(url);
        // копируем элементы из head
        for (let i = 0; i < doc.head.children.length; i++) {
          wnd_print.document.head.appendChild(doc.copy_element(doc.head.children[i]));
        }
        // копируем элементы из content
        if (doc.innerContent) {
          for (let i = 0; i < doc.content.children.length; i++) {
            wnd_print.document.body.appendChild(doc.copy_element(doc.content.children[i]));
          }
        } else {
          wnd_print.document.body.appendChild(doc.content);
        }
        if(doc.title){
          wnd_print.document.title = doc.title;
        }

        // сохраняем содержимое документа
        setTimeout(() => {
          const blob = new Blob([wnd_print.document.firstElementChild.outerHTML], {type: 'text/html'});
          if(navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, filename);
          }
          else {
            const elem = document.createElement('a');
            elem.href = URL.createObjectURL(blob);
            elem.download = filename;
            document.body.appendChild(elem);
            elem.click();
            document.body.removeChild(elem);
          }
          wnd_print.close();
        }, 200);

      };

      return null;
    }
    catch(err){
      URL.revokeObjectURL(url);
      $p.msg.show_msg({
        title: $p.msg.bld_title,
        type: "alert-error",
        text: err.message.match("outerWidth") ?
          "Ошибка сохранения документа" : err.message
      });
    }
  }

  /**
   * Получаем HTML печатной формы
   */
  get_html() {
    return new Promise((resolve, reject) => {
      const doc = this,
        // вызываем для заполнения _blob
        url = this.blankURL;

      // отзываем объект
      URL.revokeObjectURL(url);

      const reader = new FileReader();

      // срабатывает после как blob будет загружен
      reader.addEventListener('loadend', e => {
        const document = new DOMParser().parseFromString(e.srcElement.result, 'text/html');

        // копируем элементы из head
        for (let i = 0; i < doc.head.children.length; i++) {
          document.head.appendChild(doc.copy_element(doc.head.children[i]));
        }
        // копируем элементы из content
        if (doc.innerContent) {
          for (let i = 0; i < doc.content.children.length; i++) {
            document.body.appendChild(doc.copy_element(doc.content.children[i]));
          }
        } else {
          document.body.appendChild(doc.content);
        }
        if (doc.title) {
          document.title = doc.title;
        }

        resolve(document.firstElementChild.outerHTML);
      });

      // срабатывает при ошибке в процессе загрузки blob
      reader.addEventListener('error', e => {
        reject(e);
      });

      // читаем blob как текст
      reader.readAsText(this._blob);
    });
  }

  get blank() {
    return this._attr.blank
  }
  set blank (v) {
    this._attr.blank = v;
  }

  get head() {
    return this._attr.head
  }
  set head (v) {
    this.clear_head();
    if(typeof v === 'string') {
      this._attr.head.innerHTML = v;
    }
    else if(v instanceof HTMLElement) {
      this._attr.head.innerHTML = v.innerHTML;
    }
  }

  get content() {
    return this._attr.content
  }
  set content (v) {
    this.clear();
    if(typeof v === 'string') {
      this._attr.content.innerHTML = v;
    }
    else if(v instanceof HTMLElement) {
      this._attr.content.innerHTML = v.innerHTML;
    }
  }

  get title() {
    return this._attr.title
  }
  set title (v) {
    this._attr.title = v;
  }

}


/**
 * Экспортируем объект-плагин для модификации metadata.js
 */
export default {

  /**
   * ### Модификатор конструктора MetaEngine
   * Вызывается в контексте экземпляра MetaEngine
   */
  constructor() {

    this.SpreadsheetDocument = SpreadsheetDocument;

    if(!window.dhx4) {
      window.dhx4 = {};
    }
    if (typeof(window.dhx4.template) == "undefined") {

      // trim
      window.dhx4.trim = function(t) {
        return String(t).replace(/^\s{1,}/,"").replace(/\s{1,}$/,"");
      };

      // template parsing
      window.dhx4.template = function(tpl, data, trim) {

        // tpl - template text, #value|func:param0:param1:paramX#
        // data - object with key-value
        // trim - true/false, trim values
        return tpl.replace(/#([a-zа-я0-9_-]{1,})(\|([^#]*))?#/gi, function(){

          var key = arguments[1];

          var t = window.dhx4.trim(arguments[3]);
          var func = null;
          var args = [data[key]];

          if (t.length > 0) {

            t = t.split(":");
            var k = [];

            // check escaped colon
            for (let q=0; q<t.length; q++) {
              if (q > 0 && k[k.length-1].match(/\\$/) != null) {
                k[k.length-1] = k[k.length-1].replace(/\\$/,"")+":"+t[q];
              } else {
                k.push(t[q]);
              }
            }

            func = k[0];
            for (let q=1; q<k.length; q++) args.push(k[q]);

          }

          // via inner function
          if (typeof(func) == "string" && typeof(window.dhx4.template[func]) == "function") {
            return window.dhx4.template[func].apply(window.dhx4.template, args);
          }

          // value only
          if (key.length > 0 && typeof(data[key]) != "undefined") {
            if (trim == true) return window.dhx4.trim(data[key]);
            return String(data[key]);
          }

          // key not found
          return "";

        });

      };

      window.dhx4.template.date = function(value, format) {
        // Date obj + format	=> convert to string
        // timestamp + format	=> convert to string
        // string		=> no convert
        // any other value	=> empty string
        if (value != null) {
          if (value instanceof Date) {
            return window.dhx4.date2str(value, format);
          } else {
            value = value.toString();
            if (value.match(/^\d*$/) != null) return window.dhx4.date2str(new Date(parseInt(value)), format);
            return value;
          }
        }
        return "";
      };

      window.dhx4.template.maxlength = function(value, limit) {
        return String(value).substr(0, limit);
      };

      window.dhx4.template.number_format = function(value, format, group_sep, dec_sep) {
        var fmt = window.dhx4.template._parseFmt(format, group_sep, dec_sep);
        if (fmt == false) return value;
        return window.dhx4.template._getFmtValue(value, fmt);
      };

      window.dhx4.template.lowercase = function(value) {
        if (typeof(value) == "undefined" || value == null) value = "";
        return String(value).toLowerCase();
      };
      window.dhx4.template.uppercase = function(value) {
        if (typeof(value) == "undefined" || value == null) value = "";
        return String(value).toUpperCase();
      };

      // number format helpers
      window.dhx4.template._parseFmt = function(format, group_sep, dec_sep) {

        var t = format.match(/^([^\.\,0-9]*)([0\.\,]*)([^\.\,0-9]*)/);
        if (t == null || t.length != 4) return false; // invalid format

        var fmt = {
          // int group
          i_len: false,
          i_sep: (typeof(group_sep)=="string"?group_sep:","),
          // decimal
          d_len: false,
          d_sep: (typeof(dec_sep)=="string"?dec_sep:"."),
          // chars before and after
          s_bef: (typeof(t[1])=="string"?t[1]:""),
          s_aft: (typeof(t[3])=="string"?t[3]:"")
        };

        var f = t[2].split(".");
        if (f[1] != null) fmt.d_len = f[1].length;

        var r = f[0].split(",");
        if (r.length > 1) fmt.i_len = r[r.length-1].length;

        return fmt;

      };

      window.dhx4.template._getFmtValue = function(value, fmt) {

        var r = String(value).match(/^(-)?([0-9]{1,})(\.([0-9]{1,}))?$/); // r = [complete value, minus sign, integer, full decimal, decimal]

        if (r != null && r.length == 5) {
          var v0 = "";
          // minus sign
          if (r[1] != null) v0 += r[1];
          // chars before
          v0 += fmt.s_bef;
          // int part
          if (fmt.i_len !== false) {
            var i = 0; var v1 = "";
            for (var q=r[2].length-1; q>=0; q--) {
              v1 = ""+r[2].charAt(q)+v1;
              if (++i == fmt.i_len && q > 0) { v1=fmt.i_sep+v1; i=0; }
            }
            v0 += v1;
          } else {
            v0 += r[2];
          }
          // dec part
          if (fmt.d_len !== false) {
            if (r[4] == null) r[4] = "";
            while (r[4].length < fmt.d_len) r[4] += "0";
            eval("dhx4.temp = new RegExp(/\\d{"+fmt.d_len+"}/);");
            var t1 = (r[4]).match(dhx4.temp);
            if (t1 != null) v0 += fmt.d_sep+t1;
            dhx4.temp = t1 = null;
          }
          // chars after
          v0 += fmt.s_aft;

          return v0;
        }

        return value;
      };

    }
  }

};
