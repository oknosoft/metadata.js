copy /y common.js+i18n.ru.js+meta_meta.js+meta_mngrs.js+meta_tabulars.js+meta_objs.js+meta_rest.js+events.js ..\lib\metadata.core.js /b

java -jar "C:\Program Files (x86)\JetBrains\WebStorm 11.0.2\plugins\JavaScriptLanguage\lib\compiler.jar" ^
--compilation_level SIMPLE_OPTIMIZATIONS --charset UTF-8 --language_in=ES5 ^
--js ..\lib\metadata.core.js       ^
--module metadatacore:1
move /Y metadatacore.js ..\dist\metadata.core.min.js