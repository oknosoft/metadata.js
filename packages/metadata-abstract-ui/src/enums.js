/**
 * Перечислимые типы react-ui
 */

//import { classes } from "metadata-core";

/**
 * Положение заголовка элемента управления DataField.label_position
 * @type Object
 */
export const LABEL_POSITIONS = {
	auto: 'auto',
	hide: 'hide',
	left: 'left',
	right: 'right',
	top: 'top',
	bottom: 'bottom'
}

/**
 * Тип поля элемента управления DataField.kind
 * @type Object
 */
export const DATA_FIELD_KINDS = {
	input: 'input',   // поле ввода
	label: 'label',   // поле надписи
	toggle: 'toggle', // поле переключателя
	image: 'image',   // поле картинки
	text: 'text'      // многострочный редактор текста
}
