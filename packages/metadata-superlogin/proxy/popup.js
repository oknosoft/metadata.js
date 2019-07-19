/**
 * ### Окно авторизации
 *
 * @module popup
 *
 * Created by Evgeniy Malyarov on 14.06.2019.
 */

export default function oAuthPopup(url, options = {}) {
  return new Promise((resolve, reject) => {
    let _oauthComplete = false;
    options.windowName = options.windowTitle ||	'Social Login';
    options.windowOptions = options.windowOptions || 'location=0,status=0,directories=no,width=600,height=400';
    const _oauthWindow = window.open(url, options.windowName, options.windowOptions);

    if (!_oauthWindow) {
      reject({ error: 'Authorization popup blocked' });
    }

    const _oauthInterval = setInterval(() => {
      if (_oauthWindow.closed) {
        clearInterval(_oauthInterval);
        if (!_oauthComplete) {
          reject({ error: 'Authorization cancelled' });
        }
      }
    }, 500);

    window.superlogin = {
      oauthSession(err, user, info = {}) {
        if (!err && user) {
          info.serverTimeDiff = user.issued - Date.now();
          return resolve({user, info});
        }
        else if (!err && info) {
          return resolve(info);
        }
        _oauthComplete = true;
        return reject(err);
      }
    };
  });
}
