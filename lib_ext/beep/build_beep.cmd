java -jar "C:\Program Files (x86)\JetBrains\WebStorm 10.0.1\plugins\JavaScriptLanguage\lib\compiler.jar" ^
--compilation_level SIMPLE_OPTIMIZATIONS --charset UTF-8 --language_in=ES5 ^
--js Beep.js        ^
--js Beep.Note.js   ^
--js Beep.Sample.js ^
--js Beep.Voice.js  ^
--module beep_min:4
del beep.min.js
ren beep_min.js beep.min.js