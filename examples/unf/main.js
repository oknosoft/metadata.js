/**
 * <br />&copy; http://www.oknosoft.ru 2009-2015
 * Created 17.06.2015
 * @module  основное окно интерфейса unf demo
 */




function create_main_form(){


}


/**
 * инициализация dhtmlXWindows и анализ WebSQL при готовности документа
 */
$p.iface.oninit = function() {

	$p.iface.layout_2u()

		.then(function (tree) {

			$p.iface.frm_auth(
				null,
				{
					meta: "/examples/unf/data/meta.json",
					data: "/examples/unf/data/"
				},
				create_main_form,
				function (err) {
					console.log(err.message);
				}
			);
		}

	);

};

