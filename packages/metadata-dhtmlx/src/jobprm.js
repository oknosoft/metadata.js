

export default ({job_prm}) => {

	/**
	 * Осуществляет синтаксический разбор параметров url
	 * @method parse_url
	 * @return {Object}
	 */
	job_prm.parse_url_str = function (prm_str) {
		var prm = {}, tmp = [], pairs;

		if (prm_str[0] === "#" || prm_str[0] === "?")
			prm_str = prm_str.substr(1);

		if (prm_str.length > 2) {

			pairs = decodeURI(prm_str).split('&');

			// берём параметры из url
			for (var i in pairs) {   //разбиваем пару на ключ и значение, добавляем в их объект
				tmp = pairs[i].split('=');
				if (tmp[0] == "m") {
					try {
						prm[tmp[0]] = JSON.parse(tmp[1]);
					} catch (e) {
						prm[tmp[0]] = {};
					}
				} else
					prm[tmp[0]] = tmp[1] || "";
			}
		}

		return prm;
	}

	/**
	 * Осуществляет синтаксический разбор параметров url
	 * @method parse_url
	 * @return {Object}
	 */
	job_prm.parse_url = function () {
		return this.parse_url_str(location.search)._mixin(this.parse_url_str(location.hash));
	}

	/**
	 * Содержит объект с расшифровкой параметров url, указанных при запуске программы
	 * @property url_prm
	 * @type {Object}
	 * @static
	 */
	job_prm.url_prm = job_prm.parse_url();

};
