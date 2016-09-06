/**
 * ### Наша promise-реализация ajax
 * - Поддерживает basic http авторизацию
 * - Позволяет установить перед отправкой запроса специфические заголовки
 * - Поддерживает получение и отправку данных с типом `blob`
 * - Позволяет отправлять запросы типа `get`, `post`, `put`, `patch`, `delete`
 *
 * @class Ajax
 * @static
 * @menuorder 31
 * @tooltip Работа с http
 */
class Ajax{

	constructor() {

		/**
		 * имя пользователя для авторизации на сервере
		 * @property username
		 * @type String
		 */
		this.username = "";

		/**
		 * пароль пользователя для авторизации на сервере
		 * @property password
		 * @type String
		 */
		this.password = "";

		/**
		 * признак авторизованности на сервере
		 * @property authorized
		 * @type Boolean
		 */
		this.authorized = false;

	}

	async _call(method, url, post_data, auth, before_send) {

		return await new Promise(function (resolve, reject) {

			// внутри Node, используем request
			if (typeof window == "undefined" && auth && auth.request) {

				auth.request({
						url: encodeURI(url),
						headers: {
							"Authorization": auth.auth
						}
					},
					function (error, response, body) {
						if (error)
							reject(error);

						else if (response.statusCode != 200)
							reject({
								message: response.statusMessage,
								description: body,
								status: response.statusCode
							});

						else
							resolve({response: body});
					}
				);

			} else {

				// делаем привычные для XHR вещи
				var req = new XMLHttpRequest();

				if (window.dhx4 && window.dhx4.isIE)
					url = encodeURI(url);

				if (auth) {
					var username, password;
					if (typeof auth == "object" && auth.username && auth.hasOwnProperty("password")) {
						username = auth.username;
						password = auth.password;

					} else {
						if ($p.ajax.username && $p.ajax.authorized) {
							username = $p.ajax.username;
							password = $p.aes.Ctr.decrypt($p.ajax.password);

						} else {
							username = $p.wsql.get_user_param("user_name");
							password = $p.aes.Ctr.decrypt($p.wsql.get_user_param("user_pwd"));

							if (!username && $p.job_prm && $p.job_prm.guest_name) {
								username = $p.job_prm.guest_name;
								password = $p.aes.Ctr.decrypt($p.job_prm.guest_pwd);
							}
						}
					}
					req.open(method, url, true, username, password);
					req.withCredentials = true;
					req.setRequestHeader("Authorization", "Basic " +
						btoa(unescape(encodeURIComponent(username + ":" + password))));
				} else
					req.open(method, url, true);

				if (before_send)
					before_send.call(this, req);

				if (method != "GET") {
					if (!this.hide_headers && !auth.hide_headers) {
						req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
						req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
					}
				} else {
					post_data = null;
				}

				req.onload = function () {
					// Этот кусок вызовется даже при 404’ой ошибке
					// поэтому проверяем статусы ответа
					if (req.status == 200 && (req.response instanceof Blob || req.response.substr(0, 9) !== "<!DOCTYPE")) {
						// Завершаем Обещание с текстом ответа
						if (req.responseURL == undefined)
							req.responseURL = url;
						resolve(req);
					}
					else {
						// Обламываемся, и передаём статус ошибки
						// что бы облегчить отладку и поддержку
						if (req.response)
							reject({
								message: req.statusText,
								description: req.response,
								status: req.status
							});
						else
							reject(Error(req.statusText));
					}
				};

				// отлавливаем ошибки сети
				req.onerror = function () {
					reject(Error("Network Error"));
				};

				// Делаем запрос
				req.send(post_data);
			}

		});

	}

	/**
	 * Выполняет асинхронный get запрос
	 * @method get
	 * @param url {String}
	 * @return {Promise.<T>}
	 * @async
	 */
	get(url) {
		return this._call("GET", url);
	};

	/**
	 * Выполняет асинхронный post запрос
	 * @method post
	 * @param url {String}
	 * @param postData {String} - данные для отправки на сервер
	 * @return {Promise.<T>}
	 * @async
	 */
	post(url, postData) {
		if (arguments.length == 1) {
			postData = "";
		} else if (arguments.length == 2 && (typeof(postData) == "function")) {
			postData = "";
		} else {
			postData = String(postData);
		}
		return this._call("POST", url, postData);
	};

	/**
	 * Выполняет асинхронный get запрос с авторизацией и возможностью установить заголовки http
	 * @method get_ex
	 * @param url {String}
	 * @param auth {Boolean}
	 * @param beforeSend {Function} - callback перед отправкой запроса на сервер
	 * @return {Promise.<T>}
	 * @async
	 */
	get_ex(url, auth, beforeSend) {
		return this._call("GET", url, null, auth, beforeSend);
	};

	/**
	 * Выполняет асинхронный post запрос с авторизацией и возможностью установить заголовки http
	 * @method post_ex
	 * @param url {String}
	 * @param postData {String} - данные для отправки на сервер
	 * @param auth {Boolean}
	 * @param beforeSend {Function} - callback перед отправкой запроса на сервер
	 * @return {Promise.<T>}
	 * @async
	 */
	post_ex(url, postData, auth, beforeSend) {
		return this._call("POST", url, postData, auth, beforeSend);
	};

	/**
	 * Выполняет асинхронный put запрос с авторизацией и возможностью установить заголовки http
	 * @method put_ex
	 * @param url {String}
	 * @param postData {String} - данные для отправки на сервер
	 * @param auth {Boolean}
	 * @param beforeSend {Function} - callback перед отправкой запроса на сервер
	 * @return {Promise.<T>}
	 * @async
	 */
	put_ex(url, postData, auth, beforeSend) {
		return this._call("PUT", url, postData, auth, beforeSend);
	};

	/**
	 * Выполняет асинхронный patch запрос с авторизацией и возможностью установить заголовки http
	 * @method patch_ex
	 * @param url {String}
	 * @param postData {String} - данные для отправки на сервер
	 * @param auth {Boolean}
	 * @param beforeSend {Function} - callback перед отправкой запроса на сервер
	 * @return {Promise.<T>}
	 * @async
	 */
	patch_ex(url, postData, auth, beforeSend) {
		return this._call("PATCH", url, postData, auth, beforeSend);
	};

	/**
	 * Выполняет асинхронный delete запрос с авторизацией и возможностью установить заголовки http
	 * @method delete_ex
	 * @param url {String}
	 * @param auth {Boolean}
	 * @param beforeSend {Function} - callback перед отправкой запроса на сервер
	 * @return {Promise.<T>}
	 * @async
	 */
	delete_ex(url, auth, beforeSend) {
		return this._call("DELETE", url, null, auth, beforeSend);

	};

	/**
	 * Получает с сервера двоичные данные (pdf отчета или картинку или произвольный файл) и показывает его в новом окне, используя data-url
	 * @method get_and_show_blob
	 * @param url {String} - адрес, по которому будет произведен запрос
	 * @param post_data {Object|String} - данные запроса
	 * @param [method] {String}
	 * @async
	 */
	get_and_show_blob(url, post_data, method) {

		var params = "menubar=no,toolbar=no,location=no,status=no,directories=no,resizable=yes,scrollbars=yes",
			req;

		function show_blob(req) {
			url = window.URL.createObjectURL(req.response);
			var wnd_print = window.open(url, "wnd_print", params);
			wnd_print.onload = (e) => window.URL.revokeObjectURL(url);
			return wnd_print;
		}

		if (!method || (typeof method == "string" && method.toLowerCase().indexOf("post") != -1))
			req = this.post_ex(url,
				typeof post_data == "object" ? JSON.stringify(post_data) : post_data,
				true,
				xhr => xhr.responseType = "blob");
		else
			req = this.get_ex(url, true, xhr => xhr.responseType = "blob");

		return show_blob(req)
	};

	/**
	 * Получает с сервера двоичные данные (pdf отчета или картинку или произвольный файл) и показывает диалог сохранения в файл
	 * @method get_and_save_blob
	 * @param url {String} - адрес, по которому будет произведен запрос
	 * @param post_data {Object|String} - данные запроса
	 * @param file_name {String} - имя файла для сохранения
	 * @return {Promise.<T>}
	 */
	get_and_save_blob(url, post_data, file_name) {

		return this.post_ex(url,
			typeof post_data == "object" ? JSON.stringify(post_data) : post_data, true, function (xhr) {
				xhr.responseType = "blob";
			})
			.then(function (req) {
				saveAs(req.response, file_name);
			});
	};

	default_attr(attr, url) {
		if (!attr.url)
			attr.url = url;
		if (!attr.username)
			attr.username = this.username;
		if (!attr.password)
			attr.password = this.password;
		attr.hide_headers = true;

		if ($p.job_prm["1c"]) {
			attr.auth = $p.job_prm["1c"].auth;
			attr.request = $p.job_prm["1c"].request;
		}
	}

}



