/**
 * Обработчики событий и методы документа __Заказ покупателя__
 *
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author	Evgeniy Malyarov
 *
 * @module  ЗаказПокупателя
 */

unf.modifiers.push(

	function($p){

		var _mgr = Документы.ЗаказПокупателя;


		/**
		 * Обработчик события "при изменении свойства" в шапке или табличной части при редактировании в форме объекта
		 * @this {DataObj} - обработчик вызывается в контексте текущего объекта
		 */
		_mgr.attache_event("value_change", function (attr) {

			// для примера, установим цену номнклатуры в строке заказа при изменении номенклатуры или характеристики
			if(attr.tabular_section == "Запасы" && (attr.field == "Номенклатура" || attr.field == "Характеристика"))
				inventories_nom_characteristic_change.call(this, attr);

		});

		/**
		 * При изменении номенклатуры или характеристики в строке табчасти Запасы
		 * @param attr
		 */
		function inventories_nom_characteristic_change(attr){

			attr.row[attr.field] = attr.value;

			// при непустой характеристике проверяем владельца
			if(!attr.row.Характеристика.empty() && attr.row.Характеристика.owner != attr.row.Номенклатура){
				attr.row.Характеристика = "";
				attr.grid.cells(attr.row.row, 2).setValue("");
			}


			// прочитаем цену номенклатуры
			var prm = {
				period: this.date,
				Номенклатура: attr.row.Номенклатура,
				Характеристика: attr.row.Характеристика
			};

			if(!this.ВидЦен.empty())
				prm.ВидЦен = this.ВидЦен;

			else if(!this.Договор.ВидЦен.empty())
				prm.ВидЦен = this.Договор.ВидЦен;

			РегистрыСведений.ЦеныНоменклатуры.rest_slice_last(prm)
				.then(function (data) {
					if(data.length)
						attr.row.Цена = data[0].Цена;
					else
						attr.row.Цена = 0;
					attr.grid.cells(attr.row.row, 5).setValue(attr.row.Цена);
				})
				.catch(function (err) {
					$p.record_log(err);
				});
		}

	}
);
