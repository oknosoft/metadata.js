import MetaEngine from '../../metadata-core/src/common';
import metadata_pouchdb from '../../metadata-pouchdb/src/index';
import metadata_abstract_ui_meta from '../../metadata-abstract-ui/src/meta';
import metadata_abstract_ui from '../../metadata-abstract-ui/src/plugin';
import metadata_dhtmlx from './index';

MetaEngine
  .plugin(metadata_pouchdb)
  .plugin(metadata_abstract_ui_meta)
  .plugin(metadata_abstract_ui)
  .plugin(metadata_dhtmlx);

const $p = new MetaEngine();

export default $p;