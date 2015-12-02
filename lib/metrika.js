// Yandex.Metrika
var yaParams = {};
(function (d, w, c) {
	(w[c] = w[c] || []).push(function () {
		try {
			w.yaCounter681390 = new Ya.Metrika({
				id: 681390,
				enableAll: true,
				webvisor: true,
				params: window.yaParams || {}
			});
		} catch (e) {
		}
	});
	var n = d.getElementsByTagName("script")[0], s = d.createElement("script"), f = function () {
		n.parentNode.insertBefore(s, n);
	};
	s.type = "text/javascript";
	s.async = true;
	s.src = (d.location.protocol == "https:" ? "https:" : "http:") + "//mc.yandex.ru/metrika/watch.js";
	if (w.opera == "[object Opera]") {
		d.addEventListener("DOMContentLoaded", f);
	} else {
		f();
	}
})(document, window, "yandex_metrika_callbacks");

// GOOGLE ANALITICS
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
(function (d, w) {
	var n = d.getElementsByTagName("script")[0],
		s = d.createElement("script"),
		f = function () {
			n.parentNode.insertBefore(s, n);
		};
	s.type = "text/javascript";
	s.async = true;
	s.src = gaJsHost + "google-analytics.com/ga.js";
	s.addEventListener('load', function () {
		try {
			var pageTracker = _gat._getTracker("UA-8892193-1");
			pageTracker._trackPageview();
		} catch (err) {
		}
	}, false);
	if (w.opera == "[object Opera]") {
		d.addEventListener("DOMContentLoaded", f);
	} else {
		f();
	}
})(document, window);
