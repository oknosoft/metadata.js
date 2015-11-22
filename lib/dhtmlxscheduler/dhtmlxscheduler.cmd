java -jar "C:\Program Files (x86)\JetBrains\WebStorm 11.0\plugins\JavaScriptLanguage\lib\compiler.jar" ^
--compilation_level SIMPLE_OPTIMIZATIONS --charset UTF-8 --language_in=ES5 ^
--js dhtmlxscheduler.js       ^
--js dhtmlxscheduler_locale_ru.js       ^
--js dhtmlxscheduler_minical.js       ^
--js dhtmlxscheduler_timeline.js       ^
--js dhtmlxscheduler_treetimeline.js       ^
--module scheduler:5
del dhtmlxscheduler.min.js
ren scheduler.js dhtmlxscheduler.min.js