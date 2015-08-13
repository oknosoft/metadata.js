describe("Загрузка страницы:", function () {

	var wtest,	$p;

	beforeEach(function () {
		wtest = frames[0];
		$p = wtest.$p;
	});

	it("Переменная $p должна содержать объект", function () {
		expect(typeof $p).toBe("object");
	});

	it("Свойство $p.job_prm при загрузке должен быть пустым", function () {
		expect($p.job_prm).toBeUndefined();
	});

	it("Свойства $p.eve и $p.iface должны содержать object", function () {
		expect(typeof $p.eve).toBe("object");
		expect(typeof $p.iface).toBe("object");
	});

});

describe("События:", function () {

	var wtest, $p;

	beforeEach(function(done) {

		wtest = frames[0];
		wtest.location.reload();
		wtest.onunload = function(){

			setTimeout(function() {
				wtest = frames[0];
				wtest.onload = function(){

					$p = wtest.$p;

					$p.iface.oninit = function () {
						console.log(Date.now());
					};

					$p.settings = function (prm, modifiers) {
						console.log(Date.now());
					};

					spyOn($p.iface, 'oninit').and.callThrough();

					spyOn($p, 'settings').and.callThrough();

					setTimeout(function() {
						done();
					}, 1000);
				};

			}, 10);

		};
	});

	it("oninit() и settings() должен быть вызваны в пределах секунды после загрузки страницы", function() {
		expect($p.iface.oninit).toHaveBeenCalled();
		expect($p.settings).toHaveBeenCalled();
	});

});

describe("Диалог авторизации:", function () {

	var wtest, $p;

	beforeEach(function(done) {

		$j.draw_auth($j.prm_unf)
			.then(function (w) {
				wtest = w;
				$p = wtest.$p;
				done();
			})
			.catch(function (err) {
				console.log(err);
				done();
			});
	});

	it("layout + диалог нарисованы", function() {
		// свойство $p.iface.auth должно содеражать объект типа dhtmlXForm
		expect($p.iface.auth instanceof wtest.dhtmlXForm).toBeTruthy();
		// свойство $p.iface.docs должно содеражать объект типа dhtmlXLayoutCell
		expect($p.iface.docs instanceof wtest.dhtmlXLayoutCell).toBeTruthy();
	});

});

describe("Aвторизация:", function () {

	var wtest, $p, prm_patch = {
		login: "",
		password: ""
	};

	it("должна быть ошибка при неверном логине-пароле", function(done) {

		prm_patch.login = "Плохой логин";
		$j.log_in($j.prm_unf, [], prm_patch)
			.then(function (w) {
				wtest = w;
				$p = wtest.$p;
				spec();
			})
			.catch(function (err) {
				wtest = err.wtest;
				$p = wtest.$p;
				spec();
			});

		function spec(){
			// признак авторизованности в $p.ajax
			expect($p.ajax.authorized).toBeFalsy();

			// диалог с ошибкой
			var error = wtest.document.querySelector(".dhtmlx-alert-error"), btn;
			expect(error).toBeDefined();
			if(error){
				btn = error.querySelector(".dhtmlx_popup_button");
				btn.click();
			}
			done();
		}

	});

	it("должна быть ошибка при нереальном url сервиса https://zzz.xxx.su/", function(done) {

		prm_patch.login = "Дилер";
		prm_patch.rest_path = "https://zzz.xxx.su/";
		$j.log_in($j.prm_unf, [], prm_patch)
			.then(function (w) {
				wtest = w;
				$p = wtest.$p;
				spec();
			})
			.catch(function (err) {
				wtest = err.wtest;
				$p = wtest.$p;
				spec();
			});

		function spec(){
			// признак авторизованности в $p.ajax
			expect($p.ajax.authorized).toBeFalsy();

			// диалог с ошибкой
			var error = wtest.document.querySelector(".dhtmlx-alert-error"), btn;
			expect(error).toBeDefined();
			if(error){
				btn = error.querySelector(".dhtmlx_popup_button");
				btn.click();
			}
			done();
		}
	});


	it("должен случиться callback при успешной авторизации", function(done) {

		prm_patch.login = "Дилер";
		delete prm_patch.rest_path;
		$j.log_in($j.prm_unf, [], prm_patch)
			.then(function (w) {
				wtest = w;
				$p = wtest.$p;
				spec();
			})
			.catch(function (err) {
				wtest = err.wtest;
				$p = wtest.$p;
				spec();
			});

		function spec(){

			// признак авторизованности в $p.ajax
			expect($p.ajax.authorized).toBeTruthy();

			// диалог с ошибкой должен отсутствовать
			expect(wtest.document.querySelector(".dhtmlx-alert-error")).toBeNull();

			$p.iface.docs.hideHeader();

			done();
		}

	});

	it("Справочник номенклатуры должен существовать и содержать элементы", function(done) {

		prm_patch.login = "Дилер";
		delete prm_patch.rest_path;
		$j.log_in($j.prm_unf, [], prm_patch)
			.then(function (w) {
				wtest = w;
				$p = wtest.$p;
				spec();
			})
			.catch(function (err) {
				wtest = err.wtest;
				$p = wtest.$p;
				spec();
			});

		function spec(){

			expect($p.cat.Номенклатура.alatable.length).toBeGreaterThan(50);

			done();
		}

	});


});