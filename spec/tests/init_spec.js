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
			expect(typeof $p.job_prm).not.toBe("object");
		});

		it("eve и iface должны содержать object", function () {
			expect(typeof $p.eve).toBe("object");
			expect(typeof $p.iface).toBe("object");
		});
	});

});

describe("События:", function () {

	var wtest,	$p;

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
					spyOn($p.iface, 'oninit');

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

describe("Aвторизация:", function () {

	var wtest,	$p;

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

					setTimeout(function() {
						done();
					}, 1000);
				};

			}, 10);

		};
	});

	it("layout + диалог нарисованы", function() {
		expect(typeof $p).toBe("object");
	});

});