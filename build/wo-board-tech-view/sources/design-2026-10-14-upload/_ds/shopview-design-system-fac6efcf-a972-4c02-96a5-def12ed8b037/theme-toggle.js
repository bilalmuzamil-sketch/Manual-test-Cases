/* Shopview theming mechanism.
   Sets [data-theme] on <html> to one of: "light" | "dark" | "system".
   - "system" (default) follows the OS via prefers-color-scheme (handled in CSS).
   - "light"/"dark" are explicit overrides.
   Choice persists in localStorage under "sv-theme".
   Usage:
     <script src="theme-toggle.js"></script>
     ShopviewTheme.set("dark");      // explicit
     ShopviewTheme.cycle();          // light -> dark -> system -> light
     ShopviewTheme.get();            // "light" | "dark" | "system"
     ShopviewTheme.resolved();       // actual applied theme, "light" | "dark"
*/
(function () {
  var KEY = 'sv-theme';
  var VALID = ['light', 'dark', 'system'];
  var mql = window.matchMedia('(prefers-color-scheme: dark)');

  function read() {
    var v = null;
    try { v = localStorage.getItem(KEY); } catch (e) {}
    return VALID.indexOf(v) > -1 ? v : 'system';
  }
  function apply(pref) {
    document.documentElement.setAttribute('data-theme', pref);
  }
  function resolved() {
    var p = read();
    if (p === 'system') return mql.matches ? 'dark' : 'light';
    return p;
  }
  function set(pref) {
    if (VALID.indexOf(pref) < 0) pref = 'system';
    try { localStorage.setItem(KEY, pref); } catch (e) {}
    apply(pref);
    dispatch();
  }
  function cycle() {
    var order = ['light', 'dark', 'system'];
    set(order[(order.indexOf(read()) + 1) % order.length]);
  }
  function dispatch() {
    window.dispatchEvent(new CustomEvent('sv-theme-change', {
      detail: { pref: read(), resolved: resolved() }
    }));
  }

  // Apply immediately (before paint) to avoid a flash.
  apply(read());
  // React live to OS changes while in "system".
  mql.addEventListener('change', function () { if (read() === 'system') dispatch(); });

  window.ShopviewTheme = { get: read, set: set, cycle: cycle, resolved: resolved };
})();
