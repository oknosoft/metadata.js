/**
 * Created by unpete on 13.05.2015.
 */


/**
 * __Javascript SOAP Client__
 * Forked from javascriptsoapclient.codeplex.com and improved by gtathub.
 * For new versions check: https://github.com/gtathub/js-soap-client
 * Original work by Matteo Casati (based on v2.4 from 2007-12-21)
 * Improved by Gordon Tschirner (https://github.com/gtathub)
 * Licensed under Creative Commons (by SA) 2.5
 * @class SOAPClient
 * @static
 */
$p.sc = function SOAPClient() {};
(function (sc) {

	/**
	 *
	 * Параметры запроса SOAP
	 * @class SOAPClient.Parameters
	 * @constructor
	 */
	sc.Parameters = function(){
		var _pl = [];

		/**
		 * Добавляет элемент в коллекцию параметров SOAP
		 * @method add
		 * @param name {String}
		 * @param value {Any}
		 * @return {SOAPClient.Parameters}
		 */
		this.add = function (name, value) {
			_pl[name] = value;
			return this;
		};

		/**
		 * Сериализует параметры SOAP в XML
		 * @method toXml
		 * @return {string}
		 */
		this.toXml = function()
		{
			var xml = "";
			for(var p in _pl)
			{
				switch(typeof(_pl[p]))
				{
					case "string":
					case "number":
					case "boolean":
					case "object":
						xml += sc.Parameters._serialize(p, _pl[p]);
						break;
					default:
						break;
				}
			}
			return xml;
		}
	};

	/**
	 * Выполняет SOAP запрос к серверу
	 * @method invoke
	 * @for SOAPClient
	 * @param url {String} - адрес, по которому будет произведен запрос
	 * @param method {String} - метод http (GET, POST)
	 * @param parameters {SOAPClient.Parameters} - параметры запроса SOAP
	 * @param [async=false] {Boolean} - признак асинхронного выполнения запроса
	 * @param [callback] {Function}
	 * @async
	 */
	sc.invoke = function (url, method, parameters) {

		// load from cache?
		var wsdl = _cacheWsdl[url];
		if (typeof wsdl != "undefined" && wsdl != "" && wsdl != "undefined")
			return _sendSoapRequest(url, method, parameters, wsdl);

		// get wsdl
		//_doOpenHeader(xmlHttp, "GET", url + "?wsdl", async);
		//_doOpenHeader(xmlHttp, "GET", "/data/order_dealer.wsdl", async);
		return $p.ajax.get_ex("/data/order_dealer.wsdl").then(function(req) {
			return _onLoadWsdl(url, method, parameters, req);
		});
	};




	sc.Parameters._serialize = function (t, o) {
		var s = "";
		switch (typeof(o)) {
			case "string":
				s += "<" + t + ">";
				s += o.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
				s += "</" + t + ">";
				break;
			case "number":
			case "boolean":
				s += "<" + t + ">";
				s += o.toString();
				s += "</" + t + ">";
				break;
			case "object":
				// Date
				if (o.constructor.toString().indexOf("function Date()") > -1) {

					var year = o.getFullYear().toString();
					var month = (o.getMonth() + 1).toString();
					month = (month.length == 1) ? "0" + month : month;
					var date = o.getDate().toString();
					date = (date.length == 1) ? "0" + date : date;
					var hours = o.getHours().toString();
					hours = (hours.length == 1) ? "0" + hours : hours;
					var minutes = o.getMinutes().toString();
					minutes = (minutes.length == 1) ? "0" + minutes : minutes;
					var seconds = o.getSeconds().toString();
					seconds = (seconds.length == 1) ? "0" + seconds : seconds;
					var milliseconds = o.getMilliseconds().toString();
					var tzminutes = Math.abs(o.getTimezoneOffset());
					var tzhours = 0;
					while (tzminutes >= 60) {
						tzhours++;
						tzminutes -= 60;
					}
					tzminutes = (tzminutes.toString().length == 1) ? "0" + tzminutes.toString() : tzminutes.toString();
					tzhours = (tzhours.toString().length == 1) ? "0" + tzhours.toString() : tzhours.toString();
					var timezone = ((o.getTimezoneOffset() < 0) ? "+" : "-") + tzhours + ":" + tzminutes;
					s += "<" + t + ">";
					s += year + "-" + month + "-" + date + "T" + hours + ":" + minutes + ":" + seconds + "." + milliseconds + timezone;
					s += "</" + t + ">";
				}
				// Array
				else if (o.constructor.toString().indexOf("function Array()") > -1) {

					s += "<" + t + " SOAP-ENC:arrayType=\"SOAP-ENC:Array[" + o.length + "]\" xsi:type=\"SOAP-ENC:Array\">";
					for (var p in o) {
						if (!isNaN(Number(p)))   // linear array
						{
							(/function\s+(\w*)\s*\(/ig).exec(o[p].constructor.toString());
							var type = RegExp.$1;
							//noinspection FallThroughInSwitchStatementJS
							switch (type) {
								case "":
									type = typeof(o[p]);
								case "String":
									type = "string";
									break;
								case "Number":
									type = "int";
									break;
								case "Boolean":
									type = "bool";
									break;
								case "Date":
									type = "DateTime";
									break;
							}
							s += sc.Parameters._serialize("item", o[p]);
						}
						else    // associative array
						{
							sc.Parameters._serialize("item", o[p]);
						}
					}
					s += "</" + t + ">";
				}
				// Object or custom function
				else
					for (var p in o) {
						s += "<" + t + ">";
						s += sc.Parameters._serialize(p, o[p]);
						s += "</" + t + ">";
					}
				break;
			default:
				break; // throw new Error(500, "SOAPClient.Parameters: type '" + typeof(o) + "' is not supported");
		}
		return s;
	};

	sc.toString = function(){return "Javascript SOAP Client"};


	var _cacheWsdl = [],

		_onLoadWsdl = function (url, method, parameters, req) {
			var wsdl = req.responseXML;
			if(!wsdl && req.status == 200 && req.responseText)
				wsdl = (new DOMParser()).parseFromString(req.responseText, "text/xml");
			if(wsdl){
				_cacheWsdl[url] = wsdl;	// save a copy in cache
				return _sendSoapRequest(url, method, parameters, wsdl);
			} else
				throw "Empty response from " + url;
		},

		_sendSoapRequest = function (url, method, parameters, wsdl) {
			// get namespace
			var ns = (typeof wsdl.documentElement.attributes["targetNamespace"] == "undefined") ? wsdl.documentElement.attributes.getNamedItem("targetNamespace").nodeValue : wsdl.documentElement.attributes["targetNamespace"].value;
			// build SOAP request
			var sr =
				"<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
				"<soap:Envelope " +
				"xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" " +
				"xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" " +
				"xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">" +
				"<soap:Body>" +
				"<" + method + " xmlns=\"" + ns + "\">" +
				parameters.toXml() +
				"</" + method + "></soap:Body></soap:Envelope>";
			// send request
			return $p.ajax.post_ex(url, sr, true, function (req) {
				req.setRequestHeader("SOAPAction", ((ns.lastIndexOf("/") != ns.length - 1) ? ns + "/" : ns) + method);
			}).then(function(req) {
				return _onSendSoapRequest(method, wsdl, req);

			});
		},

		_onSendSoapRequest = function (method, wsdl, req) {
			var o = null;
			var nd = _getElementsByTagName(req.responseXML, "return");
			if (nd.length == 0)
				nd = _getElementsByTagName(req.responseXML, "m:return");            // IE|FF
			if (nd.length == 0)
				nd = _getElementsByTagName(req.responseXML, method + "Response");	// PHP web Service?
			if (nd.length == 0)
				nd = _getElementsByTagName(req.responseXML, method + "Result");     // new PHP web Service?
			if (nd.length == 0 && req.responseXML.getElementsByTagName("faultcode").length > 0) {
				throw new Error(500, req.responseXML.getElementsByTagName("faultstring")[0].childNodes[0].nodeValue);
			}
			sc.authorized = true;
			return _soapresult2object(nd[0], wsdl);
		},

		_soapresult2object = function (node, wsdl) {
			var wsdlTypes = _getTypesFromWsdl(wsdl);
			return _node2object(node, wsdlTypes);
		},

		_node2object = function (node, wsdlTypes) {
			// null node
			if (node == null)
				return null;
			// text node
			if (node.nodeType == 3 || node.nodeType == 4)
				return _extractValue(node, wsdlTypes);
			// leaf node
			if (node.childNodes.length == 1 && (node.childNodes[0].nodeType == 3 || node.childNodes[0].nodeType == 4))
				return _node2object(node.childNodes[0], wsdlTypes);
			if (node.childNodes[0].nodeType == 3 || node.childNodes[0].nodeType == 4){
				var res = "";
				for(var i=0; i <node.childNodes.length; i++)
					res += node.childNodes[i].nodeValue;
				return res;
			}
			// затычка для текстовых ответов
			return node.innerHTML;


			var isArray = false;
			var tmpNodeNameObject = {};
			for (var i = 0; !isArray && i < node.childNodes.length; i++) {
				if (typeof tmpNodeNameObject[node.childNodes[i].nodeName] == "undefined")
					tmpNodeNameObject[node.childNodes[i].nodeName] = true;
				else isArray = true;

			}
			var isarray = isArray || _getTypeFromWsdl(node.nodeName, wsdlTypes).toLowerCase().indexOf("arrayof") != -1;
			// object node
			if (!isarray) {
				var obj = null;
				if (node.hasChildNodes())
					obj = {};
				for (var i = 0; i < node.childNodes.length; i++) {
					obj[node.childNodes[i].nodeName] = _node2object(node.childNodes[i], wsdlTypes);
				}
				return obj;
			}
			// list node
			else {
				// create node ref
				var l = [];
				for (var i = 0; i < node.childNodes.length; i++)
					l[l.length] = _node2object(node.childNodes[i], wsdlTypes);
				return l;
			}
		},

		_extractValue = function (node, wsdlTypes) {
			var value = node.nodeValue;
			switch (_getTypeFromWsdl(node.parentNode.nodeName, wsdlTypes).toLowerCase()) {
				default:
				case "s:string":
					return (value != null) ? value + "" : "";
				case "s:boolean":
					return value + "" == "true";
				case "s:int":
				case "s:long":
					return (value != null) ? parseInt(value + "", 10) : 0;
				case "s:double":
					return (value != null) ? parseFloat(value + "") : 0;
				case "s:datetime":
					if (value == null)
						return null;
					else {
						value = value + "";
						value = value.substring(0, (value.lastIndexOf(".") == -1 ? value.length : value.lastIndexOf(".")));
						value = value.replace(/T/gi, " ");
						value = value.replace(/-/gi, "/");
						var d = new Date();
						d.setTime(Date.parse(value));
						return d;
					}
			}
		},

		_getTypesFromWsdl = function (wsdl) {
			var wsdlTypes = [];
			// IE
			var ell = wsdl.getElementsByTagName("s:element");
			var useNamedItem = true;
			// MOZ
			if (ell.length == 0) {
				ell = wsdl.getElementsByTagName("element");
				useNamedItem = false;
			}
			for (var i = 0; i < ell.length; i++) {
				if (useNamedItem) {
					if (ell[i].attributes.getNamedItem("name") != null && ell[i].attributes.getNamedItem("type") != null)
						wsdlTypes[ell[i].attributes.getNamedItem("name").nodeValue] = ell[i].attributes.getNamedItem("type").nodeValue;
				}
				else {
					if (ell[i].attributes["name"] != null && ell[i].attributes["type"] != null)
						wsdlTypes[ell[i].attributes["name"].value] = ell[i].attributes["type"].value;
				}
			}
			return wsdlTypes;
		},

		_getTypeFromWsdl = function (elementname, wsdlTypes) {
			var type = wsdlTypes[elementname] + "";
			return (type == "undefined") ? "" : type;
		},

		_getElementsByTagName = function (document, tagName) {
			return document.getElementsByTagName(tagName);
		};


})($p.sc);
