/*!
 metadata.js vPACKAGE_VERSION, built:PACKAGE_BUILT_TIME &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2019
 metadata.js may be freely distributed under the MIT. To obtain _Oknosoft Commercial license_, contact info@oknosoft.ru
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(<%= amd %>, factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(<%= cjs %>);
  } else {
    root.<%= namespace %> = factory(<%= global %>);
  }
}(this, function(<%= param %>) {
<%= contents %>
return <%= exports %>;
}));
