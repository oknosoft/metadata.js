/**
 * Поле ввода адреса связанная с ним форма ввода адреса
 * <br />&copy; http://www.oknosoft.ru 2009-2015
 * @module  wnd_address
 */


/**
 *  Конструктор поля ввода адреса
 */
function eXcell_addr(cell){

	if (!cell) return;

	var t = this, td,

		ti_keydown=function(e){
			return input_keydown(e, t);
		},

		open_selection=function(e) {
			wnd_address(t.source);
			return $p.cancel_bubble(e);
		};

	t.cell = cell;
	t.grid = t.cell.parentNode.grid;
	t.open_selection = open_selection;

	/**
	 * @desc: 	устанавливает текст в ячейке. например, this.setCValue("<input type='button' value='"+val+"'>",val);
	 */
	t.setValue=function(val){ t.setCValue(val); };

	/**
	 * @desc: 	получает значение ячейки из табличной части или поля объекта или допполя допобъекта, а не из грида
	 */
	t.getValue=function(){
		if(t.source = t.grid.getUserData("", "source")){
			return t.source.o["shipping_address"];
		}
	};

	/**
	 * @desc: 	создаёт элементы управления редактора и назначает им обработчики
	 */
	t.edit=function(){
		var ti;
		t.val = t.getValue();		//save current value
		if(t.source.tabular_section){
			t.cell.innerHTML = '<div class="ref_div23"><input type="text" class="dhx_combo_edit" style="height: 22px;"><div class="ref_field23">&nbsp;</div></div>';
		}else{
			t.cell.innerHTML = '<div class="ref_div21"><input type="text" class="dhx_combo_edit" style="height: 20px;"><div class="ref_field21">&nbsp;</div></div>';
		}

		td = t.cell.firstChild;
		ti = td.childNodes[0];
		ti.value=t.val;
		ti.onclick=$p.cancel_bubble;		//blocks onclick event
		ti.readOnly = true;
		ti.focus();
		ti.onkeydown=ti_keydown;
		td.childNodes[1].onclick=open_selection;
	};

	/**
	 * @desc: 	вызывается при отключении редактора
	 */
	t.detach=function(){
		if(t.cell.firstChild && t.cell.firstChild.childNodes[0] && t.cell.firstChild.childNodes[0].length)
			t.setValue(t.cell.firstChild.childNodes[0].value);	//sets the new value
		return !$p.is_equal(t.val, t.getValue());				// compares the new and the old values
	}
}
eXcell_addr.prototype = eXcell_proto;
window.eXcell_addr = eXcell_addr;

function wnd_address(source){

	var wnd,		// окно формы
		v = {		// реквизиты формы
			delivery_area: source.o.delivery_area,
			coordinates: source.o.coordinates ? JSON.parse(source.o.coordinates) : [],
			country: "Россия",
			region: "",
			city: "",
			street:	"",
			postal_code: "",
			marker: {}
		};

	process_address_fields(frm_create);


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
				pwnd: source,
				allow_close: true,
				allow_minmax: true,
				on_close: frm_close,
				caption: source.o.shipping_address
			}
		};

		wnd = $p.iface.dat_blank(null, options.wnd);

		wnd.elmnts.layout = wnd.attachLayout('2E');
		wnd.elmnts.cell_frm = wnd.elmnts.layout.cells('a');
		wnd.elmnts.cell_frm.setHeight('110');
		wnd.elmnts.cell_frm.hideHeader();
		wnd.elmnts.cell_frm.fixSize(0,1);

		wnd.elmnts.pgrid = wnd.elmnts.cell_frm.attachPropertyGrid();
		wnd.elmnts.pgrid.setDateFormat("%d.%m.%Y %H:%i");
		wnd.elmnts.pgrid.init();
		wnd.elmnts.pgrid.loadXMLString(source.o._manager.get_property_grid_xml({
			" ": [
				{id: "delivery_area", path: "o.delivery_area", synonym: "Район доставки", type: "ref", txt: v.delivery_area.presentation},
				{id: "region", path: "o.region", synonym: "Регион", type: "ro", txt: v.region},
				{id: "city", path: "o.city", synonym: "Населенный пункт", type: "ed", txt: v.city},
				{id: "street", path: "o.street", synonym: "Улица, дом, корпус, литера, квартира", type: "ed", txt: v.street}
			]
		}, v), function(){
			wnd.elmnts.pgrid.enableAutoHeight(true);
			//wnd.elmnts.pgrid.setInitWidthsP("40,60");
			wnd.elmnts.pgrid.setSizes();
			wnd.elmnts.pgrid.setUserData("", "source", {
				o: v,
				grid: wnd.elmnts.pgrid,
				on_select: pgrid_on_select,
				slist: slist
			});
			wnd.elmnts.pgrid.attachEvent("onPropertyChanged", pgrid_on_changed );

		});

		wnd.elmnts.toolbar = wnd.attachToolbar();
		wnd.elmnts.toolbar.setIconsPath(dhtmlx.image_path + 'dhxtoolbar_web/');
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
	 *	@desc: 	Наборы значений для реффилдов
	 */
	function slist() {
		var res = [];
		if(this.fpath[0]=="delivery_area"){
			$p.cat["delivery_areas"].form_selection(this.source, {initial_value: v.delivery_area.ref});
		}
		return res;
	}

	/**
	 *	@desc: 	обработчик команд формы
	 *	@type:	private
	 *	@topic: 0
	 */
	function toolbar_click(btn_id){
		if(btn_id=="btn_select"){					// выполнить команду редактора построителя

			source.o.delivery_area = v.delivery_area;

			assemble_address_fields();

			source.grid.cells("shipping_address", 1)
				.setValue(source.o.shipping_address);

			source.o.coordinates = JSON.stringify([v.latitude, v.longitude]);

		}
		wnd.close();
	}

	/**
	 *	@desc: 	обработчик выбора значения в свойствах (ссылочные типы)
	 *	@param:	this - важный контекст
	 */
	function pgrid_on_select(selv){

		if(selv===undefined)
			return;

		var f = wnd.elmnts.pgrid.getSelectedRowId(),
			clear_street = false;

		if(v[f] != undefined){
			clear_street = (v[f] != selv);
			v[f] = selv;
		}

		if($p.is_data_obj(selv) ){
			wnd.elmnts.pgrid.cells().setValue(selv.presentation);
			delivery_area_changed(clear_street);
		}else
			addr_changed();
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

				v.postal_code = process_address_components({}, results[0].address_components).postal_code || "";
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

		source.o.shipping_address = assemble_addr();

		var fields = '<КонтактнаяИнформация  \
				xmlns="http://www.v8.1c.ru/ssl/contactinfo" \
				xmlns:xs="http://www.w3.org/2001/XMLSchema" \
				xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"   \
				Представление="%1">   \
					<Комментарий/>  \
					<Состав xsi:type="Адрес" Страна="РОССИЯ">   \
						<Состав xsi:type="АдресРФ">'.replace('%1', source.o.shipping_address);

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

		source.o.address_fields = fields;
	}

	function process_address_fields(callback){

		if(source.o.address_fields){
			v.xml = ( new DOMParser() ).parseFromString(source.o.address_fields, "text/xml");
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

		// если есть координаты $p.ipinfo, используем их
		// иначе - Москва
		if(v.coordinates.length){
			// если координаты есть в Расчете, используем их
			v.latitude = v.coordinates[0];
			v.longitude = v.coordinates[1];
			callback();

		}else if(source.o.shipping_address){
			// если есть строка адреса, пытаемся геокодировать
			do_geocoding(function (results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					v.latitude = results[0].geometry.location.lat();
					v.longitude = results[0].geometry.location.lng();
				}
				callback();
			});

		}else if($p.ipinfo.latitude && $p.ipinfo.longitude ){
			v.latitude = $p.ipinfo.latitude;
			v.longitude = $p.ipinfo.longitude;
			callback();
		}else{
			v.latitude = 55.635924;
			v.longitude = 37.6066379;
			callback();
			$p.msg.show_msg($p.msg.empty_geocoding);
		}

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

	function process_address_components(v, components){
		var i, c, j, street = "", street0 = "", locality = "";
		for(i in components){
			c = components[i];
			//street_number,route,locality,administrative_area_level_2,administrative_area_level_1,country,sublocality_level_1
			for(j in c.types){
				switch(c.types[j]){
					case "route":
						if(c.short_name.indexOf("Unnamed")==-1){
							street = c.short_name + (street ? (" " + street) : "");
							street0 = $p.m.trim(c.long_name.replace("улица", ""));
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
						street = (street ? (street + " ") : "") + c.short_name;
						break;
					case "postal_code":
						v.postal_code = c.short_name;
						break;
					default:
						break;
				}
			}
		}
		if(v.region == v.city_long)
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

	function marker_dragend(e) {
		$p.ipinfo.ggeocoder.geocode({'latLng': e.latLng}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[0]) {
					var addr = results[0];

					wnd.setText(addr.formatted_address);
					process_address_components(v, addr.address_components);

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

			} else
				pgrid_on_select(new_value);
		}
	}

	function frm_close(win){
		source.grid.editStop();
		return !win.error;
	}

	return wnd;

};
