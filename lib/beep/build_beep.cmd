rem java -jar "C:\Program Files (x86)\JetBrains\WebStorm 10.0.1\plugins\JavaScriptLanguage\lib\compiler.jar" ^
rem --compilation_level SIMPLE_OPTIMIZATIONS --charset UTF-8 --language_in=ES5 ^
rem --js Beep.js        ^
rem --js Beep.Note.js   ^
rem --js Beep.Sample.js ^
rem --js Beep.Voice.js  ^
rem --module beep_min:4
rem del beep.min.js
rem ren beep_min.js beep.min.js

del beep.bundle.js
copy Beep.js + Beep.Note.js + Beep.Sample.js + Beep.Voice.js beep.bundle.js