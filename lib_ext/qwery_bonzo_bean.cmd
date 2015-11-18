java -jar "C:\Program Files (x86)\JetBrains\WebStorm 11.0\plugins\JavaScriptLanguage\lib\compiler.jar" ^
--compilation_level SIMPLE_OPTIMIZATIONS --charset UTF-8 --language_in=ES5 ^
--js qwery_bonzo_bean.js    ^
--js qwery\qwery.js         ^
--js bonzo\bonzo.js         ^
--js bean\bean.js           ^
--module qbb:4
del qbb.min.js
ren qbb.js qbb.min.js