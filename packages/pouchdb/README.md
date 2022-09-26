# PouchDB data adapter for metadata.js

Example initialization app with pouchdb adapter:
```javascript
import MetaEngine from 'metadata-core'
import metadata_pouchdb from 'metadata-pouchdb'
import metadata_redux from 'metadata-redux'
MetaEngine
  .plugin(metadata_pouchdb) // connect pouchdb-adapter to metadata-core
  .plugin(metadata_redux)   // connect redux-actions to metadata-core
const $p = new MetaEngine()
```

