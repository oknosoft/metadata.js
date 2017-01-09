/**
 * ### Расширение функциональности TabularSection
 *
 * @module tabulars
 *
 * Created 09.01.2017
 */

import ClipboardAction from "clipboard/lib/clipboard-action";


function tabulars(constructor, classes) {

	Object.defineProperty(classes.TabularSection.prototype, 'export', {

		value: function (format = 'csv', columns = []) {

			const data = []
			const {utils, wsql} = classes.$p
			const len = columns.length - 1

			let text

			this.forEach((row) => {
				const rdata = {}
				columns.forEach((col) => {
					if(utils.is_data_obj(row[col])){
						if(format == 'json'){
							rdata[col] = {
								ref: row[col].ref,
								type: row[col]._manager.class_name,
								presentation: row[col].presentation
							}
						}
						else{
							rdata[col] = row[col].presentation
						}
					}
					else if(typeof(row[col]) == 'number'  && format == 'csv') {
						rdata[col] = row[col].toLocaleString('ru-RU', {useGrouping: false})
					}
					else if(row[col] instanceof Date && format != 'xls') {
						rdata[col] = utils.moment(row[col]).format(utils.moment._masks.date_time)
					}
					else{
						rdata[col] = row[col]
					}
				})
				data.push(rdata)
			})

			if(format == 'xls'){
				return wsql.alasql.promise(`SELECT * INTO XLSX('${this._name + '_' + utils.moment().format("YYYYMMDDHHmm")}.xlsx',{headers:true}) FROM ? `,[data])
			}
			else{
				return new Promise((resolve, reject) => {

					if(format == 'json'){
						text = JSON.stringify(data, null, '\t');
					}
					else {
						text = columns.join('\t') + '\n'
						data.forEach((row) => {
							columns.forEach((col, index) => {
								text+= row[col]
								if(index < len){
									text+= '\t'
								}
							})
							text+= '\n'
						})
					}

					new ClipboardAction({
						action: 'copy',
						text,
						emitter: {emit: resolve}
					})
				})
			}
		}
	})

}