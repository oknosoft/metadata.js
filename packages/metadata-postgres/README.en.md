### PouchDB data adapter for metadata.js

[README in Russian](README.md)

Example initialization metadata-react-app with pouchdb adapter:
```javascript
import MetaEngine from 'metadata-core'
import metadata_pouchdb from 'metadata-pouchdb'
import metadata_redux from 'metadata-redux'
MetaEngine
  .plugin(metadata_pouchdb) // connect pouchdb-adapter to metadata-core
  .plugin(metadata_redux)   // connect redux-actions to metadata-core
const $p = new MetaEngine()
```

For details, see [metadata.js](https://github.com/oknosoft/metadata.js)
