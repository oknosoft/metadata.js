describe("OCombo:", function () {

	var wtest,	$p;

	beforeEach(function () {
		wtest = frames[0];
		$p = wtest.$p;
	});

	it("Конствуктор должен возвращать объект типа OCombo", function () {
		expect(typeof $p).toBe("object");
	});


});