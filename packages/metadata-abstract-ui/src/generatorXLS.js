

export default class GeneratorXLS {
  constructor(data, columns, utils) {
    this.utils = utils;
    this.data = data;
    this.columns = columns.filter(el => el.width !== -1);
  }

  generate({name = 'Спецификация', fileName = `specification`}) {
    return import('xlsx')
      .then((module) => {
        const XLSX = this.XLSX = (module.default || module);
        const workbook = XLSX.utils.book_new();
        const header = this.columns.map(el => el.name);
        let ws = XLSX.utils.aoa_to_sheet([header]);
        ws[`!rows`] = [{hpx: 20}];
        ws["!cols"] = header.map(el => ({wch: el.length}));
        if (this.data && this.data.length) {
          this.fillSheet([...this.data], ws);
        }
        XLSX.utils.book_append_sheet(workbook, ws, name);
        return XLSX.writeFile(workbook, `${fileName}.xlsx`);
      });
  }

  getRowData(row) {
    const {columns, utils} = this;
    return columns.map(({key, formatter}) => {
      const value = row[key];
      if(formatter) {
        let v = formatter({value, row, raw: true});
        if(!v && value && typeof value === 'string') {
          v = value;
        }
        let {fraction, appearance} = formatter;
        if(Array.isArray(appearance)) {
          for(const crow of appearance) {
            if(crow.check(row)) {
              try {
                const {withRaw, text, fraction: cf, ...css} = JSON.parse(crow.css);
                let value;
                if(typeof text === 'string') {
                  return text;
                }
                else if(typeof cf === 'number') {
                  fraction = cf;
                  break;
                }
              }
              catch (e) {}
            }
          }
        }
        if(typeof fraction === 'number' && typeof v === 'number') {
          let z = '#\u00A0##0';
          if(fraction) {
            z += '.';
            for(let i = 0; i < fraction; i++) {
              z += '0';
            }
          }
          return {v, t: 'n', z};
        }
        return v;
      }
      else if(utils.is_data_obj(value)) {
        return value.toString();
      }
      return value;
    });
  }

  fillSheet(arr, ws, level = 0) {
    if (!arr.length) {
      return ws;
    } else {
      const row = arr.shift();
      const data = this.getRowData(row);
      this.XLSX.utils.sheet_add_aoa(ws, [data], {origin: -1});
      ws[`!rows`].push({level});
      data.forEach((el, i) => {
        ws["!cols"][i].wch = Math.max(ws["!cols"][i].wch, String(el).length)
      });
      if (row.children && row.children.length) {
        this.fillSheet([...row.children], ws, 1)
      }
      return this.fillSheet(arr, ws, level);
    }
  }
}
