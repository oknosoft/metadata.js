/**
 * Ячейка грида для отображения картинки svg и компонент,
 * получающий и отображающий галерею эскизов объекта данных
 *
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author	Evgeniy Malyarov
 *
 * @module  wdg_rsvg
 * @requires common
 */

if(typeof window !== "undefined" && "dhtmlx" in window){

	/**
	 * Конструктор поля картинки svg
	 */
	function eXcell_rsvg(cell){ //the eXcell name is defined here
		if (cell){                // the default pattern, just copy it
			this.cell = cell;
			this.grid = this.cell.parentNode.grid;
		}
		this.edit = function(){};  //read-only cell doesn't have edit method
		this.isDisabled = function(){ return true; }; // the cell is read-only, so it's always in the disabled state
		this.setValue=function(val){
			this.setCValue(val ? $p.iface.scale_svg(val, 120, 10) : "нет эскиза");
		}
	}
	eXcell_rsvg.prototype = eXcell_proto;
	window.eXcell_rsvg = eXcell_rsvg;

	/**
	 * ### Визуальный компонент OSvgs
	 * Получает и отображает галерею эскизов объекта данных
	 *
	 * @class OSvgs
	 * @param manager {DataManager}
	 * @param layout {dhtmlXLayoutObject|dhtmlXWindowsCell}
	 * @param area {HTMLElement}
	 * @constructor
	 */
	$p.iface.OSvgs = function (manager, layout, area) {

		var t = this,
			minmax = document.createElement('div'),
			pics_area = document.createElement('div'),
			stack = [],
			area_hidden = $p.wsql.get_user_param("svgs_area_hidden", "boolean"),
			area_text = area.querySelector(".dhx_cell_statusbar_text");

		if(area_text)
			area_text.style.display = "none";

		pics_area.className = 'svgs-area';
		if(area.firstChild)
			area.insertBefore(pics_area, area.firstChild);
		else
			area.appendChild(pics_area);

		minmax.className = 'svgs-minmax';
		minmax.title="Скрыть/показать панель эскизов";
		minmax.onclick = function () {
			area_hidden = !area_hidden;
			$p.wsql.set_user_param("svgs_area_hidden", area_hidden);
			apply_area_hidden();

			if(!area_hidden && stack.length)
				t.reload();

		};
		area.appendChild(minmax);
		apply_area_hidden();

		function apply_area_hidden(){

			pics_area.style.display = area_hidden ? "none" : "";

			if(layout.setSizes)
				layout.setSizes();
			else{
				var dim = layout.getDimension();
				layout.setDimension(dim[0], dim[1]);
				layout.maximize();
			}

			if(area_hidden){
				minmax.style.backgroundPositionX = "-32px";
				minmax.style.top = layout.setSizes ? "16px" : "-18px";
			}
			else{
				minmax.style.backgroundPositionX = "0px";
				minmax.style.top = "0px";
			}
		}

		function drow_svgs(res){

			var i, j, k, svg_elm;

			$p.iface.clear_svgs(pics_area);

			if(!res.svgs.length){
				// возможно, стоит показать надпись, что нет эскизов
			}else
				for(i in res.svgs){
					if(!res.svgs[i] || res.svgs[i].substr(0, 1) != "<")
						continue;
					svg_elm = document.createElement("div");
					pics_area.appendChild(svg_elm);
					svg_elm.style["float"] = "left";
					svg_elm.innerHTML = $p.iface.scale_svg(res.svgs[i], 88, 22);
				}
		}

		this.reload = function (ref) {

			if(ref)
				stack.push(ref);

			if(!area_hidden)
				setTimeout(function(){
					if(stack.length){
						manager.save({
							ref: stack.pop(),
							specify: "order_pics",
							action: "calc",
							async: true
						})
							.then(drow_svgs)
							.catch(function (err) {
								console.log(err);
							});
						stack.length = 0;
					}
				}, 300);
		}

	}

}