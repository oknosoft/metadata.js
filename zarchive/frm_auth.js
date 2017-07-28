/**
 * Создаёт форму авторизации с обработчиками перехода к фидбэку и настройкам,
 * полем входа под гостевой ролью, полями логина и пароля и кнопкой входа
 * @method frm_auth
 * @for InterfaceObjs
 * @param attr {Object} - параметры формы
 * @param [attr.cell] {dhtmlXCellObject}
 * @return {Promise}
 */
$p.iface.frm_auth = function (attr, resolve, reject) {

  if(!attr)
    attr = {};

  var _cell, _frm, w, were_errors;

  if(attr.modal_dialog){
    if(!attr.options)
      attr.options = {
        name: "frm_auth",
        caption: "Вход на сервер",
        width: 360,
        height: 300,
        center: true,
        allow_close: true,
        allow_minmax: true,
        modal: true
      };
    _cell = this.auth = this.dat_blank(attr._dxw, attr.options);
    _cell.attachEvent("onClose", function(win){
      if(were_errors){
        reject && reject(err);
      }else if(resolve)
        resolve();
      return true;
    });
    _frm = _cell.attachForm();

  }else{
    _cell = attr.cell || this.docs;
    _frm = this.auth = _cell.attachForm();
    $p.msg.show_msg($p.msg.init_login, _cell);
  }


  function do_auth(login, password){

    $p.ajax.username = login;
    $p.ajax.password = $p.aes.Ctr.encrypt(password);

    if(login){

      if($p.wsql.get_user_param("user_name") != login)
        $p.wsql.set_user_param("user_name", login);					// сохраняем имя пользователя в базе

      var observer = $p.eve.attachEvent("user_log_in", function () {
        $p.eve.detachEvent(observer);
        _cell && _cell.close && _cell.close();
      });

      //$p.eve.log_in(attr.onstep)
      $p.wsql.pouch.log_in(login, password)
        .then(function () {

          if($p.wsql.get_user_param("enable_save_pwd")){
            if($p.aes.Ctr.decrypt($p.wsql.get_user_param("user_pwd")) != password)
              $p.wsql.set_user_param("user_pwd", $p.aes.Ctr.encrypt(password));   // сохраняем имя пользователя в базе

          }else if($p.wsql.get_user_param("user_pwd") != "")
            $p.wsql.set_user_param("user_pwd", "");

          $p.eve.logged_in = true;
          if(attr.modal_dialog)
            _cell && _cell.close && _cell.close();
          else if(resolve)
            resolve();

        })
        .catch(function (err) {
          were_errors = true;
          _frm && _frm.onerror &&_frm.onerror(err);
        })
        .then(function () {
          if($p.iface.sync)
            $p.iface.sync.close();
          if(_cell && _cell.progressOff){
            _cell.progressOff();
            if(!were_errors && attr.hide_header)
              _cell.hideHeader();
          }
          if($p.iface.cell_tree && !were_errors)
            $p.iface.cell_tree.expand();
        });

    } else
      this.validate();
  }

  // обработчик кнопки "войти" формы авторизации
  function auth_click(name){

    were_errors = false;
    this.resetValidateCss();

    if(this.getCheckedValue("type") == "guest"){

      var login = this.getItemValue("guest"),
        password = "";
      if($p.job_prm.guests && $p.job_prm.guests.length){
        $p.job_prm.guests.some(function (g) {
          if(g.username == login){
            password = $p.aes.Ctr.decrypt(g.password);
            return true;
          }
        });
      }
      do_auth.call(this, login, password);

    }else if(this.getCheckedValue("type") == "auth"){
      do_auth.call(this, this.getItemValue("login"), this.getItemValue("password"));

    }
  }

  // загружаем структуру формы
  _frm.loadStruct($p.injected_data["form_auth.xml"], function(){

    var selected;

    // если указан список гостевых пользователей
    if($p.job_prm.guests && $p.job_prm.guests.length){

      var guests = $p.job_prm.guests.map(function (g) {
        var v = {
          text: g.username,
          value: g.username
        };
        if($p.wsql.get_user_param("user_name") == g.username){
          v.selected = true;
          selected = g.username;
        }
        return v;
      });

      if(!selected){
        guests[0].selected = true;
        selected = guests[0].value;
      }

      _frm.reloadOptions("guest", guests);
    }

    // после готовности формы читаем пользователя из локальной датабазы
    if($p.wsql.get_user_param("user_name") && $p.wsql.get_user_param("user_name") != selected){
      _frm.setItemValue("login", $p.wsql.get_user_param("user_name"));
      _frm.setItemValue("type", "auth");

      if($p.wsql.get_user_param("enable_save_pwd") && $p.wsql.get_user_param("user_pwd")){
        _frm.setItemValue("password", $p.aes.Ctr.decrypt($p.wsql.get_user_param("user_pwd")));
      }
    }

    // позиционируем форму по центру
    if(!attr.modal_dialog){
      if((w = ((_cell.getWidth ? _cell.getWidth() : _cell.cell.offsetWidth) - 500)/2) >= 10)
        _frm.cont.style.paddingLeft = w.toFixed() + "px";
      else
        _frm.cont.style.paddingLeft = "20px";
    }

    setTimeout(function () {

      dhx4.callEvent("on_draw_auth", [_frm]);

      if(($p.wsql.get_user_param("autologin") || attr.try_auto) && (selected || ($p.wsql.get_user_param("user_name") && $p.wsql.get_user_param("user_pwd"))))
        auth_click.call(_frm);

    });
  });

  // назначаем обработчик нажатия на кнопку
  _frm.attachEvent("onButtonClick", auth_click);

  _frm.attachEvent("onKeyDown",function(inp, ev, name, value){
    if(ev.keyCode == 13){
      if(name == "password" || this.getCheckedValue("type") == "guest"){
        auth_click.call(this);
      }
    }
  });


  _frm.onerror = function (err) {

    $p.ajax.authorized = false;

    var emsg = err.message.toLowerCase();

    if(emsg.indexOf("auth") != -1) {
      $p.msg.show_msg({
        title: $p.msg.main_title + $p.version,
        type: "alert-error",
        text: $p.msg.error_auth
      });
      _frm.setItemValue("password", "");
      _frm.validate();

    }else if(emsg.indexOf("gateway") != -1 || emsg.indexOf("net") != -1) {
      $p.msg.show_msg({
        title: $p.msg.main_title + $p.version,
        type: "alert-error",
        text: $p.msg.error_network
      });
    }
  }



};
