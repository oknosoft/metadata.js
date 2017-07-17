export default ($p) => {
	const {load_script, wsql, utils} = $p;

	/**
	 * ### Врзвращает объект Docxtemplater из blob
	 * blob может быть получен из вложения DataObj
	 *
	 * @method docxtemplater
	 * @for Utils
	 * @param blob {Blob} - двоичные данные шаблона
	 * @return {Docxtemplater} - объект open-xml-docx
	 * @async
	 */
	utils.docxtemplater = function (blob) {

		return (window.Docxtemplater ?
			Promise.resolve() :
			Promise.all([
				load_script("https://cdn.jsdelivr.net/jszip/2/jszip.min.js", "script"),
				load_script("https://cdn.jsdelivr.net/combine/gh/open-xml-templating/docxtemplater-build/build/docxtemplater-latest.min.js,gh/open-xml-templating/docxtemplater-image-module-build/build/docxtemplater-image-module-latest.min.js", "script"),
			]))
			.then(function () {
				if(!Docxtemplater.prototype.saveAs){
					Docxtemplater.prototype.saveAs = function (name) {
						var out = this.getZip().generate({type: "blob", mimeType: utils.mime_lookup('docx')});
						wsql.alasql.utils.saveAs(out, name);
					};
				}
				return utils.blob_as_text(blob, 'array');
			})
			.then(function (buffer) {
				return new Docxtemplater().loadZip(new JSZip(buffer));
			});
	};
}