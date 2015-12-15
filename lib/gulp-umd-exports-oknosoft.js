/*!
 &copy; http://www.oknosoft.ru 2014-2015
 @license content of this file is covered by Oknosoft Commercial license. Usage without proper license is prohibited. To obtain it contact info@oknosoft.ru
 @author Evgeniy Malyarov
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
