/*
 * Dropdown Search bookmarklet - readable source.
 *
 * Opens a small floating search box. As you type it lists every matching
 * option from:
 *   1. every visible native <select> on the page (closed or open), and
 *   2. every custom dropdown / menu that is OPEN right now
 *      (Quasar q-select / q-menu, ARIA listbox / menu, Bootstrap, Select2,
 *       Ant Design, MUI Autocomplete, Vuetify).
 * Non-matching items in an open custom menu are hidden in place, matches are
 * outlined. Enter (or a click on a result) selects the option.
 *
 * Keys: Down/Up = move, Enter = select, Esc = close. Clicking the bookmarklet
 * again also closes it.
 *
 * RULES FOR EDITING THIS FILE (build.js packs it into one line):
 *   - block comments only, never line comments;
 *   - end every statement with a semicolon;
 *   - no comment markers inside string literals.
 * After editing run:  node build.js   (regenerates bookmarklet.txt + install.html)
 */
(function () {
  var PANEL_ID = '__dd_search_panel__';
  var existing = document.getElementById(PANEL_ID);
  if (existing && existing.__ddClose) { existing.__ddClose(); return; }

  var MAX_RESULTS = 300;

  var OPTION_SELECTOR = [
    '[role="option"]', '[role="menuitem"]', '[role="menuitemradio"]', '[role="menuitemcheckbox"]',
    '.q-menu .q-item', '.dropdown-menu .dropdown-item', '.dropdown-menu > li',
    '.select2-results__option', '.ant-select-item-option', '.MuiAutocomplete-option',
    '.v-menu__content .v-list-item', '.v-overlay__content .v-list-item'
  ].join(',');

  var CONTAINER_SELECTOR = [
    '[role="listbox"]', '[role="menu"]', '.q-menu', '.dropdown-menu', '.select2-results',
    '.ant-select-dropdown', '.MuiAutocomplete-popper', '.v-menu__content', '.v-overlay__content'
  ].join(',');

  var items = [];
  var active = 0;
  var touched = [];
  var scanTimer = null;
  var drag = null;

  /* ---------- small helpers ---------- */
  function norm(s) { return (s || '').replace(/\s+/g, ' ').trim(); }
  function terms(q) { return norm(q).toLowerCase().split(' ').filter(Boolean); }
  function matches(text, t) {
    var low = text.toLowerCase();
    for (var i = 0; i < t.length; i++) { if (low.indexOf(t[i]) === -1) { return false; } }
    return true;
  }
  function el(tag, css, text) {
    var e = document.createElement(tag);
    if (css) { e.style.cssText = css; }
    if (text != null) { e.textContent = text; }
    return e;
  }
  function isShown(e) {
    if (e.hasAttribute('data-dd-hidden')) { return true; }
    if (!e.getClientRects().length) { return false; }
    var cs = getComputedStyle(e);
    return cs.visibility !== 'hidden' && cs.display !== 'none';
  }
  function textOfIds(ids) {
    return norm((ids || '').split(/\s+/).map(function (id) {
      var t = id && document.getElementById(id);
      return t ? t.textContent : '';
    }).join(' '));
  }
  function labelFor(node) {
    if (!node) { return ''; }
    var l = node.getAttribute('aria-label');
    if (l) { return norm(l); }
    l = textOfIds(node.getAttribute('aria-labelledby'));
    if (l) { return l; }
    if (node.labels && node.labels.length) { return norm(node.labels[0].textContent); }
    var field = node.closest && node.closest('.q-field');
    if (field) {
      var ql = field.querySelector('.q-field__label');
      if (ql) { return norm(ql.textContent); }
    }
    return '';
  }

  /* ---------- panel ---------- */
  var panel = el('div',
    'position:fixed;top:12px;right:12px;z-index:2147483647;width:380px;max-width:calc(100vw - 24px);' +
    'background:#fff;color:#1f2328;border:1px solid #8c959f;border-radius:8px;' +
    'box-shadow:0 8px 28px rgba(0,0,0,.28);font:13px/1.35 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;' +
    'text-align:left;letter-spacing:normal;');
  panel.id = PANEL_ID;

  var header = el('div',
    'display:flex;align-items:center;gap:8px;padding:6px 8px;background:#1f6feb;color:#fff;' +
    'border-radius:7px 7px 0 0;cursor:move;user-select:none;');
  header.setAttribute('data-dd-drag', '1');
  var title = el('div', 'flex:1;font-weight:600;', 'Dropdown search');
  title.setAttribute('data-dd-drag', '1');
  var closeBtn = el('button',
    'all:unset;cursor:pointer;padding:0 6px;font-size:16px;line-height:1;color:#fff;', '×');
  closeBtn.setAttribute('data-dd-close', '1');
  closeBtn.title = 'Close (Esc)';
  header.appendChild(title);
  header.appendChild(closeBtn);

  var input = el('input',
    'box-sizing:border-box;display:block;width:calc(100% - 16px);margin:8px;padding:6px 8px;' +
    'border:1px solid #8c959f;border-radius:6px;font:inherit;color:#1f2328;background:#fff;outline:none;');
  input.type = 'text';
  input.placeholder = 'Type to search dropdown options…';
  input.setAttribute('autocomplete', 'off');
  input.setAttribute('aria-label', 'Search dropdown options');

  var status = el('div', 'padding:0 10px 6px;color:#57606a;font-size:12px;');
  var list = el('div', 'max-height:55vh;overflow:auto;border-top:1px solid #d0d7de;');
  list.setAttribute('role', 'listbox');

  panel.appendChild(header);
  panel.appendChild(input);
  panel.appendChild(status);
  panel.appendChild(list);

  /* ---------- in-place filtering of open custom menus ---------- */
  function touch(node) {
    if (node.hasAttribute('data-dd-touched')) { return; }
    node.setAttribute('data-dd-touched', '1');
    touched.push({ node: node, display: node.style.display, outline: node.style.outline, offset: node.style.outlineOffset });
  }
  function restoreAll() {
    for (var i = 0; i < touched.length; i++) {
      var t = touched[i];
      t.node.style.display = t.display;
      t.node.style.outline = t.outline;
      t.node.style.outlineOffset = t.offset;
      t.node.removeAttribute('data-dd-touched');
      t.node.removeAttribute('data-dd-hidden');
    }
    touched = [];
  }

  /* ---------- scanning ---------- */
  function scan() {
    restoreAll();
    var t = terms(input.value);
    var found = [];
    var hiddenCount = 0;

    /* 1. native selects */
    var selects = document.querySelectorAll('select');
    for (var s = 0; s < selects.length; s++) {
      var sel = selects[s];
      if (panel.contains(sel) || sel.disabled || !isShown(sel)) { continue; }
      var selLabel = labelFor(sel) || sel.name || sel.id || ('Dropdown ' + (s + 1));
      for (var o = 0; o < sel.options.length; o++) {
        var opt = sel.options[o];
        var text = norm(opt.label || opt.text);
        if (!text || !matches(text, t)) { continue; }
        var grp = opt.parentNode && opt.parentNode.tagName === 'OPTGROUP' ? ' › ' + norm(opt.parentNode.label) : '';
        found.push({ kind: 'native', select: sel, option: opt, text: text, source: selLabel + grp, disabled: opt.disabled, selected: opt.selected });
      }
    }

    /* 2. open custom menus */
    var nodes = Array.prototype.slice.call(document.querySelectorAll(OPTION_SELECTOR));
    var cands = nodes.filter(function (n) {
      return n.tagName !== 'OPTION' && !panel.contains(n) && isShown(n);
    });
    /* keep the innermost element when two candidates are nested */
    cands = cands.filter(function (n) {
      for (var i = 0; i < cands.length; i++) { if (cands[i] !== n && n.contains(cands[i])) { return false; } }
      return true;
    });
    var menuNames = [];
    var menuFound = [];
    cands.forEach(function (n) {
      var text = norm(n.innerText || n.textContent);
      if (!text) { return; }
      var box = n.closest(CONTAINER_SELECTOR) || n.parentNode;
      var idx = menuNames.indexOf(box);
      if (idx === -1) { menuNames.push(box); idx = menuNames.length - 1; }
      var owner = box && box.id ? document.querySelector('[aria-controls="' + box.id + '"],[aria-owns="' + box.id + '"]') : null;
      var src = labelFor(box) || labelFor(owner) || ('Open menu ' + (idx + 1));
      var ok = matches(text, t);
      if (t.length) {
        touch(n);
        if (ok) {
          n.style.outline = '2px solid #1f6feb';
          n.style.outlineOffset = '-2px';
        } else {
          n.style.display = 'none';
          n.setAttribute('data-dd-hidden', '1');
          hiddenCount++;
        }
      }
      if (ok) {
        var dis = n.getAttribute('aria-disabled') === 'true' || n.classList.contains('disabled') || n.classList.contains('q-item--disabled');
        var sel2 = n.getAttribute('aria-selected') === 'true' || n.getAttribute('aria-checked') === 'true' || n.classList.contains('q-item--active');
        menuFound.push({ kind: 'custom', node: n, text: text, source: src, disabled: dis, selected: sel2 });
      }
    });

    /* the menu the user just opened is the likeliest target - list it first */
    items = menuFound.concat(found);
    if (active >= items.length) { active = 0; }
    render(t, selects.length, menuNames.length, hiddenCount);
  }

  function scheduleScan() {
    clearTimeout(scanTimer);
    scanTimer = setTimeout(scan, 200);
  }

  /* ---------- rendering ---------- */
  function highlight(target, text, t) {
    var low = text.toLowerCase();
    var marks = [];
    t.forEach(function (term) {
      var from = 0, at;
      while ((at = low.indexOf(term, from)) !== -1) { marks.push([at, at + term.length]); from = at + term.length; }
    });
    marks.sort(function (a, b) { return a[0] - b[0]; });
    var pos = 0;
    marks.forEach(function (m) {
      if (m[0] < pos) { m[0] = pos; }
      if (m[1] <= m[0]) { return; }
      if (m[0] > pos) { target.appendChild(document.createTextNode(text.slice(pos, m[0]))); }
      target.appendChild(el('mark', 'background:#fff8c5;color:inherit;padding:0;', text.slice(m[0], m[1])));
      pos = m[1];
    });
    if (pos < text.length) { target.appendChild(document.createTextNode(text.slice(pos))); }
  }

  function render(t, nSelects, nMenus, hiddenCount) {
    while (list.firstChild) { list.removeChild(list.firstChild); }
    var shown = Math.min(items.length, MAX_RESULTS);
    for (var i = 0; i < shown; i++) {
      var it = items[i];
      var row = el('div',
        'padding:5px 10px;cursor:' + (it.disabled ? 'not-allowed' : 'pointer') + ';border-bottom:1px solid #f0f2f4;' +
        (it.disabled ? 'opacity:.5;' : '') + (i === active ? 'background:#ddf4ff;' : ''));
      row.setAttribute('data-dd-idx', String(i));
      row.setAttribute('role', 'option');
      var main = el('div', 'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;');
      highlight(main, it.text, t);
      if (it.selected) { main.appendChild(el('span', 'color:#1a7f37;margin-left:6px;', '✓ current')); }
      var sub = el('div', 'font-size:11px;color:#57606a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;',
        (it.kind === 'native' ? 'Dropdown: ' : 'Menu: ') + it.source + (it.disabled ? ' (disabled)' : ''));
      row.appendChild(main);
      row.appendChild(sub);
      list.appendChild(row);
    }
    var msg = items.length + ' match' + (items.length === 1 ? '' : 'es');
    if (items.length > shown) { msg += ' (first ' + shown + ' shown)'; }
    msg += ' · ' + nSelects + ' dropdown' + (nSelects === 1 ? '' : 's') + ', ' + nMenus + ' open menu' + (nMenus === 1 ? '' : 's');
    if (hiddenCount) { msg += ' · ' + hiddenCount + ' hidden in menu'; }
    if (!nMenus) { msg += ' · open a custom dropdown to search it too'; }
    status.textContent = msg;
    var cur = list.querySelector('[data-dd-idx="' + active + '"]');
    if (cur && cur.scrollIntoView) { cur.scrollIntoView({ block: 'nearest' }); }
  }

  function setActive(i) {
    if (!items.length) { return; }
    var max = Math.min(items.length, MAX_RESULTS) - 1;
    active = i < 0 ? max : i > max ? 0 : i;
    var rows = list.children;
    for (var r = 0; r < rows.length; r++) { rows[r].style.background = r === active ? '#ddf4ff' : ''; }
    if (rows[active]) { rows[active].scrollIntoView({ block: 'nearest' }); }
  }

  /* ---------- choosing an option ---------- */
  function flash(node) {
    if (!node || !node.style) { return; }
    var o = node.style.outline, off = node.style.outlineOffset;
    node.style.outline = '3px solid #1a7f37';
    node.style.outlineOffset = '2px';
    setTimeout(function () { node.style.outline = o; node.style.outlineOffset = off; }, 1500);
  }
  function fire(node, type, Ctor) {
    var C = Ctor || MouseEvent;
    try { node.dispatchEvent(new C(type, { bubbles: true, cancelable: true, view: window, button: 0 })); } catch (e) { /* older browsers */ }
  }
  function choose(i) {
    var it = items[i];
    if (!it) { return; }
    if (it.disabled) { status.textContent = 'That option is disabled.'; return; }
    if (it.kind === 'native') {
      var sel = it.select;
      if (sel.multiple) { it.option.selected = !it.option.selected; } else { sel.selectedIndex = it.option.index; }
      sel.dispatchEvent(new Event('input', { bubbles: true }));
      sel.dispatchEvent(new Event('change', { bubbles: true }));
      sel.scrollIntoView({ block: 'center' });
      flash(sel);
      scan();
      status.textContent = 'Selected “' + it.text + '” in ' + it.source + '.';
    } else {
      var n = it.node;
      restoreAll();
      n.scrollIntoView({ block: 'nearest' });
      var P = window.PointerEvent || MouseEvent;
      fire(n, 'pointerdown', P);
      fire(n, 'mousedown');
      fire(n, 'pointerup', P);
      fire(n, 'mouseup');
      fire(n, 'click');
      status.textContent = 'Clicked “' + it.text + '” in ' + it.source + '.';
      scheduleScan();
    }
    input.focus();
  }

  /* ---------- events ----------
   * Custom menus (Quasar etc.) close when they see a mousedown / focus change
   * outside themselves. The shield runs on window in the capture phase - before
   * any page listener - handles the panel's own mouse actions, then stops the
   * event so the page never learns the panel was touched. Default actions
   * (focusing the input, placing the caret) still happen.
   */
  function onPanelMouse(e) {
    var tgt = e.target;
    if (e.type === 'mousedown') {
      if (tgt !== input) { e.preventDefault(); }
      if (tgt.closest('[data-dd-drag]') && !tgt.closest('[data-dd-close]')) {
        var r = panel.getBoundingClientRect();
        drag = { dx: e.clientX - r.left, dy: e.clientY - r.top };
      }
    }
    if (e.type === 'click') {
      if (tgt.closest('[data-dd-close]')) { close(); return; }
      var row = tgt.closest('[data-dd-idx]');
      if (row) { var i = +row.getAttribute('data-dd-idx'); setActive(i); choose(i); }
    }
  }
  var SHIELDED = ['pointerdown', 'pointerup', 'mousedown', 'mouseup', 'click', 'dblclick', 'touchstart', 'touchend', 'focusin', 'focusout', 'focus', 'blur'];
  function shield(e) {
    var inside = panel.contains(e.target);
    var toPanel = e.relatedTarget && panel.contains(e.relatedTarget);
    if (inside) {
      onPanelMouse(e);
      e.stopImmediatePropagation();
    } else if (toPanel && (e.type === 'focusout' || e.type === 'blur')) {
      e.stopImmediatePropagation();
    }
  }
  function onMove(e) {
    if (!drag) { return; }
    panel.style.left = Math.max(0, e.clientX - drag.dx) + 'px';
    panel.style.top = Math.max(0, e.clientY - drag.dy) + 'px';
    panel.style.right = 'auto';
  }
  function onUp() { drag = null; }

  function onKey(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); choose(active); }
    else if (e.key === 'Escape') { e.preventDefault(); close(); }
    e.stopPropagation();
  }
  function stopKey(e) { e.stopPropagation(); }

  var observer = new MutationObserver(function (muts) {
    for (var i = 0; i < muts.length; i++) {
      if (!panel.contains(muts[i].target)) { scheduleScan(); return; }
    }
  });

  function close() {
    clearTimeout(scanTimer);
    observer.disconnect();
    restoreAll();
    window.removeEventListener('mousemove', onMove, true);
    window.removeEventListener('mouseup', onUp, true);
    SHIELDED.forEach(function (t) { window.removeEventListener(t, shield, true); });
    if (panel.parentNode) { panel.parentNode.removeChild(panel); }
  }
  panel.__ddClose = close;

  /* drag listeners are registered before the shield so they still see mouseup */
  window.addEventListener('mousemove', onMove, true);
  window.addEventListener('mouseup', onUp, true);
  SHIELDED.forEach(function (t) { window.addEventListener(t, shield, true); });
  input.addEventListener('input', function () { active = 0; scan(); });
  input.addEventListener('keydown', onKey);
  input.addEventListener('keyup', stopKey);
  input.addEventListener('keypress', stopKey);

  (document.body || document.documentElement).appendChild(panel);
  observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
  scan();
  input.focus();
})();
