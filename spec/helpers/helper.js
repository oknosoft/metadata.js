/**
 * Created 13.08.2015<br />
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author	Evgeniy Malyarov
 *
 * @module  helper
 */
var $j = {

	// Параметры работы программы для УНФ
	prm_unf: {
		russian_names: true,
		rest_path: "/a/unf/odata/standard.odata/",
		rest: true,
		data_url: "examples/unf/data/",
		create_tables: "examples/unf/data/create_tables.sql",
		layout: "layout_1c"
	},

	/**
	 * Рисует диалог авторизации
	 * @param oprm
	 * @param omodifiers
	 * @return {Promise>}
	 */
	draw_auth: function (oprm, omodifiers) {

		var wtest = frames[0], $p, was_done;

		return new Promise(function(resolve, reject) {
			try{

				wtest.location.reload();
				wtest.onunload = function(){

					setTimeout(function() {
						wtest = frames[0];
						wtest.onload = function(){

							$p = wtest.$p;

							$p.settings = function (prm, modifiers) {
								for(var f in oprm)
									prm[f] = oprm[f];
							};

							$p.iface.oninit = function () {

								if(!was_done){
									was_done = true;

									$p.iface[oprm.layout]()
										.then(function () {
											$p.iface.frm_auth(
												null,
												function(){
													console.log("on_auth");
												},
												function (err) {
													reject(err);
												},
												function(){
													resolve(wtest)
												}
											);
										})
										.catch(function (err) {
											reject(err);
										});
								}
							};

							setTimeout(function() {
								if(!was_done){
									was_done = true;
									reject(new Error("timout"));
								}
							}, 3000);
						};

					}, 10);
				};

			}catch(err){
				reject(err);
			}
		});

	},

	log_in: function (oprm, omodifiers, prm_patch) {

		var tprm = {};
		for(var f in oprm)
			tprm[f] = oprm[f];
		for(var f in prm_patch){
			if(f!="login" && f!="password")
				tprm[f] = prm_patch[f];
		}

		return $j.draw_auth(tprm, omodifiers)
			.then(function (wtest) {
				var $p = wtest.$p;

				return new Promise(function(resolve, reject) {

					$p.iface.auth.setItemValue("type", "auth");
					$p.iface.auth.setItemValue("login", prm_patch.login);
					$p.iface.auth.setItemValue("password", prm_patch.password);
					$p.iface.auth.on_auth = function () {
						resolve(wtest);
					};
					$p.iface.auth.on_error = function (err) {
						reject({err: err, wtest: wtest});
					};

					$p.iface.auth.btn_click("submit");

				})
		});
	}

};