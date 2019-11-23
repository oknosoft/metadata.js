
const page = {
  docs_written: 0,
  page: 0,
  start: Date.now(),
  manifest: [],
  add(arr) {
    this.manifest.push.apply(this.manifest, arr);
  },
  get total_rows() {
    let v = 0;
    for(const el of this.manifest) {
      const key = Object.keys(el)[0];
      v += el[key];
    }
    return v;
  }
};

export function load_ram({adapters: {pouch}, md}) {
  const {remote: {doc}, props} = pouch;
  return fetch(`/couchdb/mdm/${props.zone}/${props._suffix}`, {
    headers: doc.getBasicAuthHeaders({prefix: pouch.auth_prefix(), ...doc.__opts.auth}),
  })
    .then(stream_load(md, pouch))
    .then(() => {
      props._data_loaded = true;
      pouch.emit('pouch_data_loaded');
    })
    .then(() => {
      props._doc_ram_loading = true;
      pouch.emit('pouch_doc_ram_start');
    })
    .then(() => {
      props._doc_ram_loading = false;
      props._doc_ram_loaded = true;
      pouch.emit('pouch_doc_ram_loaded');
    });

}

// загружает данные, которые не зависят от отдела абонента
export function load_common({adapters: {pouch}, md}) {
  return fetch(`/couchdb/mdm/${pouch.props.zone}/common`)
    .then(stream_load(md, pouch))
    .then(() => pouch.emit('pouch_no_data', 'no_ram'));
}

function stream_load(md, pouch) {

  function load(part) {
    const data = JSON.parse(part);
    const mgr = md.mgr_by_class_name(data.name);
    mgr && mgr.load_array(data.rows);
    page.docs_written += data.rows.length;
    page.page++;
    pouch.emit('pouch_data_page', page);
  }

  return async function stream_load({body, headers}) {
    const reader = body.getReader();
    const decoder = new TextDecoder("utf-8");

    page.add(JSON.parse(headers.get('manifest')));
    page.page && pouch.emit('pouch_load_start', page);

    let chunks = '';
    for(;;) {
      const {done, value} = await reader.read();
      if (done) {
        break;
      }
      const text = decoder.decode(value);
      const parts = text.split('\r\n');
      if(!text.endsWith('\r\n')) {
        if(chunks.length) {
          chunks += parts.shift();
          if(parts.length) {
            load(chunks);
            chunks = '';
          }
        }
        if(parts.length) {
          chunks = parts.pop();
        }
      }
      else if(chunks.length) {
        chunks += parts.shift();
        if(parts.length) {
          load(chunks);
          chunks = '';
        }
      }

      for(const part of parts) {
        part && load(part);
      }
    }

  };
}
