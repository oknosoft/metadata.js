### Абстрактные перечисления и методы интерфейса пользователя для metadata.js

[English version](README.en.md)

For details, see [metadata.js](https://github.com/oknosoft/metadata.js)

Библиотека экспортирует плагин для metadata-core и описывет перечислимые типы и методы, востребованные всеми
ui-библиотеками ([metadata-react-ui](../metadata-react-ui), [metadata-ember-ui](../metadata-ember-ui), [metadata-angular-ui](../metadata-angular-ui) и т.д.)

#### Перечисления

| Перечислене | Описание |
|:---|:---|
| LABEL_POSITIONS | Положение заголовка элемента управления. Имеет смысл для полей ввода и групп формы |
| DATA_FIELD_KINDS | Тип поля ввода |

#### Методы

| Метод | Описание |
|:---|:---|
| control_by_type | Возвращает имя типа элемента управления для типа поля. Параметры (type: MetaObj.Type, val: DataObj) |


