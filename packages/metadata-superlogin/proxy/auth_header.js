function getBasicAuthHeaders({prefix = 'Basic ', username, password}) {
  return {Authorization: `${prefix} ${new Buffer(username + ':' + password, 'utf8').toString('base64')}`};
}

module.exports = {getBasicAuthHeaders};
