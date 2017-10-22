import MetaEngine from '../../metadata-core/src/common';
import metadata_pouchdb from '../../metadata-pouchdb/src/index';
import metadata_abstract_ui_tabulars from '../../metadata-abstract-ui/src/tabulars';
import metadata_abstract_ui from '../../metadata-abstract-ui/src/plugin';
import metadata_dhtmlx from './index';

MetaEngine
  .plugin(metadata_pouchdb)
  .plugin(metadata_abstract_ui)
  .plugin(metadata_abstract_ui_tabulars)
  .plugin(metadata_dhtmlx);

require('pouchdb-authentication/dist/pouchdb.authentication.min');

const $p = new MetaEngine();

export default $p;
