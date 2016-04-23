[![Stars](https://img.shields.io/github/stars/oknosoft/metadata.js.svg?label=Github%20%E2%98%85&a)](https://github.com/oknosoft/metadata.js/stargazers)
[![Release](https://img.shields.io/github/tag/oknosoft/metadata.js.svg?label=Last%20release&a)](https://github.com/oknosoft/metadata.js/releases)
[![NPM downloads](http://img.shields.io/npm/dm/metadata-js.svg?style=flat&label=npm%20downloads)](https://npmjs.org/package/metadata-js?)
[![NPM version](https://img.shields.io/npm/l/metadata-js.svg?)](http://www.gnu.org/licenses/agpl.html)

**Metadata.js** is a library for building offline-first browser-based applications

[README на русском языке](README.md)

### What is Metadata.js?
**Metadata.js** is a JavaScript implementation of [1C:Enterprise Platform object model](http://1c-dn.com/1c_enterprise/platform_architecture_overview/). Its goal is to emulate the most popular classes of 1C:Enterprise API, while running in the browser or in Node.js.

![The structure of the system based on metadata.js](examples/imgs/metadata_infrastructure.png)

![Структура metadata.js в браузере](examples/imgs/metadata_structure.png)

### Presentation
[![Structure metadata.js in a browser](examples/imgs/metadata_slideshare.jpg)](http://www.slideshare.net/ssuser7ad218/metadatajs)

### Concept
In metadata.js, we attempt to supplemented the best of modern technologies of data processing, tools that we did not have in their daily work
- We use the most valuable from 1C
- Complements ES2015 and Web UI

### Unlike competitors
Metadata.js not compete with client Web UI and client-server (including reactive) frameworks, and complements the new abstraction of [data objects](http://www.oknosoft.ru/upzp/apidocs/classes/DataObj.html) and [data managers](http://www.oknosoft.ru/upzp/apidocs/classes/DataManager.html). Using these classes simplifies the development of complex interfaces of business applications.

### Credits
Many thanks to
- Andrey Gershun & M. Rangel Wulff, authors of [AlaSQL](https://github.com/agershun/alasql) - Javascript SQL database library
- Authors of [PouchDB](http://pouchdb.com/) and [CouchDB](http://couchdb.apache.org/) - NoSQL database and data synchronization engine
- Authors of [dhtmlx](http://dhtmlx.com/) - a beautiful set of Ajax-powered UI components
- Other people for useful tools, which make our work easier

### License

Metadata.js is dual licensed. You may use it under [AGPL-3.0](http://licenseit.ru/wiki/index.php/GNU_Affero_General_Public_License_version_3) license for non-profit Open Source projects or under [oknosoft commercial license](http://www.oknosoft.ru/programmi-oknosoft/metadata.html) for any number of non-competing products, without restrictions on the number of copies.

To obtain oknosoft commercial license contact (info@oknosoft.ru)

[Licence information](LICENSE.en.md).

The license on this repo covers all contents of the repo, but does not supercede the existing licenses for products used for this work and other products.

(c) 2014-2016, Oknosoft Lab (info@oknosoft.ru)
