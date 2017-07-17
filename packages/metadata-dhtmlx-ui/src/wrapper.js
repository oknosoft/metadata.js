export default ($p) => {
	const {DataManager, EnumManager, BusinessProcessManager, DataProcessorsManager, ChartOfAccountManager, TaskManager, CatManager, DocManager,
		DataObj, CatObj, DocObj, TabularSection, TabularSectionRow, } = $p.classes;

	Function.prototype._extend = function( Parent ) {
		var F = function() { };
		F.prototype = Parent.prototype;
		this.prototype = new F();
		this.prototype.constructor = this;
		this.__define("superclass", {
			value: Parent.prototype,
			enumerable: false
		});
	}

	<%= contents %>
};