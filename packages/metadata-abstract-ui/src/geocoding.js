/**
 * Объекты для доступа к геокодерам Яндекс, Google и sypexgeo<br />
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016<br />
 * Created 16.04.2016
 *
 * @module geocoding
 */

/**
 * Геокодер карт Яндекс
 * @class YaGeocoder
 * @static
 */
class YaGeocoder {

  /**
   * Выполняет прямое или обратное геокодирование
   * @method geocode
   * @param attr {Object}
   * @return {Promise.<T>}
   */
  geocode(attr) {
    //http://geocode-maps.yandex.ru/1.x/?geocode=%D0%A7%D0%B5%D0%BB%D1%8F%D0%B1%D0%B8%D0%BD%D1%81%D0%BA,+%D0%9F%D0%BB%D0%B5%D1%85%D0%B0%D0%BD%D0%BE%D0%B2%D0%B0+%D1%83%D0%BB%D0%B8%D1%86%D0%B0,+%D0%B4%D0%BE%D0%BC+32&format=json&sco=latlong
    //http://geocode-maps.yandex.ru/1.x/?geocode=61.4080273,55.1550362&format=json&lang=ru_RU

    return Promise.resolve(false);
  }

}

export default function ipinfo() {
  const {classes, md, msg, record_log, utils, job_prm} = this;

  /**
   * ### Данные геолокации
   * Объект предоставляет доступ к функциям _геокодирования браузера_, а так же - геокодерам _Яндекс_ и _Гугл_
   *
   * @class IPInfo
   * @static
   * @menuorder 60
   * @tooltip Данные геолокации
   */
  class IPInfo{

    constructor() {
      this._yageocoder = null;
      this._ggeocoder = null;
      this._parts = null;
      this._addr = '';
      this._pos = 0;

      // подгружаем скрипты google
      if (job_prm.use_google_geo && typeof window !== 'undefined') {
        if (!window.google || !window.google.maps) {
          utils.load_script(`https://maps.google.com/maps/api/js?key=${job_prm.use_google_geo}&callback=$p.ipinfo.location_callback`, 'script');
        }
        else {
          this.location_callback();
        }
      }
    }

    ipgeo() {
      return fetch('//api.sypexgeo.net/')
        .then(response => response.json())
        .catch(record_log);
    }

    /**
     * Объект [геокодера yandex](https://tech.yandex.ru/maps/doc/geocoder/desc/concepts/input_params-docpage/)
     * @property yageocoder
     * @for IPInfo
     * @type YaGeocoder
     */
    get yageocoder() {
      if(!this._yageocoder){
        this._yageocoder = new YaGeocoder();
      }
      return _yageocoder;
    }

    /**
     * Объект [геокодера google](https://developers.google.com/maps/documentation/geocoding/?hl=ru#GeocodingRequests)
     * @property ggeocoder
     * @for IPInfo
     * @type {google.maps.Geocoder}
     */
    get ggeocoder(){
      return this._ggeocoder;
    }

    /**
     * Адрес геолокации пользователя программы
     * @property addr
     * @for IPInfo
     * @type String
     */
    get addr() {
      return this._addr;
    }

    get parts() {
      return this._parts;
    }

    /**
     * Выполняет синтаксический разбор частей адреса
     */
    components(v, components) {
      if(!v) v = {};
      if(!components) components = this._parts.address_components;
      let i, c, j, street = "", street0 = "", locality = "";
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
            v.locality = c.short_name;
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

    /**
     * Функция обратного вызова для карт Google
     */
    location_callback() {
      this._ggeocoder = new google.maps.Geocoder();
      md.emit('geo_google_ready');
      this.crrent_pos_ready();
    }

    crrent_pos_ready() {
      return new Promise((resolve, reject) => {
        if(this._pos === 2) {
          resolve();
        }
        else if(this._pos === 1) {
          const timer = setTimeout(() => {
            if(this._pos === 2) {
              resolve();
            }
            else {
              reject();
            }
          }, 10000);
          md.once('geo_current_position', () => {
            clearTimeout(timer);
            resolve();
          });
        }
        else {
          if(!navigator.geolocation){
            return reject();
          }
          this._pos = 1;
          navigator.geolocation.getCurrentPosition(
            (position) => {

              /**
               * Географическая широта геолокации пользователя программы
               * @property latitude
               * @for IPInfo
               * @type Number
               */
              this.latitude = position.coords.latitude;

              /**
               * Географическая долгота геолокации пользователя программы
               * @property longitude
               * @for IPInfo
               * @type Number
               */
              this.longitude = position.coords.longitude;

              const latlng = new google.maps.LatLng(this.latitude, this.longitude);

              this._ggeocoder.geocode({'latLng': latlng}, (results, status) => {
                if (status == google.maps.GeocoderStatus.OK){
                  this._pos = 2;
                  if(!results[1] || results[0].address_components.length >= results[1].address_components.length) {
                    this._parts = results[0];
                  }
                  else {
                    this._parts = results[1];
                  }
                  this._addr = this._parts.formatted_address;

                  md.emit('geo_current_position', this.components());
                }
              });

            },
            (err) => {
              reject(err)
            },
            {
              enableHighAccuracy: true,
              maximumAge: 300000,
              timeout: 20000,
            }
          );
        }
      });
    }

    /**
     * Promise ожидает готовности google
     * @return {Promise<any>}
     */
    google_ready() {
      return new Promise((resolve, reject) => {
        if(this._ggeocoder) {
          return resolve();
        }
        // Если Google не ответил - информируем об ошибке и продолжаем
        setTimeout(() => {
          if(this._ggeocoder){
            return resolve();
          }
          msg.show_msg({
            type: "alert-warning",
            text: msg.error_geocoding + " Google",
            title: msg.main_title
          });

          reject();

        }, 10000);
      });

    }
  }

	classes.IPInfo = IPInfo;
};
