

export default class GeneratorXLS {
  constructor(data, columns) {
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
    return this.columns.map(({key, formatter}) => (formatter ? formatter({value: row[key], row, raw: true}) : row[key]));
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
