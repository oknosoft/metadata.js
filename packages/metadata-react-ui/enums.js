'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
 * Перечислимые типы react-ui
 */

/**
 * Положение заголовка элемента управления
 * @type Object
 */
var LABEL_POSITIONS = exports.LABEL_POSITIONS = {
	auto: 'auto',
	hide: 'hide',
	left: 'left',
	right: 'right',
	top: 'top',
	bottom: 'bottom'
};

/**
 * Тип поля элемента управления data_field
 * @type Object
 */
var DATA_FIELD_KIND = exports.DATA_FIELD_KIND = {
	input: 'input', // поле ввода
	label: 'label', // поле надписи
	toggle: 'toggle', // поле переключателя
	image: 'image', // поле картинки
	text: 'text' // многострочный редактор текста
};