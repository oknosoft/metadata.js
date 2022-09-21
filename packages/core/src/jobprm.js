/**
 * Параметры работы программы
 * они же - параметры сеанса. БОльшая часть, заполняется из `cch.predefined_elmnts`
 */
export default class JobPrm {

	constructor($p) {
		this.$p = $p;
		this.local_storage_prefix = '';
		this.create_tables = true;
	}

	init(settings) {
		// подмешиваем параметры, заданные в файле настроек сборки
    if (typeof settings == 'function') {
      settings(this);
    }
	}

}
