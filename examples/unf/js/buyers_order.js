/**
 * Обработчики событий и методы документа __Заказ покупателя__
 * <br />&copy; http://www.oknosoft.ru 2009-2015
 * @module  buyers_order
 */

unf.modifiers.push(

	function($p){

		var _mgr = $p.doc.buyers_order;


		/**
		 * Обработчик события "при изменении свойства" в шапке или табличной части при редактировании в форме объекта
		 * @this {DataObj} - обработчик вызывается в контексте текущего объекта
		 */
		_mgr.attache_event("value_change", function (attr) {

			// для примера, установим цену номнклатуры в строке заказа при изменении номенклатуры или характеристики
			if(attr.tabular_section == "inventories" && (attr.field == "nom" || attr.field == "characteristic"))
				inventories_nom_characteristic_change.call(this, attr);

		});

		/**
		 * При изменении номенклатуры или характеристики в строке табчасти Запасы
		 * @param attr
		 */
		function inventories_nom_characteristic_change(attr){

			attr.row[attr.field] = attr.value;

			// при непустой характеристике проверяем владельца
			if(!attr.row.characteristic.empty() && attr.row.characteristic.owner != attr.row.nom)
				attr.row.characteristic = "";

			// прочитаем цену номенклатуры
			var prm = {
				period: this.date,
				nom: attr.row.nom,
				characteristic: attr.row.characteristic
			};

			if(!this.price_type.empty())
				prm.price_type = this.price_type;

			else if(!this.contract.price_type.empty())
				prm.price_type = this.contract.price_type;

			$p.ireg.nom_prices.rest_slice_last(prm)
				.then(function (data) {
					if(data.length)
						attr.row.price = data[0].price;
					else
						attr.row.price = 0;
					attr.grid.cells(attr.row.row, 5).setValue(attr.row.price);
				})
				.catch(function (err) {
					console.log(err);
				});
		}

	}
);
