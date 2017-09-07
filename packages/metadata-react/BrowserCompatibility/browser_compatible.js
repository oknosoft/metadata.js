/**
 *
 *
 * @module browser_compatible
 *
 * Created by Evgeniy Malyarov on 07.09.2017.
 */

export default function browser_compatible() {
  return navigator.userAgent.match(/(Chrome|Opera|YaBrowser)/) && !navigator.userAgent.match(/Edge/);
}
