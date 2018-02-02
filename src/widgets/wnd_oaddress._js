/**
 * Поле ввода адреса связанная с ним форма ввода адреса
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 *
 * @module  wnd_oaddress
 */

if(typeof window !== "undefined" && "dhtmlx" in window){

	/**
	 *  Конструктор поля ввода адреса
	 */
	function eXcell_addr(cell){

		if (!cell)
			return;

		var t = this, td,

			ti_keydown=function(e){
				return eXcell_proto.input_keydown(e, t);
			},

			open_selection=function(e) {
				var source = {grid: t.grid}._mixin(t.grid.get_cell_field());
				wnd_address(source);
				return $p.iface.cancel_bubble(e);
			};

		t.cell = cell;
		t.grid = t.cell.parentNode.grid;
		t.open_selection = open_selection;

		/**
		 * Устанавливает текст в ячейке. например, this.setCValue("<input type='button' value='"+val+"'>",val);
		 */
		t.setValue=function(val){ t.setCValue(val); };

		/**
		 * Получает значение ячейки из табличной части или поля объекта или допполя допобъекта, а не из грида
		 */
		t.getValue=function(){
			return t.grid.get_cell_value();
		};

		/**
		 * Создаёт элементы управления редактора и назначает им обработчики
		 */
		t.edit=function(){
			var ti;
			t.val = t.getValue();		//save current value
			t.cell.innerHTML = '<div class="ref_div21"><input type="text" class="dhx_combo_edit" style="height: 20px;"><div class="ref_field21">&nbsp;</div></div>';

			td = t.cell.firstChild;
			ti = td.childNodes[0];
			ti.value=t.val;
			ti.onclick=$p.iface.cancel_bubble;		//blocks onclick event
			ti.readOnly = true;
			ti.focus();
			ti.onkeydown=ti_keydown;
			td.childNodes[1].onclick=open_selection;
		};

		/**
		 * Вызывается при отключении редактора
		 */
		t.detach=function(){
			t.setValue(t.getValue());
			return !$p.utils.is_equal(t.val, t.getValue());				// compares the new and the old values
		}
	}
	eXcell_addr.prototype = eXcell_proto;
	window.eXcell_addr = eXcell_addr;

	function wnd_address(source){

		var wnd,		// окно формы
			obj = source.obj,
			pwnd = source.pwnd,
			_delivery_area = obj.delivery_area,
			v = {		// реквизиты формы
				coordinates: obj.coordinates ? JSON.parse(obj.coordinates) : [],
				country: "Россия",
				region: "",
				city: "",
				street:	"",
				postal_code: "",
				marker: {}
			};
		v.__define("delivery_area", {
			get: function () {
				return _delivery_area;
			},
			set: function (selv) {
				pgrid_on_select(selv);

			}
		});

		process_address_fields().then(frm_create);


		/**
		 * ПриСозданииНаСервере
		 */
		function frm_create(){

			// параметры открытия формы
			var options = {
				name: 'wnd_addr',
				wnd: {
					id: 'wnd_addr',
					top: 130,
					left: 200,
					width: 800,
					height: 560,
					modal: true,
					center: true,
					pwnd: pwnd,
					allow_close: true,
					allow_minmax: true,
					on_close: frm_close,
					caption: obj.shipping_address || 'Адрес доставки'
				}
			};

			// уменьшаем высоту, в случае малого фрейма
			if(pwnd && pwnd.getHeight){
				if(options.wnd.height > pwnd.getHeight())
					options.wnd.height = pwnd.getHeight();
			}

			wnd = $p.iface.dat_blank(null, options.wnd);

			//TODO: компактная кнопка выбора в заголовке формы
			// wnd.cell.parentElement.querySelector(".dhxwin_text")

			wnd.elmnts.layout = wnd.attachLayout('2E');
			wnd.elmnts.cell_frm = wnd.elmnts.layout.cells('a');
			wnd.elmnts.cell_frm.setHeight('110');
			wnd.elmnts.cell_frm.hideHeader();
			wnd.elmnts.cell_frm.fixSize(0,1);

			// TODO: переделать на OHeadFields
			wnd.elmnts.pgrid = wnd.elmnts.cell_frm.attachPropertyGrid();
			wnd.elmnts.pgrid.setDateFormat("%d.%m.%Y %H:%i");
			wnd.elmnts.pgrid.init();
			wnd.elmnts.pgrid.parse(obj._manager.get_property_grid_xml({
				" ": [
					{id: "delivery_area", path: "o.delivery_area", synonym: "Район доставки", type: "ref", txt: v.delivery_area.presentation},
					{id: "region", path: "o.region", synonym: "Регион", type: "ro", txt: v.region},
					{id: "city", path: "o.city", synonym: "Населенный пункт", type: "ed", txt: v.city},
					{id: "street", path: "o.street", synonym: "Улица, дом, корп., лит., кварт.", type: "ed", txt: v.street}
				]
			}, v), function(){
				wnd.elmnts.pgrid.enableAutoHeight(true);
				wnd.elmnts.pgrid.setInitWidthsP("40,60");
				wnd.elmnts.pgrid.setSizes();
				wnd.elmnts.pgrid.attachEvent("onPropertyChanged", pgrid_on_changed );

			}, "xml");
			wnd.elmnts.pgrid.get_cell_field = function () {
				return {
					obj: v,
					field: "delivery_area",
					on_select: pgrid_on_select,
					pwnd: wnd,
					metadata: {
						"synonym": "Район",
						"tooltip": "Район (зона, направление) доставки для группировки при планировании и оптимизации маршрута геокодером",
						"choice_groups_elm": "elm",
						"type": {
							"types": [
								"cat.delivery_areas"
							],
							"is_ref": true
						}
					}};
			};

			wnd.elmnts.toolbar = wnd.attachToolbar({
				icons_path: dhtmlx.image_path + 'dhxtoolbar' + dhtmlx.skin_suffix()
			});
			wnd.elmnts.toolbar.loadStruct('<toolbar><item id="btn_select" type="button" title="Установить адрес" text="&lt;b&gt;Выбрать&lt;/b&gt;" /></toolbar>',
				function(){
					this.attachEvent("onclick", toolbar_click);
				});


			wnd.elmnts.cell_map = wnd.elmnts.layout.cells('b');
			wnd.elmnts.cell_map.hideHeader();

			// если координаты есть в Расчете, используем их
			// если есть строка адреса, пытаемся геокодировать
			// если есть координаты $p.ipinfo, используем их
			// иначе - Москва
			var mapParams = {
				center: new google.maps.LatLng(v.latitude, v.longitude),
				zoom: v.street ? 15 : 12,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			wnd.elmnts.map = wnd.elmnts.cell_map.attachMap(mapParams);

			v.marker = new google.maps.Marker({
				map: wnd.elmnts.map,
				draggable: true,
				animation: google.maps.Animation.DROP,
				position: mapParams.center
			});
			google.maps.event.addListener(v.marker, 'click', marker_toggle_bounce);
			google.maps.event.addListener(v.marker, 'dragend', marker_dragend);

			refresh_grid();
		}

		/**
		 *	@desc: 	обработчик команд формы
		 *	@type:	private
		 *	@topic: 0
		 */
		function toolbar_click(btn_id){
			if(btn_id=="btn_select"){					// выполнить команду редактора построителя

				obj.delivery_area = v.delivery_area;

				assemble_address_fields();

				obj.coordinates = JSON.stringify([v.latitude, v.longitude]);

			}
			wnd.close();
		}

		/**
		 *	Обработчик выбора значения в свойствах (ссылочные типы)
		 */
		function pgrid_on_select(selv){

			if(selv===undefined)
				return;

			var old = _delivery_area, clear_street;

			if($p.utils.is_data_obj(selv))
				_delivery_area = selv;
			else
				_delivery_area = $p.cat.delivery_areas.get(selv, false);

			clear_street = old != _delivery_area;

			if(!$p.utils.is_data_obj(_delivery_area))
				_delivery_area = $p.cat.delivery_areas.get();

			wnd.elmnts.pgrid.cells().setValue(selv.presentation);
			delivery_area_changed(clear_street);
		}

		function delivery_area_changed(clear_street){
			// получим город и район из "района доставки"
			if(!v.delivery_area.empty() && clear_street )
				v.street = "";

			if(v.delivery_area.region){
				v.region = v.delivery_area.region;
				wnd.elmnts.pgrid.cells("region", 1).setValue(v.region);

			}else if(clear_street)
				v.region = "";

			if(v.delivery_area.city){
				v.city = v.delivery_area.city;
				wnd.elmnts.pgrid.cells("city", 1).setValue(v.city);

			}else if(clear_street)
				v.city = "";

			if(v.delivery_area.latitude && v.delivery_area.longitude){
				var LatLng = new google.maps.LatLng(v.delivery_area.latitude, v.delivery_area.longitude);
				wnd.elmnts.map.setCenter(LatLng);
				v.marker.setPosition(LatLng);
			}

			refresh_grid();
		}

		function refresh_grid(){
			wnd.elmnts.pgrid.cells("region", 1).setValue(v.region);
			wnd.elmnts.pgrid.cells("city", 1).setValue(v.city);
			wnd.elmnts.pgrid.cells("street", 1).setValue(v.street);
		}

		function addr_changed() {
			var zoom = v.street ? 15 : 12;

			if(wnd.elmnts.map.getZoom() != zoom)
				wnd.elmnts.map.setZoom(zoom);

			do_geocoding(function (results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					var loc = results[0].geometry.location;
					wnd.elmnts.map.setCenter(loc);
					v.marker.setPosition(loc);
					v.latitude = loc.lat();
					v.longitude = loc.lng();

					v.postal_code = $p.ipinfo.components({}, results[0].address_components).postal_code || "";
				}
			});
		}

		function assemble_addr(){
			return (v.street ? (v.street.replace(/,/g," ") + ", ") : "") +
				(v.city ? (v.city + ", ") : "") +
				(v.region ? (v.region + ", ") : "") + v.country +
				(v.postal_code ? (", " + v.postal_code) : "");
		}

		function assemble_address_fields(){

			obj.shipping_address = assemble_addr();

			var fields = '<КонтактнаяИнформация  \
				xmlns="http://www.v8.1c.ru/ssl/contactinfo" \
				xmlns:xs="http://www.w3.org/2001/XMLSchema" \
				xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"   \
				Представление="%1">   \
					<Комментарий/>  \
					<Состав xsi:type="Адрес" Страна="РОССИЯ">   \
						<Состав xsi:type="АдресРФ">'.replace('%1', obj.shipping_address);

			if(v.region)
				fields += '\n<СубъектРФ>' + v.region + '</СубъектРФ>';

			if(v.city){
				if(v.city.indexOf('г.') != -1 || v.city.indexOf('г ') != -1 || v.city.indexOf(' г') != -1)
					fields += '\n<Город>' + v.city + '</Город>';
				else
					fields += '\n<НаселПункт>' + v.city + '</НаселПункт>';
			}

			if(v.street){
				var street = (v.street.replace(/,/g," ")),
					suffix, index, house, bld, house_type, flat_type, bld_type;

				// отделяем улицу от дома, корпуса и квартиры
				for(var i in $p.fias){
					if($p.fias[i].type == 1){
						for(var j in $p.fias[i].syn){
							if((index = street.indexOf($p.fias[i].syn[j])) != -1){
								house_type = i;
								suffix = street.substr(index + $p.fias[i].syn[j].length).trim();
								street = street.substr(0, index).trim();
								break;
							}
						}
					}
					if(house_type)
						break;
				}
				if(!house_type){
					house_type = "1010";
					if((index = street.indexOf(" ")) != -1){
						suffix = street.substr(index);
						street = street.substr(0, index);
					}
				}
				fields += '\n<Улица>' + street.trim() + '</Улица>';

				// отделяем корпус и квартиру от дома
				if(suffix){

					house = suffix.toLowerCase();
					suffix = "";

					for(var i in $p.fias){
						if($p.fias[i].type == 3){
							for(var j in $p.fias[i].syn){
								if((index = house.indexOf($p.fias[i].syn[j])) != -1){
									flat_type = i;
									suffix = house.substr(index + $p.fias[i].syn[j].length);
									house = house.substr(0, index);
									break;
								}
							}
						}
						if(flat_type)
							break;
					}

					if(!flat_type){
						flat_type = "2010";
						if((index = house.indexOf(" ")) != -1){
							suffix = house.substr(index);
							house = house.substr(0, index);
						}
					}

					fields += '\n<ДопАдрЭл><Номер Тип="' + house_type +  '" Значение="' + house.trim() + '"/></ДопАдрЭл>';

				}

				if(suffix)
					fields += '\n<ДопАдрЭл><Номер Тип="' + flat_type +  '" Значение="' + suffix.trim() + '"/></ДопАдрЭл>';

			}

			if(v.postal_code)
				fields += '<ДопАдрЭл ТипАдрЭл="10100000" Значение="' + v.postal_code + '"/>';

			fields += '</Состав> \
					</Состав></КонтактнаяИнформация>';

			obj.address_fields = fields;
		}

		function process_address_fields(){

			if(obj.address_fields){
				v.xml = ( new DOMParser() ).parseFromString(obj.address_fields, "text/xml");
				var tmp = {}, res = {"building_room": ""}, tattr, building_room = [],
					nss = "СубъектРФ,Округ,СвРайМО,СвРайМО,ВнутригРайон,НаселПункт,Улица,Город,ДопАдрЭл,Адрес_по_документу,Местоположение".split(",");

				function get_aatributes(ca){
					if(ca.attributes && ca.attributes.length == 2){
						var res = {};
						res[ca.attributes[0].value] = ca.attributes[1].value;
						return res;
					}
				}

				for(var i in nss){
					tmp[nss[i]] = v.xml.getElementsByTagName(nss[i]);
				}
				for(var i in tmp){
					for(var j in tmp[i]){
						if(j == "length" || !tmp[i].hasOwnProperty(j))
							continue;
						if(tattr = get_aatributes(tmp[i][j])){
							if(!res[i])
								res[i] = [];
							res[i].push(tattr);
						}else if(tmp[i][j].childNodes.length){
							for(var k in tmp[i][j].childNodes){
								if(k == "length" || !tmp[i][j].childNodes.hasOwnProperty(k))
									continue;
								if(tattr = get_aatributes(tmp[i][j].childNodes[k])){
									if(!res[i])
										res[i] = [];
									res[i].push(tattr);
								}else if(tmp[i][j].childNodes[k].nodeValue){
									if(!res[i])
										res[i] = tmp[i][j].childNodes[k].nodeValue;
									else
										res[i] += " " + tmp[i][j].childNodes[k].nodeValue;
								}
							}
						}
					}
				}
				for(var i in res["ДопАдрЭл"]){

					for(var j in $p.fias){
						if(j.length != 4)
							continue;
						if(res["ДопАдрЭл"][i][j])
							building_room[$p.fias[j].type] = $p.fias[j].name + " " + res["ДопАдрЭл"][i][j];
					}

					if(res["ДопАдрЭл"][i]["10100000"])
						v.postal_code = res["ДопАдрЭл"][i]["10100000"];
				}

				v.address_fields = res;

				//
				v.region = res["СубъектРФ"] || res["Округ"] || "";
				v.city = res["Город"] || res["НаселПункт"] || "";
				v.street = (res["Улица"] || "");
				for(var i in building_room){
					v.street+= " " + building_room[i];
				}
			}

			return new Promise(function(resolve, reject){

				if(!$p.ipinfo)
					$p.ipinfo = new IPInfo();

				if(window.google && window.google.maps)
					resolve();
				else{
					$p.load_script("//maps.google.com/maps/api/js?callback=$p.ipinfo.location_callback", "script", function(){});

					var google_ready = $p.eve.attachEvent("geo_google_ready", function () {

						if(watch_dog)
							clearTimeout(watch_dog);

						if(google_ready){
							$p.eve.detachEvent(google_ready);
							google_ready = null;
							resolve();
						}
					});

					// Если Google не ответил - информируем об ошибке и продолжаем
					var watch_dog = setTimeout(function () {

						if(google_ready){
							$p.eve.detachEvent(google_ready);
							google_ready = null;
						}
						$p.msg.show_msg({
							type: "alert-warning",
							text: $p.msg.error_geocoding + " Google",
							title: $p.msg.main_title
						});

						resolve();

					}, 10000);
				}

			})
				.then(function () {

					// если есть координаты $p.ipinfo, используем их
					// иначе - Москва
					if(v.coordinates.length){
						// если координаты есть в Расчете, используем их
						v.latitude = v.coordinates[0];
						v.longitude = v.coordinates[1];

					}else if(obj.shipping_address){
						// если есть строка адреса, пытаемся геокодировать
						do_geocoding(function (results, status) {
							if (status == google.maps.GeocoderStatus.OK) {
								v.latitude = results[0].geometry.location.lat();
								v.longitude = results[0].geometry.location.lng();
							}
						});

					}else if($p.ipinfo.latitude && $p.ipinfo.longitude ){
						v.latitude = $p.ipinfo.latitude;
						v.longitude = $p.ipinfo.longitude;

					}else{
						v.latitude = 55.635924;
						v.longitude = 37.6066379;
						$p.msg.show_msg($p.msg.empty_geocoding);
					}

				});

		}

		function do_geocoding(callback){
			var address = assemble_addr();

			$p.ipinfo.ggeocoder.geocode({ 'address': address}, callback);
		}

		function marker_toggle_bounce() {

			if (v.marker.getAnimation() != null) {
				v.marker.setAnimation(null);
			} else {
				v.marker.setAnimation(google.maps.Animation.BOUNCE);
				setTimeout(function(){v.marker.setAnimation(null)}, 1500);
			}
		}

		function marker_dragend(e) {
			$p.ipinfo.ggeocoder.geocode({'latLng': e.latLng}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					if (results[0]) {
						var addr = results[0];

						wnd.setText(addr.formatted_address);
						$p.ipinfo.components(v, addr.address_components);

						refresh_grid();

						var zoom = v.street ? 15 : 12;
						if(wnd.elmnts.map.getZoom() != zoom){
							wnd.elmnts.map.setZoom(zoom);
							wnd.elmnts.map.setCenter(e.latLng);
						}

						v.latitude = e.latLng.lat();
						v.longitude = e.latLng.lng();
					}
				}
			});
		}

		function pgrid_on_changed(pname, new_value, old_value){
      pname = wnd.elmnts.pgrid.getSelectedRowId();
			if(pname){
				if(v.delivery_area.empty()){
					new_value = old_value;
					$p.msg.show_msg({
						type: "alert",
						text: $p.msg.delivery_area_empty,
						title: $p.msg.addr_title});
					setTimeout(function(){
						wnd.elmnts.pgrid.selectRowById("delivery_area");
					}, 50);

				} else if(pname == "delivery_area")
					pgrid_on_select(new_value);
				else{
					v[pname] = new_value;
					addr_changed();
				}
			}
		}

		function frm_close(win){
			source.grid.editStop();
			return !win.error;
		}

		return wnd;

	}

}