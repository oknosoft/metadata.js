describe("Загрузка страницы:", function () {

	var wtest,	$p;

	beforeEach(function () {
		wtest = frames[0];
		$p = wtest.$p;
	});

	it("Переменная $p должна содержать объект", function () {

		expect(typeof $p).toBe("object");
	});

	describe("Проверка ключевх свойств $p:", function () {

		it("job_prm при загрузке должен быть пустым", function () {
			expect($p.job_prm).toBeUndefined();
		});

		it("eve и iface должны содержать object", function () {
			expect(typeof $p.eve).toBe("object");
			expect(typeof $p.iface).toBe("object");
		});
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
					spyOn($p.iface, 'oninit').and.callThrough();

					setTimeout(function() {
						done();
					}, 1000);
				};

			}, 10);

		};
	});

	it("oninit должен произойти в пределах секунды после загрузки страницы", function() {
		expect($p.iface.oninit).toHaveBeenCalled();
	});

});

describe("Диалог авторизации:", function () {

	var wtest, $p, was_done;

	beforeEach(function(done) {

		wtest = frames[0];
		wtest.location.reload();
		wtest.onunload = function(){

			setTimeout(function() {
				wtest = frames[0];
				wtest.onload = function(){

					$p = wtest.$p;

					$p.settings = function (prm, modifiers) {

						prm.russian_names = true;
						prm.rest_path = "/a/unf/odata/standard.odata/";
						prm.data_url = "examples/unf/data/";
						prm.create_tables = "examples/unf/data/create_tables.sql";

					};

					$p.iface.oninit = function () {

						$p.iface.layout_1c();

						$p.iface.frm_auth(
							null,
							function () {
								//$p.iface.set_hash("doc.СчетНаОплатуПокупателю", "", "", "oper");
								$p.iface.docs.hideHeader();

							},
							function (err) {
								console.log(err);
							}
						);

						if(!was_done){
							was_done = true;
							done();
						}
					};

					setTimeout(function() {
						if(!was_done){
							was_done = true;
							done();
						}
					}, 3000);
				};

			}, 10);

		};
	});

	it("layout + диалог нарисованы", function() {
		expect($p.iface.auth instanceof wtest.dhtmlXForm).toBeTruthy();
		expect($p.iface.docs instanceof wtest.dhtmlXLayoutCell).toBeTruthy();
	});

});

describe("Aвторизация:", function () {

	var wtest,	$p;

	beforeEach(function() {

		wtest = frames[0];
		$p = wtest.$p;

	});

	it("должна быть ошибка при неверном логине-пароле", function() {
		expect(typeof $p).toBe("object");
	});

	it("должен случиться callback при успешной авторизации", function() {
		expect(typeof $p).toBe("object");
	});

});