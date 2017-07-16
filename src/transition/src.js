import MetaEngine from '../../packages/metadata-core/src/common';
import metadata_pouchdb from '../../packages/metadata-pouchdb/src';
import metadata_abstract_ui_meta from '../../packages/metadata-abstract-ui/src/meta';
import metadata_abstract_ui from '../../packages/metadata-abstract-ui/src/plugin';
import metadata_dhtmlx from '../../packages/metadata-dhtmlx-ui/src';

MetaEngine
  .plugin(metadata_pouchdb)
  .plugin(metadata_abstract_ui_meta)
  .plugin(metadata_abstract_ui)
  .plugin(metadata_dhtmlx);

const $p = new MetaEngine();

export default $p;