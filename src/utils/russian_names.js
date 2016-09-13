/**
 * Добавляет коллекциям менеджеров и метаданным русские синонимы, как свойства объекта _window_
 * @method russian_names
 */
this.russian_names = function(){
	if($p.job_prm.russian_names){

		// глобальный контекст
		window.__define({
			"Метаданные": {
				get: function(){return $p.md},
				enumerable: false
			},
			"Справочники": {
				get: function(){return $p.cat},
				enumerable: false
			},
			"Документы": {
				get: function(){return $p.doc},
				enumerable: false
			},
			"РегистрыСведений": {
				get: function(){return $p.ireg},
				enumerable: false
			},
			"РегистрыНакопления": {
				get: function(){return $p.areg},
				enumerable: false
			},
			"РегистрыБухгалтерии": {
				get: function(){return $p.accreg},
				enumerable: false
			},
			"Обработки": {
				get: function(){return $p.dp},
				enumerable: false
			},
			"Отчеты": {
				get: function(){return $p.rep},
				enumerable: false
			},
			"ОбластьКонтента": {
				get: function(){return $p.iface.docs},
				enumerable: false
			},
			"Сообщить": {
				get: function(){return $p.msg.show_msg},
				enumerable: false
			},
			"Истина": {
				value: true,
				enumerable: false
			},
			"Ложь": {
				value: false,
				enumerable: false
			}

		});

		// свойства и методы менеджеров
		DataManager.prototype.__define({
				"ФормаВыбора": {
					get: function(){return this.form_selection},
					enumerable: false
				},
				"ФормаОбъекта": {
					get: function(){return this.form_obj},
					enumerable: false
				},
				"Найти": {
					get: function(){return this.find},
					enumerable: false
				},
				"НайтиСтроки": {
					get: function(){return this.find_rows},
					enumerable: false
				},
				"НайтиПоНаименованию": {
					get: function(){return this.by_name},
					enumerable: false
				}
			}
		);

		// свойства и методы объектов данных
		DataObj.prototype.__define({
				"ФормаОбъекта": {
					get: function(){return this.form_obj},
					enumerable: false
				}
			}
		);

	}
};