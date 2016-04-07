/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Web worker to encrypt/decrypt files using AES counter-mode             (c) Chris Veness 2016  */
/*                                                                                   MIT Licence  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

importScripts('js/crypto/aes.js');
importScripts('js/crypto/aes-ctr.js');

/**
 * Web worker to encrypt/decrypt files using AES counter-mode.
 *
 * @param {string} msg.data.op - 'encrypt' or 'decrypt'.
 * @param {File}   msg.data.file - File to be encrypted or decrypted.
 * @param {string} msg.data.password - Password to use to encrypt/decrypt file.
 * @param {number} msg.data.bits - Number of bits to use for key.
 * @returns {ciphertext|plaintext} - Blob containing encrypted ciphertext / decrypted plaintext.
 *
 * @example
 *   var worker = new Worker('aes-ctr-file-webworker.js');
 *   var file = this.files[0];
 *   worker.postMessage({ op:'encrypt', file:file, password:'L0ck it up ŝaf3', bits:256 });
 *   worker.onmessage = function(msg) {
 *     if (msg.data.progress != 'complete') {
 *       $('progress').val(msg.data.progress * 100); // update progress bar
 *     }
 *     if (msg.data.progress == 'complete') {
 *       saveAs(msg.data.ciphertext, file.name+'.encrypted'); // save encrypted file
 *     }
 *   }
 *
 * Note saveAs() cannot run in web worker, so encrypted/decrypted file has to be passed back to UI
 * thread to be saved.
 *
 * TODO: error handling on failed decryption
 */
onmessage = function(msg) {
	switch (msg.data.op) {
		case 'encrypt':
			var reader = new FileReaderSync();
			var plaintext = reader.readAsText(msg.data.file, 'utf-8');
			var ciphertext = Aes.Ctr.encrypt(plaintext, msg.data.password, msg.data.bits);
			// return encrypted file as Blob; UI thread can then use saveAs()
			var blob = new Blob([ciphertext], { type: 'text/plain' });
			self.postMessage({ progress: 'complete', ciphertext: blob });
			break;
		case 'decrypt':
			var reader = new FileReaderSync();
			var ciphertext = reader.readAsText(msg.data.file, 'iso-8859-1');
			var plaintext = Aes.Ctr.decrypt(ciphertext, msg.data.password, msg.data.bits);
			// return decrypted file as Blob; UI thread can then use saveAs()
			var blob = new Blob([plaintext], { type: 'application/octet-stream' });
			self.postMessage({ progress: 'complete', plaintext: blob });
			break;
	}
};