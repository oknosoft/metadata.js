import {GoogleIcon, CouchdbIcon, OfflineIcon, LdapIcon, SamlIcon} from './icons';

export default {
  couchdb: {name: 'Couchdb', Icon: CouchdbIcon},
  ldap: {name: 'LDAP', Icon: LdapIcon},
  google: {name: 'Google', Icon: GoogleIcon},
  saml: {name: 'SAML', Icon: SamlIcon},
  offline: {name: 'Автономный режим', Icon: OfflineIcon},
};

export const directLogins = ['couchdb', 'ldap'];
