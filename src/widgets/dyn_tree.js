/**
 * Динамическое дерево иерархического справочника
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 * 
 * @module  wdg_dyn_tree
 */

/**
 * ### Визуальный компонент - динамическое дерево иерархического справочника
 *
 * Особенность dhtmlx: экземпляр создаётся не конструктором, а функцией `attachDynTree` (без `new`) и размещается в ячейке dhtmlXCellObject
 *
 * @class ODynTree
 * @param mgr {DataManager}
 * @param [callback] Function
 * @constructor
 */
dhtmlXCellObject.prototype.attachDynTree = function(mgr, filter, callback) {

	if(this.setCollapsedText)
		this.setCollapsedText("Дерево");

	if(!filter)
		filter = {is_folder: true};

	var tree = this.attachTree();
	tree.setImagePath(dhtmlx.image_path + 'dhxtree' + dhtmlx.skin_suffix());
	tree.setIconsPath(dhtmlx.image_path + 'dhxtree' + dhtmlx.skin_suffix());
	if($p.job_prm.device_type == "desktop")
		tree.enableKeyboardNavigation(true);

	tree.__define({
		/**
		 * Фильтр, налагаемый на дерево
		 */
		filter: {
			get: function () {

			},
			set: function (v) {
				filter = v;
			},
			enumerable: false,
			configurable: false
		}
	});

	// !!! проверить закешированность дерева
	// !!! для неиерархических справочников дерево можно спрятать
	setTimeout(function () {

		mgr.sync_grid({
			action: "get_tree",
			filter: filter
		}, tree)
			.then(function (res) {
				if(callback)
					callback(res);
			});

	});

	return tree;
};