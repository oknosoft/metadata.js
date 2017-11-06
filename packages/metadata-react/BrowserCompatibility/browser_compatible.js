// Совместимость браузера проверяем по наличию конструкторов Promise, Proxy и Symbol
export default function browser_compatible() {
  // navigator.userAgent.match(/(Chrome|Opera|YaBrowser)/) && !navigator.userAgent.match(/Edge/);
  return typeof Promise == 'function' && typeof Proxy == 'function' && typeof Symbol == 'function';
}
