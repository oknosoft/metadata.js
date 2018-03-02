[![Stars](https://img.shields.io/github/stars/oknosoft/metadata.js.svg?label=Github%20%E2%98%85&a)](https://github.com/oknosoft/metadata.js/stargazers)
[![Release](https://img.shields.io/github/tag/oknosoft/metadata.js.svg?label=Last%20release&a)](https://github.com/oknosoft/metadata.js/releases)
[![NPM downloads](http://img.shields.io/npm/dm/metadata-js.svg?style=flat&label=npm%20downloads)](https://npmjs.org/package/metadata-js?)
[![NPM version](https://img.shields.io/npm/l/metadata-js.svg?)](http://licenseit.ru/wiki/index.php/MIT)

_Metadata.js - проект с открытым кодом.<br />Приглашаем к сотрудничеству всех желающих. Будем благодарны за любую помощь._

[English version](README.en.md)

Недавно открыто [сообщество по изучению metadata.js](https://github.com/oknosoft/metadata-devtraining).

### Почему Metadata.js?
Библиотека предназначена для разработки бизнес-ориентированных и учетных offline-first браузерных приложений и содержит JavaScript реализацию [Объектной модели 1С](http://v8.1c.ru/overview/Platform.htm). Библиотека эмулирует наиболее востребованные классы API 1С внутри браузера или Node.js, дополняя их средствами автономной работы и обработки данных на клиенте.

### Для кого?
Для разработчиков мобильных и браузерных приложений, которым близка парадигма 1С _на базе бизнес-объектов: документов и справочников_, но которым тесно в рамках традиционной платформы 1С.  
Metadata.js предоставляет программисту:
- высокоуровневые [data-объекты](http://www.oknosoft.ru/upzp/apidocs/classes/DataObj.html), схожие по функциональности с документами, регистрами и справочниками платформы 1С
- инструменты декларативного описания метаданных и автогенерации интерфейса, схожие по функциональности с метаданными и формами платформы 1С 
- средства событийно-целостной репликации и эффективные классы обработки данных, не имеющие прямых аналогов в 1С 

## Предпосылки
Проект начинался с реализации лёгкого javascript клиента 1С (в дополнение к толстому, тонкому и веб-клиентам) и предназначался для чтения и редактирования данных, расположенных на [сервере 1С](http://v8.1c.ru/overview/Term_000000033.htm) с большим числом подключений (дилеры или интернет-витрина с сотнями анонимных либо авторизованных внешних пользователей).
Позже, была реализована математика, использующая в качестве сервера хранилище данных на базе [CouchDB](http://couchdb.apache.org/) и [PouchDB](http://pouchdb.com/) с поддержкой прозрачной в реальном времени синхронизации с 1С

## Автономное Web-приложение - это просто
- [Шаблон helloworld](https://github.com/oknosoft/helloworld)
- [Живое демо](https://light.oknosoft.ru/helloworld/)
- [Статья](http://infostart.ru/public/540168/) с пошаговыми инструкциями
   
## Концепция и философия
> В metadata.js предпринята попытка дополнить лучшее из современных технологий обработки данных инструментами, которых нам не хватало в повседневной работе

![Структура системы на базе metadata.js](examples/imgs/metadata_infrastructure.png)

![Структура metadata.js в браузере](examples/imgs/metadata_structure.png)
 
### Используем самое ценное от 1С
- Эффективная модель *Метаданных* со *ссылочной типизацией* и *подробным описанием реквизитов*
- Высокоуровневая объектная модель данных. Предопределенное (при необходимости, переопределяемое) поведение *Документов*, *Регистров*, *Справочников* и *Менеджеров объектов*, наличие *стандартных реквизитов* и *событий*, повышает эффективность разработки *в разы* по сравнению с фреймворками, оперирующими записями реляционных таблиц
- Автогенерация форм и элементов управления
 
Чтобы предоставить разработчику на javascript инструментарий, подобный 1С-ному, на верхнем уровне фреймворка реализованы классы:
- [AppEvents](http://www.oknosoft.ru/upzp/apidocs/classes/AppEvents.html), обслуживающий события при старте программы, авторизацию пользователей и состояния сети
- [Meta](http://www.oknosoft.ru/upzp/apidocs/classes/Meta.html) - хранилище метаданных конфигурации
- [DataManager](http://www.oknosoft.ru/upzp/apidocs/classes/DataManager.html) с наследниками `RefDataManager`, `EnumManager`, `InfoRegManager`, `CatManager`, `DocManager` - менеджеры объектов данных - аналоги 1С-ных `ПеречислениеМенеджер`, `РегистрСведенийМенеджер`, `СправочникМенеджер`, `ДокументМенеджер`
- [DataObj](http://www.oknosoft.ru/upzp/apidocs/classes/DataObj.html) с наследниками `CatObj`, `DocObj`, `EnumObj`, `DataProcessorObj` - аналоги 1С-ных `СправочникОбъект`, `ДокументОбъект`, `ОбработкаОбъект`
 
### Отличия от конкурентов
Metadata.js не конкурирует с UI фреймворками, а дополняет их новой абстракцией в виде [Объектов](http://www.oknosoft.ru/upzp/apidocs/classes/DataObj.html) и [Менеджеров](http://www.oknosoft.ru/upzp/apidocs/classes/DataManager.html) данных. Использование этих классов упрощает разработку сложных интерфейсов бизнес-приложений.
С классической платформой 1С, metadata так же, не конкурирует, т.к. рассчитана в основном, на работу в автономном режиме в браузере или на мобильном устройстве

## Установка и подключение

```bash
npm install --save metadata-js  # node
npm install -g metadata-js      # command line
```

Чтобы создать структуру папок и заготовки файлов проекта, выполните команды
```bash
metadata init                   # create empty repo
npm install                     # install dependencies
```

Для браузера, подключите таблицы стилей `fontawesome`, `dhtmlx`, `metadata` и скрипты `alasql`, `dhtmlx`, `metadata`
```html
<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/fontawesome/latest/css/font-awesome.min.css">
<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/g/metadata(dhx_terrace.css+metadata.css)">
<script src="//cdn.jsdelivr.net/g/momentjs,alasql,pouchdb,jquery,metadata(dhtmlx.min.js+metadata.min.js)"></script>
```

## Благодарности
- Andrey Gershun & M. Rangel Wulff, authors of [AlaSQL](https://github.com/agershun/alasql) - Javascript SQL database library
- Авторам [PouchDB](http://pouchdb.com/) и [CouchDB](http://couchdb.apache.org/) - NoSQL database and data synchronization engine
- Прочим авторам за их замечательные инструменты, упрощающие нашу работу

## Лицензия
[MIT](LICENSE)

Данная лицензия распространяется на все содержимое репозитория, но не заменеют существующие лицензии для продуктов, используемых библиотекой metadata.js

(c) 2014-2018, компания Окнософт (info@oknosoft.ru)
