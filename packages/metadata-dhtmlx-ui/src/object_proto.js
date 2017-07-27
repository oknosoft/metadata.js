
Function.prototype._extend = function( Parent ) {
	var F = function() { };
	F.prototype = Parent.prototype;
	this.prototype = new F();
	this.prototype.constructor = this;
	this.__define("superclass", {
		value: Parent.prototype,
		enumerable: false
	});
};

/**
 * rubles.js — сумма прописью https://github.com/meritt/rubles
 * &copy; [Алексей Симоненко](mailto:alexey@simonenko.su), [simonenko.su](http://simonenko.su)
 * @module rubles.js
 */
(function() {
  'use strict';

  var words = [
    [
      '', 'один', 'два', 'три', 'четыре', 'пять', 'шесть',
      'семь', 'восемь', 'девять', 'десять', 'одиннадцать',
      'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать',
      'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'
    ],
    [
      '', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят',
      'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'
    ],
    [
      '', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот',
      'шестьсот', 'семьсот', 'восемьсот', 'девятьсот'
    ]
  ];

  var toFloat = function(number) {
    return parseFloat(number);
  };

  var plural = function(count, options) {
    if (options.length !== 3) {
      return false;
    }

    count = Math.abs(count) % 100;
    var rest = count % 10;

    if (count > 10 && count < 20) {
      return options[2];
    }

    if (rest > 1 && rest < 5) {
      return options[1];
    }

    if (rest === 1) {
      return options[0];
    }

    return options[2];
  };

  var parseNumber = function(number, count) {
    var first;
    var second;
    var numeral = '';

    if (number.length === 3) {
      first = number.substr(0, 1);
      number = number.substr(1, 3);
      numeral = '' + words[2][first] + ' ';
    }

    if (number < 20) {
      numeral = numeral + words[0][toFloat(number)] + ' ';
    } else {
      first = number.substr(0, 1);
      second = number.substr(1, 2);
      numeral = numeral + words[1][first] + ' ' + words[0][second] + ' ';
    }

    if (count === 0) {
      numeral = numeral + plural(number, ['рубль', 'рубля', 'рублей']);
    } else if (count === 1) {
      if (numeral !== '  ') {
        numeral = numeral + plural(number, ['тысяча ', 'тысячи ', 'тысяч ']);
        numeral = numeral.replace('один ', 'одна ').replace('два ', 'две ');
      }
    } else if (count === 2) {
      if (numeral !== '  ') {
        numeral = numeral + plural(number, ['миллион ', 'миллиона ', 'миллионов ']);
      }
    } else if (count === 3) {
      numeral = numeral + plural(number, ['миллиард ', 'миллиарда ', 'миллиардов ']);
    }

    return numeral;
  };

  var parseDecimals = function(number) {
    var text = plural(number, ['копейка', 'копейки', 'копеек']);

    if (number === 0) {
      number = '00';
    } else if (number < 10) {
      number = '0' + number;
    }

    return ' ' + number + ' ' + text;
  };

  var rubles = function(number) {
    if (!number) {
      return false;
    }

    var type = typeof number;
    if (type !== 'number' && type !== 'string') {
      return false;
    }

    if (type === 'string') {
      number = toFloat(number.replace(',', '.'));

      if (isNaN(number)) {
        return false;
      }
    }

    if (number <= 0) {
      return false;
    }

    var splt;
    var decimals;

    number = number.toFixed(2);
    if (number.indexOf('.') !== -1) {
      splt = number.split('.');
      number = splt[0];
      decimals = splt[1];
    }

    var numeral = '';
    var length = number.length - 1;
    var parts = '';
    var count = 0;
    var digit;

    while (length >= 0) {
      digit = number.substr(length, 1);
      parts = digit + parts;

      if ((parts.length === 3 || length === 0) && !isNaN(toFloat(parts))) {
        numeral = parseNumber(parts, count) + numeral;
        parts = '';
        count++;
      }

      length--;
    }

    numeral = numeral.replace(/\s+/g, ' ');

    if (decimals) {
      numeral = numeral + parseDecimals(toFloat(decimals));
    }

    return numeral;
  };

  /**
   * Сумму прописью в прототип числа
   */
  if(!Number.prototype.in_words)
    Number.prototype.in_words = function() {
      return rubles(this);
    };

})();

export default {};
