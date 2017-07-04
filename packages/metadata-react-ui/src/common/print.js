/**
 * ### Методы печати в прототип DataManager
 *
 * @module print
 *
 * Created 10.01.2017
 */


/**
 * Печатает объект
 * @method print
 * @param ref {DataObj|String} - guid ссылки на объект
 * @param model {String|DataObj.cat.formulas} - идентификатор команды печати
 * @param [wnd] {dhtmlXWindows} - окно, из которого вызываем печать
 */
function print(ref, model, wnd) {

  function tune_wnd_print(wnd_print) {
    if (wnd && wnd.progressOff)
      wnd.progressOff();
    if (wnd_print)
      wnd_print.focus();
  }

  if (wnd && wnd.progressOn)
    wnd.progressOn();

  setTimeout(tune_wnd_print, 3000);

  // если _printing_plates содержит ссылку на обрабочтик печати, используем его
  if (this._printing_plates[model] instanceof DataObj)
    model = this._printing_plates[model];

  // если существует локальный обработчик, используем его
  if (model instanceof DataObj && model.execute) {

    if (ref instanceof DataObj)
      return model.execute(ref)
        .then(tune_wnd_print);
    else
      return this.get(ref, true)
        .then(model.execute.bind(model))
        .then(tune_wnd_print);

  } else {

    // иначе - печатаем средствами 1С или иного сервера
    var rattr = {};
    $p.ajax.default_attr(rattr, job_prm.irest_url());
    rattr.url += this.rest_name + "(guid'" + utils.fix_guid(ref) + "')" +
      "/Print(model=" + model + ", browser_uid=" + wsql.get_user_param("browser_uid") + ")";

    return $p.ajax.get_and_show_blob(rattr.url, rattr, "get")
      .then(tune_wnd_print);
  }

}