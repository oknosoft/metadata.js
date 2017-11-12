// Совместимость браузера проверяем по наличию конструкторов Promise, Proxy и Symbol
export default function browser_compatible(ie11) {
  // navigator.userAgent.match(/(Chrome|Opera|YaBrowser)/) && !navigator.userAgent.match(/Edge/);

  return (typeof Promise == 'function' && typeof Proxy == 'function' && typeof Symbol == 'function') ||
    (ie11 && navigator.userAgent.match(/Trident\/7.0/) && navigator.userAgent.match(/11.0/));
}
