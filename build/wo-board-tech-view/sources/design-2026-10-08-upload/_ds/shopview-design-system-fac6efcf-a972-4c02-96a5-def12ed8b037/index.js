/* ============================================================================
   Shopview Design System — THE entry point.
   ----------------------------------------------------------------------------
   This is the only file an artboard needs to know about. Everything the system
   offers is reachable as `SV.<Component>`.

       <link rel="stylesheet" href="colors_and_type.css">
       <link rel="stylesheet" href="components.css">
       <script src="lucide-icons.js"></script>
       <script type="text/babel" src="components/tokens.js"></script>
       <script type="text/babel" src="components/sv-components.jsx"></script>
       <script type="text/babel" src="index.js"></script>

       const { PageShell, Table, Button, StatusBadge } = SV;

   Rules this file exists to enforce:
     1. If a component is in SV, USE IT. Do not rebuild it.
     2. If a component is NOT in SV, say so out loud before building anything.
        `SV.missing('date picker')` prints the sentence to say.
     3. Never reach past this file into a component's source to copy its markup.

   Run `SV.inventory()` in the console to print everything available.
   ========================================================================== */

(function () {
  const W = window;
  const SV = (W.SV = W.SV || {});

  /* --- Components carried over from the earlier generation -----------------
     These predate the component layer. They are token-correct for colour but
     still hardcode type and geometry; they are listed here so they are
     discoverable rather than reinvented, and flagged so we know what is left
     to migrate. */
  const LEGACY = [
    'FilterChip', 'FilterDropdown', 'FilterDropdownWithPills', 'StatusDropdown',
    'SingleSelectDropdown', 'DateRangeDropdown', 'DATE_PRESETS', 'SelectAllRow',
    'ColumnsDropdown', 'COLUMN_DEFS', 'DEFAULT_COLUMNS',
    'GlobalSearchModal', 'SEARCH_TABS',
    'TweaksPanel', 'useTweaks',
    'DesignCanvas', 'DCArtboard', 'DCSection', 'DCPostIt',
    'ShopviewTheme', 'svIcon', 'SV_LUCIDE',
  ];
  /* Resolved lazily, not copied. In the generated bundle the sources run in
     alphabetical order, so `index.js` executes before `lucide-icons.js` and
     `theme-toggle.js` — copying values here would capture `undefined`. */
  LEGACY.forEach((name) => {
    if (Object.prototype.hasOwnProperty.call(SV, name)) return;
    Object.defineProperty(SV, name, {
      configurable: true,
      enumerable: true,
      get() { return W[name]; },
    });
  });

  /* --- What the system does NOT have --------------------------------------
     Known gaps. If a design needs one of these, it is a conversation, not an
     invention. Anything not in SV and not listed here is also a gap. */
  SV.GAPS = {
    'date picker': 'Only DateRangeDropdown (preset list + free-text range) exists. No calendar grid.',
    'file upload': 'Not designed. The upload toast in preview/notifications.html shows the result, not the control.',
    'pagination': 'Not designed. Tables in the product scroll.',
    'stepper / wizard': 'Not designed.',
    'combobox / typeahead': 'GlobalSearchModal is the only search pattern. No inline autocomplete field.',
    'data chart': 'No charting component. --sv-cat-* tokens exist for categorical series.',
    'skeleton / loading': 'No loading state anywhere in the system, including buttons.',
    'empty state illustration': 'By design — Shopview empty states are text only.',
    'mobile navigation': 'Desktop-first. Mobile artboards exist but no mobile nav component.',
  };

  /* Print the sentence to say when something is missing, instead of guessing. */
  SV.missing = function (what) {
    const known = SV.GAPS[String(what).toLowerCase()];
    const line = known
      ? `Shopview DS has no ${what}. ${known} Confirm the approach before I build one.`
      : `Shopview DS has no ${what}, and it is not a known gap either. Confirm before I build one.`;
    console.warn('[Shopview DS] ' + line);
    return line;
  };

  /* Grouped inventory — what an agent or a new colleague should read first. */
  SV.GROUPS = {
    'Layout':     ['PageShell', 'AppHeader', 'SidePanel', 'Card', 'StatCard'],
    'Actions':    ['Button', 'SplitButton', 'Menu', 'MenuRow', 'MenuSection', 'MenuSep'],
    'Forms':      ['Input', 'Select', 'Checkbox', 'Radio', 'Toggle'],
    'Data':       ['Table', 'Badge', 'StatusBadge', 'Tabs'],
    'Feedback':   ['Modal', 'Alert', 'Toast', 'Tooltip'],
    'Navigation': ['Breadcrumbs', 'Tabs'],
    'Filtering':  ['FilterChip', 'FilterDropdown', 'StatusDropdown', 'SingleSelectDropdown', 'DateRangeDropdown', 'ColumnsDropdown'],
    'Search':     ['GlobalSearchModal'],
    'Product':    ['WorkOrdersHeader', 'FilterCheckbox', 'WorkOrdersPage', 'FilterBar'],
    'Icons':      ['Icon', 'svIcon'],
    'Theme':      ['ShopviewTheme'],
  };

  SV.inventory = function () {
    const out = {};
    Object.entries(SV.GROUPS).forEach(([group, names]) => {
      out[group] = names.map((n) => (SV[n] === undefined ? n + ' (NOT LOADED)' : n)).join(', ');
    });
    // eslint-disable-next-line no-console
    console.table(out);
    const gaps = Object.keys(SV.GAPS).join(', ');
    console.info('[Shopview DS] Known gaps — ask before building: ' + gaps);
    return out;
  };

  /* --- Reclaim the names the older files steal ----------------------------
     Sources are concatenated alphabetically, so a later file that assigns the
     same global silently replaces an earlier one. Two names lose that race:

       Checkbox   filter-dropdown.jsx publishes a presentational ({checked,
                  partial}) box with no label and no onChange. variation-a.jsx
                  then renders <Checkbox label="Authorized" /> and the label
                  vanishes, silently.
       AppHeader  filter-bar.jsx publishes the real Work Orders header — six
                  nav items, search, time clock. A genuinely different
                  component that happens to share the name.

     `index.js` sorts after both (i > f), so this is the last word. The
     displaced implementations are not thrown away: they get an honest name so
     they stay reachable. Components that render these internally are
     unaffected — inside the bundle each source is its own closure, so
     filter-bar's WorkOrdersPage keeps using filter-bar's own header. */
  const RECLAIM = {
    Checkbox:  'FilterCheckbox',      // filter-dropdown.jsx
    AppHeader: 'WorkOrdersHeader',    // filter-bar.jsx
  };
  Object.entries(RECLAIM).forEach(([name, keepAs]) => {
    const canonical = SV[name];
    if (typeof canonical !== 'function') return;
    if (W[name] && W[name] !== canonical) {
      if (SV[keepAs] === undefined) SV[keepAs] = W[name];
      W[name] = canonical;
    }
  });

  /* Fail loudly at load time rather than silently rendering a hand-rolled
     lookalike three screens later — but only when the page actually wants
     React components.

     Some pages consume the system as CSS only: they load the bundle for the
     tokens and the sv-* classes and never load React. Every JSX section of
     the bundle then fails with "React is not defined", which is expected on
     such a page. Shouting about missing components there is noise, and it
     buries the errors that do matter. */
  const CORE = ['Button', 'Input', 'Badge', 'Card', 'Table', 'Modal', 'Menu', 'Tooltip', 'Alert', 'PageShell'];
  const absent = CORE.filter((n) => SV[n] === undefined);
  if (absent.length) {
    if (typeof React === 'undefined') {
      console.info(
        '[Shopview DS] No React on this page, so the React component layer is unavailable — expected ' +
        'for a CSS-only page. The sv-* classes in components.css and every --sv-* token work regardless.'
      );
    } else {
      console.error(
        '[Shopview DS] index.js loaded but these core components are missing: ' + absent.join(', ') +
        '. components/sv-components.jsx has probably not been loaded. Do NOT rebuild them by hand.'
      );
    }
  }

  SV.version = '2.0.0';
})();
