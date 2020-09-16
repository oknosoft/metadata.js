/**
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 * @module init.js
 * Created 20.07.2016
 */

/**
 *  /data
 *  /dist
 *  /dist/imgs
 *  /src
 *  /src/modifiers
 *  /src/templates
 *  /src/templates/cursors
 *  /src/templates/printing_plates
 *  /src/templates/imgs
 *  /src/templates/xml
 */
/*

 */

exports.command = 'init [dir]';
exports.desc = 'Create an empty repo';
exports.builder = {
  dir: {
    default: '.'
  }
};
exports.handler = function (argv) {

  const https = require('https');

  const zipUrl = "https://codeload.github.com/oknosoft/helloworld/zip/v2";
  const request = https.get(zipUrl);

  request.on('response', (response) => {
    response.pipe(unzip.Extract({path: argv.dir})).on('close', function () {
      console.log('done');
    })
      .on('error', function (err) {
        console.error('An error occurred:', err);
        process.exitCode = 1;
      });
  });
}
