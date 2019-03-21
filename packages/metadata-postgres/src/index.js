
import proto from './proto';
import adapter from './adapter';

const plugin = {

	proto(constructor) {
		// дополняем и модифицируем конструкторы
		proto(constructor);
		adapter(constructor);
	},

	constructor(){
		// создаём экземпляр адаптера нашего типа
		const {AdapterPostgres} = this.classes;
		this.adapters.pgsql = new AdapterPostgres(this);
	}
}
export default plugin;
