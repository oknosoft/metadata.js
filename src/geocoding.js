/**
 * Объекты для доступа к геокодерам Яндекс, Google и sypexgeo<br />
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016<br />
 * Created 16.04.2016
 *
 * @module geocoding
 */

/**
 * ### Данные геолокации
 * Объект предоставляет доступ к функциям _геокодирования браузера_, а так же - геокодерам _Яндекс_ и _Гугл_
 *
 * @class IPInfo
 * @static
 * @menuorder 60
 * @tooltip Данные геолокации
 */
function IPInfo(){

	var _yageocoder,
		_ggeocoder,
		_ipgeo,
		_addr = "",
		_parts;

	/**
	 * Геокодер карт Яндекс
	 * @class YaGeocoder
	 * @static
	 */
	function YaGeocoder(){

		/**
		 * Выполняет прямое или обратное геокодирование
		 * @method geocode
		 * @param attr {Object}
		 * @return {Promise.<T>}
		 */
		this.geocode = function (attr) {
			//http://geocode-maps.yandex.ru/1.x/?geocode=%D0%A7%D0%B5%D0%BB%D1%8F%D0%B1%D0%B8%D0%BD%D1%81%D0%BA,+%D0%9F%D0%BB%D0%B5%D1%85%D0%B0%D0%BD%D0%BE%D0%B2%D0%B0+%D1%83%D0%BB%D0%B8%D1%86%D0%B0,+%D0%B4%D0%BE%D0%BC+32&format=json&sco=latlong
			//http://geocode-maps.yandex.ru/1.x/?geocode=61.4080273,55.1550362&format=json&lang=ru_RU

			return Promise.resolve(false);
		}
	}



	this.__define({

		ipgeo: {
			value: function () {
				return $p.ajax.get("//api.sypexgeo.net/")
					.then(function (req) {
						return JSON.parse(req.response);
					})
					.catch($p.record_log);
			}
		},

		/**
		 * Объект [геокодера yandex](https://tech.yandex.ru/maps/doc/geocoder/desc/concepts/input_params-docpage/)
		 * @property yageocoder
		 * @for IPInfo
		 * @type YaGeocoder
		 */
		yageocoder: {
			get : function(){

				if(!_yageocoder)
					_yageocoder = new YaGeocoder();
				return _yageocoder;
			},
			enumerable : false,
			configurable : false
		},

		/**
		 * Объект [геокодера google](https://developers.google.com/maps/documentation/geocoding/?hl=ru#GeocodingRequests)
		 * @property ggeocoder
		 * @for IPInfo
		 * @type {google.maps.Geocoder}
		 */
		ggeocoder: {
			get : function(){
				return _ggeocoder;
			},
			enumerable : false,
			configurable : false
		},

		/**
		 * Адрес геолокации пользователя программы
		 * @property addr
		 * @for IPInfo
		 * @type String
		 */
		addr: {
			get : function(){
				return _addr;
			}
		},

		parts: {
			get : function(){
				return _parts;
			}
		},

		/**
		 * Выполняет синтаксический разбор частей адреса
		 */
		components: {
			value : function(v, components){
				var i, c, j, street = "", street0 = "", locality = "";
				for(i in components){
					c = components[i];
					//street_number,route,locality,administrative_area_level_2,administrative_area_level_1,country,sublocality_level_1
					for(j in c.types){
						switch(c.types[j]){
							case "route":
								if(c.short_name.indexOf("Unnamed")==-1){
									street = c.short_name + (street ? (" " + street) : "");
									street0 = c.long_name.replace("улица", "").trim();
								}
								break;
							case "administrative_area_level_1":
								v.region = c.long_name;
								break;
							case "administrative_area_level_2":
								v.city = c.short_name;
								v.city_long = c.long_name;
								break;
							case "locality":
								locality = (locality ? (locality + " ") : "") + c.short_name;
								break;
							case "street_number":
                v.house = "дом " + c.short_name;
								break;
							case "postal_code":
								v.postal_code = c.short_name;
								break;
							default:
								break;
						}
					}
				}
				if(v.region && v.region == v.city_long)
					if(v.city.indexOf(locality) == -1)
						v.city = locality;
					else
						v.city = "";
				else if(locality){
					if(v.city.indexOf(locality) == -1 && v.region.indexOf(locality) == -1)
						street = locality + ", " + street;
				}

				// если в адресе есть подстрока - не переписываем
				if(!v.street || v.street.indexOf(street0)==-1)
					v.street = street;

				return v;
			}
		},

		/**
		 * Функция обратного вызова для карт Google
		 */
		location_callback: {
			value: function(){

				_ggeocoder = new google.maps.Geocoder();

				$p.eve.callEvent("geo_google_ready");

				if(navigator.geolocation)
					navigator.geolocation.getCurrentPosition(function(position){

						/**
						 * Географическая широта геолокации пользователя программы
						 * @property latitude
						 * @for IPInfo
						 * @type Number
						 */
						$p.ipinfo.latitude = position.coords.latitude;

						/**
						 * Географическая долгота геолокации пользователя программы
						 * @property longitude
						 * @for IPInfo
						 * @type Number
						 */
						$p.ipinfo.longitude = position.coords.longitude;

						var latlng = new google.maps.LatLng($p.ipinfo.latitude, $p.ipinfo.longitude);

						_ggeocoder.geocode({'latLng': latlng}, function(results, status) {
							if (status == google.maps.GeocoderStatus.OK){
								if(!results[1] || results[0].address_components.length >= results[1].address_components.length)
									_parts = results[0];
								else
									_parts = results[1];
								_addr = _parts.formatted_address;

								$p.eve.callEvent("geo_current_position", [$p.ipinfo.components({}, _parts.address_components)]);
							}
						});

					}, $p.record_log, {
						timeout: 30000
					}
				);
			}
		}
	});

}
