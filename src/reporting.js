/**
 * Конструкторы табличных документов печатных форм и отчетов<br/>
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016<br/>
 * Created 17.04.2016
 *
 * @module reporting
 */

/**
 * Объект для построения печатных форм и отчетов
 *
 * @param [attr] {Object} - размер листа, ориентация, поля и т.д.
 * @constructor
 */
function SpreadsheetDocument(attr, events) {

	this._attr = {
		orientation: "portrait",
    title: "",
    content: document.createElement("DIV"),
    head: document.createElement("HEAD"),
    blank: "",
	};

	if(attr && typeof attr == "string"){
		this.content = attr;
	}
	else if(typeof attr == "object"){
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
  if(events && typeof events == "object"){
    this._events._mixin(events);
  }
}
SpreadsheetDocument.prototype.__define({

  clear_head: {
    value: function () {
      while (this._attr.head.firstChild) {
        this._attr.head.removeChild(this._attr.head.firstChild);
      }
    }
  },

	clear: {
		value: function () {
			while (this._attr.content.firstChild) {
				this._attr.content.removeChild(this._attr.content.firstChild);
			}
		}
  },

  /**
	 * Добавляем элементы в заголовок
	 */
  put_head: {
    value: function (tag, attr) {

      var elm;

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
  },

	/**
	 * Выводит область ячеек в табличный документ
	 */
	put: {
		value: function (range, attr) {

			var elm;

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
	},

  /**
   * Добавляет область и заполняет её данными
   * @method append
   * @param template {HTMLElement}
   * @param data {Object}
   */
  append: {
    value: function (template, data) {

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
  },

  draw_table: {
    value: function (template, data) {

      var tabular = template.attributes.tabular && template.attributes.tabular.value;
      if(!tabular){
        console.error('Не указана табличная часть в шаблоне ' + template.id);
        return;
      }
      var rows = data[tabular];
      if(!Array.isArray(rows)){
        console.error('В данных отсутствует массив ' + tabular);
        return;
      }

      // контейнер таблицы
      var cont = document.createElement("div");

      // заполняем контейнер по шаблону
      cont.innerHTML = template.innerHTML;

      // собственно, таблица
      var table = cont.querySelector("table");

      // шаблон строки таблицы
      var tpl_row = table.querySelector("[name=row]");

      // удаляем пустую строку из итоговой таблицы
      if(tpl_row){
        tpl_row.parentElement.removeChild(tpl_row);
      }
      else{
        console.error('Отсутствует <TR name="row"> в шаблоне таблицы');
        return;
      }

      // находим все шаблоны группировок
      var tpl_grouping = table.querySelector("tbody").querySelectorAll("tr");

      // удаляем шаблоны группировок из итоговой таблицы
      tpl_grouping.forEach(function (elm) {
        elm.parentElement.removeChild(elm);
      });


      // подвал таблицы
      var tfoot = table.querySelector("tfoot");
      if(tfoot){
        tfoot.parentElement.removeChild(tfoot);
        tfoot.innerHTML = dhx4.template(tfoot.innerHTML, data);
        table.appendChild(tfoot);
      }

      // есть ли итоги

      function put_rows(rows) {
        rows.forEach(function(row) {
          var table_row = document.createElement("TR");
          table_row.innerHTML = dhx4.template(tpl_row.innerHTML, row);
          table.appendChild(table_row);
        });
      }

      // есть ли группировка + цикл по табчасти
      var grouping = data._grouping && data._grouping.find_rows({use: true, parent: tabular});
      if(grouping && grouping.length == 1 && tpl_grouping.length){

        var gfield = grouping[0].field;

        $p.wsql.alasql("select distinct `"+gfield+"` from ? order by `"+gfield+"`", [rows])
          .forEach(function (group) {
            var table_row = document.createElement("TR");
            table_row.innerHTML = dhx4.template(tpl_grouping[0].innerHTML, group);
            table.appendChild(table_row);
            put_rows(rows.filter(function (row) {
              return row[gfield] == group[gfield];
            }));
          })
      }
      else{
        put_rows(rows);
      }

      // собственно, вывод табличной части в отчет
      this.put(cont.innerHTML, cont.attributes);
    }
  },

  draw_rows: {
    value: function (template, data) {

      var tabular = template.attributes.tabular && template.attributes.tabular.value;
      if(!tabular){
        console.error('Не указана табличная часть в шаблоне ' + template.id);
        return;
      }
      var rows = data[tabular];
      if(!Array.isArray(rows)){
        console.error('В данных отсутствует массив ' + tabular);
        return;
      }

      // цикл по табчасти - выводим строку
      for(var i = 0; i < rows.length; i++){
        this.put(dhx4.template(template.innerHTML.replace(/<!---/g, '').replace(/--->/g, ''), rows[i]), template.attributes);
      }
    }
  },

  /**
   * Копирование элемента
   */
  copy_element: {
    value: function(elem) {

      var elm = document.createElement(elem.tagName);
      elm.innerHTML = elem.innerHTML;
      var attr = elem.attributes;
      Object.keys(attr).forEach(function (key) {
        elm.setAttribute(attr[key].name || key, attr[key].value || attr[key]);
      });

      return elm;
    }
  },

  /**
   * Возвращает objectURL шаблона пустой страницы
   */
  blankURL: {
    get: function () {
      if(!this._blankURL) {
        var blob;
        if(this.blank) {
          blob = new Blob([this.blank], {type: 'text/html'});
        }
        else {
          blob = $p.injected_data['view_blank.html'] instanceof Blob ?
            $p.injected_data['view_blank.html'] :
            new Blob([$p.injected_data['view_blank.html']], {type: 'text/html'});
        }
        this._blankURL = window.URL.createObjectURL(blob);
      }
      return this._blankURL;
    }
  },

  /**
   * Показывает отчет в отдельном окне
   */
  print: {
    value: function () {

      try{

        var doc = this,
          url = this.blankURL,
          wnd_print = window.open(
          url, "_blank", "fullscreen,menubar=no,toolbar=no,location=no,status=no,directories=no,resizable=yes,scrollbars=yes");

        if (wnd_print.outerWidth < screen.availWidth || wnd_print.outerHeight < screen.availHeight){
          wnd_print.moveTo(0,0);
          wnd_print.resizeTo(screen.availWidth, screen.availHeight);
        }

        wnd_print.onload = function(e) {
          window.URL.revokeObjectURL(url);
          // копируем элементы из head
          for (var i = 0; i < doc.head.children.length; i++) {
            wnd_print.document.head.appendChild(doc.copy_element(doc.head.children[i]));
          }
          // копируем элементы из content
          if (doc.innerContent) {
            for (var i = 0; i < doc.content.children.length; i++) {
              wnd_print.document.body.appendChild(doc.copy_element(doc.content.children[i]));
            }
          } else {
            wnd_print.document.body.appendChild(doc.content);
          }
          if(doc.title){
            wnd_print.document.title = doc.title;
          }
          wnd_print.print();
          doc = null;
        };

        return wnd_print;
      }
      catch(err){
        window.URL.revokeObjectURL && window.URL.revokeObjectURL(url);
        $p.msg.show_msg({
          title: $p.msg.bld_title,
          type: "alert-error",
          text: err.message.match("outerWidth") ?
            "Ошибка открытия окна печати<br />Вероятно, в браузере заблокированы всплывающие окна" : err.message
        });
      }
    }
  },

  /**
   * Сохраняет печатную форму в файл
   */
  save_as: {
    value: function (filename) {

      try{
        var doc = this,
          url = this.blankURL,
          wnd_print = window.open(
          url, "_blank", "fullscreen,menubar=no,toolbar=no,location=no,status=no,directories=no,resizable=yes,scrollbars=yes");

        if (wnd_print.outerWidth < screen.availWidth || wnd_print.outerHeight < screen.availHeight){
          wnd_print.moveTo(0,0);
          wnd_print.resizeTo(screen.availWidth, screen.availHeight);
        }

        wnd_print.onload = function(e) {
          window.URL.revokeObjectURL(url);
          // копируем элементы из head
          for (var i = 0; i < doc.head.children.length; i++) {
            wnd_print.document.head.appendChild(doc.copy_element(doc.head.children[i]));
          }
          // копируем элементы из content
          if (doc.innerContent) {
            for (var i = 0; i < doc.content.children.length; i++) {
              wnd_print.document.body.appendChild(doc.copy_element(doc.content.children[i]));
            }
          } else {
            wnd_print.document.body.appendChild(doc.content);
          }
          if(doc.title){
            wnd_print.document.title = doc.title;
          }

          // сохраняем содержимое документа
          var blob = new Blob([wnd_print.document.firstElementChild.outerHTML], {type: 'text/html'});
          if(window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename);
          }
          else {
            var elem = window.document.createElement('a');
            elem.href = window.URL.createObjectURL(blob);
            elem.download = filename;
            document.body.appendChild(elem);
            elem.click();
            document.body.removeChild(elem);
          }

          wnd_print.close();
          doc = null;
        };

        return null;
      }
      catch(err){
        window.URL.revokeObjectURL && window.URL.revokeObjectURL(url);
        $p.msg.show_msg({
          title: $p.msg.bld_title,
          type: "alert-error",
          text: err.message.match("outerWidth") ?
            "Ошибка сохранения документа" : err.message
        });
      }
    }
  },

  blank: {
    get: function () {
      return this._attr.blank
    },
    set: function (v) {
      this._attr.blank = v;
    }
  },

  head: {
    get: function () {
      return this._attr.head
    },
    set: function (v) {
      this.clear_head();
      if(typeof v == 'string') {
        this._attr.head.innerHTML = v;
      }
      else if(v instanceof HTMLElement) {
        this._attr.head.innerHTML = v.innerHTML;
      }
    }
  },

	content: {
		get: function () {
			return this._attr.content
		},
    set: function (v) {
      this.clear();
      if(typeof v == 'string') {
        this._attr.content.innerHTML = v;
      }
      else if(v instanceof HTMLElement) {
        this._attr.content.innerHTML = v.innerHTML;
      }
    }
  },

	title: {
		get: function () {
			return this._attr.title
		},
		set: function (v) {
			this._attr.title = v;
		}
	}

});

/**
 * Экспортируем конструктор SpreadsheetDocument, чтобы экземпляры печатного документа можно было создать снаружи
 * @property SpreadsheetDocument
 * @for MetaEngine
 * @type {function}
 */
$p.SpreadsheetDocument = SpreadsheetDocument;


/**
 * Табличный документ для экранных отчетов
 * @param container {HTMLElement|dhtmlXCellObject} - элемент DOM, в котором будет размещена таблица
 * @param [attr] {Object} - атрибуты инициплизации
 * @constructor
 */
function HandsontableDocument(container, attr) {

	var init = function () {

		if(this._then)
			this._then(this);

	}.bind(this);

	this._online = (attr && attr.allow_offline) || (navigator.onLine && $p.wsql.pouch.authorized);

	if(container instanceof dhtmlXCellObject){
		this._cont = document.createElement('div');
		container.detachObject(true);
		container.attachObject(this._cont);
	}else{
		this._cont = container;
	}

	this._cont.classList.add("handsontable_wrapper");
	if(!this._online){
		this._cont.innerHTML = $p.msg.report_need_online;
	}else{
		this._cont.innerHTML = attr.autorun ? $p.msg.report_prepare : $p.msg.report_need_prepare;
	}

	this.then = function (callback) {
		this._then = callback;
		return this;
	};

	this.requery = function (opt) {

		if(this.hot)
			this.hot.destroy();

		if(opt instanceof Error){
			this._cont.innerHTML = $p.msg.report_error + (opt.name ? " <b>" + opt.name + "</b>" : "") + (opt.message ? " " + opt.message : "");
		}else{
			this._cont.innerHTML = "";
			this.hot = new Handsontable(this._cont, opt);
		}
	};


	// отложенная загрузка handsontable и зависимостей
	if(typeof Handsontable != "function" && this._online){

		$p.load_script("https://cdnjs.cloudflare.com/ajax/libs/pikaday/1.4.0/pikaday.min.js","script")
			.then(function () {
				return $p.load_script("https://cdnjs.cloudflare.com/ajax/libs/numbro/1.9.2/numbro.min.js","script")
			})
			.then(function () {
				return $p.load_script("https://cdn.jsdelivr.net/g/zeroclipboard,handsontable@0.26(handsontable.min.js)","script")
			})
			.then(function () {
				return Promise.all([
					$p.load_script("https://cdn.jsdelivr.net/handsontable/0.26/handsontable.min.css","link"),
					$p.load_script("https://cdnjs.cloudflare.com/ajax/libs/numbro/1.9.2/languages/ru-RU.min.js","script")
				]);
			})
			.then(init);

	}else{
		setTimeout(init);
	}

}

/**
 * Экспортируем конструктор HandsontableDocument, чтобы экземпляры табличного документа можно было создать снаружи
 * @property HandsontableDocument
 * @for MetaEngine
 * @type {function}
 */
$p.HandsontableDocument = HandsontableDocument;
