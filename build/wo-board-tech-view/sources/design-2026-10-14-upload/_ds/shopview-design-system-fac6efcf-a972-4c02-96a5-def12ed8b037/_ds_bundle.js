/* @ds-bundle: {"format":4,"namespace":"ShopviewDesignSystem_fac6ef","components":[],"sourceHashes":{"ai-agent-icon.js":"21f83ea55205","badge.jsx":"b39fc5665c42","columns-dropdown.jsx":"961434ca6f6f","components/sv-components.jsx":"ed35b760e730","components/tokens.js":"3103beb7c2f1","design-canvas.jsx":"862a6db59c7c","filter-bar.jsx":"b8ba67216eed","filter-chip.jsx":"ca450d9f3b8b","filter-dropdown.jsx":"d74e9eb73af0","global-search.jsx":"8ce760104ad9","index.js":"d1ca3f5bd1fe","lucide-icons.js":"2028bf8ec4b7","mobile-filters.jsx":"7ba67a64ed57","mobile-global-search.jsx":"b354881d6ddb","mobile-work-orders.jsx":"970887d27572","theme-toggle.js":"d783a00d8146","tweaks-panel.jsx":"a1107c630a56","work-orders.jsx":"d0d32dcd483d"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ShopviewDesignSystem_fac6ef = window.ShopviewDesignSystem_fac6ef || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// ai-agent-icon.js
try { (() => {
/**
 * <ai-agent-icon> — Animated AI agent gear-cog icon
 * ShopView Design System
 *
 * Attributes:
 *   size    — display size in px (default: 24)
 *   color   — stroke/fill color (default: currentColor)
 *   state   — "idle" | "thinking" (default: "idle")
 *
 * Usage:
 *   <script src="ai-agent-icon.js"></script>
 *   <ai-agent-icon size="24"></ai-agent-icon>
 *   <ai-agent-icon size="32" state="thinking" color="#fff"></ai-agent-icon>
 */

class AiAgentIcon extends HTMLElement {
  static get observedAttributes() {
    return ['size', 'color', 'state'];
  }
  constructor() {
    super();
    this._root = this.attachShadow({
      mode: 'open'
    });
    this._blinkTimer = null;
    this._spinBusy = false;
  }
  connectedCallback() {
    this._render();
  }
  disconnectedCallback() {
    clearTimeout(this._blinkTimer);
  }
  attributeChangedCallback() {
    if (this.isConnected) this._render();
  }
  get _size() {
    return parseFloat(this.getAttribute('size') ?? '24');
  }
  get _color() {
    return this.getAttribute('color') ?? 'currentColor';
  }
  get _state() {
    return this.getAttribute('state') ?? 'idle';
  }

  // ── Gear path ────────────────────────────────────────────────────────────
  // Cubic beziers with tangent-matched control points → G1-continuous joins.
  _buildGear() {
    const cx = 12,
      cy = 12,
      Ro = 11.1,
      Ri = 8.9,
      n = 8;
    const step = Math.PI * 2 / n;
    const th = step * 0.13; // half-angle of tooth tip
    const sl = step * 0.20; // slope width (higher = gentler transition)
    const k = 0.52; // bezier tension

    const fmt = (r, a) => `${(cx + r * Math.cos(a)).toFixed(3)} ${(cy + r * Math.sin(a)).toFixed(3)}`;
    const cp = (r, a, dist, dir) => {
      const x = cx + r * Math.cos(a) + dir * dist * -Math.sin(a);
      const y = cy + r * Math.sin(a) + dir * dist * Math.cos(a);
      return `${x.toFixed(3)} ${y.toFixed(3)}`;
    };
    let d = '';
    for (let i = 0; i < n; i++) {
      const m = i * step - Math.PI / 2;
      const aVL = m - th - sl;
      const aTL = m - th;
      const aTR = m + th;
      const aVR = m + th + sl;
      const aVLn = (i + 1) * step - Math.PI / 2 - th - sl;
      const di = Ri * sl * k;
      const do_ = Ro * sl * k;
      if (i === 0) d += `M${fmt(Ri, aVL)}`;
      d += ` C${cp(Ri, aVL, di, +1)} ${cp(Ro, aTL, do_, -1)} ${fmt(Ro, aTL)}`;
      d += ` A${Ro} ${Ro} 0 0 1 ${fmt(Ro, aTR)}`;
      d += ` C${cp(Ro, aTR, do_, +1)} ${cp(Ri, aVR, di, -1)} ${fmt(Ri, aVR)}`;
      d += ` A${Ri} ${Ri} 0 0 1 ${fmt(Ri, aVLn)}`;
    }
    return d + ' Z';
  }

  // ── Render ───────────────────────────────────────────────────────────────
  _render() {
    clearTimeout(this._blinkTimer);
    this._spinBusy = false;
    const size = this._size;
    const color = this._color;
    const thinking = this._state === 'thinking';
    const gearD = this._buildGear();
    this._root.innerHTML = `
      <style>
        :host {
          display: inline-block;
          line-height: 0;
          cursor: pointer;
        }

        svg { display: block; overflow: visible; }

        /* Gear */
        .gear {
          transform-box: fill-box;
          transform-origin: 50% 50%;
        }
        .gear.thinking {
          animation: spin-loop 3.6s linear infinite;
        }

        /* Eyes */
        .eye-dot {
          transform-box: fill-box;
          transform-origin: 50% 50%;
          animation: look 6s ease-in-out infinite;
        }
        .eye-dot.thinking {
          animation: pulse 1.1s ease-in-out infinite;
        }
        .eye-l {
          transform-box: fill-box;
          transform-origin: 50% 50%;
        }
        .eye-l.blink {
          animation: blink .22s ease-in-out forwards;
        }

        /* Keyframes */
        @keyframes spin-once {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes spin-loop {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes look {
          0%,  10%  { transform: translateX(0px); }
          22%, 42%  { transform: translateX(-.65px); }
          52%, 72%  { transform: translateX(.65px); }
          82%, 100% { transform: translateX(0px); }
        }
        @keyframes pulse {
          0%,100% { transform: scale(1);   opacity: 1; }
          50%     { transform: scale(.54); opacity: .45; }
        }
        @keyframes blink {
          0%   { transform: scaleY(1); }
          38%  { transform: scaleY(.06); }
          100% { transform: scaleY(1); }
        }
      </style>

      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"
           style="color:${color}">
        <g class="gear${thinking ? ' thinking' : ''}">
          <path d="${gearD}" stroke="currentColor" stroke-width="2"
                stroke-linejoin="round" stroke-linecap="round" fill="none"/>
        </g>
        <g class="eye-l">
          <circle cx="8.8" cy="12" r="1.3" fill="currentColor"
                  class="eye-dot${thinking ? ' thinking' : ''}"/>
        </g>
        <circle cx="15.2" cy="12" r="1.3" fill="currentColor"
                class="eye-dot${thinking ? ' thinking' : ''}"/>
      </svg>`;
    if (!thinking) {
      this._initHover();
      this._scheduleBlink();
    }
  }

  // ── Hover spin ───────────────────────────────────────────────────────────
  _initHover() {
    const svg = this._root.querySelector('svg');
    const gear = this._root.querySelector('.gear');
    svg.addEventListener('mouseenter', () => {
      if (this._spinBusy || this._state === 'thinking') return;
      this._spinBusy = true;
      gear.style.animation = 'none';
      gear.getBoundingClientRect(); // force reflow
      gear.style.animation = 'spin-once 1.05s cubic-bezier(0,0,.18,1) forwards';
      gear.addEventListener('animationend', () => {
        gear.style.animation = '';
        this._spinBusy = false;
      }, {
        once: true
      });
    });
  }

  // ── Blink scheduler ──────────────────────────────────────────────────────
  _scheduleBlink() {
    this._blinkTimer = setTimeout(() => {
      if (this._state === 'thinking') return;
      const eyeL = this._root.querySelector('.eye-l');
      if (eyeL) {
        eyeL.classList.remove('blink');
        eyeL.getBoundingClientRect();
        eyeL.classList.add('blink');
        eyeL.addEventListener('animationend', () => eyeL.classList.remove('blink'), {
          once: true
        });
      }
      this._scheduleBlink();
    }, 2000 + Math.random() * 5000);
  }
}

/* Guarded: this file is also concatenated into _ds_bundle.js, so on a page that
   loads both the bundle and this file directly, define() would throw
   "the name has already been used with this registry". The throw was landing in
   ShopviewDesignSystem_fac6ef.__errors on every consumer. */
if (!customElements.get('ai-agent-icon')) {
  customElements.define('ai-agent-icon', AiAgentIcon);
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ai-agent-icon.js", error: String((e && e.message) || e) }); }

// badge.jsx
try { (() => {
/* Badge — legacy standalone entry.
 * ----------------------------------------------------------------------------
 * Badge is owned by the component layer (components/sv-components.jsx →
 * SV.Badge). This file exists because the standalone artboards — Filters V2,
 * Global Search Page, the mobile screens — list their own <script> tags and
 * load `badge.jsx` directly, without the component layer. Emptying this file
 * takes `Badge` away from all of them.
 *
 * So it still defines Badge, but ONLY if nothing has defined it yet.
 *
 *   bundle:      badge.jsx (b) runs before components/… (c), defines Badge,
 *                and the component layer then replaces it. Canonical wins,
 *                and the old clobbering is gone.
 *   standalone:  nothing else defines Badge, so this one serves the artboard.
 *
 * Do not remove the guard, and do not add new components here — put them in
 * the component layer or they will start winning by load order again.
 */
if (typeof window.Badge !== 'function') {
  const BADGE_TONES = {
    success: {
      bg: "var(--sv-success-fill)",
      border: "var(--sv-success-border)",
      text: "var(--sv-success-text)"
    },
    warning: {
      bg: "var(--sv-warning-fill)",
      border: "var(--sv-warning-border)",
      text: "var(--sv-warning-text)"
    },
    danger: {
      bg: "var(--sv-danger-fill)",
      border: "var(--sv-danger-border)",
      text: "var(--sv-danger-text)"
    },
    info: {
      bg: "var(--sv-info-fill)",
      border: "var(--sv-info-border)",
      text: "var(--sv-info-text)"
    },
    neutral: {
      bg: "var(--sv-surface-sunken)",
      border: "var(--sv-border-strong)",
      text: "var(--sv-text-primary)"
    }
  };
  const STATUS_TONE = {
    "Estimate": "info",
    "Approved": "info",
    "In progress": "info",
    "Imported": "neutral",
    "Review": "warning",
    "Declined": "danger",
    "Complete": "success",
    "Invoiced": "success",
    "Paid": "success"
  };
  const BADGE_SIZES = {
    md: {
      height: 22,
      padding: "2px 8px",
      fontSize: 11,
      lineHeight: "11px",
      fontWeight: 500,
      letterSpacing: "normal"
    },
    sm: {
      height: 18,
      padding: "1px 7px",
      fontSize: 10,
      lineHeight: "10px",
      fontWeight: 600,
      letterSpacing: "0.015em"
    }
  };
  function Badge({
    children,
    tone = "neutral",
    size = "md",
    shape = "rounded",
    bordered = true,
    style
  }) {
    // `error` is an accepted alias of `danger`, matching SV.Badge.
    const t = BADGE_TONES[tone === "error" ? "danger" : tone] || BADGE_TONES.neutral;
    const s = BADGE_SIZES[size] || BADGE_SIZES.md;
    return /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: size === "sm" ? 3 : 4,
        height: size === "sm" ? "auto" : s.height,
        padding: s.padding,
        boxSizing: "border-box",
        whiteSpace: size === "sm" ? "normal" : "nowrap",
        fontFamily: "var(--sv-font-ui)",
        fontWeight: s.fontWeight,
        fontSize: s.fontSize,
        lineHeight: s.lineHeight,
        letterSpacing: s.letterSpacing,
        borderRadius: shape === "square" ? 8 : 9999,
        background: t.bg,
        color: t.text,
        border: `1px solid ${bordered ? t.border : "transparent"}`,
        ...style
      }
    }, children);
  }
  window.Badge = Badge;
  if (typeof window.STATUS_TONE !== "object") window.STATUS_TONE = STATUS_TONE;
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "badge.jsx", error: String((e && e.message) || e) }); }

// columns-dropdown.jsx
try { (() => {
// Columns dropdown — toggle which optional table columns are visible.
// Locked columns (On Site, Status, Number, Customer) are shown but not toggleable.
//
// The order below IS the column order in the table. It was previously imposed at
// runtime by an ORDER array in the Work Orders page's own glue, which redefined
// window.COLUMN_DEFS through a property setter; four of the columns existed only
// inside that glue. Both now live here, so the definitions and the order are one
// thing in one place and the promoted TableBackdrop has real cells to render.
//
//   unit / techs        promoted from the Work Orders screen, on by default
//   auth / partsReady   off by default; the user turns them on
//   parts               removed — partsReady replaced it and carries its label

const COLUMN_DEFS = [{
  key: "onsite",
  label: "On Site",
  locked: true
}, {
  key: "status",
  label: "Status",
  locked: true
}, {
  key: "auth",
  label: "Auth",
  on: false
}, {
  key: "partsReady",
  label: "Parts",
  on: false
}, {
  key: "waiting",
  label: "Waiting On Parts",
  on: true
}, {
  key: "number",
  label: "Number",
  locked: true
}, {
  key: "cust",
  label: "Customer",
  locked: true
}, {
  key: "unit",
  label: "Unit #",
  on: true
}, {
  key: "asset",
  label: "Asset",
  on: true
}, {
  key: "vin",
  label: "VIN/Serial #",
  on: true
}, {
  key: "progress",
  label: "Progress",
  on: true
}, {
  key: "tech",
  label: "Lead Technician",
  on: true
}, {
  key: "adv",
  label: "Service Advisor",
  on: true
}, {
  key: "clocked",
  label: "Clocked In",
  on: true
}, {
  key: "lines",
  label: "Lines",
  on: true
}, {
  key: "techs",
  label: "Assigned Tech",
  on: true
}, {
  key: "created",
  label: "Created on",
  on: true
}, {
  key: "invoiced",
  label: "Invoiced Date",
  on: false
}, {
  key: "daysopen",
  label: "Days open",
  on: false
}, {
  key: "returns",
  label: "Returns",
  on: false
}, {
  key: "total",
  label: "Total price",
  on: true
} // always last
];
const DEFAULT_COLUMNS = COLUMN_DEFS.filter(c => c.locked || c.on).map(c => c.key);
function ColumnCheck({
  checked,
  disabled
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      height: 16,
      borderRadius: 4,
      flexShrink: 0,
      display: "grid",
      placeItems: "center",
      border: `1px solid ${checked ? "var(--sv-accent)" : "var(--sv-border-strong)"}`,
      background: checked ? "var(--sv-accent)" : "var(--sv-surface)",
      opacity: disabled ? 0.5 : 1
    }
  }, checked && /*#__PURE__*/React.createElement("svg", {
    width: "10",
    height: "10",
    viewBox: "0 0 12 12",
    fill: "none",
    stroke: "var(--sv-text-on-accent)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2.5 6.5L4.75 8.75L9.5 3.5"
  })));
}

/* `allowKeys` narrows the list to the columns a given view can render — the By
   Lead Tech view has no Lead Technician column, because the rows are already
   grouped by it. `hideLocked` drops the always-on columns from the list rather
   than showing them greyed with a padlock; the Work Orders screen prefers the
   shorter list, other screens prefer knowing they exist. Neither changes what
   the table renders, only what this menu offers. */
function ColumnsDropdown({
  visible,
  onChange,
  width = 288,
  allowKeys = null,
  hideLocked = false
}) {
  const [q, setQ] = React.useState("");
  const [hover, setHover] = React.useState(null);
  const offered = COLUMN_DEFS.filter(c => (!allowKeys || c.locked || allowKeys.includes(c.key)) && !(hideLocked && c.locked));
  const list = offered.filter(c => c.label.toLowerCase().includes(q.toLowerCase()));
  const toggle = key => onChange(visible.includes(key) ? visible.filter(k => k !== key) : COLUMN_DEFS.filter(c => visible.includes(c.key) || c.key === key).map(c => c.key));
  const isDefault = visible.length === DEFAULT_COLUMNS.length && DEFAULT_COLUMNS.every(k => visible.includes(k));
  const optional = offered.filter(c => !c.locked);
  const shownCount = optional.filter(c => visible.includes(c.key)).length;
  const rootRef = React.useRef();
  const [avail, setAvail] = React.useState(null);
  React.useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const measure = () => setAvail(Math.max(180, window.innerHeight - el.getBoundingClientRect().top - 16));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    ref: rootRef,
    style: {
      width,
      background: "var(--sv-surface-overlay)",
      borderRadius: 12,
      border: "1px solid var(--sv-elev-2-border)",
      boxShadow: "var(--sv-elev-2-shadow)",
      overflow: "hidden",
      fontFamily: "var(--sv-font-ui)",
      display: "flex",
      flexDirection: "column",
      maxHeight: avail ? avail : undefined
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      padding: "12px 16px 8px",
      borderBottom: "1px solid var(--sv-border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: "var(--sv-text-primary)"
    }
  }, "Columns"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 500,
      color: "var(--sv-text-secondary)"
    }
  }, shownCount, " of ", optional.length, " shown")), /*#__PURE__*/React.createElement("input", {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "Find a column",
    style: {
      all: "unset",
      boxSizing: "border-box",
      width: "100%",
      height: 34,
      padding: "0 12px",
      borderRadius: 8,
      background: "var(--sv-surface-hover)",
      border: "1px solid var(--sv-border-default)",
      fontFamily: "inherit",
      fontSize: 14,
      color: "var(--sv-text-primary)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      maxHeight: 320,
      overflowY: "auto",
      padding: "6px 0"
    }
  }, list.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 16px",
      fontSize: 14,
      color: "var(--sv-text-secondary)"
    }
  }, "No columns match"), list.map(c => {
    const checked = c.locked || visible.includes(c.key);
    return /*#__PURE__*/React.createElement("div", {
      key: c.key,
      onClick: () => !c.locked && toggle(c.key),
      onMouseEnter: () => setHover(c.key),
      onMouseLeave: () => setHover(null),
      title: c.locked ? "Always shown" : undefined,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 16px",
        cursor: c.locked ? "default" : "pointer",
        background: hover === c.key && !c.locked ? "var(--sv-surface-hover)" : "transparent",
        transition: "background-color 120ms ease-out"
      }
    }, /*#__PURE__*/React.createElement(ColumnCheck, {
      checked: checked,
      disabled: c.locked
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontSize: 14,
        fontWeight: 500,
        color: c.locked ? "var(--sv-text-secondary)" : "var(--sv-text-primary)"
      }
    }, c.label), c.locked && /*#__PURE__*/React.createElement("svg", {
      width: "14",
      height: "14",
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "var(--sv-text-muted)",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "7",
      width: "10",
      height: "7",
      rx: "1.5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M5.5 7V5a2.5 2.5 0 015 0v2"
    })));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      borderTop: "1px solid var(--sv-border-default)",
      padding: "10px 16px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onChange(COLUMN_DEFS.filter(c => c.locked || offered.some(o => o.key === c.key)).map(c => c.key)),
    style: {
      all: "unset",
      cursor: "pointer",
      color: "var(--sv-text-primary)",
      fontWeight: 500,
      fontSize: 14
    }
  }, "Show all"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onChange(DEFAULT_COLUMNS),
    disabled: isDefault,
    style: {
      all: "unset",
      cursor: isDefault ? "default" : "pointer",
      color: isDefault ? "var(--sv-text-disabled)" : "var(--sv-accent)",
      fontWeight: 500,
      fontSize: 14
    }
  }, "Reset to default")));
}
window.COLUMN_DEFS = COLUMN_DEFS;
window.DEFAULT_COLUMNS = DEFAULT_COLUMNS;
window.ColumnsDropdown = ColumnsDropdown;
})(); } catch (e) { __ds_ns.__errors.push({ path: "columns-dropdown.jsx", error: String((e && e.message) || e) }); }

// components/sv-components.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ============================================================================
   Shopview Design System — React component layer
   ----------------------------------------------------------------------------
   Every component renders the `sv-*` classes defined in components.css, so a
   React artboard and a plain-HTML artboard produce byte-identical pixels.

   No component in this file contains a hex colour, a font name, or a themed
   value. If you need a colour, it is a token. If a token does not exist, stop
   and say so — do not invent one.

   Requires, in this order:
     colors_and_type.css      tokens
     components.css           component layer
     lucide-icons.js          svIcon()          (optional, degrades gracefully)
     components/tokens.js     SV_T              (optional, for custom surfaces)
   ========================================================================== */

const {
  useState: useSvState,
  useEffect: useSvEffect,
  useRef: useSvRef,
  useCallback: useSvCallback
} = React;

/* Icon — thin wrapper over the project's Lucide set.
   A missing glyph used to render as an empty box and say nothing, which is
   how `chevron-right` went unnoticed. Now it warns once per name, so a typo
   or a glyph that was never vendored shows up the first time it renders. */
const _svIconWarned = new Set();
function Icon({
  name,
  size = 20,
  style,
  className
}) {
  if (typeof window.svIcon === 'function') {
    const set = window.SV_LUCIDE;
    if (set && !set[name] && !_svIconWarned.has(name)) {
      _svIconWarned.add(name);
      console.warn(`[Shopview DS] No icon named "${name}". It is not in SV_LUCIDE (${set ? Object.keys(set).length : 0} glyphs). ` + 'Pick an existing one, or vendor the glyph into lucide-icons.js — do not ship an empty box.');
    }
    return window.svIcon(name, size, {
      style,
      className
    });
  }
  return /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    className: className,
    style: {
      display: 'inline-block',
      width: size,
      height: size,
      flex: 'none',
      ...style
    }
  });
}
const cx = (...parts) => parts.filter(Boolean).join(' ');

/* ------------------------------------------------------------------ BUTTON */
function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  iconTrailing,
  children,
  className,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: cx('sv-btn', `sv-btn--${variant}`, size === 'sm' && 'sv-btn--sm', className)
  }, rest), icon && /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: size === 'sm' ? 16 : 20
  }), children, iconTrailing && /*#__PURE__*/React.createElement(Icon, {
    name: iconTrailing,
    size: size === 'sm' ? 16 : 20
  }));
}
function SplitButton({
  variant = 'primary',
  children,
  onMain,
  onCaret,
  className,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cx('sv-split', `sv-split--${variant}`, className)
  }, rest), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sv-split__label",
    onClick: onMain
  }, children), /*#__PURE__*/React.createElement("span", {
    className: "sv-split__divider"
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sv-split__caret",
    onClick: onCaret,
    "aria-label": "More actions"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-down",
    size: 14
  })));
}

/* ------------------------------------------------------------------- INPUT
   Floating label. Two requirements the spec makes load-bearing:
     - the <input> renders BEFORE the <label>  (adjacent sibling combinator)
     - placeholder is a single space           (:not(:placeholder-shown))
   Both are handled here so no caller can get them wrong. */
function Input({
  label,
  hint,
  error,
  id,
  className,
  ...rest
}) {
  const auto = useSvRef(`sv-in-${Math.random().toString(36).slice(2, 9)}`);
  const fieldId = id || auto.current;
  return /*#__PURE__*/React.createElement("div", {
    className: className
  }, /*#__PURE__*/React.createElement("div", {
    className: cx('sv-field', error && 'sv-field--error')
  }, /*#__PURE__*/React.createElement("input", _extends({
    id: fieldId,
    placeholder: " "
  }, rest)), /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId
  }, label)), (error || hint) && /*#__PURE__*/React.createElement("div", {
    className: cx('sv-hint', error && 'sv-hint--error')
  }, error || hint));
}

/* Dropdown field. Readonly input + chevron, exactly as the spec draws it. */
function Select({
  label,
  hint,
  error,
  value,
  id,
  className,
  onClick,
  ...rest
}) {
  const auto = useSvRef(`sv-sel-${Math.random().toString(36).slice(2, 9)}`);
  const fieldId = id || auto.current;
  return /*#__PURE__*/React.createElement("div", {
    className: className
  }, /*#__PURE__*/React.createElement("div", {
    className: cx('sv-field', 'sv-field--select', error && 'sv-field--error')
  }, /*#__PURE__*/React.createElement("input", _extends({
    id: fieldId,
    placeholder: " ",
    readOnly: true,
    value: value ?? '',
    onClick: onClick
  }, rest)), /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId
  }, label), /*#__PURE__*/React.createElement("span", {
    className: "sv-field__chevron"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-down",
    size: 16
  }))), (error || hint) && /*#__PURE__*/React.createElement("div", {
    className: cx('sv-hint', error && 'sv-hint--error')
  }, error || hint));
}

/* ---------------------------------------------------------------- CONTROLS
   Checked state is a TINTED fill with an accent glyph — not a solid accent
   fill with a white tick. Verified against preview/controls.html. */
function Checkbox({
  checked = false,
  indeterminate = false,
  disabled = false,
  label,
  onChange,
  className
}) {
  const box = /*#__PURE__*/React.createElement("span", {
    role: "checkbox",
    "aria-checked": indeterminate ? 'mixed' : checked,
    "aria-disabled": disabled || undefined,
    tabIndex: disabled ? -1 : 0,
    className: cx('sv-check', (checked || indeterminate) && 'is-checked', disabled && 'is-disabled', className),
    onClick: () => !disabled && onChange?.(!checked),
    onKeyDown: e => {
      if (!disabled && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        onChange?.(!checked);
      }
    }
  }, (checked || indeterminate) && /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 10 10",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, indeterminate ? /*#__PURE__*/React.createElement("path", {
    d: "M2.5 5h5"
  }) : /*#__PURE__*/React.createElement("path", {
    d: "M1.5 5.2 3.9 7.5 8.5 2.5"
  })));
  if (!label) return box;
  return /*#__PURE__*/React.createElement("label", {
    className: "sv-control-row"
  }, box, label);
}
function Radio({
  checked = false,
  disabled = false,
  label,
  onChange,
  name,
  className
}) {
  const dot = /*#__PURE__*/React.createElement("span", {
    role: "radio",
    "aria-checked": checked,
    "aria-disabled": disabled || undefined,
    tabIndex: disabled ? -1 : 0,
    "data-name": name,
    className: cx('sv-radio', checked && 'is-checked', disabled && 'is-disabled', className),
    onClick: () => !disabled && onChange?.(true),
    onKeyDown: e => {
      if (!disabled && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        onChange?.(true);
      }
    }
  }, checked && /*#__PURE__*/React.createElement("span", {
    className: cx('sv-radio__dot', disabled && 'is-disabled')
  }));
  if (!label) return dot;
  return /*#__PURE__*/React.createElement("label", {
    className: "sv-control-row"
  }, dot, label);
}
function Toggle({
  on = false,
  disabled = false,
  label,
  onChange,
  className
}) {
  const sw = /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "switch",
    "aria-checked": on,
    disabled: disabled,
    className: cx('sv-toggle', on && 'is-on', disabled && 'is-disabled', className),
    onClick: () => !disabled && onChange?.(!on)
  }, /*#__PURE__*/React.createElement("span", {
    className: "sv-toggle__thumb"
  }));
  if (!label) return sw;
  return /*#__PURE__*/React.createElement("label", {
    className: "sv-control-row"
  }, sw, label);
}

/* ------------------------------------------------------------------- BADGE
   tone: success | warning | danger | info | neutral
   `error` is accepted as an alias of `danger` for older artboards. */
function Badge({
  tone = 'neutral',
  size = 'md',
  shape = 'rounded',
  bordered = true,
  children,
  className,
  ...rest
}) {
  const t = tone === 'error' ? 'danger' : tone;
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cx('sv-badge', `sv-badge--${t}`, size === 'sm' && 'sv-badge--sm', shape === 'square' && 'sv-badge--square', !bordered && 'sv-badge--flat', className)
  }, rest), children);
}

/* Two status vocabularies. They are NOT interchangeable — a work order line
   moves through authorisation, an invoice moves through payment. Pick the map
   that matches the column you are rendering. */
const WORK_ORDER_STATUS = {
  'Draft': 'neutral',
  'Imported': 'neutral',
  'Estimate': 'info',
  'Requested': 'warning',
  'Authorization Required': 'warning',
  'Awaiting': 'warning',
  'Review': 'warning',
  'Authorized': 'info',
  'Approved': 'info',
  'In Progress': 'info',
  'Declined': 'danger',
  'Completed': 'success',
  'Complete': 'success'
};
const FINANCE_STATUS = {
  'Estimate': 'info',
  'Invoiced': 'info',
  'Awaiting': 'warning',
  'Partially Paid': 'warning',
  'Overdue': 'danger',
  'Unpaid': 'danger',
  'Paid': 'success'
};

/* Back-compat: the old global `statusTone` resolved both vocabularies from one
   map. Kept so existing artboards render, but new work should pass the map. */
const STATUS_TONE = {
  ...FINANCE_STATUS,
  ...WORK_ORDER_STATUS
};
function statusTone(status, map) {
  return (map || STATUS_TONE)[status] || 'neutral';
}
function StatusBadge({
  status,
  vocabulary = 'workOrder',
  ...rest
}) {
  const map = vocabulary === 'finance' ? FINANCE_STATUS : WORK_ORDER_STATUS;
  return /*#__PURE__*/React.createElement(Badge, _extends({
    tone: map[status] || 'neutral'
  }, rest), status);
}

/* -------------------------------------------------------------------- CARD */
/* `padded={false}` is the older ui_kits spelling of `flush`. Accepted so the
   demo and existing artboards keep working — and destructured rather than
   spread, so it never leaks onto the DOM node as an attribute. */
function Card({
  children,
  flush = false,
  padded,
  className,
  ...rest
}) {
  const isFlush = flush || padded === false;
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cx('sv-card', isFlush && 'sv-card--flush', className)
  }, rest), children);
}

/* -------------------------------------------------------------------- TABS
   Counts render as parenthesised text, matching the spec. They are not pills.
   Selected and hover look identical by design; aria-selected carries meaning. */
function Tabs({
  tabs = [],
  value,
  onChange,
  className
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: cx('sv-tabs', className),
    role: "tablist"
  }, tabs.map(t => {
    const key = t.key ?? t.label;
    return /*#__PURE__*/React.createElement("button", {
      key: key,
      role: "tab",
      type: "button",
      "aria-selected": key === value,
      className: "sv-tab",
      onClick: () => onChange?.(key)
    }, t.label, typeof t.count === 'number' && /*#__PURE__*/React.createElement("span", {
      className: "sv-tab__count"
    }, t.count), t.dropdown && /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-down",
      size: 16,
      className: "sv-tab__chev"
    }));
  }));
}

/* ------------------------------------------------------------------- TABLE
   columns: [{ key, label, numeric?, width?, render?(row) }]
   Row hover, selection and sorting are extensions beyond the spec card and
   are opt-in, so a plain table still matches the documented default exactly. */
/* `onRowClick(row, index, event)` — a screen that opens a detail panel from a
   row used to have to catch clicks on the wrapper and index `tr.rowIndex - 1`
   into its own array. Clicks that start on a control inside the row (the
   selection checkbox, a button in a cell) do not fire it. */
function Table({
  columns = [],
  rows = [],
  getRowKey,
  hover = true,
  selectable = false,
  selected = [],
  onSelect,
  sort,
  onSort,
  onRowClick,
  empty = 'Nothing to show.',
  className
}) {
  const allSelected = selectable && rows.length > 0 && selected.length === rows.length;
  const keyOf = (row, i) => getRowKey ? getRowKey(row, i) : row.id ?? i;
  const rowClick = onRowClick ? (row, i) => e => {
    if (e.target.closest('button, a, input, select, label, [role="menuitem"]')) return;
    onRowClick(row, i, e);
  } : null;
  return /*#__PURE__*/React.createElement("table", {
    className: cx('sv-table', hover && 'sv-table--hover', onRowClick && 'sv-table--clickable', className)
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, selectable && /*#__PURE__*/React.createElement("th", {
    className: "sv-table__check"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    checked: allSelected,
    indeterminate: selected.length > 0 && !allSelected,
    onChange: next => onSelect?.(next ? rows.map(keyOf) : [])
  })), columns.map(c => /*#__PURE__*/React.createElement("th", {
    key: c.key,
    className: c.numeric ? 'sv-num' : undefined,
    style: c.width ? {
      width: c.width
    } : undefined
  }, onSort ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sv-table__sort",
    "aria-sort": sort?.key === c.key ? sort.dir === 'asc' ? 'ascending' : 'descending' : undefined,
    onClick: () => onSort(c.key, sort?.key === c.key && sort.dir === 'asc' ? 'desc' : 'asc')
  }, c.label, /*#__PURE__*/React.createElement(Icon, {
    name: sort?.key === c.key && sort.dir === 'desc' ? 'arrow-down' : 'arrow-up',
    size: 12
  })) : c.label)))), /*#__PURE__*/React.createElement("tbody", null, rows.length === 0 ? /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    className: "sv-table__empty",
    colSpan: columns.length + (selectable ? 1 : 0)
  }, empty)) : rows.map((row, i) => {
    const k = keyOf(row, i);
    const isSel = selectable && selected.includes(k);
    return /*#__PURE__*/React.createElement("tr", {
      key: k,
      "aria-selected": isSel || undefined,
      onClick: rowClick ? rowClick(row, i) : undefined
    }, selectable && /*#__PURE__*/React.createElement("td", {
      className: "sv-table__check"
    }, /*#__PURE__*/React.createElement(Checkbox, {
      checked: isSel,
      onChange: next => onSelect?.(next ? [...selected, k] : selected.filter(x => x !== k))
    })), columns.map(c => /*#__PURE__*/React.createElement("td", {
      key: c.key,
      className: c.numeric ? 'sv-num' : undefined
    }, c.render ? c.render(row) : row[c.key])));
  })));
}

/* ------------------------------------------------------------------- MODAL
   variant 'default'  — 68px title header, radius 12   (600px wide)
   variant 'confirm'  — icon + title + subtitle, radius 8, no body (460px)
   The scrim is rendered here; the spec card omits it but --sv-scrim exists. */
function Modal({
  open = true,
  title,
  subtitle,
  icon,
  tone = 'warning',
  variant = 'default',
  width,
  onClose,
  footer,
  footerSplit = false,
  children,
  className
}) {
  useSvEffect(() => {
    if (!open || !onClose) return undefined;
    const onKey = e => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  const isConfirm = variant === 'confirm';
  const w = width || (isConfirm ? 460 : 600);
  const toneVar = tone === 'error' ? 'danger' : tone;
  return /*#__PURE__*/React.createElement("div", {
    className: "sv-scrim",
    onClick: e => {
      if (e.target === e.currentTarget) onClose?.();
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    "aria-label": title,
    className: cx('sv-modal', isConfirm && 'sv-modal--confirm', className),
    style: {
      width: w
    }
  }, isConfirm ? /*#__PURE__*/React.createElement("div", {
    className: "sv-modal__header sv-modal__header--stacked"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sv-modal__toprow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sv-modal__icon",
    style: {
      background: `var(--sv-${toneVar}-fill)`,
      color: `var(--sv-${toneVar}-text)`
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon || 'circle-alert',
    size: 24
  })), onClose && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sv-modal__close",
    onClick: onClose,
    "aria-label": "Close"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 20
  }))), /*#__PURE__*/React.createElement("div", {
    className: "sv-modal__textblock"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sv-modal__title"
  }, title), subtitle && /*#__PURE__*/React.createElement("div", {
    className: "sv-modal__subtitle"
  }, subtitle))) : /*#__PURE__*/React.createElement("div", {
    className: "sv-modal__header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sv-modal__title"
  }, title), onClose && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sv-modal__close",
    onClick: onClose,
    "aria-label": "Close"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 20
  }))), children && /*#__PURE__*/React.createElement("div", {
    className: cx('sv-modal__body', variant === 'form' && 'sv-modal__body--form')
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    className: cx('sv-modal__footer', footerSplit && 'sv-modal__footer--split')
  }, footer)));
}

/* -------------------------------------------------------------------- MENU
   Compose from MenuRow / MenuSection / MenuSep. `checkable` reserves the 16px
   gutter on every row so labels stay aligned whether or not they are ticked. */
function Menu({
  wide = false,
  children,
  className,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "menu",
    className: cx('sv-menu', wide && 'sv-menu--wide', className)
  }, rest), children);
}
function MenuRow({
  icon,
  children,
  badge,
  kbd,
  submenu,
  checked,
  checkable = false,
  active = false,
  danger = false,
  disabled = false,
  onClick,
  className
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "menuitem",
    disabled: disabled,
    onClick: disabled ? undefined : onClick,
    className: cx('sv-menu__row', active && 'is-active', danger && 'is-danger', disabled && 'is-disabled', className)
  }, checkable ? checked ? /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 16,
    style: {
      color: 'var(--sv-accent)'
    }
  }) : /*#__PURE__*/React.createElement("span", {
    className: "sv-menu__gutter"
  }) : icon && /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 16
  }), /*#__PURE__*/React.createElement("span", {
    className: "sv-menu__label"
  }, children), badge && /*#__PURE__*/React.createElement("span", {
    className: "sv-menu__badge"
  }, badge), kbd && /*#__PURE__*/React.createElement("span", {
    className: "sv-menu__kbd"
  }, kbd), submenu && /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 16,
    className: "sv-menu__chev"
  }));
}
const MenuSection = ({
  children
}) => /*#__PURE__*/React.createElement("div", {
  className: "sv-menu__section"
}, children);
const MenuSep = () => /*#__PURE__*/React.createElement("div", {
  className: "sv-menu__sep",
  role: "separator"
});

/* ----------------------------------------------------------------- TOOLTIP
   placement is where the bubble sits relative to the trigger. The arrow goes
   on the opposite edge — handled here so callers cannot invert it. */
const TT_ARROW = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left'
};
function Tooltip({
  label,
  sub,
  placement = 'top',
  children,
  className
}) {
  const arrow = TT_ARROW[placement];
  const rowAxis = placement === 'left' || placement === 'right';
  const bubble = /*#__PURE__*/React.createElement("div", {
    className: cx('sv-tt', sub && 'sv-tt--has-sub')
  }, /*#__PURE__*/React.createElement("span", {
    className: "sv-tt__label"
  }, label), sub && /*#__PURE__*/React.createElement("span", {
    className: "sv-tt__sub"
  }, sub));
  const arrowEl = /*#__PURE__*/React.createElement("span", {
    className: "sv-tt__arrow"
  });
  // arrow before the bubble when it sits on the bubble's top/left edge
  const first = arrow === 'top' || arrow === 'left';
  return /*#__PURE__*/React.createElement("span", {
    className: cx('sv-tt-host', className)
  }, children, /*#__PURE__*/React.createElement("span", {
    className: `sv-tt-pop sv-tt-pop--${placement}`,
    role: "tooltip"
  }, /*#__PURE__*/React.createElement("span", {
    className: cx('sv-tt-wrap', rowAxis && 'sv-tt-wrap--row', `sv-tt-wrap--arrow-${arrow}`)
  }, first ? arrowEl : null, bubble, first ? null : arrowEl)));
}

/* --------------------------------------------------------- ALERT / TOAST */
const TONE_ICON = {
  success: 'circle-check',
  warning: 'circle-alert',
  danger: 'circle-x',
  info: 'info'
};
function Alert({
  tone = 'info',
  title,
  children,
  icon,
  onClose,
  className
}) {
  const t = tone === 'error' ? 'danger' : tone;
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    className: cx('sv-alert', `sv-alert--${t}`, className)
  }, /*#__PURE__*/React.createElement("span", {
    className: "sv-alert__icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon || TONE_ICON[t],
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    className: "sv-alert__body"
  }, title && /*#__PURE__*/React.createElement("div", {
    className: "sv-alert__title"
  }, title), children && /*#__PURE__*/React.createElement("div", {
    className: "sv-alert__support"
  }, children)), onClose && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sv-alert__close",
    onClick: onClose,
    "aria-label": "Dismiss"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 20
  })));
}
function Toast({
  tone = 'info',
  title,
  meta,
  children,
  icon,
  actions,
  compact = false,
  onClose,
  className
}) {
  const t = tone === 'error' ? 'danger' : tone;
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    className: cx('sv-toast', `sv-toast--${t}`, compact && 'sv-toast--compact', className)
  }, /*#__PURE__*/React.createElement("span", {
    className: "sv-toast__featured"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon || TONE_ICON[t],
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    className: "sv-toast__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sv-toast__title"
  }, title, meta && /*#__PURE__*/React.createElement("span", {
    className: "sv-toast__meta"
  }, meta)), children && /*#__PURE__*/React.createElement("div", {
    className: "sv-toast__support"
  }, children), actions && /*#__PURE__*/React.createElement("div", {
    className: "sv-toast__actions"
  }, actions)), onClose && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sv-toast__close",
    onClick: onClose,
    "aria-label": "Dismiss"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 20
  })));
}

/* -------------------------------------------------------------- BREADCRUMB
   items: [{ label, href?, onClick? }] — the last item renders as current. */
function Breadcrumbs({
  items = [],
  className
}) {
  return /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Breadcrumb",
    className: cx('sv-crumbs', className)
  }, items.map((it, i) => {
    const last = i === items.length - 1;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: it.label
    }, last ? /*#__PURE__*/React.createElement("span", {
      className: "sv-crumbs__current",
      "aria-current": "page"
    }, it.label) : /*#__PURE__*/React.createElement("a", {
      className: "sv-crumbs__link",
      href: it.href || '#',
      onClick: it.onClick
    }, it.label), !last && /*#__PURE__*/React.createElement("span", {
      className: "sv-crumbs__sep"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 16
    })));
  }));
}

/* ------------------------------------------------------------------- SHELL */
const SV_NAV = [{
  key: 'work-orders',
  label: 'Work Orders'
}, {
  key: 'schedule',
  label: 'Schedule'
}, {
  key: 'customers',
  label: 'Customers'
}, {
  key: 'parts',
  label: 'Parts'
}, {
  key: 'reports',
  label: 'Reports'
}];
function Avatar({
  name = '',
  className
}) {
  const initials = name.split(' ').map(x => x[0]).slice(0, 2).join('').toUpperCase();
  return /*#__PURE__*/React.createElement("span", {
    className: cx('sv-avatar', className)
  }, initials);
}

/* Reads every dimension from --sv-header-*. If the bar is the wrong height,
   change the token in colors_and_type.css — not this component. */
function AppHeader({
  active = 'work-orders',
  nav = SV_NAV,
  user = 'Aaron Keating',
  onNavigate,
  onSearch,
  right,
  className
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: cx('sv-header', className)
  }, /*#__PURE__*/React.createElement("span", {
    className: "sv-header__logo"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 30 30",
    fill: "currentColor",
    "aria-label": "Shopview"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "15",
    cy: "15",
    r: "13"
  }))), /*#__PURE__*/React.createElement("nav", {
    className: "sv-header__nav"
  }, nav.map(n => /*#__PURE__*/React.createElement("button", {
    key: n.key,
    type: "button",
    "aria-current": n.key === active ? 'page' : undefined,
    onClick: () => onNavigate?.(n.key)
  }, n.label))), /*#__PURE__*/React.createElement("span", {
    className: "sv-header__spacer"
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sv-header__search",
    onClick: onSearch
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 20
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      textAlign: 'left'
    }
  }, "Search"), /*#__PURE__*/React.createElement("span", {
    className: "sv-kbd"
  }, /*#__PURE__*/React.createElement("span", null, "\u2318"), /*#__PURE__*/React.createElement("span", null, "K"))), /*#__PURE__*/React.createElement("span", {
    className: "sv-header__right"
  }, right, /*#__PURE__*/React.createElement(Avatar, {
    name: user
  })));
}

/* `side="right"` is the detail panel that opens beside a list. The default is
   the left navigation/filter panel. Before this existed, a right-hand panel
   meant overriding the borders inline on every screen that wanted one. */
function SidePanel({
  title,
  children,
  width,
  side = 'left',
  className
}) {
  return /*#__PURE__*/React.createElement("aside", {
    className: cx('sv-side', side === 'right' && 'sv-side--right', className),
    style: width ? {
      width
    } : undefined
  }, title && /*#__PURE__*/React.createElement("div", {
    className: "sv-side__title"
  }, title), children);
}

/* -------------------------------------------------------------------- POPOVER
   Anchors floating content under (or right-aligned to) an element, inside the
   nearest `[data-popover-host]`, and closes on outside click or Escape. This is
   how every filter dropdown in the product opens. It used to live only inside
   filter-bar.jsx, so a screen that wanted a chip with a dropdown had to
   reimplement the anchoring and the outside-click handling by hand. */
function Popover({
  open,
  anchorRef,
  children,
  onClose,
  offset = 8,
  align = 'left',
  panelWidth = 0
}) {
  const [pos, setPos] = React.useState(null);
  const panelRef = React.useRef(null);
  React.useLayoutEffect(() => {
    if (!open || !anchorRef.current) return;
    const place = () => {
      const r = anchorRef.current.getBoundingClientRect();
      const host = anchorRef.current.closest('[data-popover-host]');
      const h = host ? host.getBoundingClientRect() : {
        left: 0,
        top: 0,
        width: window.innerWidth
      };
      let left = align === 'right' ? r.right - h.left - panelWidth : r.left - h.left;
      left = Math.max(8, Math.min(left, (h.width || window.innerWidth) - panelWidth - 8));
      setPos({
        left,
        top: r.bottom - h.top + offset
      });
    };
    place();
    /* the anchor moves when the window resizes or the filter row wraps */
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [open, align, offset, panelWidth]);
  React.useEffect(() => {
    if (!open) return;
    /* outside-click is judged against this popover's own node, not a shared
       document id, so two open popovers cannot mistake each other for
       themselves */
    const onDoc = e => {
      if (anchorRef.current && anchorRef.current.contains(e.target)) return;
      if (panelRef.current && panelRef.current.contains(e.target)) return;
      onClose && onClose();
    };
    const onKey = e => {
      if (e.key === 'Escape') onClose && onClose();
    };
    /* focus leaving the popover closes it too — a modal opened by a shortcut
       (⌘K) takes focus without a click, and tabbing out of the panel should
       not leave it hanging. Judged a frame later, against activeElement: a
       dropdown that autofocuses its search box fires focusin while the panel
       is still mounting, before panelRef exists, and would otherwise read as
       "outside" and close itself. */
    let live = true,
      raf = 0;
    const onFocus = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!live) return; /* this popover already closed — a stale onClose would shut its successor */
        const a = document.activeElement;
        if (!a || a === document.body) return;
        if (anchorRef.current && anchorRef.current.contains(a)) return;
        if (panelRef.current && panelRef.current.contains(a)) return;
        onClose && onClose();
      });
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    document.addEventListener('focusin', onFocus);
    return () => {
      live = false;
      cancelAnimationFrame(raf);
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('focusin', onFocus);
    };
  }, [open, onClose]);
  if (!open || !pos) return null;
  return /*#__PURE__*/React.createElement("div", {
    ref: panelRef,
    className: "sv-popover",
    style: {
      left: pos.left,
      top: pos.top
    }
  }, children);
}

/* Key/value block for detail panels — the "Return · Supplier · RMA #" kind of
   list that every record screen has, and that kept being hand-built as a
   <dl> with inline styles. `items` is [{ label, value }]; a value may be a node. */
function Facts({
  title,
  items = [],
  className
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: cx('sv-facts', className)
  }, title && /*#__PURE__*/React.createElement("div", {
    className: "sv-facts__title"
  }, title), /*#__PURE__*/React.createElement("dl", {
    className: "sv-facts__list"
  }, items.map((it, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: it.key ?? i
  }, /*#__PURE__*/React.createElement("dt", {
    className: "sv-facts__k"
  }, it.label), /*#__PURE__*/React.createElement("dd", {
    className: "sv-facts__v"
  }, it.value ?? /*#__PURE__*/React.createElement("span", {
    className: "sv-facts__empty"
  }, "\u2014"))))));
}
function StatCard({
  label,
  value,
  delta,
  tone = 'info'
}) {
  return /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 'var(--sv-space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sv-stat__label"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "sv-stat__value"
  }, value, delta && /*#__PURE__*/React.createElement(Badge, {
    tone: tone,
    size: "sm"
  }, delta)));
}

/* The single page skeleton. All three existing screens collapse into this;
   use it instead of hand-rolling a layout, so every screen scrolls, pads and
   aligns the same way. */
/* Two page layouts, and they are not interchangeable:

     layout="detail"  (default)  A record, a form, a dashboard. Cards on the
                                 grey canvas, content padded on every side.
     layout="list"               A list screen. White surface, the filter row
                                 on white, and the table runs edge to edge with
                                 no card around it. This is how every list in
                                 Shopview looks, and how WorkOrdersScreen
                                 already renders — the generic shell used to
                                 contradict it, so screens built from the shell
                                 came out with a padded table on grey.

   `filters` is the row of FilterChips under the title; it renders on the list
   layout's white strip. `sidebar.side = 'right'` puts the panel after the
   content, for a detail panel that opens beside the list. */
function PageShell({
  title,
  actions,
  breadcrumbs,
  sidebar,
  stats,
  tabs,
  filters,
  children,
  active = 'work-orders',
  onNavigate,
  header = true,
  layout = 'detail'
}) {
  const isList = layout === 'list';
  const panel = sidebar && /*#__PURE__*/React.createElement(SidePanel, {
    title: sidebar.title,
    side: sidebar.side,
    width: sidebar.width
  }, sidebar.children);
  const right = sidebar && sidebar.side === 'right';
  return /*#__PURE__*/React.createElement("div", {
    className: cx('sv-app', isList && 'sv-app--list')
  }, header && /*#__PURE__*/React.createElement(AppHeader, {
    active: active,
    onNavigate: onNavigate
  }), /*#__PURE__*/React.createElement("div", {
    className: "sv-main"
  }, !right && panel, /*#__PURE__*/React.createElement("div", {
    className: cx('sv-content', isList && 'sv-content--list')
  }, breadcrumbs && /*#__PURE__*/React.createElement(Breadcrumbs, {
    items: breadcrumbs
  }), /*#__PURE__*/React.createElement("div", {
    className: "sv-page-head"
  }, /*#__PURE__*/React.createElement("h1", null, title), /*#__PURE__*/React.createElement("span", {
    className: "sv-page-head__spacer"
  }), actions), stats && /*#__PURE__*/React.createElement("div", {
    className: "sv-stats"
  }, stats), tabs && /*#__PURE__*/React.createElement("div", {
    className: "sv-tabs-row"
  }, tabs), filters && /*#__PURE__*/React.createElement("div", {
    className: "sv-filter-row",
    "data-popover-host": true
  }, filters), isList ? /*#__PURE__*/React.createElement("div", {
    className: "sv-list-body"
  }, children) : children), right && panel));
}

/* Everything published flat (existing artboards use bare globals) and again
   under SV (the documented way to reach the system). */
const SV = {
  Icon,
  Button,
  SplitButton,
  Input,
  Select,
  Checkbox,
  Radio,
  Toggle,
  Badge,
  StatusBadge,
  WORK_ORDER_STATUS,
  FINANCE_STATUS,
  STATUS_TONE,
  statusTone,
  Card,
  Tabs,
  Table,
  Modal,
  Menu,
  MenuRow,
  MenuSection,
  MenuSep,
  Tooltip,
  Alert,
  Toast,
  Breadcrumbs,
  Popover,
  AppHeader,
  SidePanel,
  Facts,
  StatCard,
  PageShell,
  Avatar,
  SV_NAV
};
Object.assign(window, SV, {
  SV
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/sv-components.jsx", error: String((e && e.message) || e) }); }

// components/tokens.js
try { (() => {
/* Shopview DS — token accessors.
 *
 * Components NEVER write a hex or a colour name. They read from SV_T.
 * Every value here is a `var(--sv-*)` reference into colors_and_type.css,
 * so every component themes for free under [data-theme="dark"].
 *
 * Only Tier-2 semantic tokens are exposed. Raw palette steps (--sv-grey-500,
 * --sv-primary-500, …) are deliberately NOT here: they do not flip in dark mode.
 */

const SV_T = {
  // ── surfaces ──────────────────────────────────────────────────────────
  canvas: 'var(--sv-surface-canvas)',
  // page background
  surface: 'var(--sv-surface)',
  // cards, inputs, header
  raised: 'var(--sv-surface-raised)',
  overlay: 'var(--sv-surface-overlay)',
  sunken: 'var(--sv-surface-sunken)',
  // table head, disabled field
  hover: 'var(--sv-surface-hover)',
  selected: 'var(--sv-surface-selected)',
  navSelected: 'var(--sv-surface-nav-selected)',
  inverse: 'var(--sv-surface-inverse)',
  // tooltip bubble
  scrim: 'var(--sv-scrim)',
  // modal backdrop

  // ── text ──────────────────────────────────────────────────────────────
  text: 'var(--sv-text-primary)',
  textSecondary: 'var(--sv-text-secondary)',
  textMuted: 'var(--sv-text-muted)',
  textDisabled: 'var(--sv-text-disabled)',
  textInverse: 'var(--sv-text-inverse)',
  textOnAccent: 'var(--sv-text-on-accent)',
  textOnInverse: 'var(--sv-text-on-inverse)',
  // NOT interchangeable with textInverse in dark

  // ── borders ───────────────────────────────────────────────────────────
  borderSubtle: 'var(--sv-border-subtle)',
  // body row dividers
  border: 'var(--sv-border-default)',
  // containers, header rule
  borderStrong: 'var(--sv-border-strong)',
  // input + secondary button
  borderFocus: 'var(--sv-border-focus)',
  // ── accent ────────────────────────────────────────────────────────────
  accent: 'var(--sv-accent)',
  accentHover: 'var(--sv-accent-hover)',
  accentActive: 'var(--sv-accent-active)',
  accentText: 'var(--sv-accent-text)',
  accentSubtle: 'var(--sv-accent-subtle)',
  accentSubtleText: 'var(--sv-accent-subtle-text)',
  accentOnSolid: 'var(--sv-accent-on-solid)',
  // ── semantic tones ────────────────────────────────────────────────────
  // NOTE: --sv-error-* and --sv-danger-* are byte-identical aliases in both
  // themes. This layer standardises on `danger`. Do not introduce `error`.
  tone: {
    success: {
      base: 'var(--sv-success)',
      fill: 'var(--sv-success-fill)',
      border: 'var(--sv-success-border)',
      text: 'var(--sv-success-text)'
    },
    warning: {
      base: 'var(--sv-warning)',
      fill: 'var(--sv-warning-fill)',
      border: 'var(--sv-warning-border)',
      text: 'var(--sv-warning-text)'
    },
    danger: {
      base: 'var(--sv-danger)',
      fill: 'var(--sv-danger-fill)',
      border: 'var(--sv-danger-border)',
      text: 'var(--sv-danger-text)'
    },
    info: {
      base: 'var(--sv-info)',
      fill: 'var(--sv-info-fill)',
      border: 'var(--sv-info-border)',
      text: 'var(--sv-info-text)'
    },
    neutral: {
      base: 'var(--sv-border-strong)',
      fill: 'var(--sv-surface-sunken)',
      border: 'var(--sv-border-strong)',
      text: 'var(--sv-text-primary)'
    }
  },
  // ── elevation ─────────────────────────────────────────────────────────
  // --sv-shadow-* do NOT theme. --sv-elev-N-* do. Anything raised uses elev.
  elev: [{
    bg: 'var(--sv-elev-0-bg)',
    shadow: 'var(--sv-elev-0-shadow)',
    border: 'var(--sv-elev-0-border)'
  }, {
    bg: 'var(--sv-elev-1-bg)',
    shadow: 'var(--sv-elev-1-shadow)',
    border: 'var(--sv-elev-1-border)'
  }, {
    bg: 'var(--sv-elev-2-bg)',
    shadow: 'var(--sv-elev-2-shadow)',
    border: 'var(--sv-elev-2-border)'
  }, {
    bg: 'var(--sv-elev-3-bg)',
    shadow: 'var(--sv-elev-3-shadow)',
    border: 'var(--sv-elev-3-border)'
  }],
  focusRing: 'var(--sv-focus-ring)',
  // ── radii ─────────────────────────────────────────────────────────────
  radius: {
    xs: 'var(--sv-radius-xs)',
    // 4  — kbd chip, checkbox
    sm: 'var(--sv-radius-sm)',
    // 6  — tab pill, small icon button
    md: 'var(--sv-radius-md)',
    // 8  — button, input, menu, alert, table
    lg: 'var(--sv-radius-lg)',
    // 12 — modal, toast, card
    xl: 'var(--sv-radius-xl)',
    // 16
    pill: 'var(--sv-radius-pill)'
  },
  // ── spacing (name is an index; px = index × 4) ─────────────────────────
  space: {
    1: 'var(--sv-space-1)',
    2: 'var(--sv-space-2)',
    3: 'var(--sv-space-3)',
    4: 'var(--sv-space-4)',
    5: 'var(--sv-space-5)',
    6: 'var(--sv-space-6)',
    8: 'var(--sv-space-8)',
    10: 'var(--sv-space-10)',
    12: 'var(--sv-space-12)',
    16: 'var(--sv-space-16)',
    20: 'var(--sv-space-20)',
    24: 'var(--sv-space-24)',
    32: 'var(--sv-space-32)'
  },
  // ── type ──────────────────────────────────────────────────────────────
  font: 'var(--sv-font-ui)',
  fontDisplay: 'var(--sv-font-display)',
  fontMono: 'var(--sv-font-mono)',
  // Whole type steps, ready to spread: style={{ ...SV_T.type.body }}
  type: {
    h1: {
      fontSize: 'var(--sv-h1-size)',
      lineHeight: 'var(--sv-h1-lh)',
      fontWeight: 'var(--sv-h1-weight)',
      letterSpacing: '-0.01em'
    },
    h2: {
      fontSize: 'var(--sv-h2-size)',
      lineHeight: 'var(--sv-h2-lh)',
      fontWeight: 'var(--sv-h2-weight)'
    },
    h3: {
      fontSize: 'var(--sv-h3-size)',
      lineHeight: 'var(--sv-h3-lh)',
      fontWeight: 'var(--sv-h3-weight)'
    },
    h4: {
      fontSize: 'var(--sv-h4-size)',
      lineHeight: 'var(--sv-h4-lh)',
      fontWeight: 'var(--sv-h4-weight)'
    },
    body: {
      fontSize: 'var(--sv-body-size)',
      lineHeight: 'var(--sv-body-lh)',
      fontWeight: 'var(--sv-body-weight)'
    },
    bodyMed: {
      fontSize: 'var(--sv-body-size)',
      lineHeight: 'var(--sv-body-lh)',
      fontWeight: 'var(--sv-body-medium-weight)'
    },
    bodyBold: {
      fontSize: 'var(--sv-body-size)',
      lineHeight: 'var(--sv-body-lh)',
      fontWeight: 'var(--sv-body-semibold-weight)'
    },
    body2: {
      fontSize: 'var(--sv-body2-size)',
      lineHeight: 'var(--sv-body2-lh)',
      fontWeight: 'var(--sv-body2-weight)',
      letterSpacing: 'var(--sv-body2-tracking)'
    },
    caption: {
      fontSize: 'var(--sv-caption-size)',
      lineHeight: 'var(--sv-caption-lh)',
      fontWeight: 'var(--sv-caption-weight)',
      letterSpacing: 'var(--sv-caption-tracking)'
    }
  },
  // ── header geometry (read these; never hardcode a header height) ───────
  header: {
    height: 'var(--sv-header-height)',
    // 64
    padding: 'var(--sv-header-padding)',
    // 12px 20px 12px 28px — asymmetric on purpose
    gap: 'var(--sv-header-gap)',
    // 16
    logoSize: 'var(--sv-header-logo-size)',
    // 32
    controlHeight: 'var(--sv-header-control-height)',
    // 34
    controlRadius: 'var(--sv-header-control-radius)' // 8
  },
  headerV2: {
    height: 'var(--sv-header-v2-height)',
    // 48 — a DIFFERENT component, not a drift
    padding: 'var(--sv-header-v2-padding)',
    gap: 'var(--sv-header-v2-gap)',
    logoSize: 'var(--sv-header-v2-logo-size)',
    controlHeight: 'var(--sv-header-v2-control-height)',
    avatarSize: 'var(--sv-header-v2-avatar-size)'
  },
  // ── motion ────────────────────────────────────────────────────────────
  motion: {
    fast: '120ms ease-out',
    label: '160ms cubic-bezier(.2,.8,.2,1)'
  }
};

/* Tone name → token triplet, with a safe fallback. Used by Badge, Alert,
 * Toast, StatCard. `error` is accepted as an alias of `danger` so older
 * artboards keep working, but it is not documented. */
function svTone(name) {
  if (name === 'error') return SV_T.tone.danger;
  return SV_T.tone[name] || SV_T.tone.neutral;
}
Object.assign(window, {
  SV_T,
  svTone
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/tokens.js", error: String((e && e.message) || e) }); }

// design-canvas.jsx
try { (() => {
// DesignCanvas.jsx — Figma-ish design canvas wrapper
// Warm gray grid bg + Sections + Artboards + PostIt notes.
// Artboards are reorderable (grip-drag), deletable, labels/titles are
// inline-editable, and any artboard can be opened in a fullscreen focus
// overlay (←/→/Esc). State persists to a .design-canvas.state.json sidecar
// via the host bridge. No assets, no deps.
//
// Usage:
//   <DesignCanvas>
//     <DCSection id="onboarding" title="Onboarding" subtitle="First-run variants">
//       <DCArtboard id="a" label="A · Dusk" width={260} height={480}>…</DCArtboard>
//       <DCArtboard id="b" label="B · Minimal" width={260} height={480}>…</DCArtboard>
//     </DCSection>
//   </DesignCanvas>

const DC = {
  bg: '#f0eee9',
  grid: 'rgba(0,0,0,0.06)',
  label: 'rgba(60,50,40,0.7)',
  title: 'rgba(40,30,20,0.85)',
  subtitle: 'rgba(60,50,40,0.6)',
  postitBg: '#fef4a8',
  postitText: '#5a4a2a',
  font: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
};

// One-time CSS injection (classes are dc-prefixed so they don't collide with
// the hosted design's own styles).
if (typeof document !== 'undefined' && !document.getElementById('dc-styles')) {
  const s = document.createElement('style');
  s.id = 'dc-styles';
  s.textContent = ['.dc-editable{cursor:text;outline:none;white-space:nowrap;border-radius:3px;padding:0 2px;margin:0 -2px}', '.dc-editable:focus{background:#fff;box-shadow:0 0 0 1.5px #c96442}', '[data-dc-slot]{transition:transform .18s cubic-bezier(.2,.7,.3,1)}', '[data-dc-slot].dc-dragging{transition:none;z-index:10;pointer-events:none}', '[data-dc-slot].dc-dragging .dc-card{box-shadow:0 12px 40px rgba(0,0,0,.25),0 0 0 2px #c96442;transform:scale(1.02)}',
  // isolation:isolate contains artboard content's z-indexes so a
  // z-indexed child (sticky navbar etc.) can't paint over .dc-header or
  // the .dc-menu popover that drops into the top of the card.
  '.dc-card{isolation:isolate;transition:box-shadow .15s,transform .15s}', '.dc-card *{scrollbar-width:none}', '.dc-card *::-webkit-scrollbar{display:none}',
  // Per-artboard header: grip + label on the left, delete/expand on the
  // right. Single flex row; when the artboard's on-screen width is too
  // narrow for both the label yields (ellipsis, then hidden entirely below
  // ~4ch via the container query) and the buttons stay on the row.
  '.dc-header{position:absolute;bottom:100%;left:-4px;margin-bottom:calc(4px * var(--dc-inv-zoom,1));z-index:2;', '  display:flex;align-items:center;container-type:inline-size}', '.dc-labelrow{display:flex;align-items:center;gap:4px;height:24px;flex:1 1 auto;min-width:0}', '.dc-grip{flex:0 0 auto;cursor:grab;display:flex;align-items:center;padding:5px 4px;border-radius:4px;transition:background .12s,opacity .12s}', '.dc-grip:hover{background:rgba(0,0,0,.08)}', '.dc-grip:active{cursor:grabbing}', '.dc-labeltext{flex:1 1 auto;min-width:0;cursor:pointer;border-radius:4px;padding:3px 6px;', '  display:flex;align-items:center;transition:background .12s;overflow:hidden}',
  // Below ~4ch of label room: hide the label entirely, and drop the grip to
  // hover-only (same reveal rule as .dc-btns) so a narrow header is clean
  // until the card is moused.
  '@container (max-width: 110px){', '  .dc-labeltext{display:none}', '  .dc-grip{opacity:0}', '  [data-dc-slot]:hover .dc-grip{opacity:1}', '}', '.dc-labeltext:hover{background:rgba(0,0,0,.05)}', '.dc-labeltext .dc-editable{overflow:hidden;text-overflow:ellipsis;max-width:100%}', '.dc-labeltext .dc-editable:focus{overflow:visible;text-overflow:clip}', '.dc-btns{flex:0 0 auto;margin-left:auto;display:flex;gap:2px;opacity:0;transition:opacity .12s}', '[data-dc-slot]:hover .dc-btns,.dc-btns:has(.dc-menu){opacity:1}', '.dc-expand,.dc-kebab{width:22px;height:22px;border-radius:5px;border:none;cursor:pointer;padding:0;', '  background:transparent;color:rgba(60,50,40,.7);display:flex;align-items:center;justify-content:center;', '  font:inherit;transition:background .12s,color .12s}', '.dc-expand:hover,.dc-kebab:hover{background:rgba(0,0,0,.06);color:#2a251f}',
  // Slot hosting an open menu floats above later siblings (which otherwise
  // paint on top — same z-index:auto, later DOM order) so the popup isn't
  // clipped by the next card.
  '[data-dc-slot]:has(.dc-menu){z-index:10}', '.dc-menu{position:absolute;top:100%;right:0;margin-top:4px;background:#fff;border-radius:8px;', '  box-shadow:0 8px 28px rgba(0,0,0,.18),0 0 0 1px rgba(0,0,0,.05);padding:4px;min-width:160px;z-index:10}', '.dc-menu button{display:block;width:100%;padding:7px 10px;border:0;background:transparent;', '  border-radius:5px;font-family:inherit;font-size:13px;font-weight:500;line-height:1.2;', '  color:#29261b;cursor:pointer;text-align:left;transition:background .12s;white-space:nowrap}', '.dc-menu button:hover{background:rgba(0,0,0,.05)}', '.dc-menu hr{border:0;border-top:1px solid rgba(0,0,0,.08);margin:4px 2px}', '.dc-menu .dc-danger{color:#c96442}', '.dc-menu .dc-danger:hover{background:rgba(201,100,66,.1)}',
  // Chrome (titles / labels / buttons) counter-scales against the viewport
  // zoom so it stays a constant on-screen size. --dc-inv-zoom is set by
  // DCViewport on every transform update and inherits to all descendants —
  // any overlay inside the world (e.g. a TweaksPanel on an artboard) can use
  // it the same way.
  //
  // The header uses transform:scale (out-of-flow, so layout impact doesn't
  // matter) with its world-space width set to card-width / inv-zoom so that
  // after counter-scaling its on-screen width exactly matches the card's —
  // that's what lets the container query + text-overflow behave against the
  // card's visible edge at every zoom level.
  //
  // The section head uses CSS zoom instead of transform so its layout box
  // grows with the counter-scale, pushing the card row down — otherwise the
  // constant-screen-size title would overflow into the (shrinking) world-
  // space gap and overlap the artboard headers at low zoom.
  '.dc-header{width:calc((100% + 4px) / var(--dc-inv-zoom,1));', '  transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom left}', '.dc-sectionhead{zoom:var(--dc-inv-zoom,1)}'].join('\n');
  document.head.appendChild(s);
}
const DCCtx = React.createContext(null);

// ─────────────────────────────────────────────────────────────
// DesignCanvas — stateful wrapper around the pan/zoom viewport.
// Owns runtime state (per-section order, renamed titles/labels, hidden
// artboards, focused artboard). Order/titles/labels/hidden persist to a
// .design-canvas.state.json
// sidecar next to the HTML. Reads go via plain fetch() so the saved
// arrangement is visible anywhere the HTML + sidecar are served together
// (omelette preview, direct link, downloaded zip). Writes go through the
// host's window.omelette bridge — editing requires the omelette runtime.
// Focus is ephemeral.
// ─────────────────────────────────────────────────────────────
const DC_STATE_FILE = '.design-canvas.state.json';
function DesignCanvas({
  children,
  minScale,
  maxScale,
  style
}) {
  const [state, setState] = React.useState({
    sections: {},
    focus: null
  });
  // Hold rendering until the sidecar read settles so the saved order/titles
  // appear on first paint (no source-order flash). didRead gates writes until
  // the read settles so the empty initial state can't clobber a slow read;
  // skipNextWrite suppresses the one echo-write that would otherwise follow
  // hydration.
  const [ready, setReady] = React.useState(false);
  const didRead = React.useRef(false);
  const skipNextWrite = React.useRef(false);
  React.useEffect(() => {
    let off = false;
    fetch('./' + DC_STATE_FILE).then(r => r.ok ? r.json() : null).then(saved => {
      if (off || !saved || !saved.sections) return;
      skipNextWrite.current = true;
      setState(s => ({
        ...s,
        sections: saved.sections
      }));
    }).catch(() => {}).finally(() => {
      didRead.current = true;
      if (!off) setReady(true);
    });
    const t = setTimeout(() => {
      if (!off) setReady(true);
    }, 150);
    return () => {
      off = true;
      clearTimeout(t);
    };
  }, []);
  React.useEffect(() => {
    if (!didRead.current) return;
    if (skipNextWrite.current) {
      skipNextWrite.current = false;
      return;
    }
    const t = setTimeout(() => {
      window.omelette?.writeFile(DC_STATE_FILE, JSON.stringify({
        sections: state.sections
      })).catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [state.sections]);

  // Build registries synchronously from children so FocusOverlay can read
  // them in the same render. Only direct DCSection > DCArtboard children are
  // walked — wrapping them in other elements opts out of focus/reorder.
  const registry = {}; // slotId -> { sectionId, artboard }
  const sectionMeta = {}; // sectionId -> { title, subtitle, slotIds[] }
  const sectionOrder = [];
  React.Children.forEach(children, sec => {
    if (!sec || sec.type !== DCSection) return;
    const sid = sec.props.id ?? sec.props.title;
    if (!sid) return;
    sectionOrder.push(sid);
    const persisted = state.sections[sid] || {};
    const abs = [];
    React.Children.forEach(sec.props.children, ab => {
      if (!ab || ab.type !== DCArtboard) return;
      const aid = ab.props.id ?? ab.props.label;
      if (aid) abs.push([aid, ab]);
    });
    // hidden is scoped to one source revision — when the agent regenerates
    // (artboard-ID set changes), prior deletes don't apply to new content.
    const srcKey = abs.map(([k]) => k).join('\x1f');
    const hidden = persisted.srcKey === srcKey ? persisted.hidden || [] : [];
    const srcIds = [];
    abs.forEach(([aid, ab]) => {
      if (hidden.includes(aid)) return;
      registry[`${sid}/${aid}`] = {
        sectionId: sid,
        artboard: ab
      };
      srcIds.push(aid);
    });
    const kept = (persisted.order || []).filter(k => srcIds.includes(k));
    sectionMeta[sid] = {
      title: persisted.title ?? sec.props.title,
      subtitle: sec.props.subtitle,
      slotIds: [...kept, ...srcIds.filter(k => !kept.includes(k))]
    };
  });
  const api = React.useMemo(() => ({
    state,
    section: id => state.sections[id] || {},
    patchSection: (id, p) => setState(s => ({
      ...s,
      sections: {
        ...s.sections,
        [id]: {
          ...s.sections[id],
          ...(typeof p === 'function' ? p(s.sections[id] || {}) : p)
        }
      }
    })),
    setFocus: slotId => setState(s => ({
      ...s,
      focus: slotId
    }))
  }), [state]);

  // Esc exits focus; any outside pointerdown commits an in-progress rename.
  React.useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') api.setFocus(null);
    };
    const onPd = e => {
      const ae = document.activeElement;
      if (ae && ae.isContentEditable && !ae.contains(e.target)) ae.blur();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPd, true);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPd, true);
    };
  }, [api]);
  return /*#__PURE__*/React.createElement(DCCtx.Provider, {
    value: api
  }, /*#__PURE__*/React.createElement(DCViewport, {
    minScale: minScale,
    maxScale: maxScale,
    style: style
  }, ready && children), state.focus && registry[state.focus] && /*#__PURE__*/React.createElement(DCFocusOverlay, {
    entry: registry[state.focus],
    sectionMeta: sectionMeta,
    sectionOrder: sectionOrder
  }));
}

// ─────────────────────────────────────────────────────────────
// DCViewport — transform-based pan/zoom (internal)
//
// Input mapping (Figma-style):
//   • trackpad pinch  → zoom   (ctrlKey wheel; Safari gesture* events)
//   • trackpad scroll → pan    (two-finger)
//   • mouse wheel     → zoom   (notched; distinguished from trackpad scroll)
//   • middle-drag / primary-drag-on-bg → pan
//
// Transform state lives in a ref and is written straight to the DOM
// (translate3d + will-change) so wheel ticks don't go through React —
// keeps pans at 60fps on dense canvases.
// ─────────────────────────────────────────────────────────────
function DCViewport({
  children,
  minScale = 0.1,
  maxScale = 8,
  style = {}
}) {
  const vpRef = React.useRef(null);
  const worldRef = React.useRef(null);
  const tf = React.useRef({
    x: 0,
    y: 0,
    scale: 1
  });
  // Persist viewport across reloads so the user lands back where they were
  // after an agent edit or browser refresh. The sandbox origin is already
  // per-project; pathname keeps multiple canvas files in one project apart.
  const tfKey = 'dc-viewport:' + location.pathname;
  const saveT = React.useRef(0);
  const lastPostedScale = React.useRef();
  const apply = React.useCallback(() => {
    const {
      x,
      y,
      scale
    } = tf.current;
    const el = worldRef.current;
    if (!el) return;
    el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    // Exposed for zoom-invariant chrome (labels, buttons, TweaksPanel).
    el.style.setProperty('--dc-inv-zoom', String(1 / scale));
    // Keep the host toolbar's % readout in sync with the canvas scale. Pan
    // ticks leave scale unchanged — skip the cross-frame post for those.
    if (lastPostedScale.current !== scale) {
      lastPostedScale.current = scale;
      window.parent.postMessage({
        type: '__dc_zoom',
        scale
      }, '*');
    }
    clearTimeout(saveT.current);
    saveT.current = setTimeout(() => {
      try {
        localStorage.setItem(tfKey, JSON.stringify(tf.current));
      } catch {}
    }, 200);
  }, [tfKey]);
  React.useLayoutEffect(() => {
    const flush = () => {
      clearTimeout(saveT.current);
      try {
        localStorage.setItem(tfKey, JSON.stringify(tf.current));
      } catch {}
    };
    try {
      const s = JSON.parse(localStorage.getItem(tfKey) || 'null');
      if (s && Number.isFinite(s.x) && Number.isFinite(s.y) && Number.isFinite(s.scale)) {
        tf.current = {
          x: s.x,
          y: s.y,
          scale: Math.min(maxScale, Math.max(minScale, s.scale))
        };
        apply();
      }
    } catch {}
    // Flush on pagehide and unmount so a reload within the 200ms debounce
    // window doesn't drop the last pan/zoom.
    window.addEventListener('pagehide', flush);
    return () => {
      window.removeEventListener('pagehide', flush);
      flush();
    };
  }, []);
  React.useEffect(() => {
    const vp = vpRef.current;
    if (!vp) return;
    const zoomAt = (cx, cy, factor) => {
      const r = vp.getBoundingClientRect();
      const px = cx - r.left,
        py = cy - r.top;
      const t = tf.current;
      const next = Math.min(maxScale, Math.max(minScale, t.scale * factor));
      const k = next / t.scale;
      // keep the world point under the cursor fixed
      t.x = px - (px - t.x) * k;
      t.y = py - (py - t.y) * k;
      t.scale = next;
      apply();
    };

    // Mouse-wheel vs trackpad-scroll heuristic. A physical wheel sends
    // line-mode deltas (Firefox) or large integer pixel deltas with no X
    // component (Chrome/Safari, typically multiples of 100/120). Trackpad
    // two-finger scroll sends small/fractional pixel deltas, often with
    // non-zero deltaX. ctrlKey is set by the browser for trackpad pinch.
    const isMouseWheel = e => e.deltaMode !== 0 || e.deltaX === 0 && Number.isInteger(e.deltaY) && Math.abs(e.deltaY) >= 40;
    const onWheel = e => {
      e.preventDefault();
      if (isGesturing) return; // Safari: gesture* owns the pinch — discard concurrent wheels
      if ((e.ctrlKey || e.metaKey) && !isMouseWheel(e)) {
        // trackpad pinch, or ctrl/cmd + smooth-scroll mouse. Notched
        // wheels fall through to the fixed-step branch below.
        zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.01));
      } else if (isMouseWheel(e)) {
        // notched mouse wheel — fixed-ratio step per click
        zoomAt(e.clientX, e.clientY, Math.exp(-Math.sign(e.deltaY) * 0.18));
      } else {
        // trackpad two-finger scroll — pan
        tf.current.x -= e.deltaX;
        tf.current.y -= e.deltaY;
        apply();
      }
    };

    // Safari sends native gesture* events for trackpad pinch with a smooth
    // e.scale; preferring these over the ctrl+wheel fallback gives a much
    // better feel there. No-ops on other browsers. Safari also fires
    // ctrlKey wheel events during the same pinch — isGesturing makes
    // onWheel drop those entirely so they neither zoom nor pan.
    let gsBase = 1;
    let isGesturing = false;
    const onGestureStart = e => {
      e.preventDefault();
      isGesturing = true;
      gsBase = tf.current.scale;
    };
    const onGestureChange = e => {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, gsBase * e.scale / tf.current.scale);
    };
    const onGestureEnd = e => {
      e.preventDefault();
      isGesturing = false;
    };

    // Drag-pan: middle button anywhere, or primary button on canvas
    // background (anything that isn't an artboard or an inline editor).
    let drag = null;
    const onPointerDown = e => {
      const onBg = !e.target.closest('[data-dc-slot], .dc-editable');
      if (!(e.button === 1 || e.button === 0 && onBg)) return;
      e.preventDefault();
      vp.setPointerCapture(e.pointerId);
      drag = {
        id: e.pointerId,
        lx: e.clientX,
        ly: e.clientY
      };
      vp.style.cursor = 'grabbing';
    };
    const onPointerMove = e => {
      if (!drag || e.pointerId !== drag.id) return;
      tf.current.x += e.clientX - drag.lx;
      tf.current.y += e.clientY - drag.ly;
      drag.lx = e.clientX;
      drag.ly = e.clientY;
      apply();
    };
    const onPointerUp = e => {
      if (!drag || e.pointerId !== drag.id) return;
      vp.releasePointerCapture(e.pointerId);
      drag = null;
      vp.style.cursor = '';
    };

    // Host-driven zoom (toolbar % menu). Zooms around viewport centre so the
    // visible midpoint stays fixed — matching the host's iframe-zoom feel.
    const onHostMsg = e => {
      const d = e.data;
      if (d && d.type === '__dc_set_zoom' && typeof d.scale === 'number') {
        const r = vp.getBoundingClientRect();
        zoomAt(r.left + r.width / 2, r.top + r.height / 2, d.scale / tf.current.scale);
      } else if (d && d.type === '__dc_probe') {
        // Host's [readyGen] reset asks whether a canvas is present; it
        // fires on the iframe's native 'load', which for canvases with
        // images/fonts is after our mount-time announce, so re-announce.
        // Clear the pan-tick guard so apply() re-posts the current scale
        // even if it's unchanged — the host just reset dcScale to 1.
        window.parent.postMessage({
          type: '__dc_present'
        }, '*');
        lastPostedScale.current = undefined;
        apply();
      }
    };
    window.addEventListener('message', onHostMsg);
    // Announce canvas mode so the host toolbar proxies its % control here
    // instead of scaling the iframe element (which would just shrink the
    // viewport window of an infinite canvas). The apply() that follows emits
    // the initial __dc_zoom so the toolbar % is correct before first pinch.
    // lastPostedScale reset mirrors the __dc_probe handler: the layout
    // effect's restore-path apply() may already have posted the restored
    // scale (before __dc_present), so clear the guard to re-post it in order.
    window.parent.postMessage({
      type: '__dc_present'
    }, '*');
    lastPostedScale.current = undefined;
    apply();
    vp.addEventListener('wheel', onWheel, {
      passive: false
    });
    vp.addEventListener('gesturestart', onGestureStart, {
      passive: false
    });
    vp.addEventListener('gesturechange', onGestureChange, {
      passive: false
    });
    vp.addEventListener('gestureend', onGestureEnd, {
      passive: false
    });
    vp.addEventListener('pointerdown', onPointerDown);
    vp.addEventListener('pointermove', onPointerMove);
    vp.addEventListener('pointerup', onPointerUp);
    vp.addEventListener('pointercancel', onPointerUp);
    return () => {
      window.removeEventListener('message', onHostMsg);
      vp.removeEventListener('wheel', onWheel);
      vp.removeEventListener('gesturestart', onGestureStart);
      vp.removeEventListener('gesturechange', onGestureChange);
      vp.removeEventListener('gestureend', onGestureEnd);
      vp.removeEventListener('pointerdown', onPointerDown);
      vp.removeEventListener('pointermove', onPointerMove);
      vp.removeEventListener('pointerup', onPointerUp);
      vp.removeEventListener('pointercancel', onPointerUp);
    };
  }, [apply, minScale, maxScale]);
  const gridSvg = `url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M120 0H0v120' fill='none' stroke='${encodeURIComponent(DC.grid)}' stroke-width='1'/%3E%3C/svg%3E")`;
  return /*#__PURE__*/React.createElement("div", {
    ref: vpRef,
    className: "design-canvas",
    style: {
      height: '100vh',
      width: '100vw',
      background: DC.bg,
      overflow: 'hidden',
      overscrollBehavior: 'none',
      touchAction: 'none',
      position: 'relative',
      fontFamily: DC.font,
      boxSizing: 'border-box',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: worldRef,
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      transformOrigin: '0 0',
      willChange: 'transform',
      width: 'max-content',
      minWidth: '100%',
      minHeight: '100%',
      padding: '60px 0 80px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: -6000,
      backgroundImage: gridSvg,
      backgroundSize: '120px 120px',
      pointerEvents: 'none',
      zIndex: -1
    }
  }), children));
}

// ─────────────────────────────────────────────────────────────
// DCSection — editable title + h-row of artboards in persisted order
// ─────────────────────────────────────────────────────────────
function DCSection({
  id,
  title,
  subtitle,
  children,
  gap = 48
}) {
  const ctx = React.useContext(DCCtx);
  const sid = id ?? title;
  const all = React.Children.toArray(children);
  const artboards = all.filter(c => c && c.type === DCArtboard);
  const rest = all.filter(c => !(c && c.type === DCArtboard));
  const sec = ctx && sid && ctx.section(sid) || {};
  // Must match DesignCanvas's srcKey computation exactly (it filters falsy
  // IDs), or onDelete persists a srcKey that DesignCanvas never recognizes.
  const allIds = artboards.map(a => a.props.id ?? a.props.label).filter(Boolean);
  const srcKey = allIds.join('\x1f');
  const hidden = sec.srcKey === srcKey ? sec.hidden || [] : [];
  const srcOrder = allIds.filter(k => !hidden.includes(k));
  const order = React.useMemo(() => {
    const kept = (sec.order || []).filter(k => srcOrder.includes(k));
    return [...kept, ...srcOrder.filter(k => !kept.includes(k))];
  }, [sec.order, srcOrder.join('|')]);
  const byId = Object.fromEntries(artboards.map(a => [a.props.id ?? a.props.label, a]));

  // marginBottom counter-scales so the on-screen gap between sections stays
  // constant — otherwise at low zoom the (world-space) gap collapses while
  // the screen-constant sectionhead below it doesn't, and the title reads as
  // belonging to the section above. paddingBottom below is just enough for
  // the 24px artboard-header (abs-positioned above each card) plus ~8px, so
  // the title sits tight against its own row at every zoom.
  return /*#__PURE__*/React.createElement("div", {
    "data-dc-section": sid,
    style: {
      marginBottom: 'calc(80px * var(--dc-inv-zoom, 1))',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 60px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-sectionhead",
    style: {
      paddingBottom: 36
    }
  }, /*#__PURE__*/React.createElement(DCEditable, {
    tag: "div",
    value: sec.title ?? title,
    onChange: v => ctx && sid && ctx.patchSection(sid, {
      title: v
    }),
    style: {
      fontSize: 28,
      fontWeight: 600,
      color: DC.title,
      letterSpacing: -0.4,
      marginBottom: 6,
      display: 'inline-block'
    }
  }), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      color: DC.subtitle
    }
  }, subtitle))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap,
      padding: '0 60px',
      alignItems: 'flex-start',
      width: 'max-content'
    }
  }, order.map(k => /*#__PURE__*/React.createElement(DCArtboardFrame, {
    key: k,
    sectionId: sid,
    artboard: byId[k],
    order: order,
    label: (sec.labels || {})[k] ?? byId[k].props.label,
    onRename: v => ctx && ctx.patchSection(sid, x => ({
      labels: {
        ...x.labels,
        [k]: v
      }
    })),
    onReorder: next => ctx && ctx.patchSection(sid, {
      order: next
    }),
    onDelete: () => ctx && ctx.patchSection(sid, x => ({
      hidden: [...(x.srcKey === srcKey ? x.hidden || [] : []), k],
      srcKey
    })),
    onFocus: () => ctx && ctx.setFocus(`${sid}/${k}`)
  }))), rest);
}

// DCArtboard — marker; rendered by DCArtboardFrame via DCSection.
function DCArtboard() {
  return null;
}

// Per-artboard export (kind: 'png' | 'html'). Both paths share the same
// self-contained clone: computed styles baked in, @font-face / <img> /
// inline-style background-image urls inlined as data URIs. PNG wraps the
// clone in foreignObject→canvas at 3× the artboard's natural width×height
// (same pipeline the host uses for page captures); HTML wraps it in a
// minimal standalone document. Both are independent of viewport zoom.
async function dcExport(node, w, h, name, kind) {
  try {
    await document.fonts.ready;
  } catch {}
  const toDataURL = url => fetch(url).then(r => r.blob()).then(b => new Promise(res => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.onerror = () => res(url);
    fr.readAsDataURL(b);
  })).catch(() => url);

  // Collect @font-face rules. ss.cssRules throws SecurityError on
  // cross-origin sheets (e.g. fonts.googleapis.com) — in that case fetch
  // the CSS text directly (those endpoints send ACAO:*) and regex-extract
  // the blocks. @import and @media/@supports are walked so nested
  // @font-face rules aren't missed.
  const fontRules = [],
    pending = [],
    seen = new Set();
  const scrapeCss = href => {
    if (seen.has(href)) return;
    seen.add(href);
    pending.push(fetch(href).then(r => r.text()).then(css => {
      for (const m of css.match(/@font-face\s*{[^}]*}/g) || []) fontRules.push({
        css: m,
        base: href
      });
      for (const m of css.matchAll(/@import\s+(?:url\()?['"]?([^'")\s;]+)/g)) scrapeCss(new URL(m[1], href).href);
    }).catch(() => {}));
  };
  const walk = (rules, base) => {
    for (const r of rules) {
      if (r.type === CSSRule.FONT_FACE_RULE) fontRules.push({
        css: r.cssText,
        base
      });else if (r.type === CSSRule.IMPORT_RULE && r.styleSheet) {
        const ibase = r.styleSheet.href || base;
        try {
          walk(r.styleSheet.cssRules, ibase);
        } catch {
          scrapeCss(ibase);
        }
      } else if (r.cssRules) walk(r.cssRules, base);
    }
  };
  for (const ss of document.styleSheets) {
    const base = ss.href || location.href;
    try {
      walk(ss.cssRules, base);
    } catch {
      if (ss.href) scrapeCss(ss.href);
    }
  }
  while (pending.length) await pending.shift();
  const fontCss = (await Promise.all(fontRules.map(async rule => {
    let out = rule.css,
      m;
    const re = /url\((['"]?)([^'")]+)\1\)/g;
    while (m = re.exec(rule.css)) {
      if (m[2].indexOf('data:') === 0) continue;
      let abs;
      try {
        abs = new URL(m[2], rule.base).href;
      } catch {
        continue;
      }
      out = out.split(m[0]).join('url("' + (await toDataURL(abs)) + '")');
    }
    return out;
  }))).join('\n');
  const cloneStyled = src => {
    if (src.nodeType === 8 || src.nodeType === 1 && src.tagName === 'SCRIPT') return document.createTextNode('');
    const dst = src.cloneNode(false);
    if (src.nodeType === 1) {
      const cs = getComputedStyle(src);
      let txt = '';
      for (let i = 0; i < cs.length; i++) txt += cs[i] + ':' + cs.getPropertyValue(cs[i]) + ';';
      dst.setAttribute('style', txt + 'animation:none;transition:none;');
      if (src.tagName === 'CANVAS') try {
        const im = document.createElement('img');
        im.src = src.toDataURL();
        im.setAttribute('style', txt);
        return im;
      } catch {}
    }
    for (let c = src.firstChild; c; c = c.nextSibling) dst.appendChild(cloneStyled(c));
    return dst;
  };
  const clone = cloneStyled(node);
  clone.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
  // Drop the card's own shadow/radius so the export is a flush w×h rect;
  // the artboard's own background (if any) is already in the computed style.
  clone.style.boxShadow = 'none';
  clone.style.borderRadius = '0';
  const jobs = [];
  clone.querySelectorAll('img').forEach(el => {
    const s = el.getAttribute('src');
    if (s && s.indexOf('data:') !== 0) jobs.push(toDataURL(el.src).then(d => el.setAttribute('src', d)));
  });
  [clone, ...clone.querySelectorAll('*')].forEach(el => {
    const bg = el.style.backgroundImage;
    if (!bg) return;
    let m;
    const re = /url\(["']?([^"')]+)["']?\)/g;
    while (m = re.exec(bg)) {
      const tok = m[0],
        url = m[1];
      if (url.indexOf('data:') === 0) continue;
      jobs.push(toDataURL(url).then(d => {
        el.style.backgroundImage = el.style.backgroundImage.split(tok).join('url("' + d + '")');
      }));
    }
  });
  await Promise.all(jobs);
  const xml = new XMLSerializer().serializeToString(clone);
  const save = (blob, ext) => {
    if (!blob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name + '.' + ext;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  if (kind === 'html') {
    const html = '<!doctype html><html><head><meta charset="utf-8"><title>' + name + '</title>' + (fontCss ? '<style>' + fontCss + '</style>' : '') + '</head><body style="margin:0">' + xml + '</body></html>';
    return save(new Blob([html], {
      type: 'text/html'
    }), 'html');
  }

  // PNG: the SVG's own width/height must be the output resolution — an
  // <img>-loaded SVG rasterizes at its intrinsic size, so sizing it at 1×
  // and ctx.scale()-ing up would just upscale a 1× bitmap. viewBox maps the
  // w×h foreignObject onto the px·w × px·h SVG canvas so the browser renders
  // the HTML at full resolution.
  const px = 3;
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w * px + '" height="' + h * px + '" viewBox="0 0 ' + w + ' ' + h + '"><foreignObject width="' + w + '" height="' + h + '">' + (fontCss ? '<style><![CDATA[' + fontCss + ']]></style>' : '') + xml + '</foreignObject></svg>';
  const img = new Image();
  await new Promise((res, rej) => {
    img.onload = res;
    img.onerror = () => rej(new Error('svg load failed'));
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  });
  const cv = document.createElement('canvas');
  cv.width = w * px;
  cv.height = h * px;
  cv.getContext('2d').drawImage(img, 0, 0);
  cv.toBlob(blob => save(blob, 'png'), 'image/png');
}
function DCArtboardFrame({
  sectionId,
  artboard,
  label,
  order,
  onRename,
  onReorder,
  onFocus,
  onDelete
}) {
  const {
    id: rawId,
    label: rawLabel,
    width = 260,
    height = 480,
    children,
    style = {}
  } = artboard.props;
  const id = rawId ?? rawLabel;
  const ref = React.useRef(null);
  const cardRef = React.useRef(null);
  const menuRef = React.useRef(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);

  // ⋯ menu: close on any outside pointerdown. Two-click delete lives inside
  // the menu — first click arms the row, second commits; closing disarms.
  React.useEffect(() => {
    if (!menuOpen) {
      setConfirming(false);
      return;
    }
    const off = e => {
      if (!menuRef.current || !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('pointerdown', off, true);
    return () => document.removeEventListener('pointerdown', off, true);
  }, [menuOpen]);
  const doExport = kind => {
    setMenuOpen(false);
    if (!cardRef.current) return;
    const name = String(label || id || 'artboard').replace(/[^\w\s.-]+/g, '_');
    dcExport(cardRef.current, width, height, name, kind).catch(e => console.error('[design-canvas] export failed:', e));
  };

  // Live drag-reorder: dragged card sticks to cursor; siblings slide into
  // their would-be slots in real time via transforms. DOM order only
  // changes on drop.
  const onGripDown = e => {
    e.preventDefault();
    e.stopPropagation();
    const me = ref.current;
    // translateX is applied in local (pre-scale) space but pointer deltas and
    // getBoundingClientRect().left are screen-space — divide by the viewport's
    // current scale so the dragged card tracks the cursor at any zoom level.
    const scale = me.getBoundingClientRect().width / me.offsetWidth || 1;
    const peers = Array.from(document.querySelectorAll(`[data-dc-section="${sectionId}"] [data-dc-slot]`));
    const homes = peers.map(el => ({
      el,
      id: el.dataset.dcSlot,
      x: el.getBoundingClientRect().left
    }));
    const slotXs = homes.map(h => h.x);
    const startIdx = order.indexOf(id);
    const startX = e.clientX;
    let liveOrder = order.slice();
    me.classList.add('dc-dragging');
    const layout = () => {
      for (const h of homes) {
        if (h.id === id) continue;
        const slot = liveOrder.indexOf(h.id);
        h.el.style.transform = `translateX(${(slotXs[slot] - h.x) / scale}px)`;
      }
    };
    const move = ev => {
      const dx = ev.clientX - startX;
      me.style.transform = `translateX(${dx / scale}px)`;
      const cur = homes[startIdx].x + dx;
      let nearest = 0,
        best = Infinity;
      for (let i = 0; i < slotXs.length; i++) {
        const d = Math.abs(slotXs[i] - cur);
        if (d < best) {
          best = d;
          nearest = i;
        }
      }
      if (liveOrder.indexOf(id) !== nearest) {
        liveOrder = order.filter(k => k !== id);
        liveOrder.splice(nearest, 0, id);
        layout();
      }
    };
    const up = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      const finalSlot = liveOrder.indexOf(id);
      me.classList.remove('dc-dragging');
      me.style.transform = `translateX(${(slotXs[finalSlot] - homes[startIdx].x) / scale}px)`;
      // After the settle transition, kill transitions + clear transforms +
      // commit the reorder in the same frame so there's no visual snap-back.
      setTimeout(() => {
        for (const h of homes) {
          h.el.style.transition = 'none';
          h.el.style.transform = '';
        }
        if (liveOrder.join('|') !== order.join('|')) onReorder(liveOrder);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          for (const h of homes) h.el.style.transition = '';
        }));
      }, 180);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    "data-dc-slot": id,
    style: {
      position: 'relative',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-header",
    style: {
      color: DC.label
    },
    onPointerDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-labelrow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-grip",
    onPointerDown: onGripDown,
    title: "Drag to reorder"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "9",
    height: "13",
    viewBox: "0 0 9 13",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "2",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "2",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "6.5",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "6.5",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "11",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "11",
    r: "1.1"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dc-labeltext",
    onClick: onFocus,
    title: "Click to focus"
  }, /*#__PURE__*/React.createElement(DCEditable, {
    value: label,
    onChange: onRename,
    onClick: e => e.stopPropagation(),
    style: {
      fontSize: 15,
      fontWeight: 500,
      color: DC.label,
      lineHeight: 1
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dc-btns"
  }, /*#__PURE__*/React.createElement("div", {
    ref: menuRef,
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "dc-kebab",
    title: "More",
    onClick: () => setMenuOpen(o => !o)
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "2.5",
    cy: "6",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "6",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "9.5",
    cy: "6",
    r: "1.1"
  }))), menuOpen && /*#__PURE__*/React.createElement("div", {
    className: "dc-menu",
    onPointerDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => doExport('png')
  }, "Download PNG"), /*#__PURE__*/React.createElement("button", {
    onClick: () => doExport('html')
  }, "Download HTML"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("button", {
    className: "dc-danger",
    onClick: () => {
      if (confirming) {
        setMenuOpen(false);
        onDelete();
      } else setConfirming(true);
    }
  }, confirming ? 'Click again to delete' : 'Delete'))), /*#__PURE__*/React.createElement("button", {
    className: "dc-expand",
    onClick: onFocus,
    title: "Focus"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 1h4v4M5 11H1V7M11 1L7.5 4.5M1 11l3.5-3.5"
  }))))), /*#__PURE__*/React.createElement("div", {
    ref: cardRef,
    className: "dc-card",
    style: {
      borderRadius: 2,
      boxShadow: '0 1px 3px rgba(0,0,0,.08),0 4px 16px rgba(0,0,0,.06)',
      overflow: 'hidden',
      width,
      height,
      background: '#fff',
      ...style
    }
  }, children || /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#bbb',
      fontSize: 13,
      fontFamily: DC.font
    }
  }, id)));
}

// Inline rename — commits on blur or Enter.
function DCEditable({
  value,
  onChange,
  style,
  tag = 'span',
  onClick
}) {
  const T = tag;
  return /*#__PURE__*/React.createElement(T, {
    className: "dc-editable",
    contentEditable: true,
    suppressContentEditableWarning: true,
    onClick: onClick,
    onPointerDown: e => e.stopPropagation(),
    onBlur: e => onChange && onChange(e.currentTarget.textContent),
    onKeyDown: e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.currentTarget.blur();
      }
    },
    style: style
  }, value);
}

// ─────────────────────────────────────────────────────────────
// Focus mode — overlay one artboard; ←/→ within section, ↑/↓ across
// sections, Esc or backdrop click to exit.
// ─────────────────────────────────────────────────────────────
function DCFocusOverlay({
  entry,
  sectionMeta,
  sectionOrder
}) {
  const ctx = React.useContext(DCCtx);
  const {
    sectionId,
    artboard
  } = entry;
  const sec = ctx.section(sectionId);
  const meta = sectionMeta[sectionId];
  const peers = meta.slotIds;
  const aid = artboard.props.id ?? artboard.props.label;
  const idx = peers.indexOf(aid);
  const secIdx = sectionOrder.indexOf(sectionId);
  const go = d => {
    const n = peers[(idx + d + peers.length) % peers.length];
    if (n) ctx.setFocus(`${sectionId}/${n}`);
  };
  const goSection = d => {
    // Sections whose artboards are all deleted have slotIds:[] — step past
    // them to the next non-empty section so ↑/↓ doesn't dead-end.
    const n = sectionOrder.length;
    for (let i = 1; i < n; i++) {
      const ns = sectionOrder[((secIdx + d * i) % n + n) % n];
      const first = sectionMeta[ns] && sectionMeta[ns].slotIds[0];
      if (first) {
        ctx.setFocus(`${ns}/${first}`);
        return;
      }
    }
  };
  React.useEffect(() => {
    const k = e => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        goSection(-1);
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        goSection(1);
      }
    };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  });
  const {
    width = 260,
    height = 480,
    children
  } = artboard.props;
  const [vp, setVp] = React.useState({
    w: window.innerWidth,
    h: window.innerHeight
  });
  React.useEffect(() => {
    const r = () => setVp({
      w: window.innerWidth,
      h: window.innerHeight
    });
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, []);
  const scale = Math.max(0.1, Math.min((vp.w - 200) / width, (vp.h - 260) / height, 2));
  const [ddOpen, setDd] = React.useState(false);
  const Arrow = ({
    dir,
    onClick
  }) => /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onClick();
    },
    style: {
      position: 'absolute',
      top: '50%',
      [dir]: 28,
      transform: 'translateY(-50%)',
      border: 'none',
      background: 'rgba(255,255,255,.08)',
      color: 'rgba(255,255,255,.9)',
      width: 44,
      height: 44,
      borderRadius: 22,
      fontSize: 18,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background .15s'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,.18)',
    onMouseLeave: e => e.currentTarget.style.background = 'rgba(255,255,255,.08)'
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 18 18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: dir === 'left' ? 'M11 3L5 9l6 6' : 'M7 3l6 6-6 6'
  })));

  // Portal to body so position:fixed is the real viewport regardless of any
  // transform on DesignCanvas's ancestors (including the canvas zoom itself).
  return ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    onClick: () => ctx.setFocus(null),
    onWheel: e => e.preventDefault(),
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(24,20,16,.6)',
      backdropFilter: 'blur(14px)',
      fontFamily: DC.font,
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 72,
      display: 'flex',
      alignItems: 'flex-start',
      padding: '16px 20px 0',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setDd(o => !o),
    style: {
      border: 'none',
      background: 'transparent',
      color: '#fff',
      cursor: 'pointer',
      padding: '6px 8px',
      borderRadius: 6,
      textAlign: 'left',
      fontFamily: 'inherit'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      fontWeight: 600,
      letterSpacing: -0.3
    }
  }, meta.title), /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 11 11",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    style: {
      opacity: .7
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 4l3.5 3.5L9 4"
  }))), meta.subtitle && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 13,
      opacity: .6,
      fontWeight: 400,
      marginTop: 2
    }
  }, meta.subtitle)), ddOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '100%',
      left: 0,
      marginTop: 4,
      background: '#2a251f',
      borderRadius: 8,
      boxShadow: '0 8px 32px rgba(0,0,0,.4)',
      padding: 4,
      minWidth: 200,
      zIndex: 10
    }
  }, sectionOrder.filter(sid => sectionMeta[sid].slotIds.length).map(sid => /*#__PURE__*/React.createElement("button", {
    key: sid,
    onClick: () => {
      setDd(false);
      const f = sectionMeta[sid].slotIds[0];
      if (f) ctx.setFocus(`${sid}/${f}`);
    },
    style: {
      display: 'block',
      width: '100%',
      textAlign: 'left',
      border: 'none',
      cursor: 'pointer',
      background: sid === sectionId ? 'rgba(255,255,255,.1)' : 'transparent',
      color: '#fff',
      padding: '8px 12px',
      borderRadius: 5,
      fontSize: 14,
      fontWeight: sid === sectionId ? 600 : 400,
      fontFamily: 'inherit'
    }
  }, sectionMeta[sid].title)))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => ctx.setFocus(null),
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,.12)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent',
    style: {
      border: 'none',
      background: 'transparent',
      color: 'rgba(255,255,255,.7)',
      width: 32,
      height: 32,
      borderRadius: 16,
      fontSize: 20,
      cursor: 'pointer',
      lineHeight: 1,
      transition: 'background .12s'
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 64,
      bottom: 56,
      left: 100,
      right: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: width * scale,
      height: height * scale,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      height,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      background: '#fff',
      borderRadius: 2,
      overflow: 'hidden',
      boxShadow: '0 20px 80px rgba(0,0,0,.4)'
    }
  }, children || /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#bbb'
    }
  }, aid))), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      fontSize: 14,
      fontWeight: 500,
      opacity: .85,
      textAlign: 'center'
    }
  }, (sec.labels || {})[aid] ?? artboard.props.label, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .5,
      marginLeft: 10,
      fontVariantNumeric: 'tabular-nums'
    }
  }, idx + 1, " / ", peers.length))), /*#__PURE__*/React.createElement(Arrow, {
    dir: "left",
    onClick: () => go(-1)
  }), /*#__PURE__*/React.createElement(Arrow, {
    dir: "right",
    onClick: () => go(1)
  }), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: 8
    }
  }, peers.map((p, i) => /*#__PURE__*/React.createElement("button", {
    key: p,
    onClick: () => ctx.setFocus(`${sectionId}/${p}`),
    style: {
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      width: 6,
      height: 6,
      borderRadius: 3,
      background: i === idx ? '#fff' : 'rgba(255,255,255,.3)'
    }
  })))), document.body);
}

// ─────────────────────────────────────────────────────────────
// Post-it — absolute-positioned sticky note
// ─────────────────────────────────────────────────────────────
function DCPostIt({
  children,
  top,
  left,
  right,
  bottom,
  rotate = -2,
  width = 180
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top,
      left,
      right,
      bottom,
      width,
      background: DC.postitBg,
      padding: '14px 16px',
      fontFamily: '"Comic Sans MS", "Marker Felt", "Segoe Print", cursive',
      fontSize: 14,
      lineHeight: 1.4,
      color: DC.postitText,
      boxShadow: '0 2px 8px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
      transform: `rotate(${rotate}deg)`,
      zIndex: 5
    }
  }, children);
}
Object.assign(window, {
  DesignCanvas,
  DCSection,
  DCArtboard,
  DCPostIt
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "design-canvas.jsx", error: String((e && e.message) || e) }); }

// filter-bar.jsx
try { (() => {
// Filter Bar — full toolbar context with table backdrop, plus interactive demo.

const CUSTOMERS = ["Transload Trucking", "Hard Rock Industries LLC", "RF Heavy", "Truck Zone", "1st Auto Parts Ltd", "Partmaster Ltd", "Auckland Motors Mitsubishi", "Dodson Autospares", "Texas Truck And Auto Parts", "Repco Grey Lynn", "Segedin Truck And Auto Pa…"];
const STATUSES = ["Estimate", "Approved", "In progress", "Review", "Complete", "Invoiced", "Paid", "Declined", "Imported"];
const TECHS = ["Eleanor Pena", "Esther Howard", "Jenny Wilson", "Annette Black", "Leslie Alexander", "Floyd Miles", "Theresa Webb", "Ralph Edwards"];
const ADVISORS = ["Kathryn Murphy", "Kristin Watson", "Theresa Webb", "Eleanor Pena", "Jenny Wilson"];
const ASSETS = ["Yes", "No"];
const MINE = ["Yes", "No"];
// Work-order glyph (Lucide clipboard-list) — 16px, matching the other chip icons.
//
// Built on READ, not at load. The generated bundle runs its sources in
// alphabetical order, so this file executes before lucide-icons.js (f < l) and
// window.svIcon does not exist yet. Calling it here threw, and because each
// source runs inside its own try/catch the failure was silent — it took every
// export below with it, so FilterBar, AppHeader, SVEmptyState, WorkOrdersPage,
// AppliedFilters, SearchResultsBanner, STATUSES, TECHS, CUSTOMERS and ADVISORS
// were all missing from the bundle, and the Design System silently served the
// older design-md/ generation instead. Standalone artboards were unaffected —
// they load lucide-icons.js first by hand.
const svGlyph = (name, size = 16) => typeof window.svIcon === "function" ? window.svIcon(name, size) : null;

// Mini stub of a Work Orders table so the filter bar sits in real context
function TableBackdrop({
  cols = window.DEFAULT_COLUMNS || [],
  tab = "All",
  filters = {},
  query = "",
  onClear,
  extraRows = [],
  onCount
}) {
  const rows = [{
    id: "S3-8412",
    est: "Estimate",
    est_color: "ok",
    cust: "Transload Trucking",
    asset: "Freightliner M2",
    vin: "1FD0W5HY2EEA05499",
    adv: "Esther Howard",
    tech: "Esther Howard",
    lines: 12,
    total: "$13,408.17"
  }, {
    id: "S3-3425",
    est: "Estimate",
    est_color: "ok",
    cust: "Hard Rock Industries LLC",
    asset: "—",
    vin: "1FD0W5HY2EEA05499",
    adv: "Theresa Webb",
    tech: "Ralph Edwards",
    lines: 14,
    total: "$2,321.53"
  }, {
    id: "S3-8554",
    est: "Approved",
    est_color: "ok",
    cust: "RF Heavy",
    asset: "—",
    vin: "1FD0W5HY2EEA05499",
    adv: "Ralph Edwards",
    tech: "Jenny Wilson",
    lines: 10,
    total: "$5,932.32"
  }, {
    id: "S3-8423",
    est: "Estimate",
    est_color: "err",
    cust: "Truck Zone",
    asset: "—",
    vin: "1FD0W5HY2EEA05499",
    adv: "Annette Black",
    tech: "Leslie Alexander",
    lines: 5,
    total: "$48,013.11"
  }, {
    id: "S3-9665",
    est: "Estimate",
    est_color: "ok",
    cust: "1st Auto Parts Ltd",
    asset: "—",
    vin: "1FD0W5HY2EEA05499",
    adv: "Jenny Wilson",
    tech: "Kristin Watson",
    lines: 3,
    total: "$15,182.32"
  }, {
    id: "S3-1345",
    est: "Declined",
    est_color: "err",
    cust: "Partmaster Ltd",
    asset: "—",
    vin: "1FD0W5HY2EEA05499",
    adv: "Eleanor Pena",
    tech: "Esther Howard",
    lines: 2,
    total: "$13,199.51"
  }, {
    id: "S3-5234",
    est: "In progress",
    est_color: "ok",
    cust: "Auckland Motors Mitsubishi",
    asset: "—",
    vin: "1FD0W5HY2EEA05499",
    adv: "Leslie Alexander",
    tech: "Theresa Webb",
    lines: 12,
    total: "$10,075.14"
  }, {
    id: "S3-9574",
    est: "Estimate",
    est_color: "err",
    cust: "Dodson Autospares",
    asset: "—",
    vin: "1FD0W5HY2EEA05499",
    adv: "Floyd Miles",
    tech: "Ralph Edwards",
    lines: 7,
    total: "$242,212.07"
  }, {
    id: "S3-0937",
    est: "Estimate",
    est_color: "ok",
    cust: "Segedin Truck And Auto Pa…",
    asset: "—",
    vin: "1FD0W5HY2EEA05499",
    adv: "Kathryn Murphy",
    tech: "Annette Black",
    lines: 9,
    total: "$13,408.17"
  }, {
    id: "S3-3456",
    est: "Declined",
    est_color: "err",
    cust: "Repco Grey Lynn",
    asset: "—",
    vin: "1FD0W5HY2EEA05499",
    adv: "Kristin Watson",
    tech: "Jenny Wilson",
    lines: 7,
    total: "$10,075.14"
  }];
  const extra = [{
    waiting: true,
    waitingParts: 3,
    pct: 0,
    clocked: "2:14",
    created: "Aug 03, 2026",
    invoiced: "",
    daysopen: 8,
    parts: 4,
    returns: 0
  }, {
    waiting: false,
    pct: 35,
    clocked: "",
    created: "Aug 02, 2026",
    invoiced: "",
    daysopen: 9,
    parts: 6,
    returns: 1
  }, {
    waiting: false,
    pct: 0,
    clocked: "0:48",
    created: "Jul 29, 2026",
    invoiced: "",
    daysopen: 13,
    parts: 2,
    returns: 0
  }, {
    waiting: true,
    waitingParts: 5,
    pct: 0,
    clocked: "",
    created: "Jul 28, 2026",
    invoiced: "",
    daysopen: 14,
    parts: 9,
    returns: 2
  }, {
    waiting: false,
    pct: 100,
    clocked: "5:02",
    created: "Jul 24, 2026",
    invoiced: "Aug 01, 2026",
    daysopen: 18,
    parts: 1,
    returns: 0,
    est: "Complete",
    est_color: "ok"
  }, {
    waiting: false,
    pct: 0,
    clocked: "",
    created: "Jul 21, 2026",
    invoiced: "Jul 30, 2026",
    daysopen: 21,
    parts: 0,
    returns: 0
  }, {
    waiting: true,
    waitingParts: 2,
    pct: 18,
    clocked: "1:36",
    created: "Jul 19, 2026",
    invoiced: "",
    daysopen: 23,
    parts: 7,
    returns: 1
  }, {
    waiting: false,
    pct: 100,
    clocked: "",
    created: "Jul 15, 2026",
    invoiced: "Jul 31, 2026",
    daysopen: 27,
    parts: 12,
    returns: 3,
    est: "Invoiced",
    est_color: "ok"
  }, {
    waiting: false,
    pct: 100,
    clocked: "3:20",
    created: "Jul 12, 2026",
    invoiced: "Jul 27, 2026",
    daysopen: 30,
    parts: 5,
    returns: 0,
    est: "Paid",
    est_color: "ok"
  }, {
    waiting: true,
    waitingParts: 1,
    pct: 0,
    clocked: "",
    created: "Jul 08, 2026",
    invoiced: "",
    daysopen: 34,
    parts: 3,
    returns: 1
  }];
  rows.forEach((r, i) => Object.assign(r, extra[i]));
  const allRows = extraRows.length ? extraRows.concat(rows) : rows;
  const report = onCount;
  const COMPLETED = ["Complete", "Invoiced", "Paid"];
  const WORK_ORDERS = ["Estimate", "Approved", "In progress"];
  const visibleRows = tab === "Estimates" ? allRows.filter(r => r.est === "Estimate") : tab === "Work Orders" ? allRows.filter(r => WORK_ORDERS.includes(r.est)) : tab === "Completed" ? allRows.filter(r => COMPLETED.includes(r.est)) : allRows;
  const q = query.trim().toLowerCase();
  const stF = filters.status || [];
  const assetF = (filters.asset || [])[0];
  const mineF = (filters.mine || []).length > 0;
  const MINE = ["S3-8412", "S3-3425"];
  const shownRows = visibleRows.filter(r => {
    if (stF.length && !stF.includes(r.est)) return false;
    if (assetF === "Yes" && r.asset === "\u2014") return false;
    if (assetF === "No" && r.asset !== "\u2014") return false;
    if (mineF && !MINE.includes(r.id)) return false;
    if (q && ![r.id, r.cust, r.asset, r.vin, r.adv, r.tech].some(f => String(f || "").toLowerCase().includes(q))) return false;
    return true;
  });
  React.useEffect(() => {
    report && report(shownRows.length);
  }, [shownRows.length, report]);
  const Th = ({
    children,
    w
  }) => /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "12px 16px",
      fontWeight: 500,
      fontSize: 12,
      color: "var(--sv-text-secondary)",
      borderBottom: "1px solid var(--sv-border-default)",
      whiteSpace: "nowrap",
      background: "var(--sv-surface)",
      width: w
    }
  }, children);
  const Td = ({
    children,
    align
  }) => /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "14px 16px",
      fontWeight: 500,
      fontSize: 14,
      color: "var(--sv-text-primary)",
      borderBottom: "1px solid var(--sv-border-subtle)",
      textAlign: align || "left",
      whiteSpace: "nowrap"
    }
  }, children);
  const [hoverRow, setHoverRow] = React.useState(null);
  const defs = (window.COLUMN_DEFS || []).filter(c => cols.includes(c.key));
  const OnSite = ({
    r
  }) => /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-grid",
      placeItems: "center",
      width: 24,
      height: 24,
      borderRadius: 6,
      background: r.est_color === "err" ? "var(--sv-danger-fill)" : "var(--sv-success-fill)",
      color: r.est_color === "err" ? "var(--sv-danger)" : "var(--sv-success-text)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8 1.333L1.333 4.667v3.333c0 3.682 2.985 6.667 6.667 6.667s6.667-2.985 6.667-6.667V4.667L8 1.333z"
  })));
  const StatusBadge = ({
    r
  }) => /*#__PURE__*/React.createElement(Badge, {
    tone: window.STATUS_TONE[r.est] || "neutral"
  }, r.est);
  const cell = (key, r, i) => {
    switch (key) {
      case "onsite":
        return /*#__PURE__*/React.createElement(OnSite, {
          r: r
        });
      case "status":
        return /*#__PURE__*/React.createElement(StatusBadge, {
          r: r
        });
      case "number":
        return r.id;
      case "cust":
        return r.cust;
      case "waiting":
        return r.waiting ? /*#__PURE__*/React.createElement("a", {
          href: "#",
          onClick: e => e.preventDefault(),
          style: {
            color: "var(--sv-accent)",
            fontWeight: 500,
            textDecoration: "none"
          },
          onMouseEnter: e => e.currentTarget.style.textDecoration = "underline",
          onMouseLeave: e => e.currentTarget.style.textDecoration = "none"
        }, r.waitingParts, " ", r.waitingParts === 1 ? "part" : "parts") : /*#__PURE__*/React.createElement("span", {
          style: {
            color: "var(--sv-text-muted)"
          }
        }, "\u2014");
      case "asset":
        return r.asset;
      case "vin":
        return /*#__PURE__*/React.createElement("span", {
          style: {
            color: "var(--sv-text-secondary)"
          }
        }, r.vin);
      case "progress":
        return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
          style: {
            display: "inline-block",
            width: 64,
            height: 6,
            borderRadius: 999,
            background: "var(--sv-surface-sunken)",
            verticalAlign: "middle"
          }
        }, /*#__PURE__*/React.createElement("span", {
          style: {
            display: "block",
            width: `${r.pct}%`,
            height: "100%",
            borderRadius: 999,
            background: r.pct ? "var(--sv-accent)" : "transparent"
          }
        })), /*#__PURE__*/React.createElement("span", {
          style: {
            marginLeft: 8,
            color: "var(--sv-text-secondary)",
            fontSize: 12
          }
        }, r.pct, "%"));
      case "adv":
        return r.adv;
      case "tech":
        return r.tech;
      case "clocked":
        return r.clocked ? /*#__PURE__*/React.createElement(Badge, {
          tone: "neutral",
          shape: "square"
        }, r.clocked) : /*#__PURE__*/React.createElement("span", {
          style: {
            color: "var(--sv-text-muted)"
          }
        }, "\u2014");
      case "lines":
        return r.lines;
      case "total":
        return r.total;
      case "created":
        return /*#__PURE__*/React.createElement("span", {
          style: {
            color: "var(--sv-text-secondary)"
          }
        }, r.created);
      case "invoiced":
        return /*#__PURE__*/React.createElement("span", {
          style: {
            color: r.invoiced ? "var(--sv-text-secondary)" : "var(--sv-text-muted)"
          }
        }, r.invoiced || "—");
      case "daysopen":
        return r.daysopen;
      case "parts":
        return r.parts;
      case "returns":
        return r.returns;
      default:
        return null;
    }
  };
  const numeric = ["lines", "daysopen", "parts", "returns"];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontFamily: "var(--sv-font-ui)"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, defs.map(c => /*#__PURE__*/React.createElement(Th, {
    key: c.key,
    w: c.key === "onsite" ? 56 : c.key === "status" ? 120 : undefined
  }, c.key === "onsite" ? "On Site" : c.label)))), /*#__PURE__*/React.createElement("tbody", null, shownRows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    onMouseEnter: () => setHoverRow(i),
    onMouseLeave: () => setHoverRow(null),
    style: {
      background: hoverRow === i ? "var(--sv-surface-hover)" : "transparent",
      transition: "background-color 120ms ease-out"
    }
  }, defs.map(c => /*#__PURE__*/React.createElement(Td, {
    key: c.key,
    align: numeric.includes(c.key) ? "right" : undefined
  }, cell(c.key, r, i))))))), shownRows.length === 0 && /*#__PURE__*/React.createElement(SVEmptyState, {
    query: query,
    hasFilters: stF.length > 0 || !!assetF || mineF,
    onClear: onClear
  }));
}

// Shared empty state — no rows/cards after a search or filter (web + mobile)
function SVEmptyState({
  query = "",
  hasFilters = false,
  onClear,
  compact = false
}) {
  const q = (query || "").trim();
  const title = q ? "No results for \u201c" + q + "\u201d" : "No work orders match these filters";
  const body = q && hasFilters ? "Try a different search term or remove a filter." : q ? "Check the spelling, or search by work order number, customer, unit or VIN." : "Try removing a filter to widen your results.";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8,
      textAlign: "center",
      padding: compact ? "48px 24px" : "72px 24px",
      fontFamily: "var(--sv-font-ui)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 48,
      height: 48,
      borderRadius: "50%",
      display: "grid",
      placeItems: "center",
      marginBottom: 4,
      background: "var(--sv-surface-sunken)",
      color: "var(--sv-text-secondary)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "20",
    y1: "20",
    x2: "16",
    y2: "16"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: compact ? 16 : 17,
      color: "var(--sv-text-primary)",
      maxWidth: 320
    }
  }, title), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      lineHeight: "20px",
      color: "var(--sv-text-secondary)",
      maxWidth: 320
    }
  }, body), hasFilters && onClear && /*#__PURE__*/React.createElement("button", {
    onClick: onClear,
    style: {
      all: "unset",
      cursor: "pointer",
      marginTop: 8,
      height: 36,
      padding: "0 14px",
      borderRadius: 8,
      border: "1px solid var(--sv-border-default)",
      color: "var(--sv-text-primary)",
      fontWeight: 500,
      fontSize: 14
    }
  }, "Clear all filters"));
}

// Anchored popover wrapper
function Popover({
  open,
  anchorRef,
  children,
  onClose,
  offset = 8,
  align = "left",
  panelWidth = 0
}) {
  const [pos, setPos] = React.useState(null);
  React.useLayoutEffect(() => {
    if (!open || !anchorRef.current) return;
    const r = anchorRef.current.getBoundingClientRect();
    const host = anchorRef.current.closest("[data-popover-host]");
    const h = host ? host.getBoundingClientRect() : {
      left: 0,
      top: 0,
      width: window.innerWidth
    };
    let left = align === "right" ? r.right - h.left - panelWidth : r.left - h.left;
    left = Math.max(8, Math.min(left, (h.width || window.innerWidth) - panelWidth - 8));
    setPos({
      left,
      top: r.bottom - h.top + offset
    });
  }, [open]);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = e => {
      if (anchorRef.current && anchorRef.current.contains(e.target)) return;
      const pop = document.getElementById("__open_popover");
      if (pop && pop.contains(e.target)) return;
      onClose && onClose();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, onClose]);
  if (!open || !pos) return null;
  return /*#__PURE__*/React.createElement("div", {
    id: "__open_popover",
    style: {
      position: "absolute",
      left: pos.left,
      top: pos.top,
      zIndex: 10
    }
  }, children);
}

// Top-level filter bar
function FilterBar({
  filters,
  setFilters,
  allCleared = false,
  inline = false,
  hide = []
}) {
  const [open, setOpen] = React.useState(null); // which filter id is open
  const statusRef = React.useRef();
  const custRef = React.useRef();
  const techRef = React.useRef();
  const advRef = React.useRef();
  const assetRef = React.useRef();
  const mineRef = React.useRef();
  const dateRef = React.useRef();
  const setVal = (k, v) => setFilters({
    ...filters,
    [k]: v
  });
  const valueText = (k, arr) => {
    if (k === "date") {
      if (!arr) return null;
      return arr; // date stores a string, not an array
    }
    if (!arr || arr.length === 0) return null;
    if (arr.length === 1) return arr[0];
    return `${arr[0]}, +${arr.length - 1}`;
  };
  const items = [{
    id: "status",
    icon: SVIcons.ICON_LOAD,
    label: "Status",
    ref: statusRef,
    list: STATUSES,
    panel: "status"
  }, {
    id: "mine",
    icon: svGlyph("clipboard-list", 16),
    label: "Assigned to me",
    ref: mineRef,
    list: MINE,
    panel: "status",
    toggle: true
  }, {
    id: "asset",
    icon: SVIcons.ICON_TRUCK,
    label: "Asset on site",
    ref: assetRef,
    list: ASSETS,
    panel: "single"
  }];
  const shown = items.filter(it => !hide.includes(it.id));
  const hasAny = Object.entries(filters).some(([k, v]) => k === "date" ? !!v : v && v.length > 0);
  return /*#__PURE__*/React.createElement("div", {
    "data-popover-host": true,
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      gap: inline ? 8 : 12,
      padding: inline ? 0 : "8px 24px",
      minHeight: inline ? 0 : 60
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 4
    }
  }, shown.map(it => {
    const v = filters[it.id] || (it.panel === "date" ? null : []);
    const has = it.panel === "date" ? !!v : v.length > 0;
    return /*#__PURE__*/React.createElement(FilterChip, {
      key: it.id,
      refEl: it.ref,
      icon: it.icon,
      label: it.label,
      toggle: it.toggle,
      state: !it.toggle && open === it.id ? "open" : "default",
      hasValue: has,
      valueText: valueText(it.id, v),
      onClick: () => it.toggle ? setVal(it.id, has ? [] : ["Yes"]) : setOpen(open === it.id ? null : it.id),
      onClear: it.toggle ? undefined : () => setVal(it.id, [])
    });
  })), shown.filter(it => !it.toggle).map(it => /*#__PURE__*/React.createElement(Popover, {
    key: it.id,
    open: open === it.id,
    anchorRef: it.ref,
    onClose: () => setOpen(null)
  }, it.panel === "date" ? /*#__PURE__*/React.createElement(DateRangeDropdown, {
    value: filters[it.id] || null,
    onChange: v => setVal(it.id, v),
    onClear: () => setVal(it.id, null)
  }) : it.panel === "single" ? /*#__PURE__*/React.createElement(SingleSelectDropdown, {
    options: it.list,
    value: filters[it.id] || [],
    onChange: v => setVal(it.id, v),
    onClear: () => setVal(it.id, [])
  }) : it.panel === "status" ? /*#__PURE__*/React.createElement(StatusDropdown, {
    options: it.list,
    value: filters[it.id] || [],
    onChange: v => setVal(it.id, v),
    onClear: () => setVal(it.id, [])
  }) : /*#__PURE__*/React.createElement(FilterDropdown, {
    title: it.label,
    options: it.list,
    value: filters[it.id] || [],
    onChange: v => setVal(it.id, v),
    onClear: () => setVal(it.id, [])
  }))));
}

// Shared-link notification banner — uses the DS inline-alert "info" vocabulary
// (info-fill / info-border / info-text), sized per spec: radius 12, padding 12/14.
const ICON_LINK = /*#__PURE__*/React.createElement("svg", {
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
}), /*#__PURE__*/React.createElement("path", {
  d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
}));
function SharedLinkBanner({
  onReset
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "6px 24px",
      minHeight: 34,
      background: "var(--sv-info-fill)",
      borderBottom: "1px solid var(--sv-border-subtle)",
      color: "var(--sv-info-text)",
      fontFamily: "var(--sv-font-ui)",
      fontSize: "var(--sv-body2-size)",
      lineHeight: "var(--sv-body2-lh)",
      letterSpacing: "var(--sv-body2-tracking)",
      fontWeight: "var(--sv-body2-weight)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "grid",
      placeItems: "center",
      flex: "none",
      color: "currentColor",
      transform: "scale(0.8)"
    }
  }, ICON_LINK), /*#__PURE__*/React.createElement("span", null, "Viewing a shared link - your own saved filters aren't applied"), /*#__PURE__*/React.createElement("button", {
    onClick: onReset,
    style: {
      all: "unset",
      cursor: "pointer",
      flex: "none",
      color: "currentColor",
      textDecoration: "underline",
      textUnderlineOffset: 2,
      fontFamily: "var(--sv-font-ui)",
      fontSize: "var(--sv-body2-size)",
      lineHeight: "var(--sv-body2-lh)",
      letterSpacing: "var(--sv-body2-tracking)",
      fontWeight: "var(--sv-body-semibold-weight)"
    }
  }, "Back to my view"));
}

// Result banner after a global-search handoff — says what the list is scoped to
function SearchResultsBanner({
  query,
  count,
  onClear
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      margin: "0 24px 12px",
      padding: "0 14px",
      minHeight: 36,
      borderRadius: 8,
      flex: "none",
      background: "var(--sv-accent-subtle)",
      border: "1px solid var(--sv-border-subtle)",
      color: "var(--sv-accent-text)",
      fontFamily: "var(--sv-font-ui)",
      fontSize: 14,
      lineHeight: "20px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: "grid",
      placeItems: "center",
      flex: "none",
      color: "var(--sv-accent)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "9.167",
    cy: "9.167",
    r: "5.833"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "16.667",
    y1: "16.667",
    x2: "13.292",
    y2: "13.292"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, "Showing ", /*#__PURE__*/React.createElement("strong", {
    style: {
      fontWeight: 600
    }
  }, count, " work order", count === 1 ? "" : "s"), " matching ", /*#__PURE__*/React.createElement("strong", {
    style: {
      fontWeight: 600
    }
  }, "\u201C", query, "\u201D")), /*#__PURE__*/React.createElement("button", {
    onClick: onClear,
    style: {
      all: "unset",
      cursor: "pointer",
      flex: "none",
      color: "var(--sv-accent)",
      fontFamily: "var(--sv-font-ui)",
      fontSize: 14,
      lineHeight: "20px",
      fontWeight: 500
    }
  }, "Clear search"));
}

// App header — matches design-system Header (preview/header.html)
const svKbdKey = {
  width: 16,
  height: 16,
  borderRadius: 4,
  background: "var(--sv-surface)",
  border: "1px solid var(--sv-border-default)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 500,
  fontSize: 11,
  lineHeight: 1,
  color: "var(--sv-text-secondary)"
};
function AppHeader({
  current = "Work Orders",
  clock = true,
  onSearchClick,
  searchValue = ""
}) {
  const [running, setRunning] = React.useState(true);
  const [secs, setSecs] = React.useState(4324);
  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSecs(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  const p = n => String(n).padStart(2, "0");
  const time = p(Math.floor(secs / 3600)) + ":" + p(Math.floor(secs / 60) % 60) + ":" + p(secs % 60);
  return /*#__PURE__*/React.createElement("header", {
    style: {
      height: "var(--sv-header-height)",
      flex: "none",
      background: "var(--sv-surface)",
      borderBottom: "1px solid var(--sv-border-default)",
      display: "flex",
      alignItems: "center",
      padding: "var(--sv-header-padding)",
      gap: "var(--sv-header-gap)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 16,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-label": "ShopView",
    style: {
      width: "var(--sv-header-logo-size)",
      height: "var(--sv-header-logo-size)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--sv-accent)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 100 100",
    fill: "currentColor",
    "aria-hidden": "true",
    style: {
      width: 30,
      height: 30
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M73.0787 60.9336L63.6353 51.4902C66.7831 54.7748 69.9309 57.9226 73.0787 60.9336Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M84.5575 12.489H31.729C20.6432 12.489 16.1268 17.2792 13.937 27.6806L3.94616 74.8978C3.53557 77.2244 3.125 79.1405 3.125 80.9197C3.125 82.562 3.39871 84.0675 3.94616 85.1624C12.5684 77.635 20.2327 68.8759 28.9918 61.4854C32.687 64.2226 35.698 67.6441 38.1615 71.4763C31.4553 77.635 24.4754 83.6569 18.0429 90.2262H68.1341C79.3568 90.2262 83.7363 85.4361 86.063 75.0347L96.0538 27.8175C96.4644 25.4909 96.875 23.5748 96.875 21.7956C96.7381 15.3631 93.4535 12.489 84.5575 12.489ZM51.8476 82.2883C50.8896 83.1095 50.0684 84.0675 49.1104 84.8886C46.6469 81.8777 43.0885 79.4142 42.6779 75.3084C41.4462 66.5492 34.4662 58.7481 25.844 57.1058C21.6013 56.5584 19.0009 53 16.1268 50.1259L38.9826 27.27L39.2564 26.9963L39.3932 27.1332L63.7545 51.4945C66.9024 54.6423 69.9133 57.7901 73.198 60.9379L51.8476 82.2883ZM74.9772 59.1587L41.0356 25.2171L44.3203 21.9324L78.2618 55.8741L74.9772 59.1587ZM80.041 54.0948L46.0994 20.1533L49.3841 16.8686L83.3257 50.8102L80.041 54.0948Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M46.0917 59.9816C48.8884 59.9816 51.1556 57.7144 51.1556 54.9177C51.1556 52.121 48.8884 49.8538 46.0917 49.8538C43.295 49.8538 41.0278 52.121 41.0278 54.9177C41.0278 57.7144 43.295 59.9816 46.0917 59.9816Z"
  }))), /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Primary",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 2,
      minWidth: 0,
      overflowX: "auto",
      scrollbarWidth: "none"
    }
  }, ["Dashboard", "Work Orders", "Schedule", "Customers", "Parts", "Reports"].map(n => /*#__PURE__*/React.createElement("span", {
    key: n,
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      height: "var(--sv-header-control-height)",
      padding: "8px 10px",
      borderRadius: "var(--sv-header-control-radius)",
      whiteSpace: "nowrap",
      fontWeight: 500,
      fontSize: 14,
      lineHeight: "20px",
      cursor: "pointer",
      color: "var(--sv-text-primary)",
      background: n === current ? "var(--sv-surface-nav-selected)" : "transparent"
    }
  }, n)))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    role: "search",
    onClick: onSearchClick,
    style: {
      width: 320,
      flexShrink: 1,
      minWidth: 140,
      height: "var(--sv-header-control-height)",
      boxSizing: "border-box",
      borderRadius: "var(--sv-header-control-radius)",
      background: "var(--sv-surface-sunken)",
      border: "1px solid var(--sv-border-default)",
      padding: "8px 12px",
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontSize: 14,
      fontWeight: 500,
      color: "var(--sv-text-secondary)",
      cursor: onSearchClick ? "text" : "default"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.67",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "9.167",
    cy: "9.167",
    r: "5.833"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "16.667",
    y1: "16.667",
    x2: "13.292",
    y2: "13.292"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      color: searchValue ? "var(--sv-text-primary)" : "inherit"
    }
  }, searchValue || "Search customers, work orders, parts..."), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: "flex",
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: svKbdKey
  }, "\u2318"), /*#__PURE__*/React.createElement("span", {
    style: svKbdKey
  }, "K"))), clock && /*#__PURE__*/React.createElement("div", {
    style: {
      height: "var(--sv-header-control-height)",
      flexShrink: 0,
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      gap: running ? 9 : 8,
      padding: running ? "0 8px 0 10px" : "0 8px 0 10px",
      borderRadius: "var(--sv-header-control-radius)",
      border: "1px solid " + (running ? "var(--sv-success-border)" : "var(--sv-border-default)"),
      background: running ? "var(--sv-success-fill)" : "var(--sv-surface)"
    }
  }, running ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: "var(--sv-success)",
      flexShrink: 0,
      animation: "svPulse 1.6s ease-in-out infinite"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 14,
      lineHeight: "20px",
      fontVariantNumeric: "tabular-nums",
      color: "var(--sv-success-text)",
      minWidth: 62
    }
  }, time), /*#__PURE__*/React.createElement("button", {
    type: "button",
    title: "Stop time clock",
    "aria-label": "Stop time clock",
    onClick: () => setRunning(false),
    style: {
      width: 24,
      height: 24,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      borderRadius: 6,
      border: "1px solid var(--sv-error-border)",
      background: "transparent",
      color: "var(--sv-error-text)",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "9",
    height: "9",
    viewBox: "0 0 9 9",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0.5",
    y: "0.5",
    width: "8",
    height: "8",
    rx: "1.5",
    fill: "currentColor"
  })))) : /*#__PURE__*/React.createElement("button", {
    type: "button",
    title: "Start time clock",
    onClick: () => {
      setSecs(4324);
      setRunning(true);
    },
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7,
      background: "none",
      border: 0,
      padding: 0,
      cursor: "pointer",
      fontFamily: "inherit",
      fontWeight: 600,
      fontSize: 14,
      lineHeight: "20px",
      color: "var(--sv-text-primary)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    style: {
      color: "var(--sv-text-secondary)"
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "8",
    cy: "8",
    r: "6.25"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 4.75V8l2.25 1.5"
  })), "Clock in")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: {
      background: "none",
      border: 0,
      cursor: "pointer",
      fontFamily: "inherit",
      fontWeight: 600,
      fontSize: 14,
      lineHeight: "20px",
      color: "var(--sv-text-primary)",
      padding: 0,
      whiteSpace: "nowrap"
    }
  }, "Heavy Duty"), /*#__PURE__*/React.createElement("span", {
    "aria-label": "User menu",
    style: {
      width: 32,
      height: 32,
      borderRadius: "50%",
      background: "var(--sv-accent-subtle)",
      color: "var(--sv-accent-subtle-text)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 600,
      fontSize: 12,
      overflow: "hidden"
    }
  }, "AK")));
}

// Search that reads as a text button until clicked, then becomes an inline input.
function ExpandingSearch({
  placeholder = "Type to search",
  value,
  onChange
}) {
  const [open, setOpen] = React.useState(false);
  const [inner, setInner] = React.useState("");
  const q = value !== undefined ? value : inner;
  const setQ = onChange || setInner;
  const expanded = open || !!q; // a tab's saved query keeps the field expanded
  const [hover, setHover] = React.useState(false);
  const inputRef = React.useRef();
  React.useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);
  return /*#__PURE__*/React.createElement("div", {
    role: "search",
    onClick: () => !expanded && setOpen(true),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      height: 36,
      width: expanded ? 240 : "auto",
      flexShrink: 0,
      boxSizing: "border-box",
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "0 12px",
      borderRadius: 8,
      background: !expanded && hover ? "var(--sv-surface-hover)" : "transparent",
      cursor: expanded ? "text" : "pointer",
      transition: "width 160ms ease-out, background-color 120ms ease-out"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.67",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    style: {
      flexShrink: 0,
      color: "var(--sv-text-primary)"
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "9.167",
    cy: "9.167",
    r: "5.833"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "16.667",
    y1: "16.667",
    x2: "13.292",
    y2: "13.292"
  })), !expanded ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: "var(--sv-text-primary)",
      whiteSpace: "nowrap"
    }
  }, "Search") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    value: q,
    placeholder: placeholder,
    onChange: e => setQ(e.target.value),
    onBlur: () => {
      if (!q) setOpen(false);
    },
    onKeyDown: e => {
      if (e.key === "Escape") {
        setQ("");
        setOpen(false);
      }
    },
    style: {
      all: "unset",
      flex: 1,
      minWidth: 0,
      fontFamily: "inherit",
      fontSize: 14,
      fontWeight: 500,
      color: "var(--sv-text-primary)"
    }
  }), q && /*#__PURE__*/React.createElement("button", {
    title: "Clear search",
    "aria-label": "Clear search",
    onMouseDown: e => e.preventDefault(),
    onClick: () => {
      setQ("");
      inputRef.current && inputRef.current.focus();
    },
    style: {
      all: "unset",
      cursor: "pointer",
      width: 20,
      height: 20,
      borderRadius: "50%",
      display: "grid",
      placeItems: "center",
      color: "var(--sv-text-secondary)",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "10",
    cy: "10",
    r: "7.25"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7.75 7.75l4.5 4.5M12.25 7.75l-4.5 4.5"
  })))));
}

// Standalone row of chips for each selected filter value
function AppliedFilters({
  filters,
  setFilters,
  labels
}) {
  const entries = [];
  Object.entries(filters).forEach(([k, v]) => {
    if (!v) return;
    (Array.isArray(v) ? v : [v]).forEach(val => entries.push({
      k,
      val
    }));
  });
  if (entries.length === 0) return null;
  const remove = ({
    k,
    val
  }) => {
    const cur = filters[k];
    const next = Array.isArray(cur) ? cur.filter(x => x !== val) : null;
    setFilters({
      ...filters,
      [k]: next
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 8,
      padding: "0 24px 12px",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 500,
      color: "var(--sv-text-muted)"
    }
  }, "Filters"), entries.map(({
    k,
    val
  }) => /*#__PURE__*/React.createElement("span", {
    key: k + val,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      height: 28,
      padding: "0 6px 0 10px",
      borderRadius: 100,
      background: "var(--sv-accent-subtle)",
      fontSize: 13,
      fontWeight: 500,
      color: "var(--sv-accent-subtle-text)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--sv-accent)",
      opacity: 0.8
    }
  }, labels[k] || k, ":"), val, /*#__PURE__*/React.createElement("button", {
    "aria-label": `Remove ${val}`,
    title: `Remove ${val}`,
    onClick: () => remove({
      k,
      val
    }),
    style: {
      all: "unset",
      cursor: "pointer",
      width: 18,
      height: 18,
      borderRadius: "50%",
      display: "grid",
      placeItems: "center",
      color: "var(--sv-accent)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 4l8 8M12 4l-8 8"
  }))))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setFilters({}),
    style: {
      all: "unset",
      cursor: "pointer",
      color: "var(--sv-accent)",
      fontWeight: 500,
      fontSize: 13,
      padding: "0 4px"
    }
  }, "Clear all"));
}

// Full page chrome (header + tabs + filter bar + table)
// `search` handoff from global search: { query, tab, key } — a new key re-applies it
function WorkOrdersPage({
  initial = {},
  frozenOpen = null,
  sharedLink = false,
  showAppliedRow = false,
  onSearchClick,
  searchValue = "",
  extraRows = [],
  search = null
}) {
  const [filtersByTab, setFiltersByTab] = React.useState({
    All: initial
  });
  const [cols, setCols] = React.useState(window.DEFAULT_COLUMNS || []);
  const [colsOpen, setColsOpen] = React.useState(false);
  const [tab, setTab] = React.useState("All");
  const [tableQuery, setTableQuery] = React.useState(""); // shared across tabs
  const [fromSearch, setFromSearch] = React.useState(false);
  const [resultCount, setResultCount] = React.useState(0);
  React.useEffect(() => {
    if (!search) return;
    setTableQuery(search.query || "");
    setFromSearch(!!(search.query || "").trim());
    if (search.tab) setTab(search.tab);
  }, [search && search.key]);
  const setQueryFromPage = v => {
    setTableQuery(v);
    setFromSearch(false);
  };
  const filters = filtersByTab[tab] || {};
  const setFilters = v => setFiltersByTab(m => ({
    ...m,
    [tab]: typeof v === "function" ? v(m[tab] || {}) : v
  }));
  const colsRef = React.useRef();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height: "100%",
      overflow: "hidden",
      background: "var(--sv-surface)",
      fontFamily: "var(--sv-font-ui)",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement(AppHeader, {
    clock: false,
    onSearchClick: onSearchClick,
    searchValue: searchValue
  }), sharedLink && /*#__PURE__*/React.createElement(SharedLinkBanner, {
    onReset: () => setFilters({})
  }), /*#__PURE__*/React.createElement("div", {
    "data-popover-host": true,
    style: {
      position: "relative",
      padding: "16px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 12,
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      gap: 4
    }
  }, ["All", "Work Orders", "Estimates", "Completed"].map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    onClick: () => setTab(t),
    style: {
      padding: "8px 12px",
      borderRadius: 8,
      whiteSpace: "nowrap",
      background: tab === t ? "var(--sv-surface-hover)" : "transparent",
      color: tab === t ? "var(--sv-text-primary)" : "var(--sv-text-secondary)",
      fontWeight: 500,
      fontSize: 14,
      cursor: "pointer"
    }
  }, t))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(ExpandingSearch, {
    value: fromSearch ? "" : tableQuery,
    onChange: setQueryFromPage
  }), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 1,
      height: 20,
      background: "var(--sv-border-subtle)",
      flexShrink: 0,
      margin: "0 4px"
    }
  }), /*#__PURE__*/React.createElement(FilterBar, {
    filters: filters,
    setFilters: setFilters,
    inline: true,
    hide: tab === "All" ? [] : ["status"]
  }), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 1,
      height: 20,
      background: "var(--sv-border-subtle)",
      flexShrink: 0,
      margin: "0 4px"
    }
  }), /*#__PURE__*/React.createElement("button", {
    ref: colsRef,
    title: "Columns",
    "aria-expanded": colsOpen,
    onClick: () => setColsOpen(v => !v),
    style: {
      all: "unset",
      cursor: "pointer",
      width: 36,
      height: 36,
      display: "grid",
      placeItems: "center",
      borderRadius: 8,
      background: colsOpen ? "var(--sv-surface-hover)" : "transparent"
    },
    onMouseEnter: e => e.currentTarget.style.background = "var(--sv-surface-hover)",
    onMouseLeave: e => e.currentTarget.style.background = colsOpen ? "var(--sv-surface-hover)" : "transparent"
  }, window.svIcon("columns-3", 20)), /*#__PURE__*/React.createElement(Popover, {
    open: colsOpen,
    anchorRef: colsRef,
    onClose: () => setColsOpen(false),
    align: "right",
    panelWidth: 288
  }, /*#__PURE__*/React.createElement(ColumnsDropdown, {
    visible: cols,
    onChange: setCols
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8
    }
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      all: "unset",
      cursor: "pointer",
      height: 36,
      padding: "0 16px",
      borderRadius: 8,
      background: "var(--sv-accent)",
      color: "var(--sv-text-on-accent)",
      fontWeight: 600,
      fontSize: 14
    }
  }, "New Work Order"))), showAppliedRow && /*#__PURE__*/React.createElement(AppliedFilters, {
    filters: filters,
    setFilters: setFilters,
    labels: {
      status: "Status",
      mine: "Assigned to me",
      asset: "Asset on site"
    }
  }), fromSearch && tableQuery.trim() && /*#__PURE__*/React.createElement(SearchResultsBanner, {
    query: tableQuery,
    count: resultCount,
    onClear: () => {
      setTableQuery("");
      setFromSearch(false);
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: "var(--sv-border-default)",
      flex: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: "auto",
      background: "var(--sv-surface)"
    }
  }, /*#__PURE__*/React.createElement(TableBackdrop, {
    cols: cols,
    tab: tab,
    filters: filters,
    query: tableQuery,
    extraRows: extraRows,
    onCount: setResultCount,
    onClear: () => setFilters({})
  })));
}

/* A getter for the same reason: reading it at export time would resolve to
   null, because lucide-icons.js has not run yet. */
Object.defineProperty(window, "ICON_MY_WORK_ORDERS", {
  configurable: true,
  enumerable: true,
  get() {
    return svGlyph("clipboard-list", 16);
  }
});
window.AppHeader = AppHeader;
window.AppliedFilters = AppliedFilters;
window.SearchResultsBanner = SearchResultsBanner;
window.WorkOrdersPage = WorkOrdersPage;
window.SharedLinkBanner = SharedLinkBanner;
window.FilterBar = FilterBar;
window.CUSTOMERS = CUSTOMERS;
window.STATUSES = STATUSES;
window.TECHS = TECHS;
window.SVEmptyState = SVEmptyState;
window.ADVISORS = ADVISORS;

/* Exported so work-orders.jsx can build the newer FilterBar on top of them.
   Each source file in the bundle is its own closure, so a symbol is only
   reachable from another file if it is put on window.

   Popover is deliberately NOT exported from here any more: the canonical one
   is SV.Popover in components/sv-components.jsx. The copy above stays private
   to this file because the standalone Filters artboards load this file
   without the component layer and still need it. */
window.ASSETS = ASSETS;
window.MINE = MINE;
window.ExpandingSearch = ExpandingSearch;
})(); } catch (e) { __ds_ns.__errors.push({ path: "filter-bar.jsx", error: String((e && e.message) || e) }); }

// filter-chip.jsx
try { (() => {
// Shopview Filter Chip — pill-style filter trigger that lives in a Filter Bar.
// States mirror the Figma source: Default, Hover, Selected (item picked), Empty‑selected (open + no items yet).

// Lucide glyphs, inlined by lucide-icons.js so they inherit currentColor.
//
// Resolved on READ, not at load. The generated bundle runs its sources in
// alphabetical order, so this file executes before lucide-icons.js (f < l) and
// window.svIcon does not exist yet. Calling it at module scope threw — and
// because each source runs inside its own try/catch, the failure was silent:
// it simply took the rest of this file with it, so window.FilterChip and
// window.SVIcons never existed in the bundle and the Design System fell back
// to the older design-md/ generation of the chip. Standalone artboards were
// unaffected, because they load lucide-icons.js first by hand — which is why
// this never showed up on a page anyone was looking at.
const maskIcon = (name, size = 16) => typeof window.svIcon === "function" ? window.svIcon(name, size) : null;
const lazyGlyph = (name, size = 16) => ({
  enumerable: true,
  get() {
    return maskIcon(name, size);
  }
});

/* The seven glyphs that used to be hand-drawn here are gone. Six were exact
   redraws of vendored Lucide glyphs — chevron-down, circle-x, x, search, check
   and chevron-left — and the seventh, the hamburger, is Lucide's `menu`. They
   are resolved from SV_LUCIDE now, so there is one drawing of each mark in the
   system instead of two that could drift apart.

   Sizes are preserved exactly. Stroke weight is not: these carried 1.5–1.67 and
   the vendored set is a uniform 2, which is what every other icon in the system
   renders at. */

// Filter chip — exact figma spec:
// 28px tall pill, radius 100, padding 0 10px, gap 8px between children
// Default: transparent bg, icon #364152, label Inter 500/14 #364152, chevron 20px
// Hover: bg #EEF2F6 (grey-100)
// Selected: bg #D8ECFF (primary-100), text + icon #257CFF (primary-500), chevron shown
// Selected + hover: chevron fades out, X-circle fades in over it for clear action
// toggle: renders as an on/off chip — no chevron, no clear affordance.
function FilterChip({
  icon,
  label,
  state = "default",
  onClick,
  hasValue = false,
  valueText,
  onClear,
  refEl,
  toggle = false
}) {
  const [hovered, setHovered] = React.useState(false);
  const isSelected = state === "selected" || hasValue;
  const isHover = state === "hover" || hovered;
  const isOpen = state === "open";

  /* Semantic tokens, not the raw palette steps the Figma spec above names.
     `--sv-grey-700` does not flip with the theme, so in dark mode the default
     chip label stayed a dark grey on a dark surface and the whole filter bar
     read as disabled. Light is unchanged for the text (--sv-text-primary IS
     grey-700 there); the hover fill moves one step lighter, from grey-100 to
     --sv-surface-hover, which is what every other ghost control in the system
     uses — .sv-btn--tertiary, .sv-tab, .sv-menu__row. */
  const bg = isSelected ? "var(--sv-accent-subtle)" : isHover || isOpen ? "var(--sv-surface-hover)" : "transparent";
  const color = isSelected ? "var(--sv-accent-subtle-text)" : "var(--sv-text-primary)";

  // Whether to show the clear icon overlay (selected + hovering)
  const showClear = isSelected && hovered && onClear;
  return /*#__PURE__*/React.createElement("button", {
    ref: refEl,
    onClick: onClick,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    style: {
      all: "unset",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      height: 28,
      padding: "0 10px",
      borderRadius: 100,
      backgroundColor: bg,
      color,
      fontFamily: "var(--sv-font-ui)",
      fontWeight: "var(--sv-body-weight)",
      fontSize: "var(--sv-body-size)",
      lineHeight: "var(--sv-body-lh)",
      whiteSpace: "nowrap",
      transition: "background-color 120ms ease-out"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      height: 16,
      display: "grid",
      placeItems: "center",
      flex: "none",
      color
    }
  }, icon), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: toggle && isSelected ? "var(--sv-body-semibold-weight)" : undefined
    }
  }, !toggle && hasValue && valueText ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--sv-accent-subtle-text)"
    }
  }, label, ": "), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--sv-accent-subtle-text)",
      fontWeight: "var(--sv-body-semibold-weight)"
    }
  }, valueText)) : label), !toggle && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      display: "grid",
      placeItems: "center",
      marginLeft: -4,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      display: "grid",
      placeItems: "center",
      color,
      opacity: showClear ? 0 : 1,
      transition: "opacity 140ms ease",
      pointerEvents: "none"
    }
  }, maskIcon("chevron-down", 20)), isSelected && onClear && /*#__PURE__*/React.createElement("span", {
    onClick: e => {
      e.stopPropagation();
      onClear();
    },
    style: {
      position: "absolute",
      inset: 0,
      display: "grid",
      placeItems: "center",
      color,
      opacity: showClear ? 1 : 0,
      transition: "opacity 140ms ease",
      cursor: "pointer"
    }
  }, maskIcon("circle-x", 16))));
}
window.FilterChip = FilterChip;
/* Every glyph is a getter, so it resolves the first time a component reads it —
   by which point lucide-icons.js has run. This file sorts before it. */
window.SVIcons = Object.defineProperties({}, {
  ICON_LOAD: lazyGlyph("loader"),
  ICON_USER: lazyGlyph("user"),
  ICON_WRENCH: lazyGlyph("wrench"),
  ICON_HEADSET: lazyGlyph("headset"),
  ICON_TRUCK: lazyGlyph("truck"),
  ICON_CALENDAR: lazyGlyph("calendar"),
  ICON_CHEVRON: lazyGlyph("chevron-down", 20),
  ICON_XCIRCLE: lazyGlyph("circle-x", 16),
  ICON_X: lazyGlyph("x", 14),
  ICON_SEARCH: lazyGlyph("search", 20),
  ICON_CHECK: lazyGlyph("check", 12),
  ICON_BARS: lazyGlyph("menu", 16),
  ICON_BACK: lazyGlyph("chevron-left", 20)
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "filter-chip.jsx", error: String((e && e.message) || e) }); }

// filter-dropdown.jsx
try { (() => {
// Filter dropdown panel — opens below a chip. Search input + scrollable checkbox list + "Clear selection".
// Matches Figma /Filters/Customer-v1 + /Filters/Customer-v1-selected.

/* Presentational tri-state box drawn inside a dropdown row. The row itself is
   the control (a <button role="checkbox">); this only paints the state, so it
   must never be focusable. Named FilterCheckbox so it cannot be confused with
   the form control SV.Checkbox — index.js publishes it under that name. */
/* Explicit reset, not `all: unset` — that would also unset box-shadow inline and
   beat the .sv-dd-row:focus-visible ring in components.css. Background is left
   to the class for the same reason: an inline value would beat :hover. */
const DD_ROW = {
  appearance: "none",
  WebkitAppearance: "none",
  margin: 0,
  border: 0,
  textAlign: "left",
  boxSizing: "border-box",
  display: "flex",
  alignItems: "center",
  gap: 12,
  width: "100%",
  padding: "10px 16px",
  cursor: "pointer",
  fontFamily: "var(--sv-font-ui)",
  fontWeight: "var(--sv-body-medium-weight)",
  fontSize: "var(--sv-body-size)",
  lineHeight: "var(--sv-body-lh)",
  color: "var(--sv-text-primary)"
};
function FilterCheckbox({
  checked,
  partial
}) {
  return /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 16,
      height: 16,
      flex: "none",
      borderRadius: 4,
      border: `1px solid ${checked || partial ? "var(--sv-accent)" : "var(--sv-border-strong)"}`,
      background: checked || partial ? "var(--sv-accent-subtle)" : "var(--sv-surface)",
      color: "var(--sv-accent-text)",
      display: "grid",
      placeItems: "center",
      transition: "all 120ms ease-out"
    }
  }, checked && SVIcons.ICON_CHECK, !checked && partial && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 2,
      borderRadius: 1,
      background: "var(--sv-accent)"
    }
  }));
}

// Shared "Select all" row for multi-select lists. Reflects the visible (filtered) options.
function SelectAllRow({
  options,
  value,
  onChange,
  label = "Select all"
}) {
  const selectedCount = options.filter(o => value.includes(o)).length;
  const all = options.length > 0 && selectedCount === options.length;
  const partial = selectedCount > 0 && !all;
  const toggle = () => {
    const s = new Set(value);
    if (all) options.forEach(o => s.delete(o));else options.forEach(o => s.add(o));
    onChange(Array.from(s));
  };
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sv-dd-row",
    role: "checkbox",
    "aria-checked": all ? "true" : partial ? "mixed" : "false",
    onClick: toggle,
    style: {
      ...DD_ROW,
      borderBottom: "1px solid var(--sv-border-subtle)"
    }
  }, /*#__PURE__*/React.createElement(FilterCheckbox, {
    checked: all,
    partial: partial
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, label), selectedCount > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--sv-text-secondary)",
      fontSize: 13
    }
  }, selectedCount, " selected"));
}
function PanelSearch({
  value,
  onChange,
  placeholder = "Search customer",
  autoFocus
}) {
  const [focused, setFocused] = React.useState(autoFocus);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 12px 8px 12px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      height: 40,
      padding: "0 12px",
      borderRadius: 8,
      background: "var(--sv-surface-hover)",
      border: `${focused ? 2 : 1}px solid ${focused ? "var(--sv-accent)" : "var(--sv-border-default)"}`,
      boxShadow: focused ? "var(--sv-focus-ring)" : "none",
      transition: "all 120ms ease-out"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: focused ? "var(--sv-accent-text)" : "var(--sv-text-secondary)",
      display: "grid",
      placeItems: "center"
    }
  }, SVIcons.ICON_SEARCH), /*#__PURE__*/React.createElement("input", {
    value: value,
    onChange: e => onChange(e.target.value),
    placeholder: placeholder,
    autoFocus: autoFocus,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      border: "none",
      outline: "none",
      background: "transparent",
      flex: 1,
      height: 36,
      fontFamily: "var(--sv-font-ui)",
      fontWeight: 500,
      fontSize: 14,
      lineHeight: "20px",
      color: "var(--sv-text-primary)"
    }
  })));
}

// Variant A — multi-select with checkboxes + plain search
function FilterDropdown({
  title = "Customer",
  options,
  value,
  onChange,
  onClear,
  width = 320,
  withSearch = true,
  withFooter = true,
  withSelectAll = false
}) {
  const [q, setQ] = React.useState("");
  const filtered = options.filter(o => o.toLowerCase().includes(q.toLowerCase()));
  const toggle = o => {
    const s = new Set(value);
    s.has(o) ? s.delete(o) : s.add(o);
    onChange(Array.from(s));
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      background: "var(--sv-surface-overlay)",
      borderRadius: 12,
      border: "1px solid var(--sv-border-default)",
      boxShadow: "var(--sv-elev-2-shadow)",
      overflow: "hidden",
      fontFamily: "var(--sv-font-ui)"
    }
  }, withSearch && /*#__PURE__*/React.createElement(PanelSearch, {
    value: q,
    onChange: setQ,
    placeholder: `Search ${title.toLowerCase()}`,
    autoFocus: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: 320,
      overflow: "auto",
      padding: "4px 0 8px"
    }
  }, withSelectAll && filtered.length > 0 && /*#__PURE__*/React.createElement(SelectAllRow, {
    options: filtered,
    value: value,
    onChange: onChange
  }), filtered.map(o => {
    const checked = value.includes(o);
    return /*#__PURE__*/React.createElement("button", {
      key: o,
      type: "button",
      className: "sv-dd-row",
      style: DD_ROW,
      role: "checkbox",
      "aria-checked": checked,
      onClick: () => toggle(o)
    }, /*#__PURE__*/React.createElement(FilterCheckbox, {
      checked: checked
    }), /*#__PURE__*/React.createElement("span", null, o));
  }), filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 16px",
      color: "var(--sv-text-secondary)",
      fontSize: 14
    }
  }, "No matches")), withFooter && /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid var(--sv-border-default)",
      padding: "12px 16px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClear,
    style: {
      all: "unset",
      cursor: "pointer",
      color: "var(--sv-text-primary)",
      fontFamily: "var(--sv-font-ui)",
      fontWeight: 500,
      fontSize: 14,
      lineHeight: "20px"
    }
  }, "Clear selection")));
}

// Variant B — selected/with-pills search input at top (chips inline in the search box)
function FilterDropdownWithPills({
  title = "Customer",
  options,
  value,
  onChange,
  onClear,
  width = 320
}) {
  const [q, setQ] = React.useState("");
  const filtered = options.filter(o => o.toLowerCase().includes(q.toLowerCase()));
  const toggle = o => {
    const s = new Set(value);
    s.has(o) ? s.delete(o) : s.add(o);
    onChange(Array.from(s));
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      background: "var(--sv-surface-overlay)",
      borderRadius: 12,
      border: "1px solid var(--sv-border-default)",
      boxShadow: "var(--sv-elev-2-shadow)",
      overflow: "hidden",
      fontFamily: "var(--sv-font-ui)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 12px 8px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: 6,
      minHeight: 40,
      padding: "6px 36px 6px 10px",
      borderRadius: 8,
      background: "var(--sv-surface-hover)",
      border: "2px solid var(--sv-accent)",
      boxShadow: "var(--sv-focus-ring)"
    }
  }, value.map(v => /*#__PURE__*/React.createElement("span", {
    key: v,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      height: 24,
      padding: "0 4px 0 8px",
      borderRadius: 6,
      background: "var(--sv-accent-subtle)",
      border: "1px solid transparent",
      fontWeight: 500,
      fontSize: 13,
      lineHeight: "20px",
      color: "var(--sv-accent-text)",
      maxWidth: 200
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, v), /*#__PURE__*/React.createElement("button", {
    onClick: () => toggle(v),
    style: {
      all: "unset",
      cursor: "pointer",
      color: "var(--sv-accent-text)",
      display: "grid",
      placeItems: "center",
      padding: 2
    }
  }, SVIcons.ICON_X))), /*#__PURE__*/React.createElement("input", {
    value: q,
    onChange: e => setQ(e.target.value),
    autoFocus: true,
    placeholder: value.length ? "" : `Search ${title.toLowerCase()}`,
    style: {
      border: "none",
      outline: "none",
      background: "transparent",
      flex: 1,
      minWidth: 60,
      height: 24,
      fontFamily: "var(--sv-font-ui)",
      fontWeight: 500,
      fontSize: 14,
      lineHeight: "20px",
      color: "var(--sv-text-primary)"
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: onClear,
    style: {
      all: "unset",
      cursor: "pointer",
      color: "var(--sv-text-secondary)",
      position: "absolute",
      right: 8,
      top: 8,
      width: 20,
      height: 20,
      display: "grid",
      placeItems: "center"
    }
  }, SVIcons.ICON_XCIRCLE))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: 320,
      overflow: "auto",
      padding: "4px 0 8px"
    }
  }, filtered.map(o => {
    const checked = value.includes(o);
    return /*#__PURE__*/React.createElement("button", {
      key: o,
      type: "button",
      className: "sv-dd-row",
      style: DD_ROW,
      role: "checkbox",
      "aria-checked": checked,
      onClick: () => toggle(o)
    }, /*#__PURE__*/React.createElement(FilterCheckbox, {
      checked: checked
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }, o));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid var(--sv-border-default)",
      padding: "12px 16px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClear,
    style: {
      all: "unset",
      cursor: "pointer",
      color: "var(--sv-text-primary)",
      fontFamily: "var(--sv-font-ui)",
      fontWeight: 500,
      fontSize: 14,
      lineHeight: "20px"
    }
  }, "Clear selection")));
}

// Simple single-select status list (for Status chip)
function StatusDropdown({
  options,
  value,
  onChange,
  onClear,
  width = 240,
  withSelectAll = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      background: "var(--sv-surface-overlay)",
      borderRadius: 12,
      border: "1px solid var(--sv-border-default)",
      boxShadow: "var(--sv-elev-2-shadow)",
      overflow: "hidden",
      fontFamily: "var(--sv-font-ui)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "8px 0"
    }
  }, withSelectAll && /*#__PURE__*/React.createElement(SelectAllRow, {
    options: options,
    value: value,
    onChange: onChange
  }), options.map(o => {
    const checked = value.includes(o);
    return /*#__PURE__*/React.createElement("button", {
      key: o,
      type: "button",
      className: "sv-dd-row",
      style: DD_ROW,
      role: "checkbox",
      "aria-checked": checked,
      onClick: () => {
        const s = new Set(value);
        s.has(o) ? s.delete(o) : s.add(o);
        onChange(Array.from(s));
      }
    }, /*#__PURE__*/React.createElement(FilterCheckbox, {
      checked: checked
    }), /*#__PURE__*/React.createElement("span", null, o));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid var(--sv-border-default)",
      padding: "12px 16px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClear,
    style: {
      all: "unset",
      cursor: "pointer",
      color: "var(--sv-text-primary)",
      fontWeight: 500,
      fontSize: 14,
      lineHeight: "20px"
    }
  }, "Clear selection")));
}

// Single-select list — checkmark on the selected row, no checkboxes (Asset on site)
function SingleSelectDropdown({
  options,
  value,
  onChange,
  onClear,
  width = 240
}) {
  const selected = Array.isArray(value) ? value[0] : value;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      background: "var(--sv-surface-overlay)",
      borderRadius: 12,
      border: "1px solid var(--sv-border-default)",
      boxShadow: "var(--sv-elev-2-shadow)",
      overflow: "hidden",
      fontFamily: "var(--sv-font-ui)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "8px 0"
    }
  }, options.map(o => {
    const on = selected === o;
    return /*#__PURE__*/React.createElement("button", {
      key: o,
      type: "button",
      className: "sv-dd-row",
      role: "option",
      "aria-selected": on,
      style: {
        ...DD_ROW,
        justifyContent: "space-between"
      },
      onClick: () => onChange(on ? [] : [o])
    }, /*#__PURE__*/React.createElement("span", null, o), on && /*#__PURE__*/React.createElement("svg", {
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "var(--sv-text-primary)",
      strokeWidth: "2.5",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      style: {
        flex: "none"
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M20 6 9 17l-5-5"
    })));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid var(--sv-border-default)",
      padding: "12px 16px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClear,
    style: {
      all: "unset",
      cursor: "pointer",
      color: "var(--sv-text-primary)",
      fontWeight: 500,
      fontSize: 14,
      lineHeight: "20px"
    }
  }, "Clear selection")));
}

// Date Range dropdown — single-select preset list with optional custom date inputs
const DATE_PRESETS = ["Today", "Yesterday", "This week", "This month", "Last month", "This quarter", "This year", "Custom"];
function DateRangeDropdown({
  value,
  onChange,
  onClear,
  width = 260
}) {
  const selected = value || null;
  const [customRange, setCustomRange] = React.useState("");
  const isCustom = selected === "Custom";
  const pick = preset => {
    onChange(preset === selected ? null : preset);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      background: "var(--sv-surface-overlay)",
      borderRadius: 12,
      border: "1px solid var(--sv-border-default)",
      boxShadow: "var(--sv-elev-2-shadow)",
      overflow: "hidden",
      fontFamily: "var(--sv-font-ui)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "8px 0"
    }
  }, DATE_PRESETS.map(p => {
    const active = selected === p;
    return /*#__PURE__*/React.createElement("div", {
      key: p
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "sv-dd-row",
      style: DD_ROW,
      role: "radio",
      "aria-checked": active,
      onClick: () => pick(p)
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 16,
        height: 16,
        flex: "none",
        borderRadius: "50%",
        border: `${active ? 5 : 1}px solid ${active ? "var(--sv-accent)" : "var(--sv-border-strong)"}`,
        background: "var(--sv-surface)",
        transition: "all 120ms ease-out"
      }
    }), /*#__PURE__*/React.createElement("span", null, p)), p === "Custom" && isCustom && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "4px 16px 12px 44px"
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      placeholder: "MM/DD/YYYY \u2013 MM/DD/YYYY",
      value: customRange,
      onChange: e => setCustomRange(e.target.value),
      onFocus: e => e.currentTarget.style.borderColor = "var(--sv-accent)",
      onBlur: e => e.currentTarget.style.borderColor = "var(--sv-border-default)",
      style: {
        width: "100%",
        height: 36,
        padding: "0 10px",
        borderRadius: 8,
        border: "1px solid var(--sv-border-default)",
        fontFamily: "var(--sv-font-ui)",
        fontSize: 13,
        fontWeight: 500,
        color: "var(--sv-text-primary)",
        outline: "none",
        transition: "border-color 120ms ease-out"
      }
    })));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid var(--sv-border-default)",
      padding: "12px 16px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClear,
    style: {
      all: "unset",
      cursor: "pointer",
      color: "var(--sv-text-primary)",
      fontWeight: 500,
      fontSize: 14,
      lineHeight: "20px"
    }
  }, "Clear selection")));
}
window.SelectAllRow = SelectAllRow;
window.FilterDropdown = FilterDropdown;
window.FilterDropdownWithPills = FilterDropdownWithPills;
window.StatusDropdown = StatusDropdown;
window.SingleSelectDropdown = SingleSelectDropdown;
window.DateRangeDropdown = DateRangeDropdown;
window.DATE_PRESETS = DATE_PRESETS;
window.FilterCheckbox = FilterCheckbox;
/* legacy name — index.js hands the bare `Checkbox` back to the form control
   and keeps this one reachable as SV.FilterCheckbox */
window.Checkbox = FilterCheckbox;
})(); } catch (e) { __ds_ns.__errors.push({ path: "filter-dropdown.jsx", error: String((e && e.message) || e) }); }

// global-search.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Shopview · Global Search — shared components
// Icons: Lucide, vendored in assets/icons/lucide and inlined by lucide-icons.js.
const {
  useState,
  useEffect,
  useRef,
  useMemo
} = React;

// Lucide, vendored in assets/icons/lucide and inlined by lucide-icons.js, so every
// glyph inherits currentColor and follows the theme tokens.
const gsC = {
  grey400: "var(--sv-text-muted)",
  grey500: "var(--sv-text-secondary)",
  grey700: "var(--sv-text-primary)",
  blue500: "var(--sv-accent)"
};
function Ico({
  src,
  size = 20,
  color = "grey500",
  style = {}
}) {
  return window.svIcon(src, size, {
    style: {
      display: "block",
      flexShrink: 0,
      color: gsC[color] || gsC.grey500,
      ...style
    }
  });
}
const LU = n => n;
const ICO = {
  search: LU("search"),
  xCircle: LU("circle-x"),
  workOrder: LU("clipboard-list"),
  user: LU("building-2"),
  truck: LU("truck"),
  settings: LU("cog"),
  vendor: LU("store"),
  invoice: LU("receipt"),
  salesOrder: LU("shopping-cart"),
  tool: LU("wrench"),
  arrowDown: LU("arrow-down"),
  arrowUp: LU("arrow-up"),
  enter: LU("corner-down-left"),
  clock: LU("history"),
  contact: LU("user-round"),
  purchaseOrder: LU("package"),
  vendorInvoice: LU("file-text"),
  woBadge: LU("clipboard-list")
};
const ENTITY_ICON = {
  "work-order": ICO.workOrder,
  "customer": ICO.user,
  "asset": ICO.truck,
  "part": ICO.settings,
  "vendor": ICO.vendor,
  "invoice": ICO.invoice,
  "sales-order": ICO.salesOrder,
  "contact": ICO.contact,
  "purchase-order": ICO.purchaseOrder,
  "vendor-invoice": ICO.vendorInvoice
};
const BADGE_STYLES = {
  success: {
    background: "var(--sv-success-fill)",
    border: "1px solid var(--sv-success-border)",
    color: "var(--sv-success-text)"
  },
  info: {
    background: "var(--sv-info-fill)",
    border: "1px solid var(--sv-info-border)",
    color: "var(--sv-info-text)"
  },
  warning: {
    background: "var(--sv-warning-fill)",
    border: "1px solid var(--sv-warning-border)",
    color: "var(--sv-warning-text)"
  },
  neutral: {
    background: "var(--sv-surface-sunken)",
    border: "1px solid var(--sv-border-strong)",
    color: "var(--sv-text-primary)"
  }
};
function GSBadge({
  type = "neutral",
  label,
  icon
}) {
  const s = BADGE_STYLES[type] || BADGE_STYLES.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      fontFamily: "var(--sv-font-ui)",
      fontWeight: "var(--sv-body2-weight)",
      fontSize: "var(--sv-body2-size)",
      lineHeight: "var(--sv-body2-lh)",
      letterSpacing: "var(--sv-body2-tracking)",
      height: 22,
      padding: "2px 8px",
      borderRadius: "var(--sv-radius-pill)",
      whiteSpace: "nowrap",
      ...s
    }
  }, icon && window.svIcon(icon, 12, {
    style: {
      display: "block",
      flexShrink: 0
    }
  }), label);
}

// Lucide is a uniform 24 grid with consistent padding — no per-icon rescaling.
const UNPADDED = new Set();
function EntityIcon({
  type = "work-order"
}) {
  const src = ENTITY_ICON[type] || ICO.workOrder;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: "var(--sv-radius-lg)",
      flexShrink: 0,
      background: "var(--sv-surface-sunken)",
      border: "1px solid var(--sv-border-default)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    src: src,
    size: UNPADDED.has(src) ? 17 : 20,
    color: "grey500"
  }));
}
function SectionLabel({
  label,
  action,
  onAction
}) {
  const [hov, setHov] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "4px 24px 2px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--sv-body2-size)",
      fontWeight: 600,
      lineHeight: "var(--sv-body2-lh)",
      letterSpacing: "var(--sv-body2-tracking)",
      color: "var(--sv-text-secondary)"
    }
  }, label), action && /*#__PURE__*/React.createElement("span", {
    onClick: onAction,
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    style: {
      fontSize: "var(--sv-body2-size)",
      fontWeight: 600,
      lineHeight: "var(--sv-body2-lh)",
      letterSpacing: "var(--sv-body2-tracking)",
      color: hov ? "var(--sv-accent-hover)" : "var(--sv-accent-text)",
      paddingRight: 12,
      cursor: "pointer",
      textDecoration: hov ? "underline" : "none"
    }
  }, action));
}
function TimeLabel({
  label,
  action,
  onAction
}) {
  const [hov, setHov] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "4px 24px 2px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--sv-caption-size)",
      fontWeight: "var(--sv-caption-weight)",
      lineHeight: "var(--sv-caption-lh)",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--sv-text-muted)"
    }
  }, label), action && /*#__PURE__*/React.createElement("span", {
    onClick: onAction,
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    style: {
      fontSize: "var(--sv-body2-size)",
      fontWeight: 600,
      lineHeight: "var(--sv-body2-lh)",
      letterSpacing: "var(--sv-body2-tracking)",
      color: hov ? "var(--sv-accent-hover)" : "var(--sv-accent-text)",
      paddingRight: 12,
      cursor: "pointer",
      textDecoration: hov ? "underline" : "none"
    }
  }, action));
}
function HL({
  text,
  query
}) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return React.createElement(React.Fragment, null, text.slice(0, idx), React.createElement('span', {
    style: {
      background: 'var(--sv-warning-fill)',
      borderRadius: 'var(--sv-radius-xs)'
    }
  }, text.slice(idx, idx + query.length)), text.slice(idx + query.length));
}
function ResultRow({
  type = "work-order",
  title,
  badge,
  badgeType = "success",
  meta,
  metaIcon = false,
  hovered = false,
  actionLabel,
  actions,
  highlight,
  badgeIcon,
  selected = false,
  onClick,
  onMouseMove
}) {
  const [isHov, setHov] = useState(hovered);
  const on = isHov || selected;
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    onMouseMove: onMouseMove,
    onClick: onClick,
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--sv-space-4)",
      padding: "var(--sv-space-2) var(--sv-space-3)",
      borderRadius: "var(--sv-radius-lg)",
      cursor: "pointer",
      minHeight: 58,
      background: on ? "var(--sv-surface-hover)" : "transparent",
      transition: "background 120ms ease",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 16,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(EntityIcon, {
    type: type
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--sv-body-size)",
      fontWeight: "var(--sv-body-semibold-weight)",
      lineHeight: "var(--sv-body-lh)",
      color: "var(--sv-text-primary)"
    }
  }, React.createElement(HL, {
    text: title,
    query: highlight
  })), badge && /*#__PURE__*/React.createElement(GSBadge, {
    type: badgeType,
    label: badge,
    icon: badgeIcon
  })), meta && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      fontSize: "var(--sv-body2-size)",
      fontWeight: "var(--sv-body2-weight)",
      lineHeight: "var(--sv-body2-lh)",
      letterSpacing: "var(--sv-body2-tracking)",
      color: "var(--sv-text-secondary)"
    }
  }, metaIcon && /*#__PURE__*/React.createElement(Ico, {
    src: ICO.tool,
    size: 14,
    color: "grey400"
  }), Array.isArray(meta) ? meta.map((m, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      color: m === "·" ? "var(--sv-text-disabled)" : "var(--sv-text-secondary)"
    }
  }, m === "·" ? m : React.createElement(HL, {
    text: m,
    query: highlight
  }))) : /*#__PURE__*/React.createElement("span", null, React.createElement(HL, {
    text: meta,
    query: highlight
  }))))), on && (actionLabel || actions && actions.length > 0) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      flexShrink: 0,
      alignItems: "center"
    }
  }, (actions || (actionLabel ? [{
    label: actionLabel
  }] : [])).map((a, i) => a.label ? /*#__PURE__*/React.createElement("button", {
    key: i,
    style: {
      flexShrink: 0,
      fontFamily: "var(--sv-font-ui)",
      fontWeight: "var(--sv-body-semibold-weight)",
      fontSize: "var(--sv-body2-size)",
      lineHeight: "var(--sv-body2-lh)",
      letterSpacing: "var(--sv-body2-tracking)",
      color: "var(--sv-text-primary)",
      background: "var(--sv-surface)",
      border: "1px solid var(--sv-border-strong)",
      borderRadius: "var(--sv-radius-md)",
      height: 28,
      padding: "0 var(--sv-space-3)",
      cursor: "pointer",
      whiteSpace: "nowrap",
      boxShadow: "var(--sv-elev-1-shadow)"
    }
  }, a.label) : /*#__PURE__*/React.createElement("button", {
    key: i,
    style: {
      flexShrink: 0,
      width: 28,
      height: 28,
      background: "var(--sv-surface)",
      border: "1px solid var(--sv-border-strong)",
      borderRadius: "var(--sv-radius-md)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      boxShadow: "var(--sv-elev-1-shadow)",
      padding: 0
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    src: a.icon,
    size: 16,
    color: "grey500"
  })))));
}
const SEARCH_TABS = ["All", "Work Orders", "Customers", "Assets", "Parts", "Vendors", "Part Sales", "Purchase Orders", "Vendor Invoices"];
function FilterTabs({
  tabs,
  active = 0,
  value,
  onChange
}) {
  const [sel, setSel] = useState(active);
  const [hov, setHov] = useState(-1);
  const cur = value != null ? value : sel;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 2,
      padding: "var(--sv-space-4) var(--sv-space-3)",
      flexWrap: "nowrap",
      overflowX: "auto",
      overflowY: "hidden",
      scrollbarWidth: "thin",
      scrollbarColor: "var(--sv-border-strong) transparent",
      maxWidth: "100%"
    }
  }, tabs.map((tab, i) => {
    const label = typeof tab === "string" ? tab : tab.label;
    const on = cur === i;
    const isHov = hov === i && !on;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: () => {
        setSel(i);
        onChange && onChange(i);
      },
      onMouseEnter: () => setHov(i),
      onMouseLeave: () => setHov(-1),
      style: {
        height: 28,
        padding: "0 var(--sv-space-3)",
        border: 0,
        background: on || isHov ? "var(--sv-surface-sunken)" : "transparent",
        borderRadius: "var(--sv-radius-sm)",
        display: "inline-flex",
        alignItems: "center",
        fontFamily: "var(--sv-font-ui)",
        fontWeight: "var(--sv-body-medium-weight)",
        fontSize: "var(--sv-body-size)",
        lineHeight: "var(--sv-body-lh)",
        color: on || isHov ? "var(--sv-text-primary)" : "var(--sv-text-secondary)",
        cursor: "pointer",
        transition: "background 120ms ease, color 120ms ease",
        whiteSpace: "nowrap",
        flexShrink: 0
      }
    }, label);
  }));
}
function KbdKey({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 29,
      borderRadius: 10,
      background: "var(--sv-border-default)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1px 2px 4px 2px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 24,
      height: 24,
      borderRadius: "var(--sv-radius-md)",
      background: "var(--sv-surface)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, children));
}
function KbdFooter() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 45,
      background: "var(--sv-surface-canvas)",
      borderTop: "1px solid var(--sv-border-subtle)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "var(--sv-space-2) var(--sv-space-6)",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(KbdKey, null, /*#__PURE__*/React.createElement(Ico, {
    src: ICO.arrowDown,
    size: 14,
    color: "grey500"
  })), /*#__PURE__*/React.createElement(KbdKey, null, /*#__PURE__*/React.createElement(Ico, {
    src: ICO.arrowUp,
    size: 14,
    color: "grey500"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--sv-body2-size)",
      fontWeight: "var(--sv-body2-weight)",
      letterSpacing: "var(--sv-body2-tracking)",
      color: "var(--sv-text-secondary)"
    }
  }, "Navigate")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(KbdKey, null, /*#__PURE__*/React.createElement(Ico, {
    src: ICO.enter,
    size: 13,
    color: "grey500"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--sv-body2-size)",
      fontWeight: "var(--sv-body2-weight)",
      letterSpacing: "var(--sv-body2-tracking)",
      color: "var(--sv-text-secondary)"
    }
  }, "Select"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--sv-body2-size)",
      fontWeight: "var(--sv-body2-weight)",
      letterSpacing: "var(--sv-body2-tracking)",
      color: "var(--sv-text-secondary)"
    }
  }, "Close"), /*#__PURE__*/React.createElement(KbdKey, null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--sv-body2-size)",
      fontWeight: "var(--sv-body2-weight)",
      color: "var(--sv-text-secondary)",
      padding: "0 3px"
    }
  }, "esc"))));
}
function SecondaryBtn({
  label
}) {
  const [hov, setHov] = useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    style: {
      height: 28,
      padding: "0 var(--sv-space-3)",
      background: hov ? "var(--sv-surface-hover)" : "var(--sv-surface)",
      border: "1px solid var(--sv-border-strong)",
      borderRadius: "var(--sv-radius-md)",
      boxShadow: "var(--sv-elev-1-shadow)",
      fontFamily: "var(--sv-font-ui)",
      fontWeight: "var(--sv-body-semibold-weight)",
      fontSize: "var(--sv-body2-size)",
      lineHeight: "var(--sv-body2-lh)",
      letterSpacing: "var(--sv-body2-tracking)",
      color: "var(--sv-text-primary)",
      cursor: "pointer",
      whiteSpace: "nowrap",
      transition: "background 120ms ease"
    }
  }, label);
}

// Static shell (for spec cards): query is text, not an input
function Shell({
  query = "",
  showClear = false,
  children,
  footer = true,
  querySelected = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 640,
      borderRadius: "var(--sv-radius-lg)",
      border: "5px solid var(--sv-border-subtle)",
      boxShadow: "var(--sv-elev-3-shadow)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      background: "var(--sv-surface-overlay)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 56,
      background: "var(--sv-surface-overlay)",
      borderBottom: "1px solid var(--sv-border-subtle)",
      display: "flex",
      alignItems: "center",
      gap: "var(--sv-space-3)",
      padding: "var(--sv-space-4) var(--sv-space-5)",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    src: ICO.search,
    size: 20,
    color: query ? "grey700" : "grey500"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: "var(--sv-body-size)",
      fontWeight: "var(--sv-body-medium-weight)",
      lineHeight: "var(--sv-body-lh)",
      color: query ? "var(--sv-text-primary)" : "var(--sv-text-muted)"
    }
  }, query ? querySelected ? React.createElement('span', {
    style: {
      background: 'var(--sv-accent-subtle)',
      borderRadius: 'var(--sv-radius-xs)',
      padding: '1px 0'
    }
  }, query) : query : "Search work orders, customers, parts and more"), showClear && /*#__PURE__*/React.createElement("button", {
    style: {
      background: "none",
      border: "none",
      padding: 0,
      cursor: "pointer",
      display: "flex",
      opacity: 0.7
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    src: ICO.xCircle,
    size: 18,
    color: "grey400"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      scrollbarWidth: "thin",
      scrollbarColor: "var(--sv-border-strong) transparent"
    }
  }, children), footer && /*#__PURE__*/React.createElement(KbdFooter, null));
}
function AIRow({
  query
}) {
  const [hov, setHov] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "14px 16px",
      cursor: "pointer",
      background: hov ? "var(--sv-cat-pink-fill)" : "transparent",
      transition: "background 120ms ease"
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    src: ICO.search,
    size: 20,
    color: "grey500"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--sv-body-size)",
      fontWeight: "var(--sv-body-medium-weight)",
      color: "var(--sv-text-primary)"
    }
  }, "Search all sources with"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 24,
      height: 24,
      borderRadius: "var(--sv-radius-md)",
      background: "var(--sv-cat-pink-text)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: "var(--sv-text-inverse)",
      letterSpacing: "-0.02em"
    }
  }, "AI")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--sv-body-size)",
      fontWeight: "var(--sv-body-medium-weight)",
      color: "var(--sv-text-muted)"
    }
  }, "\"", query, "\""));
}

// ── Data ──────────────────────────────────────────────────────────────────────
const SECTIONS = [{
  type: "work-order",
  label: "Work orders",
  tab: "Work Orders"
}, {
  type: "customer",
  label: "Customers",
  tab: "Customers"
}, {
  type: "asset",
  label: "Assets",
  tab: "Assets"
}, {
  type: "part",
  label: "Parts",
  tab: "Parts"
}, {
  type: "vendor",
  label: "Vendors",
  tab: "Vendors"
}, {
  type: "sales-order",
  label: "Part sales",
  tab: "Part Sales"
}, {
  type: "purchase-order",
  label: "Purchase orders",
  tab: "Purchase Orders"
}, {
  type: "vendor-invoice",
  label: "Vendor invoices",
  tab: "Vendor Invoices"
}];
const SEARCH_DATA = [{
  type: "work-order",
  title: "S1-644 Fibridge Commercial",
  badge: "Approved",
  badgeType: "success",
  meta: ["TRK 412", "·", "2019 Freightliner Cascadia"],
  actionLabel: "Add new line"
}, {
  type: "work-order",
  title: "S1-578 Fibridge Commercial",
  badge: "Estimate",
  badgeType: "info",
  meta: ["FLT 288", "·", "2021 Ford F-550"],
  actionLabel: "Add new line"
}, {
  type: "work-order",
  title: "S1-511 Fisquare Farms",
  badge: "Invoiced",
  badgeType: "neutral",
  meta: ["TKS 07", "·", "2016 John Deere 6155M"],
  actionLabel: "Add new line"
}, {
  type: "work-order",
  title: "S1-498 Fibridge Mining",
  badge: "In progress",
  badgeType: "warning",
  meta: ["2014 Caterpillar 336F"],
  actionLabel: "Add new line"
}, {
  type: "work-order",
  title: "S1-472 Fibrook Equipment",
  badge: "Approved",
  badgeType: "success",
  meta: ["TRK 133", "·", "2020 Kenworth T680"],
  actionLabel: "Add new line"
}, {
  type: "work-order",
  title: "S1-455 Fibridge Commercial",
  badge: "Estimate",
  badgeType: "info",
  meta: ["TRK 412", "·", "2019 Freightliner Cascadia"],
  actionLabel: "Add new line"
}, {
  type: "work-order",
  title: "S1-431 Fibrook Supply",
  badge: "Invoiced",
  badgeType: "neutral",
  meta: ["2018 Ram 3500"],
  actionLabel: "Add new line"
}, {
  type: "work-order",
  title: "S1-402 Fibridge Mining",
  badge: "Estimate",
  badgeType: "info",
  meta: ["EXC 501", "·", "2015 Volvo A40G"],
  actionLabel: "Add new line"
}, {
  type: "customer",
  title: "Fibridge Commercial",
  badge: "12",
  badgeType: "neutral",
  badgeIcon: ICO.woBadge,
  meta: "923 Ross Islands, X1T 2B1",
  metaIcon: false,
  contacts: ["Dana Fibridge", "Marcus Reid"],
  actionLabel: "New work order"
}, {
  type: "customer",
  title: "Fibrook Equipment",
  badge: "8",
  badgeType: "neutral",
  badgeIcon: ICO.woBadge,
  meta: "418 Delta Road, X1T 4C8",
  metaIcon: false,
  contacts: ["Priya Raman", "Owen Fibrook"],
  actionLabel: "New work order"
}, {
  type: "asset",
  title: "1999 Ford Explorer",
  meta: "Fibridge Commercial",
  metaIcon: false,
  actions: [{
    label: "New work order"
  }, {
    icon: ICO.clock
  }, {
    icon: ICO.invoice
  }]
}, {
  type: "asset",
  title: "2007 Peterbuilt",
  meta: "Fibridge Commercial",
  metaIcon: false,
  actions: [{
    label: "New work order"
  }, {
    icon: ICO.clock
  }, {
    icon: ICO.invoice
  }]
}, {
  type: "part",
  title: "Microfiber Cloth",
  badge: "72",
  badgeType: "success",
  meta: "65547",
  metaIcon: false,
  actionLabel: "View history"
}, {
  type: "part",
  title: "Rear Shock",
  badge: "12",
  badgeType: "warning",
  meta: "45836",
  metaIcon: false,
  actionLabel: "View history"
}, {
  type: "vendor",
  title: "Fibridge Mining",
  meta: ["(780) 555-0110", "·", "8824 Norman Coves, V9R8M8"],
  metaIcon: false,
  actionLabel: "Add contact"
}, {
  type: "vendor",
  title: "Fibrook Supply",
  meta: "—",
  metaIcon: false,
  actionLabel: "Add contact"
}, {
  type: "sales-order",
  title: "P2-58 Fibridge Commercial",
  badge: "In Progress",
  badgeType: "warning",
  meta: ["Sarah Chen", "·", "Apr 27, 2026"],
  metaIcon: false,
  actionLabel: "Add part"
}, {
  type: "purchase-order",
  title: "PO-3241 Fibridge Mining",
  badge: "Received",
  badgeType: "success",
  meta: ["$4,180.20", "·", "Apr 22, 2026"],
  metaIcon: false,
  actionLabel: "Receive"
}, {
  type: "purchase-order",
  title: "PO-3198 Fibridge Mining",
  badge: "Ordered",
  badgeType: "info",
  meta: ["$912.75", "·", "Apr 14, 2026"],
  metaIcon: false,
  actionLabel: "Receive"
}, {
  type: "vendor-invoice",
  title: "S9-25987 Fibridge Mining",
  badge: "Unpaid",
  badgeType: "warning",
  meta: ["$4,180.20", "·", "May 12, 2026", "·", "Invoice"],
  metaIcon: false
}, {
  type: "vendor-invoice",
  title: "S9-25901 Fibrook Supply",
  badge: "Paid",
  badgeType: "success",
  meta: ["$862.40", "·", "Apr 30, 2026", "·", "Sublet"],
  metaIcon: false
}];
const RECENT_GROUPS = [{
  label: "Today",
  items: [{
    type: "work-order",
    title: "S1-644 Fisquare Farms",
    badge: "Approved",
    badgeType: "success",
    meta: ["TKS 22", "·", "2022 Peterbilt 579"],
    actionLabel: "Add new line"
  }, {
    type: "work-order",
    title: "S1-644 Bosquare Excavating",
    badge: "Estimate",
    badgeType: "info",
    meta: ["2017 Komatsu PC210"]
  }]
}, {
  label: "Yesterday",
  items: [{
    type: "asset",
    title: "2025 Freightliner M2",
    meta: "Fisquare Farms",
    metaIcon: false,
    actions: [{
      label: "New work order"
    }, {
      icon: ICO.clock
    }, {
      icon: ICO.invoice
    }]
  }, {
    type: "customer",
    title: "Fibridge Commercial",
    badge: "12",
    badgeType: "neutral",
    badgeIcon: ICO.woBadge,
    meta: "923 Ross Islands, X1T 2B1",
    metaIcon: false,
    contacts: ["Dana Fibridge", "Marcus Reid"],
    actionLabel: "New work order"
  }]
}, {
  label: "Past week",
  items: [{
    type: "customer",
    title: "Adale Transport",
    badge: "3",
    badgeType: "neutral",
    badgeIcon: ICO.woBadge,
    meta: "923 Ross Islands, X1T 2B1",
    metaIcon: false,
    actionLabel: "New work order"
  }, {
    type: "sales-order",
    title: "P2-58 Toboro Industries",
    meta: "Apr 27, 2026",
    metaIcon: false,
    actionLabel: "Add part"
  }, {
    type: "purchase-order",
    title: "PO-3241 Fibridge Mining",
    badge: "Received",
    badgeType: "success",
    meta: ["$4,180.20", "·", "Apr 22, 2026"],
    metaIcon: false,
    actionLabel: "Receive"
  }]
}, {
  label: "Past 30 days",
  items: [{
    type: "vendor-invoice",
    title: "S9-25987 Fibridge Mining",
    badge: "Unpaid",
    badgeType: "warning",
    meta: ["$4,180.20", "·", "May 12, 2026", "·", "Invoice"],
    metaIcon: false
  }, {
    type: "part",
    title: "Spark Plug",
    badge: "12",
    badgeType: "warning",
    meta: "45836",
    metaIcon: false,
    actionLabel: "View history"
  }]
}];
function matches(item, q) {
  // Contacts are not a result group: a contact-name match surfaces its customer row instead.
  const hay = [item.title].concat(item.contacts || []).concat(Array.isArray(item.meta) ? item.meta : [item.meta || ""]).join(" ").toLowerCase();
  return hay.includes(q.toLowerCase());
}

// ── Interactive modal ─────────────────────────────────────────────────────────
// States, all reachable by real interaction:
//   1 empty / first-time  · firstTime=true and no query
//   2 recent searches     · no query, history present
//   3 results             · query with matches (tabs scope the sections)
//   4 no results          · query with no matches
//   5 persisting          · reopened after a search — query kept and pre-selected
const MAX_PER_SECTION = 5;
function GlobalSearchModal({
  open,
  onClose,
  firstTime = false,
  showAI = true,
  query,
  setQuery,
  onSelect,
  onShowAll,
  maxPerSection = MAX_PER_SECTION
}) {
  const [tab, setTab] = useState(0);
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const rowRefs = useRef([]);
  useEffect(() => {
    if (!open) return;
    setSel(0);
    const t = setTimeout(() => {
      if (!inputRef.current) return;
      inputRef.current.focus();
      if (inputRef.current.value) inputRef.current.select(); // persisting state
    }, 20);
    return () => clearTimeout(t);
  }, [open]);
  const q = (query || "").trim();
  const hasQuery = q.length > 0;
  const activeTab = SEARCH_TABS[tab];
  const PAGE_SIZE = 20; // a tab shows the first page; production loads the next 20 on scroll
  const groups = useMemo(() => {
    if (!hasQuery) return [];
    return SECTIONS.filter(sec => activeTab === "All" || sec.tab === activeTab).map(sec => {
      const all = SEARCH_DATA.filter(d => d.type === sec.type && matches(d, q));
      const cap = activeTab === "All" ? maxPerSection : PAGE_SIZE;
      return {
        ...sec,
        total: all.length,
        items: all.length > cap ? all.slice(0, cap) : all
      };
    }).filter(g => g.items.length > 0);
  }, [q, tab, hasQuery, maxPerSection]);
  const [cleared, setCleared] = useState(false);
  useEffect(() => {
    if (!open) setCleared(false);
  }, [open]);
  const noHistory = firstTime || cleared;
  const recentGroups = useMemo(() => {
    if (hasQuery || noHistory) return [];
    return RECENT_GROUPS.map(g => ({
      ...g,
      items: g.items.filter(it => activeTab === "All" || (SECTIONS.find(sec => sec.type === it.type) || {}).tab === activeTab)
    })).filter(g => g.items.length > 0);
  }, [tab, hasQuery, noHistory]);
  const flat = useMemo(() => {
    const rows = [];
    (hasQuery ? groups : recentGroups).forEach(g => g.items.forEach(it => rows.push(it)));
    return rows;
  }, [groups, recentGroups, hasQuery]);
  useEffect(() => {
    setSel(0);
  }, [q, tab]);
  useEffect(() => {
    if (!open) return;
    const onKey = e => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        if (!flat.length) return;
        e.preventDefault();
        setSel(i => {
          const next = e.key === "ArrowDown" ? Math.min(i + 1, flat.length - 1) : Math.max(i - 1, 0);
          const row = rowRefs.current[next],
            box = listRef.current;
          if (row && box) {
            const top = row.offsetTop,
              bottom = top + row.offsetHeight;
            if (top < box.scrollTop) box.scrollTop = top - 8;else if (bottom > box.scrollTop + box.clientHeight) box.scrollTop = bottom - box.clientHeight + 8;
          }
          return next;
        });
      }
      if (e.key === "Enter" && flat[sel]) {
        onSelect && onSelect(flat[sel]);
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, flat, sel]);
  if (!open) return null;
  const noResults = hasQuery && groups.length === 0;
  const tabCount = t => {
    if (!hasQuery) return null;
    if (t === "All") return SEARCH_DATA.filter(d => matches(d, q)).length;
    const sec = SECTIONS.find(x => x.tab === t);
    return sec ? SEARCH_DATA.filter(d => d.type === sec.type && matches(d, q)).length : 0;
  };
  let idx = -1;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 200,
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      paddingTop: 96
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: 640,
      maxHeight: "calc(100% - 160px)",
      borderRadius: "var(--sv-radius-lg)",
      border: "5px solid var(--sv-border-subtle)",
      boxShadow: "var(--sv-elev-3-shadow)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      background: "var(--sv-surface-overlay)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 56,
      borderBottom: "1px solid var(--sv-border-subtle)",
      display: "flex",
      alignItems: "center",
      gap: "var(--sv-space-3)",
      padding: "var(--sv-space-4) var(--sv-space-5)",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    src: ICO.search,
    size: 20,
    color: hasQuery ? "grey700" : "grey500"
  }), /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    value: query || "",
    onChange: e => setQuery(e.target.value),
    placeholder: "Search work orders, customers, parts and more",
    style: {
      flex: 1,
      border: 0,
      outline: "none",
      background: "transparent",
      fontFamily: "var(--sv-font-ui)",
      fontSize: "var(--sv-body-size)",
      fontWeight: "var(--sv-body-medium-weight)",
      lineHeight: "var(--sv-body-lh)",
      color: "var(--sv-text-primary)",
      padding: 0
    }
  }), hasQuery && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setQuery("");
      inputRef.current.focus();
    },
    style: {
      background: "none",
      border: "none",
      padding: 0,
      cursor: "pointer",
      display: "flex",
      opacity: 0.7
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    src: ICO.xCircle,
    size: 18,
    color: "grey400"
  }))), /*#__PURE__*/React.createElement("div", {
    ref: listRef,
    style: {
      flex: 1,
      overflowY: "auto",
      scrollbarWidth: "thin",
      scrollbarColor: "var(--sv-border-strong) transparent",
      position: "relative"
    }
  }, !(noHistory && !hasQuery) && /*#__PURE__*/React.createElement(FilterTabs, {
    tabs: SEARCH_TABS.map(t => {
      const c = tabCount(t);
      return {
        label: c == null ? t : t + " (" + c + ")"
      };
    }),
    value: tab,
    onChange: setTab
  }), noHistory && !hasQuery && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--sv-space-6) var(--sv-space-3)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "var(--sv-space-3)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--sv-body-size)",
      lineHeight: "var(--sv-body-lh)",
      color: "var(--sv-text-secondary)",
      textAlign: "center",
      maxWidth: 480
    }
  }, "Type to start searching for work orders, parts, customers and more")), !hasQuery && recentGroups.length > 0 && /*#__PURE__*/React.createElement(SectionLabel, {
    label: "Recent searches",
    action: "Clear all",
    onAction: () => setCleared(true)
  }), !hasQuery && recentGroups.map(g => /*#__PURE__*/React.createElement(React.Fragment, {
    key: g.label
  }, /*#__PURE__*/React.createElement(TimeLabel, {
    label: g.label
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 var(--sv-space-3)"
    }
  }, g.items.map(it => {
    idx += 1;
    const my = idx;
    return /*#__PURE__*/React.createElement("div", {
      key: my,
      ref: el => {
        rowRefs.current[my] = el;
      }
    }, /*#__PURE__*/React.createElement(ResultRow, _extends({}, it, {
      selected: sel === my,
      onMouseMove: () => setSel(my),
      onClick: () => {
        onSelect && onSelect(it);
        onClose();
      }
    })));
  })))), hasQuery && groups.map(g => /*#__PURE__*/React.createElement(React.Fragment, {
    key: g.type
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    label: g.label + " (" + g.total + ")",
    action: activeTab === "All" && g.total > g.items.length ? "Show all " + g.total : null,
    onAction: () => {
      const handled = onShowAll ? onShowAll(g, q) : false;
      if (handled === false) setTab(SEARCH_TABS.indexOf(g.tab));
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 var(--sv-space-3)"
    }
  }, g.items.map(it => {
    idx += 1;
    const my = idx;
    return /*#__PURE__*/React.createElement("div", {
      key: my,
      ref: el => {
        rowRefs.current[my] = el;
      }
    }, /*#__PURE__*/React.createElement(ResultRow, _extends({}, it, {
      highlight: q,
      selected: sel === my,
      onMouseMove: () => setSel(my),
      onClick: () => {
        onSelect && onSelect(it);
        onClose();
      }
    })));
  })))), noResults && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--sv-space-6) var(--sv-space-3)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "var(--sv-space-3)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--sv-body-size)",
      lineHeight: "var(--sv-body-lh)",
      color: "var(--sv-text-secondary)",
      textAlign: "center"
    }
  }, "No results for ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--sv-text-primary)",
      fontWeight: "var(--sv-body-medium-weight)"
    }
  }, "\u201C", q, "\u201D"), activeTab !== "All" && /*#__PURE__*/React.createElement("span", null, " in ", activeTab))), showAI && hasQuery && /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid var(--sv-border-subtle)",
      marginTop: "var(--sv-space-2)"
    }
  }, /*#__PURE__*/React.createElement(AIRow, {
    query: q
  }))), /*#__PURE__*/React.createElement(KbdFooter, null)));
}
Object.assign(window, {
  GS_ICO: ICO,
  GS_ENTITY_ICON: ENTITY_ICON,
  GS_SECTIONS: SECTIONS,
  GS_SEARCH_DATA: SEARCH_DATA,
  GS_RECENT_GROUPS: RECENT_GROUPS,
  GS_MATCHES: matches,
  SEARCH_TABS,
  Ico,
  GSBadge,
  EntityIcon,
  SectionLabel,
  TimeLabel,
  HL,
  ResultRow,
  FilterTabs,
  KbdKey,
  KbdFooter,
  SecondaryBtn,
  Shell,
  AIRow,
  GlobalSearchModal,
  GS_MAX_PER_SECTION: MAX_PER_SECTION
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "global-search.jsx", error: String((e && e.message) || e) }); }

// index.js
try { (() => {
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
  const SV = W.SV = W.SV || {};

  /* --- Components carried over from the earlier generation -----------------
     These predate the component layer. They are token-correct for colour but
     still hardcode type and geometry; they are listed here so they are
     discoverable rather than reinvented, and flagged so we know what is left
     to migrate. */
  const LEGACY = ['FilterChip', 'FilterDropdown', 'FilterDropdownWithPills', 'StatusDropdown', 'SingleSelectDropdown', 'DateRangeDropdown', 'DATE_PRESETS', 'SelectAllRow', 'ExpandingSearch', 'AppliedFilters', 'SearchResultsBanner', 'SVEmptyState', 'ColumnsDropdown', 'COLUMN_DEFS', 'DEFAULT_COLUMNS', 'GlobalSearchModal', 'SEARCH_TABS', 'ShopviewTheme', 'svIcon', 'SV_LUCIDE'];
  /* Not listed on purpose: DesignCanvas / DCSection / DCArtboard / DCPostIt and
     TweaksPanel / useTweaks. They are Claude Design artboard scaffolding
     (design-canvas.jsx, tweaks-panel.jsx), not Shopview UI. Spec cards use
     them as bare globals; nothing in a product screen should. */
  /* Resolved lazily, not copied. In the generated bundle the sources run in
     alphabetical order, so `index.js` executes before `lucide-icons.js` and
     `theme-toggle.js` — copying values here would capture `undefined`. */
  LEGACY.forEach(name => {
    if (Object.prototype.hasOwnProperty.call(SV, name)) return;
    Object.defineProperty(SV, name, {
      configurable: true,
      enumerable: true,
      get() {
        return W[name];
      }
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
    'mobile navigation': 'Desktop-first. Mobile artboards exist but no mobile nav component.'
  };

  /* Print the sentence to say when something is missing, instead of guessing. */
  SV.missing = function (what) {
    const known = SV.GAPS[String(what).toLowerCase()];
    const line = known ? `Shopview DS has no ${what}. ${known} Confirm the approach before I build one.` : `Shopview DS has no ${what}, and it is not a known gap either. Confirm before I build one.`;
    console.warn('[Shopview DS] ' + line);
    return line;
  };

  /* Grouped inventory — what an agent or a new colleague should read first. */
  SV.GROUPS = {
    'Layout': ['PageShell', 'AppHeader', 'SidePanel', 'Card', 'StatCard', 'Facts'],
    'Actions': ['Button', 'SplitButton', 'Menu', 'MenuRow', 'MenuSection', 'MenuSep'],
    'Forms': ['Input', 'Select', 'Checkbox', 'Radio', 'Toggle'],
    'Data': ['Table', 'Badge', 'StatusBadge', 'Tabs'],
    'Feedback': ['Modal', 'Alert', 'Toast', 'Tooltip'],
    'Navigation': ['Breadcrumbs', 'Tabs'],
    'Filtering': ['FilterChip', 'Popover', 'FilterDropdown', 'StatusDropdown', 'SingleSelectDropdown', 'DateRangeDropdown', 'ColumnsDropdown', 'AppliedFilters', 'ExpandingSearch'],
    'Search': ['GlobalSearchModal'],
    'Product': ['WorkOrdersScreen', 'WorkOrdersHeader', 'WorkOrdersFilterBar', 'WorkOrderTable', 'UserMenu', 'TechStack', 'StaffAvatar', 'ViewSwitch', 'LayoutSwitch', 'FilterCheckbox'],
    'Icons': ['Icon', 'svIcon'],
    'Theme': ['ShopviewTheme']
  };
  SV.inventory = function () {
    const out = {};
    Object.entries(SV.GROUPS).forEach(([group, names]) => {
      out[group] = names.map(n => SV[n] === undefined ? n + ' (NOT LOADED)' : n).join(', ');
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
                  partial}) box with no label and no onChange. A page that
                  then renders <Checkbox label="Authorized" /> loses the label,
                  silently.
       AppHeader  filter-bar.jsx publishes the real Work Orders header — six
                  nav items, search, time clock. A genuinely different
                  component that happens to share the name.
      `index.js` sorts after both (i > f), so this is the last word. The
     displaced implementations are not thrown away: they get an honest name so
     they stay reachable. Components that render these internally are
     unaffected — inside the bundle each source is its own closure, so
     filter-bar's WorkOrdersPage keeps using filter-bar's own header. */
  const RECLAIM = {
    Checkbox: 'FilterCheckbox',
    // filter-dropdown.jsx
    AppHeader: 'WorkOrdersHeader' // filter-bar.jsx
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
  const absent = CORE.filter(n => SV[n] === undefined);
  if (absent.length) {
    if (typeof React === 'undefined') {
      console.info('[Shopview DS] No React on this page, so the React component layer is unavailable — expected ' + 'for a CSS-only page. The sv-* classes in components.css and every --sv-* token work regardless.');
    } else {
      console.error('[Shopview DS] index.js loaded but these core components are missing: ' + absent.join(', ') + '. components/sv-components.jsx has probably not been loaded. Do NOT rebuild them by hand.');
    }
  }
  SV.version = '2.0.0';
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "index.js", error: String((e && e.message) || e) }); }

// lucide-icons.js
try { (() => {
// Lucide 0.469.0 (ISC) — vendored icon library. Files: assets/icons/lucide/<name>.svg
// Inline markup so glyphs inherit currentColor (theme-adaptive, no network).
window.SV_LUCIDE = {
  "menu": "<line x1=\"4\" x2=\"20\" y1=\"12\" y2=\"12\" /><line x1=\"4\" x2=\"20\" y1=\"6\" y2=\"6\" /><line x1=\"4\" x2=\"20\" y1=\"18\" y2=\"18\" />",
  "copy": "<rect width=\"14\" height=\"14\" x=\"8\" y=\"8\" rx=\"2\" ry=\"2\" /><path d=\"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2\" />",
  "filter": "<polygon points=\"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3\" />",
  "circle-help": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3\" /><path d=\"M12 17h.01\" />",
  "log-out": "<path d=\"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4\" /><polyline points=\"16 17 21 12 16 7\" /><line x1=\"21\" x2=\"9\" y1=\"12\" y2=\"12\" />",
  "sun": "<circle cx=\"12\" cy=\"12\" r=\"4\" /><path d=\"M12 2v2\" /><path d=\"M12 20v2\" /><path d=\"m4.93 4.93 1.41 1.41\" /><path d=\"m17.66 17.66 1.41 1.41\" /><path d=\"M2 12h2\" /><path d=\"M20 12h2\" /><path d=\"m6.34 17.66-1.41 1.41\" /><path d=\"m19.07 4.93-1.41 1.41\" />",
  "moon": "<path d=\"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z\" />",
  "arrow-down": "<path d=\"M12 5v14\" /><path d=\"m19 12-7 7-7-7\" />",
  "arrow-up": "<path d=\"m5 12 7-7 7 7\" /><path d=\"M12 19V5\" />",
  "arrow-up-down": "<path d=\"m21 16-4 4-4-4\" /><path d=\"M17 20V4\" /><path d=\"m3 8 4-4 4 4\" /><path d=\"M7 4v16\" />",
  "corner-down-left": "<polyline points=\"9 10 4 15 9 20\" /><path d=\"M20 4v7a4 4 0 0 1-4 4H4\" />",
  "corner-up-right": "<polyline points=\"15 14 20 9 15 4\" /><path d=\"M4 20v-7a4 4 0 0 1 4-4h12\" />",
  "chevron-down": "<path d=\"m6 9 6 6 6-6\" />",
  "chevron-left": "<path d=\"m15 18-6-6 6-6\" />",
  "chevron-right": "<path d=\"m9 18 6-6-6-6\" />",
  "rows-3": "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" /><path d=\"M21 9H3\" /><path d=\"M21 15H3\" />",
  "ban": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"m4.9 4.9 14.2 14.2\" />",
  "panel-right": "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" /><path d=\"M9 3v18\" />",
  "square-kanban": "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" /><path d=\"M8 7v7\" /><path d=\"M12 7v4\" /><path d=\"M16 7v9\" />",
  "chevrons-down-up": "<path d=\"m7 20 5-5 5 5\" /><path d=\"m7 4 5 5 5-5\" />",
  "chevrons-up-down": "<path d=\"m7 15 5 5 5-5\" /><path d=\"m7 9 5-5 5 5\" />",
  "triangle-alert": "<path d=\"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3\" /><path d=\"M12 9v4\" /><path d=\"M12 17h.01\" />",
  "row-height": "<path d=\"M3 6h11\" /><path d=\"M3 12h11\" /><path d=\"M3 18h11\" /><path d=\"M20 5v14\" /><path d=\"m17 8 3-3 3 3\" /><path d=\"m17 16 3 3 3-3\" />",
  "card-height": "<rect x=\"3\" y=\"6\" width=\"11\" height=\"8\" rx=\"2\" /><path d=\"M3 18h11\" /><path d=\"M20 5v14\" /><path d=\"m17 8 3-3 3 3\" /><path d=\"m17 16 3 3 3-3\" />",
  "circle-alert": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><line x1=\"12\" x2=\"12\" y1=\"8\" y2=\"12\" /><line x1=\"12\" x2=\"12.01\" y1=\"16\" y2=\"16\" />",
  "info": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"M12 16v-4\" /><path d=\"M12 8h.01\" />",
  "user": "<path d=\"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2\" /><circle cx=\"12\" cy=\"7\" r=\"4\" />",
  "user-round": "<circle cx=\"12\" cy=\"8\" r=\"5\" /><path d=\"M20 21a8 8 0 0 0-16 0\" />",
  "building-2": "<path d=\"M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z\" /><path d=\"M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2\" /><path d=\"M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2\" /><path d=\"M10 6h4\" /><path d=\"M10 10h4\" /><path d=\"M10 14h4\" /><path d=\"M10 18h4\" />",
  "store": "<path d=\"m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7\" /><path d=\"M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8\" /><path d=\"M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4\" /><path d=\"M2 7h20\" /><path d=\"M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7\" />",
  "headset": "<path d=\"M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z\" /><path d=\"M21 16v2a4 4 0 0 1-4 4h-5\" />",
  "inbox": "<polyline points=\"22 12 16 12 14 15 10 15 8 12 2 12\" /><path d=\"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z\" />",
  "mail": "<rect width=\"20\" height=\"16\" x=\"2\" y=\"4\" rx=\"2\" /><path d=\"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7\" />",
  "mail-check": "<path d=\"M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8\" /><path d=\"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7\" /><path d=\"m16 19 2 2 4-4\" />",
  "send": "<path d=\"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z\" /><path d=\"m21.854 2.147-10.94 10.939\" />",
  "archive": "<rect width=\"20\" height=\"5\" x=\"2\" y=\"3\" rx=\"1\" /><path d=\"M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8\" /><path d=\"M10 12h4\" />",
  "list": "<path d=\"M3 12h.01\" /><path d=\"M3 18h.01\" /><path d=\"M3 6h.01\" /><path d=\"M8 12h13\" /><path d=\"M8 18h13\" /><path d=\"M8 6h13\" />",
  "link": "<path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\" /><path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\" />",
  "at-sign": "<circle cx=\"12\" cy=\"12\" r=\"4\" /><path d=\"M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8\" />",
  "pencil": "<path d=\"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z\" /><path d=\"m15 5 4 4\" />",
  "square-pen": "<path d=\"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7\" /><path d=\"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z\" />",
  "save": "<path d=\"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z\" /><path d=\"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7\" /><path d=\"M7 3v4a1 1 0 0 0 1 1h7\" />",
  "cog": "<path d=\"M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z\" /><path d=\"M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z\" /><path d=\"M12 2v2\" /><path d=\"M12 22v-2\" /><path d=\"m17 20.66-1-1.73\" /><path d=\"M11 10.27 7 3.34\" /><path d=\"m20.66 17-1.73-1\" /><path d=\"m3.34 7 1.73 1\" /><path d=\"M14 12h8\" /><path d=\"M2 12h2\" /><path d=\"m20.66 7-1.73 1\" /><path d=\"m3.34 17 1.73-1\" /><path d=\"m17 3.34-1 1.73\" /><path d=\"m11 13.73-4 6.93\" />",
  "ellipsis": "<circle cx=\"12\" cy=\"12\" r=\"1\" /><circle cx=\"19\" cy=\"12\" r=\"1\" /><circle cx=\"5\" cy=\"12\" r=\"1\" />",
  "folder": "<path d=\"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z\" />",
  "pipette": "<path d=\"m2 22 1-1h3l9-9\" /><path d=\"M3 21v-3l9-9\" /><path d=\"m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z\" />",
  "search": "<circle cx=\"11\" cy=\"11\" r=\"8\" /><path d=\"m21 21-4.3-4.3\" />",
  "chart-column": "<path d=\"M3 3v16a2 2 0 0 0 2 2h16\" /><path d=\"M18 17V9\" /><path d=\"M13 17V5\" /><path d=\"M8 17v-3\" />",
  "eye": "<path d=\"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0\" /><circle cx=\"12\" cy=\"12\" r=\"3\" />",
  "sparkles": "<path d=\"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z\" /><path d=\"M20 3v4\" /><path d=\"M22 5h-4\" /><path d=\"M4 17v2\" /><path d=\"M5 18H3\" />",
  "hourglass": "<path d=\"M5 22h14\" /><path d=\"M5 2h14\" /><path d=\"M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22\" /><path d=\"M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2\" />",
  "codepen": "<polygon points=\"12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2\" /><line x1=\"12\" x2=\"12\" y1=\"22\" y2=\"15.5\" /><polyline points=\"22 8.5 12 15.5 2 8.5\" /><polyline points=\"2 15.5 12 8.5 22 15.5\" /><line x1=\"12\" x2=\"12\" y1=\"2\" y2=\"8.5\" />",
  "columns-3": "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" /><path d=\"M9 3v18\" /><path d=\"M15 3v18\" />",
  "clipboard-list": "<rect width=\"8\" height=\"4\" x=\"8\" y=\"2\" rx=\"1\" ry=\"1\" /><path d=\"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2\" /><path d=\"M12 11h4\" /><path d=\"M12 16h4\" /><path d=\"M8 11h.01\" /><path d=\"M8 16h.01\" />",
  "package": "<path d=\"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z\" /><path d=\"M12 22V12\" /><path d=\"m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7\" /><path d=\"m7.5 4.27 9 5.15\" />",
  "receipt": "<path d=\"M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z\" /><path d=\"M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8\" /><path d=\"M12 17.5v-11\" />",
  "file-text": "<path d=\"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z\" /><path d=\"M14 2v4a2 2 0 0 0 2 2h4\" /><path d=\"M10 9H8\" /><path d=\"M16 13H8\" /><path d=\"M16 17H8\" />",
  "credit-card": "<rect width=\"20\" height=\"14\" x=\"2\" y=\"5\" rx=\"2\" /><line x1=\"2\" x2=\"22\" y1=\"10\" y2=\"10\" />",
  "wallet": "<path d=\"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1\" /><path d=\"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4\" />",
  "briefcase": "<path d=\"M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16\" /><rect width=\"20\" height=\"14\" x=\"2\" y=\"6\" rx=\"2\" />",
  "container": "<path d=\"M22 7.7c0-.6-.4-1.2-.8-1.5l-6.3-3.9a1.72 1.72 0 0 0-1.7 0l-10.3 6c-.5.2-.9.8-.9 1.4v6.6c0 .5.4 1.2.8 1.5l6.3 3.9a1.72 1.72 0 0 0 1.7 0l10.3-6c.5-.3.9-1 .9-1.5Z\" /><path d=\"M10 21.9V14L2.1 9.1\" /><path d=\"m10 14 11.9-6.9\" /><path d=\"M14 19.8v-8.1\" /><path d=\"M18 17.5V9.4\" />",
  "wrench": "<path d=\"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z\" />",
  "truck": "<path d=\"M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2\" /><path d=\"M15 18H9\" /><path d=\"M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14\" /><circle cx=\"17\" cy=\"18\" r=\"2\" /><circle cx=\"7\" cy=\"18\" r=\"2\" />",
  "shopping-cart": "<circle cx=\"8\" cy=\"21\" r=\"1\" /><circle cx=\"19\" cy=\"21\" r=\"1\" /><path d=\"M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12\" />",
  "landmark": "<line x1=\"3\" x2=\"21\" y1=\"22\" y2=\"22\" /><line x1=\"6\" x2=\"6\" y1=\"18\" y2=\"11\" /><line x1=\"10\" x2=\"10\" y1=\"18\" y2=\"11\" /><line x1=\"14\" x2=\"14\" y1=\"18\" y2=\"11\" /><line x1=\"18\" x2=\"18\" y1=\"18\" y2=\"11\" /><polygon points=\"12 2 20 7 4 7\" />",
  "sticky-note": "<path d=\"M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z\" /><path d=\"M15 3v4a2 2 0 0 0 2 2h4\" />",
  "upload": "<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\" /><polyline points=\"17 8 12 3 7 8\" /><line x1=\"12\" x2=\"12\" y1=\"3\" y2=\"15\" />",
  "map-pin-check": "<path d=\"M19.43 12.935c.357-.967.57-1.955.57-2.935a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0 32.197 32.197 0 0 0 .813-.728\" /><circle cx=\"12\" cy=\"10\" r=\"3\" /><path d=\"m16 18 2 2 4-4\" />",
  "map-pin-off": "<path d=\"M12.75 7.09a3 3 0 0 1 2.16 2.16\" /><path d=\"M17.072 17.072c-1.634 2.17-3.527 3.912-4.471 4.727a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 1.432-4.568\" /><path d=\"m2 2 20 20\" /><path d=\"M8.475 2.818A8 8 0 0 1 20 10c0 1.183-.31 2.377-.81 3.533\" /><path d=\"M9.13 9.13a3 3 0 0 0 3.74 3.74\" />",
  "badge-check": "<path d=\"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z\" /><path d=\"m9 12 2 2 4-4\" />",
  "circle-check": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"m9 12 2 2 4-4\" />",
  "clock": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><polyline points=\"12 6 12 12 16 14\" />",
  "timer": "<line x1=\"10\" x2=\"14\" y1=\"2\" y2=\"2\" /><line x1=\"12\" x2=\"15\" y1=\"14\" y2=\"11\" /><circle cx=\"12\" cy=\"14\" r=\"8\" />",
  "history": "<path d=\"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8\" /><path d=\"M3 3v5h5\" /><path d=\"M12 7v5l4 2\" />",
  "rotate-ccw": "<path d=\"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8\" /><path d=\"M3 3v5h5\" />",
  "loader": "<path d=\"M12 2v4\" /><path d=\"m16.2 7.8 2.9-2.9\" /><path d=\"M18 12h4\" /><path d=\"m16.2 16.2 2.9 2.9\" /><path d=\"M12 18v4\" /><path d=\"m4.9 19.1 2.9-2.9\" /><path d=\"M2 12h4\" /><path d=\"m4.9 4.9 2.9 2.9\" />",
  "calendar": "<path d=\"M8 2v4\" /><path d=\"M16 2v4\" /><rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\" /><path d=\"M3 10h18\" />",
  "calendar-check": "<path d=\"M8 2v4\" /><path d=\"M16 2v4\" /><rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\" /><path d=\"M3 10h18\" /><path d=\"m9 16 2 2 4-4\" />",
  "tag": "<path d=\"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z\" /><circle cx=\"7.5\" cy=\"7.5\" r=\".5\" fill=\"currentColor\" />",
  "ticket-percent": "<path d=\"M2 9a3 3 0 1 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 1 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z\" /><path d=\"M9 9h.01\" /><path d=\"m15 9-6 6\" /><path d=\"M15 15h.01\" />",
  "graduation-cap": "<path d=\"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z\" /><path d=\"M22 10v6\" /><path d=\"M6 12.5V16a6 3 0 0 0 12 0v-3.5\" />",
  "lock": "<rect width=\"18\" height=\"11\" x=\"3\" y=\"11\" rx=\"2\" ry=\"2\" /><path d=\"M7 11V7a5 5 0 0 1 10 0v4\" />",
  "circle-x": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"m15 9-6 6\" /><path d=\"m9 9 6 6\" />",
  "trash-2": "<path d=\"M3 6h18\" /><path d=\"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6\" /><path d=\"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2\" /><line x1=\"10\" x2=\"10\" y1=\"11\" y2=\"17\" /><line x1=\"14\" x2=\"14\" y1=\"11\" y2=\"17\" />",
  "thumbs-up": "<path d=\"M7 10v12\" /><path d=\"M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z\" />",
  "pin-off": "<path d=\"M12 17v5\" /><path d=\"M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89\" /><path d=\"m2 2 20 20\" /><path d=\"M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11\" />",
  "git-branch": "<line x1=\"6\" x2=\"6\" y1=\"3\" y2=\"15\" /><circle cx=\"18\" cy=\"6\" r=\"3\" /><circle cx=\"6\" cy=\"18\" r=\"3\" /><path d=\"M18 9a9 9 0 0 1-9 9\" />",
  "plus": "<path d=\"M5 12h14\" /><path d=\"M12 5v14\" />",
  "check": "<path d=\"M20 6 9 17l-5-5\" />",
  "x": "<path d=\"M18 6 6 18\" /><path d=\"m6 6 12 12\" />"
};
window.SV_LUCIDE_BASE = "assets/icons/lucide/";

/* The one grouping of the icon set, used by preview/icons.html.
   It lived in assets/icons/lucide/_sections.json and again, hardcoded, inside
   the card — two lists that described a folder of 73 SVGs rather than the set
   that actually ships, so four glyphs the product uses were invisible on the
   card. It lives here now, next to the glyphs, and the card reads it. Every
   name below must exist in SV_LUCIDE; preview/icons.html says so out loud if
   one does not. */
window.SV_LUCIDE_GROUPS = {
  "Arrows": ["arrow-down", "arrow-up", "arrow-up-down", "corner-down-left", "corner-up-right", "chevron-down", "chevron-left", "chevron-right", "chevrons-down-up", "chevrons-up-down"],
  "Alert & Info": ["circle-alert", "info", "circle-help", "triangle-alert", "ban"],
  "Account & User": ["user", "user-round", "building-2", "store", "headset", "log-out"],
  "Communication": ["inbox", "mail", "mail-check", "send", "archive", "list", "link", "at-sign"],
  "Editing": ["pencil", "square-pen", "save", "cog", "ellipsis", "folder", "pipette", "copy", "filter", "menu"],
  "General": ["search", "chart-column", "eye", "sparkles", "hourglass", "codepen", "columns-3", "sun", "moon", "git-branch", "panel-right", "square-kanban", "rows-3", "row-height", "card-height"],
  "Objects & Business": ["clipboard-list", "package", "receipt", "file-text", "credit-card", "wallet", "briefcase", "container", "wrench", "truck", "shopping-cart", "landmark", "sticky-note", "upload", "map-pin-check", "map-pin-off"],
  "Status & Time": ["badge-check", "circle-check", "clock", "timer", "history", "rotate-ccw", "loader", "calendar", "calendar-check", "tag", "ticket-percent", "graduation-cap", "lock"],
  "Actions": ["circle-x", "trash-2", "thumbs-up", "pin-off", "plus", "check", "x"]
};

// Resolve markup at RENDER time, not call time: icon elements are often created at
// module scope, which can run before this file has executed (e.g. in bundled exports).
function SvIconInternal(props) {
  var R = window.React;
  var body = (window.SV_LUCIDE || {})[props.name] || "";
  var tick = R.useState(0);
  R.useEffect(function () {
    if (body) return;
    var t = setInterval(function () {
      if ((window.SV_LUCIDE || {})[props.name]) {
        clearInterval(t);
        tick[1](function (x) {
          return x + 1;
        });
      }
    }, 50);
    return function () {
      clearInterval(t);
    };
  }, [body, props.name]);
  var size = props.size || 20;
  var attrs = Object.assign({
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    style: {
      display: "block",
      flex: "none"
    },
    dangerouslySetInnerHTML: {
      __html: body
    }
  }, props.extra || {});
  return R.createElement("svg", attrs);
}
window.SvIcon = SvIconInternal;
window.svIcon = function (name, size, extra) {
  return window.React.createElement(SvIconInternal, {
    name: name,
    size: size,
    extra: extra,
    key: name
  });
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "lucide-icons.js", error: String((e && e.message) || e) }); }

// mobile-filters.jsx
try { (() => {
// Mobile All Filters bottom sheet — matches /Filters/Mobile (Apply filters CTA at bottom).
function MobileFilters({
  onClose
}) {
  const sections = [{
    icon: SVIcons.ICON_LOAD,
    label: "Status",
    value: null
  }, {
    icon: SVIcons.ICON_USER,
    label: "Customer",
    value: null
  }, {
    icon: SVIcons.ICON_WRENCH,
    label: "Lead Technician",
    value: null
  }, {
    icon: SVIcons.ICON_HEADSET,
    label: "Service Advisor",
    value: null
  }, {
    icon: SVIcons.ICON_TRUCK,
    label: "Asset on site",
    value: null
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 402,
      height: 720,
      background: "var(--sv-surface-overlay)",
      display: "flex",
      flexDirection: "column",
      fontFamily: "var(--sv-font-ui)",
      borderRadius: 12,
      overflow: "hidden",
      border: "1px solid var(--sv-border-default)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 16px 12px 16px",
      borderBottom: "1px solid var(--sv-border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 16,
      color: "var(--sv-text-primary)"
    }
  }, "All Filters"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      all: "unset",
      cursor: "pointer",
      color: "var(--sv-text-secondary)",
      padding: 4
    }
  }, SVIcons.ICON_X)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: "auto",
      padding: "8px 16px"
    }
  }, sections.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 4px",
      borderBottom: i === sections.length - 1 ? "none" : "1px solid var(--sv-border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      color: "var(--sv-text-primary)",
      fontWeight: 500,
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--sv-text-secondary)"
    }
  }, s.icon), s.label), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--sv-text-muted)",
      transform: "rotate(-90deg)"
    }
  }, SVIcons.ICON_CHEVRON)))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      borderTop: "1px solid var(--sv-border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      all: "unset",
      cursor: "pointer",
      width: "100%",
      height: 44,
      display: "grid",
      placeItems: "center",
      borderRadius: 8,
      background: "var(--sv-accent)",
      color: "var(--sv-text-on-accent)",
      fontWeight: 600,
      fontSize: 14
    }
  }, "Apply filters")));
}
window.MobileFilters = MobileFilters;
})(); } catch (e) { __ds_ns.__errors.push({ path: "mobile-filters.jsx", error: String((e && e.message) || e) }); }

// mobile-global-search.jsx
try { (() => {
// Mobile Global Search (402×842) — full-screen search over the mobile work orders screen.
// Differences from desktop: no centered modal, no keyboard-hints footer, no hover row
// actions (tap opens the record), no AI row. Scope chips appear only once there is a query.

const MGS_ICO = window.GS_ICO;
const mgsIcon = (name, size = 20, color = "var(--sv-text-secondary)") => window.svIcon(name, size, {
  style: {
    display: "block",
    flexShrink: 0,
    color
  }
});
function MobileEntityIcon({
  type
}) {
  const src = (window.GS_ENTITY_ICON || {})[type] || MGS_ICO.workOrder;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      flex: "none",
      borderRadius: "var(--sv-radius-lg)",
      background: "var(--sv-surface-sunken)",
      border: "1px solid var(--sv-border-default)",
      display: "grid",
      placeItems: "center"
    }
  }, mgsIcon(src, 20));
}
function MobileResultRow({
  item,
  query,
  onClick
}) {
  const [down, setDown] = React.useState(false);
  const meta = Array.isArray(item.meta) ? item.meta.join(" ") : item.meta;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onPointerDown: () => setDown(true),
    onPointerUp: () => setDown(false),
    onPointerCancel: () => setDown(false),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      minHeight: 60,
      padding: "10px 16px",
      cursor: "pointer",
      background: down ? "var(--sv-surface-hover)" : "transparent"
    }
  }, /*#__PURE__*/React.createElement(MobileEntityIcon, {
    type: item.type
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 15,
      lineHeight: "22px",
      color: "var(--sv-text-primary)",
      minWidth: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, React.createElement(window.HL, {
    text: item.title,
    query
  })), item.badge && /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(GSBadge, {
    type: item.badgeType,
    label: item.badge,
    icon: item.badgeIcon
  }))), meta && /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      fontSize: 13,
      lineHeight: "18px",
      color: "var(--sv-text-secondary)",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, React.createElement(window.HL, {
    text: meta,
    query
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      color: "var(--sv-text-disabled)",
      transform: "rotate(-90deg)"
    }
  }, SVIcons.ICON_CHEVRON));
}
function MobileGroupHeader({
  label,
  action,
  onAction
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "8px 16px",
      background: "var(--sv-surface)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 12,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--sv-text-secondary)"
    }
  }, label), action && /*#__PURE__*/React.createElement("button", {
    onClick: onAction,
    style: {
      all: "unset",
      cursor: "pointer",
      fontWeight: 600,
      fontSize: 13,
      color: "var(--sv-accent-text)"
    }
  }, action));
}
function MobileQuickActions() {
  const labels = ["New work order", "New customer", "New inventory part"];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
      width: "100%",
      maxWidth: 320
    }
  }, labels.map(l => /*#__PURE__*/React.createElement("button", {
    key: l,
    style: {
      all: "unset",
      cursor: "pointer",
      height: 44,
      display: "grid",
      placeItems: "center",
      borderRadius: 8,
      background: "var(--sv-surface)",
      border: "1px solid var(--sv-border-strong)",
      boxShadow: "var(--sv-elev-1-shadow)",
      fontWeight: 600,
      fontSize: 15,
      color: "var(--sv-text-primary)"
    }
  }, l)));
}
function MobileScopeChips({
  tabs,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      display: "flex",
      gap: 4,
      padding: "10px 16px",
      overflowX: "auto",
      scrollbarWidth: "none",
      background: "var(--sv-surface)",
      borderBottom: "1px solid var(--sv-border-default)"
    }
  }, tabs.map(t => /*#__PURE__*/React.createElement("span", {
    key: t.label,
    onClick: () => onChange(t.index),
    style: {
      flex: "none",
      padding: "7px 12px",
      borderRadius: 8,
      whiteSpace: "nowrap",
      cursor: "pointer",
      background: value === t.index ? "var(--sv-surface-hover)" : "transparent",
      color: value === t.index ? "var(--sv-text-primary)" : "var(--sv-text-secondary)",
      fontWeight: 500,
      fontSize: 15,
      lineHeight: "22px"
    }
  }, t.label)));
}

// Generic software keyboard, drawn only so layouts can be judged with the keyboard up.
function MobileKeyboard() {
  const rows = [["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"], ["a", "s", "d", "f", "g", "h", "j", "k", "l"], ["z", "x", "c", "v", "b", "n", "m"]];
  const key = extra => ({
    height: 42,
    borderRadius: 5,
    background: "var(--sv-surface)",
    boxShadow: "0 1px 0 rgba(16,24,40,0.28)",
    display: "grid",
    placeItems: "center",
    fontSize: 22,
    fontWeight: 400,
    color: "var(--sv-text-primary)",
    ...extra
  });
  const modKey = extra => key({
    background: "var(--sv-border-strong)",
    fontSize: 15,
    fontWeight: 500,
    ...extra
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      background: "var(--sv-border-default)",
      padding: "8px 3px 6px",
      userSelect: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(10, 1fr)",
      gap: 6,
      padding: "0 3px"
    }
  }, rows[0].map(k => /*#__PURE__*/React.createElement("span", {
    key: k,
    style: key()
  }, k))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(9, 1fr)",
      gap: 6,
      padding: "6px 21px 0"
    }
  }, rows[1].map(k => /*#__PURE__*/React.createElement("span", {
    key: k,
    style: key()
  }, k))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.4fr repeat(7, 1fr) 1.4fr",
      gap: 6,
      padding: "6px 3px 0"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: modKey()
  }, "\u21E7"), rows[2].map(k => /*#__PURE__*/React.createElement("span", {
    key: k,
    style: key()
  }, k)), /*#__PURE__*/React.createElement("span", {
    style: modKey()
  }, "\u232B")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.4fr 1fr 4.6fr 2fr",
      gap: 6,
      padding: "6px 3px 0"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: modKey()
  }, "123"), /*#__PURE__*/React.createElement("span", {
    style: modKey({
      fontSize: 18
    })
  }, "\uD83C\uDF10"), /*#__PURE__*/React.createElement("span", {
    style: key({
      fontSize: 15,
      fontWeight: 500
    })
  }, "space"), /*#__PURE__*/React.createElement("span", {
    style: key({
      background: "var(--sv-accent)",
      color: "var(--sv-text-on-accent)",
      fontSize: 15,
      fontWeight: 600
    })
  }, "search")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 12,
      display: "grid",
      placeItems: "center",
      paddingTop: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 134,
      height: 5,
      borderRadius: 3,
      background: "var(--sv-text-secondary)"
    }
  })));
}
function MobileSearchScreen({
  open,
  onClose,
  query,
  setQuery,
  onSelect,
  firstTime = false,
  keyboard = false
}) {
  const [tab, setTab] = React.useState(0);
  const [cleared, setCleared] = React.useState(false);
  const inputRef = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    setTab(0);
    const t = setTimeout(() => {
      if (!inputRef.current) return;
      inputRef.current.focus();
      if (inputRef.current.value) inputRef.current.select();
    }, 30);
    return () => clearTimeout(t);
  }, [open]);
  const q = (query || "").trim();
  const hasQuery = q.length > 0;
  const TABS = window.SEARCH_TABS;
  const activeTab = TABS[tab];
  const SECTIONS = window.GS_SECTIONS,
    DATA = window.GS_SEARCH_DATA,
    matches = window.GS_MATCHES;
  const groups = React.useMemo(() => {
    if (!hasQuery) return [];
    return SECTIONS.filter(sec => activeTab === "All" || sec.tab === activeTab).map(sec => ({
      ...sec,
      items: DATA.filter(d => d.type === sec.type && matches(d, q))
    })).filter(g => g.items.length > 0);
  }, [q, tab, hasQuery]);
  const recentGroups = React.useMemo(() => {
    if (hasQuery || firstTime || cleared) return [];
    return window.GS_RECENT_GROUPS;
  }, [hasQuery, firstTime, cleared]);

  // Only the types that actually matched, so the chip row stays short.
  const scopeTabs = React.useMemo(() => {
    if (!hasQuery) return [];
    const all = DATA.filter(d => matches(d, q)).length;
    const rest = SECTIONS.map(sec => ({
      sec,
      n: DATA.filter(d => d.type === sec.type && matches(d, q)).length
    })).filter(x => x.n > 0).map(x => ({
      label: x.sec.label + " (" + x.n + ")",
      index: TABS.indexOf(x.sec.tab)
    }));
    return [{
      label: "All (" + all + ")",
      index: 0
    }].concat(rest);
  }, [q, hasQuery]);
  React.useEffect(() => {
    if (hasQuery && scopeTabs.length && !scopeTabs.some(t => t.index === tab)) setTab(0);
  }, [scopeTabs]);
  if (!open) return null;
  const noResults = hasQuery && groups.length === 0;
  const showEmptyState = (firstTime || cleared) && !hasQuery;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 30,
      background: "var(--sv-surface)",
      display: "flex",
      flexDirection: "column",
      fontFamily: "var(--sv-font-ui)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      height: 64,
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "0 16px",
      borderBottom: "1px solid var(--sv-border-default)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      height: 40,
      borderRadius: 8,
      background: "var(--sv-surface-sunken)",
      border: "1px solid var(--sv-border-default)",
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "0 12px"
    }
  }, mgsIcon(MGS_ICO.search, 18, hasQuery ? "var(--sv-text-primary)" : "var(--sv-text-secondary)"), /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    type: "search",
    value: query || "",
    onChange: e => setQuery(e.target.value),
    placeholder: "Search work orders, parts\u2026",
    enterKeyHint: "search",
    autoComplete: "off",
    autoCorrect: "off",
    spellCheck: "false",
    onKeyDown: e => {
      if (e.key === "Escape") onClose();
    },
    style: {
      all: "unset",
      flex: 1,
      minWidth: 0,
      fontFamily: "inherit",
      fontSize: 15,
      fontWeight: 500,
      color: "var(--sv-text-primary)"
    }
  }), hasQuery && /*#__PURE__*/React.createElement("button", {
    "aria-label": "Clear search",
    onMouseDown: e => e.preventDefault(),
    onClick: () => {
      setQuery("");
      inputRef.current && inputRef.current.focus();
    },
    style: {
      all: "unset",
      cursor: "pointer",
      display: "grid",
      placeItems: "center",
      flex: "none",
      padding: 4,
      margin: -4
    }
  }, mgsIcon(MGS_ICO.xCircle, 18, "var(--sv-text-muted)"))), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      all: "unset",
      cursor: "pointer",
      flex: "none",
      padding: "0 4px",
      minHeight: 44,
      display: "grid",
      placeItems: "center",
      fontWeight: 600,
      fontSize: 15,
      color: "var(--sv-accent-text)"
    }
  }, "Cancel")), hasQuery && scopeTabs.length > 1 && /*#__PURE__*/React.createElement(MobileScopeChips, {
    tabs: scopeTabs,
    value: tab,
    onChange: setTab
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      WebkitOverflowScrolling: "touch"
    }
  }, showEmptyState && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "32px 16px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      lineHeight: "22px",
      color: "var(--sv-text-secondary)",
      textAlign: "center"
    }
  }, "Type to start searching for work orders, parts, customers and more"), /*#__PURE__*/React.createElement(MobileQuickActions, null)), !hasQuery && recentGroups.map((g, gi) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: g.label
  }, /*#__PURE__*/React.createElement(MobileGroupHeader, {
    label: g.label,
    action: gi === 0 ? "Clear" : null,
    onAction: () => setCleared(true)
  }), g.items.map((it, i) => /*#__PURE__*/React.createElement(MobileResultRow, {
    key: i,
    item: it,
    onClick: () => {
      onSelect && onSelect(it);
      onClose();
    }
  })))), hasQuery && groups.map(g => /*#__PURE__*/React.createElement(React.Fragment, {
    key: g.type
  }, activeTab === "All" && /*#__PURE__*/React.createElement(MobileGroupHeader, {
    label: g.label + " (" + g.items.length + ")"
  }), g.items.map((it, i) => /*#__PURE__*/React.createElement(MobileResultRow, {
    key: i,
    item: it,
    query: q,
    onClick: () => {
      onSelect && onSelect(it);
      onClose();
    }
  })))), noResults && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "32px 16px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      lineHeight: "22px",
      color: "var(--sv-text-secondary)",
      textAlign: "center"
    }
  }, "No results for ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--sv-text-primary)",
      fontWeight: 600
    }
  }, "\u201C", q, "\u201D"), activeTab !== "All" && /*#__PURE__*/React.createElement("span", null, " in ", activeTab)), /*#__PURE__*/React.createElement(MobileQuickActions, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 24
    }
  })), keyboard && /*#__PURE__*/React.createElement(MobileKeyboard, null));
}
Object.assign(window, {
  MobileSearchScreen,
  MobileKeyboard,
  MobileResultRow,
  MobileGroupHeader,
  MobileScopeChips
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "mobile-global-search.jsx", error: String((e && e.message) || e) }); }

// mobile-work-orders.jsx
try { (() => {
// Mobile Work Orders screen (402×874) — same components, tokens and type as the desktop
// filter bar. variant="legacy" = the filter set from Figma; variant="updated" = the new
// desktop filter set (Status · Assigned to me · Asset on site) with mobile bottom sheets.

const mwMask = (name, size = 16) => window.svIcon(name, size);
const MW_WO = mwMask("clipboard-list", 22);
const MW_FILTERS = mwMask("arrow-up-down", 16);
const MW_SORT = /*#__PURE__*/React.createElement("svg", {
  width: "20",
  height: "20",
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.67",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M14.1667 3.33325V16.6666M17.5 13.3333L14.1667 16.6666L10.8333 13.3333M5.83333 16.6666V3.33325M9.16667 6.66659L5.83333 3.33325L2.5 6.66659"
}));
const MW_CLOCK = /*#__PURE__*/React.createElement("svg", {
  width: "22",
  height: "22",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.8",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "13",
  r: "8"
}), /*#__PURE__*/React.createElement("path", {
  d: "M12 9.5V13l2.5 1.5M9 2h6M18.5 4.5l1.5 1.5"
}));
const MW_ORDERS = [{
  id: "S3-13986",
  badges: [["Approved", "info"], ["Over Limit", "danger"]],
  customer: "Transload Trucking",
  asset: "Freightliner 114SD",
  onSite: false,
  vin: "2GDJG31M3F4523491",
  unit: "245"
}, {
  id: "S2-156",
  badges: [["Estimate", "info"]],
  customer: "Hard Rock Industries LLC",
  asset: "Western Star 4700",
  onSite: true,
  vin: "2GDJG31M3F4523491",
  unit: "245"
}, {
  id: "S1-6",
  badges: [["Estimate", "info"]],
  customer: "RF Heavy",
  asset: "Western Star 4700",
  onSite: false,
  vin: "2GDJG31M3F4523491",
  unit: "245"
}, {
  id: "S1-4",
  badges: [["Complete", "success"]],
  customer: "Truck Zone",
  asset: "Kenworth T880",
  onSite: false,
  vin: "1XKAD49X9DJ341227",
  unit: "112"
}, {
  id: "S3-14022",
  badges: [["In progress", "info"]],
  customer: "Northgate Logistics",
  asset: "Peterbilt 579",
  onSite: true,
  vin: "1XPBDP9X1MD712004",
  unit: "318"
}, {
  id: "S2-201",
  badges: [["Approved", "info"]],
  customer: "Basin Oilfield Services",
  asset: "Mack Anthem",
  onSite: false,
  vin: "1M1AN07Y8KM019823",
  unit: "77"
}, {
  id: "S1-19",
  badges: [["In progress", "info"], ["Over Limit", "danger"]],
  customer: "Prairie Haul Co.",
  asset: "Volvo VNL 760",
  onSite: true,
  vin: "4V4NC9EH0LN228841",
  unit: "902"
}, {
  id: "S1-2",
  badges: [["Complete", "success"]],
  customer: "Hard Rock Industries LLC",
  asset: "International LT625",
  onSite: false,
  vin: "3HSDZAPR4LN123908",
  unit: "061"
}, {
  id: "S2-238",
  badges: [["Estimate", "info"]],
  customer: "Cedar Ridge Transport",
  asset: "Kenworth W990",
  onSite: true,
  vin: "1XKWD49X8KJ227105",
  unit: "430"
}, {
  id: "S3-14071",
  badges: [["Approved", "info"]],
  customer: "Transload Trucking",
  asset: "Freightliner Cascadia",
  onSite: false,
  vin: "3AKJHHDR9LSKS1123",
  unit: "188"
}, {
  id: "S1-27",
  badges: [["In progress", "info"]],
  customer: "Truck Zone",
  asset: "Peterbilt 389",
  onSite: true,
  vin: "1XPXD49X3ED198220",
  unit: "506"
}, {
  id: "S2-092",
  badges: [["Complete", "success"]],
  customer: "RF Heavy",
  asset: "Mack Granite",
  onSite: false,
  vin: "1M2GR2GC5MM011742",
  unit: "264"
}, {
  id: "S3-13940",
  badges: [["Complete", "success"]],
  customer: "Basin Oilfield Services",
  asset: "Volvo VHD 300",
  onSite: false,
  vin: "4V5KC9GH3MN301882",
  unit: "019"
}];
const MW_MINE = ["S3-13986", "S1-6", "S3-14022", "S1-27", "S2-238"];

// ── Chrome ───────────────────────────────────────────────────────────────────
function MobileHeader({
  searchValue = "",
  onSearchClick
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      height: 64,
      flex: "none",
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "0 16px",
      background: "var(--sv-surface)",
      borderBottom: "1px solid var(--sv-border-default)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-label": "ShopView",
    style: {
      width: 32,
      height: 32,
      flex: "none",
      display: "grid",
      placeItems: "center",
      color: "var(--sv-accent)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 100 100",
    fill: "currentColor",
    "aria-hidden": "true",
    style: {
      width: 30,
      height: 30
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M84.5575 12.489H31.729C20.6432 12.489 16.1268 17.2792 13.937 27.6806L3.94616 74.8978C3.53557 77.2244 3.125 79.1405 3.125 80.9197C3.125 82.562 3.39871 84.0675 3.94616 85.1624C12.5684 77.635 20.2327 68.8759 28.9918 61.4854C32.687 64.2226 35.698 67.6441 38.1615 71.4763C31.4553 77.635 24.4754 83.6569 18.0429 90.2262H68.1341C79.3568 90.2262 83.7363 85.4361 86.063 75.0347L96.0538 27.8175C96.4644 25.4909 96.875 23.5748 96.875 21.7956C96.7381 15.3631 93.4535 12.489 84.5575 12.489ZM51.8476 82.2883C50.8896 83.1095 50.0684 84.0675 49.1104 84.8886C46.6469 81.8777 43.0885 79.4142 42.6779 75.3084C41.4462 66.5492 34.4662 58.7481 25.844 57.1058C21.6013 56.5584 19.0009 53 16.1268 50.1259L38.9826 27.27L39.2564 26.9963L39.3932 27.1332L63.7545 51.4945C66.9024 54.6423 69.9133 57.7901 73.198 60.9379L51.8476 82.2883ZM74.9772 59.1587L41.0356 25.2171L44.3203 21.9324L78.2618 55.8741L74.9772 59.1587ZM80.041 54.0948L46.0994 20.1533L49.3841 16.8686L83.3257 50.8102L80.041 54.0948Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M46.0917 59.9816C48.8884 59.9816 51.1556 57.7144 51.1556 54.9177C51.1556 52.121 48.8884 49.8538 46.0917 49.8538C43.295 49.8538 41.0278 52.121 41.0278 54.9177C41.0278 57.7144 43.295 59.9816 46.0917 59.9816Z"
  }))), /*#__PURE__*/React.createElement("div", {
    role: "search",
    onClick: onSearchClick,
    style: {
      flex: 1,
      minWidth: 0,
      height: 40,
      boxSizing: "border-box",
      borderRadius: 8,
      background: "var(--sv-surface-sunken)",
      border: "1px solid var(--sv-border-default)",
      padding: "0 12px",
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontSize: 15,
      fontWeight: 500,
      color: "var(--sv-text-secondary)",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "grid",
      placeItems: "center",
      flex: "none",
      color: "var(--sv-text-secondary)"
    }
  }, SVIcons.ICON_SEARCH), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      color: searchValue ? "var(--sv-text-primary)" : "inherit"
    }
  }, searchValue || "Search")), /*#__PURE__*/React.createElement("button", {
    "aria-label": "Time clock",
    style: {
      all: "unset",
      cursor: "pointer",
      flex: "none",
      width: 28,
      display: "grid",
      placeItems: "center",
      color: "var(--sv-text-primary)"
    }
  }, MW_CLOCK), /*#__PURE__*/React.createElement("span", {
    "aria-label": "User menu",
    style: {
      width: 34,
      height: 34,
      flex: "none",
      borderRadius: "50%",
      background: "var(--sv-accent-subtle)",
      color: "var(--sv-accent-subtle-text)",
      display: "grid",
      placeItems: "center",
      fontWeight: 600,
      fontSize: 13
    }
  }, "AK"));
}
function MobileTabs({
  tabs,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      display: "flex",
      gap: 4,
      padding: "12px 16px",
      overflowX: "auto",
      scrollbarWidth: "none"
    }
  }, tabs.map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    onClick: () => onChange(t),
    style: {
      flex: "none",
      padding: "8px 12px",
      borderRadius: 8,
      whiteSpace: "nowrap",
      cursor: "pointer",
      background: value === t ? "var(--sv-surface-hover)" : "transparent",
      color: value === t ? "var(--sv-text-primary)" : "var(--sv-text-secondary)",
      fontWeight: 500,
      fontSize: 15,
      lineHeight: "22px"
    }
  }, t)));
}

// Same behavior as the web ExpandingSearch: text button until tapped, then an inline input.
function MobileExpandingSearch({
  open,
  setOpen,
  q,
  setQ,
  placeholder = "Type to search"
}) {
  const inputRef = React.useRef();
  const expanded = open || !!q;
  React.useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);
  return /*#__PURE__*/React.createElement("div", {
    role: "search",
    onClick: () => !expanded && setOpen(true),
    style: {
      height: 36,
      flex: expanded ? 1 : "none",
      minWidth: 0,
      boxSizing: "border-box",
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "0 10px",
      borderRadius: 8,
      cursor: expanded ? "text" : "pointer",
      color: "var(--sv-text-primary)",
      transition: "flex-grow 160ms ease-out"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "grid",
      placeItems: "center",
      flex: "none"
    }
  }, SVIcons.ICON_SEARCH), !expanded ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      fontSize: 15,
      whiteSpace: "nowrap"
    }
  }, "Search") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    value: q,
    placeholder: placeholder,
    onChange: e => setQ(e.target.value),
    onBlur: () => {
      if (!q) setOpen(false);
    },
    onKeyDown: e => {
      if (e.key === "Escape") {
        setQ("");
        setOpen(false);
      }
    },
    style: {
      all: "unset",
      flex: 1,
      minWidth: 0,
      fontFamily: "inherit",
      fontSize: 15,
      fontWeight: 500,
      color: "var(--sv-text-primary)"
    }
  }), q && /*#__PURE__*/React.createElement("button", {
    "aria-label": "Clear search",
    onMouseDown: e => e.preventDefault(),
    onClick: () => {
      setQ("");
      inputRef.current && inputRef.current.focus();
    },
    style: {
      all: "unset",
      cursor: "pointer",
      width: 20,
      height: 20,
      borderRadius: "50%",
      display: "grid",
      placeItems: "center",
      color: "var(--sv-text-primary)",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "10",
    cy: "10",
    r: "7.25"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7.75 7.75l4.5 4.5M12.25 7.75l-4.5 4.5"
  })))));
}
function MobileToolbar({
  onSort,
  searchOpen,
  setSearchOpen,
  q,
  setQ
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 4,
      padding: "0 16px 12px"
    }
  }, /*#__PURE__*/React.createElement(MobileExpandingSearch, {
    open: searchOpen,
    setOpen: setSearchOpen,
    q: q,
    setQ: setQ
  }), /*#__PURE__*/React.createElement("button", {
    onClick: onSort,
    "aria-label": "Sort",
    style: {
      all: "unset",
      cursor: "pointer",
      width: 36,
      height: 36,
      borderRadius: 8,
      display: "grid",
      placeItems: "center",
      color: "var(--sv-text-primary)"
    }
  }, MW_SORT), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 4
    }
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      all: "unset",
      cursor: "pointer",
      height: 40,
      padding: "0 16px",
      borderRadius: 8,
      background: "var(--sv-accent)",
      color: "var(--sv-text-on-accent)",
      fontWeight: 600,
      fontSize: 15
    }
  }, "New Work Order"));
}

// ── Cards ────────────────────────────────────────────────────────────────────
function MobileSwitch({
  on
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: 44,
      height: 24,
      borderRadius: 100,
      flex: "none",
      display: "block",
      position: "relative",
      background: on ? "var(--sv-accent)" : "var(--sv-border-default)",
      transition: "background-color 140ms ease-out"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 2,
      left: on ? 22 : 2,
      width: 20,
      height: 20,
      borderRadius: "50%",
      background: "var(--sv-surface)",
      boxShadow: "var(--sv-elev-1-shadow)",
      transition: "left 140ms ease-out"
    }
  }));
}
function WorkOrderCard({
  wo
}) {
  const rows = [["Customer", wo.customer], ["Asset", wo.asset], ["Asset On Site", /*#__PURE__*/React.createElement(MobileSwitch, {
    on: wo.onSite
  })], ["VIN/Serial", wo.vin], ["Unit", wo.unit]];
  return /*#__PURE__*/React.createElement("article", {
    style: {
      background: "var(--sv-surface)",
      border: "1px solid var(--sv-border-default)",
      borderRadius: 12,
      padding: 16,
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "grid",
      placeItems: "center",
      flex: "none",
      color: "var(--sv-text-primary)"
    }
  }, MW_WO), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 18,
      lineHeight: "26px",
      color: "var(--sv-text-primary)",
      flex: 1,
      minWidth: 0
    }
  }, wo.id), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      gap: 6,
      flex: "none"
    }
  }, wo.badges.map(([label, tone]) => /*#__PURE__*/React.createElement(Badge, {
    key: label,
    tone: tone
  }, label)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      rowGap: 8
    }
  }, rows.map(([label, value]) => /*#__PURE__*/React.createElement("div", {
    key: label,
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
      minHeight: 24
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      fontSize: 15,
      lineHeight: "22px",
      color: "var(--sv-text-secondary)",
      flex: "none"
    }
  }, label), typeof value === "string" ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 15,
      lineHeight: "22px",
      color: "var(--sv-text-primary)",
      textAlign: "right",
      minWidth: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, value) : value))));
}

// ── Bottom sheets ────────────────────────────────────────────────────────────
function MobileSheet({
  title,
  onClose,
  onBack,
  children,
  footer,
  onApply
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 20,
      background: "var(--sv-scrim)",
      display: "flex",
      alignItems: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: "100%",
      maxHeight: "82%",
      background: "var(--sv-surface-overlay)",
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      display: "flex",
      flexDirection: "column",
      boxShadow: "var(--sv-elev-3-shadow)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "16px 16px 12px",
      borderBottom: "1px solid var(--sv-border-subtle)"
    }
  }, onBack && /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    "aria-label": "Back",
    style: {
      all: "unset",
      cursor: "pointer",
      color: "var(--sv-text-secondary)",
      display: "grid",
      placeItems: "center"
    }
  }, SVIcons.ICON_BACK), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontWeight: 600,
      fontSize: 17,
      color: "var(--sv-text-primary)"
    }
  }, title), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Close",
    style: {
      all: "unset",
      cursor: "pointer",
      color: "var(--sv-text-secondary)",
      padding: 4
    }
  }, SVIcons.ICON_X)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto"
    }
  }, children), footer !== null && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      borderTop: "1px solid var(--sv-border-subtle)",
      flex: "none"
    }
  }, footer || /*#__PURE__*/React.createElement("button", {
    onClick: onApply || onClose,
    style: {
      all: "unset",
      cursor: "pointer",
      width: "100%",
      height: 48,
      display: "grid",
      placeItems: "center",
      borderRadius: 8,
      background: "var(--sv-accent)",
      color: "var(--sv-text-on-accent)",
      fontWeight: 600,
      fontSize: 15
    }
  }, "Apply filters"))));
}
function SheetRow({
  label,
  right,
  onClick
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      padding: "14px 16px",
      cursor: "pointer",
      minHeight: 52,
      borderBottom: "1px solid var(--sv-border-subtle)",
      fontWeight: 500,
      fontSize: 15,
      lineHeight: "22px",
      color: "var(--sv-text-primary)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, label), right);
}
const mwCheckbox = on => /*#__PURE__*/React.createElement("span", {
  style: {
    width: 20,
    height: 20,
    borderRadius: 6,
    flex: "none",
    display: "grid",
    placeItems: "center",
    border: "1px solid " + (on ? "var(--sv-accent)" : "var(--sv-border-strong)"),
    background: on ? "var(--sv-accent)" : "var(--sv-surface)",
    color: "var(--sv-text-on-accent)"
  }
}, on ? SVIcons.ICON_CHECK : null);
const mwCheckmark = /*#__PURE__*/React.createElement("svg", {
  width: "16",
  height: "16",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "var(--sv-text-primary)",
  strokeWidth: "2.5",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  style: {
    flex: "none"
  }
}, /*#__PURE__*/React.createElement("path", {
  d: "M20 6 9 17l-5-5"
}));

// Multi-select sheet (Status, Customer, Technician, Advisor) — optional search
function MobileMultiSheet({
  title,
  options,
  value = [],
  onChange,
  onClose,
  onBack,
  search = false
}) {
  const [q, setQ] = React.useState("");
  const [draft, setDraft] = React.useState(value);
  const list = search && q ? options.filter(o => o.toLowerCase().includes(q.toLowerCase())) : options;
  const toggle = o => setDraft(draft.includes(o) ? draft.filter(x => x !== o) : draft.concat(o));
  const apply = () => {
    onChange(draft);
    onClose();
  };
  return /*#__PURE__*/React.createElement(MobileSheet, {
    title: title,
    onClose: onClose,
    onBack: onBack,
    onApply: apply
  }, search && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 16px",
      borderBottom: "1px solid var(--sv-border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 40,
      borderRadius: 8,
      background: "var(--sv-surface-sunken)",
      border: "1px solid var(--sv-border-default)",
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "0 12px",
      color: "var(--sv-text-secondary)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "grid",
      placeItems: "center"
    }
  }, SVIcons.ICON_SEARCH), /*#__PURE__*/React.createElement("input", {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "Search " + title.toLowerCase(),
    style: {
      all: "unset",
      flex: 1,
      minWidth: 0,
      fontFamily: "inherit",
      fontSize: 15,
      fontWeight: 500,
      color: "var(--sv-text-primary)"
    }
  }))), list.map(o => /*#__PURE__*/React.createElement(SheetRow, {
    key: o,
    label: o,
    right: mwCheckbox(draft.includes(o)),
    onClick: () => toggle(o)
  })), draft.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 16px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setDraft([]),
    style: {
      all: "unset",
      cursor: "pointer",
      color: "var(--sv-text-primary)",
      fontWeight: 500,
      fontSize: 15
    }
  }, "Clear selection")));
}

// Single-select sheet — checkmark on the selected row, no checkboxes (Asset on site)
function MobileSingleSheet({
  title,
  options,
  value = [],
  onChange,
  onClose,
  onBack
}) {
  const [draft, setDraft] = React.useState(value);
  const selected = draft[0];
  return /*#__PURE__*/React.createElement(MobileSheet, {
    title: title,
    onClose: onClose,
    onBack: onBack,
    onApply: () => {
      onChange(draft);
      onClose();
    }
  }, options.map(o => /*#__PURE__*/React.createElement(SheetRow, {
    key: o,
    label: o,
    right: selected === o ? mwCheckmark : null,
    onClick: () => setDraft(selected === o ? [] : [o])
  })), selected && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 16px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setDraft([]),
    style: {
      all: "unset",
      cursor: "pointer",
      color: "var(--sv-text-primary)",
      fontWeight: 500,
      fontSize: 15
    }
  }, "Clear selection")));
}

// ── Screen ───────────────────────────────────────────────────────────────────
const mwItems = variant => variant === "updated" ? [{
  id: "status",
  label: "Status",
  icon: SVIcons.ICON_LOAD,
  panel: "multi",
  list: window.STATUSES
}, {
  id: "mine",
  label: "Assigned to me",
  icon: window.ICON_MY_WORK_ORDERS,
  toggle: true
}, {
  id: "asset",
  label: "Asset on site",
  icon: SVIcons.ICON_TRUCK,
  panel: "single",
  list: ["Yes", "No"]
}] : [{
  id: "status",
  label: "Status",
  icon: SVIcons.ICON_LOAD,
  panel: "multi",
  list: window.STATUSES
}, {
  id: "cust",
  label: "Customer",
  icon: SVIcons.ICON_USER,
  panel: "multi",
  search: true,
  list: window.CUSTOMERS
}, {
  id: "tech",
  label: "Lead Technician",
  icon: SVIcons.ICON_WRENCH,
  panel: "multi",
  search: true,
  list: window.TECHS
}, {
  id: "adv",
  label: "Service Advisor",
  icon: SVIcons.ICON_HEADSET,
  panel: "multi",
  search: true,
  list: window.ADVISORS
}, {
  id: "asset",
  label: "Asset on site",
  icon: SVIcons.ICON_TRUCK,
  panel: "multi",
  list: ["Yes", "No"]
}];
function MobileWorkOrders({
  variant = "legacy",
  initial = {},
  sharedLink = false,
  onSearchClick,
  searchValue = ""
}) {
  const allItems = React.useMemo(() => mwItems(variant), [variant]);
  const [filtersByTab, setFiltersByTab] = React.useState({
    All: initial
  });
  const [tab, setTab] = React.useState("All");
  const filters = filtersByTab[tab] || {};
  const setFilters = v => setFiltersByTab(m => ({
    ...m,
    [tab]: typeof v === "function" ? v(m[tab] || {}) : v
  }));
  const [sheet, setSheet] = React.useState(null); // null | filter id
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [q, setQ] = React.useState(""); // shared across tabs

  const setVal = (k, v) => setFilters({
    ...filters,
    [k]: v
  });
  const valueText = arr => !arr || arr.length === 0 ? null : arr.length === 1 ? arr[0] : `${arr[0]}, +${arr.length - 1}`;
  const open = id => setSheet(id);
  const closeSheet = () => setSheet(null);
  const items = tab === "All" ? allItems : allItems.filter(i => i.id !== "status");
  const active = allItems.find(i => i.id === sheet);
  const badgeOf = wo => wo.badges.map(b => b[0]);
  const orders = MW_ORDERS.filter(wo => {
    const b = badgeOf(wo);
    if (tab === "Estimates" && !b.includes("Estimate")) return false;
    if (tab === "Completed" && !b.includes("Complete")) return false;
    if (tab === "Work Orders" && !b.some(x => ["Estimate", "Approved", "In progress"].includes(x))) return false;
    const st = filters.status || [];
    if (st.length && !st.some(s => b.includes(s))) return false;
    const asset = (filters.asset || [])[0];
    if (asset === "Yes" && !wo.onSite) return false;
    if (asset === "No" && wo.onSite) return false;
    if ((filters.mine || []).length && !MW_MINE.includes(wo.id)) return false;
    const cust = filters.customer || [];
    if (cust.length && !cust.includes(wo.customer)) return false;
    const term = q.trim().toLowerCase();
    if (term && ![wo.id, wo.customer, wo.asset, wo.vin, wo.unit].some(f => String(f || "").toLowerCase().includes(term))) return false;
    return true;
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height: "100%",
      position: "relative",
      overflow: "hidden",
      background: "var(--sv-surface-canvas)",
      fontFamily: "var(--sv-font-ui)",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement(MobileHeader, {
    onSearchClick: onSearchClick,
    searchValue: searchValue
  }), sharedLink && /*#__PURE__*/React.createElement(SharedLinkBanner, {
    onReset: () => setFilters({})
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      background: "var(--sv-surface)"
    }
  }, /*#__PURE__*/React.createElement(MobileTabs, {
    tabs: ["All", "Work Orders", "Estimates", "Completed"],
    value: tab,
    onChange: setTab
  }), /*#__PURE__*/React.createElement(MobileToolbar, {
    searchOpen: searchOpen,
    setSearchOpen: setSearchOpen,
    q: q,
    setQ: setQ
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "12px 16px",
      overflowX: "auto",
      scrollbarWidth: "none",
      background: "var(--sv-surface)",
      borderTop: "1px solid var(--sv-border-default)",
      borderBottom: "1px solid var(--sv-border-default)"
    }
  }, items.map(it => {
    const v = filters[it.id] || [];
    const has = v.length > 0;
    return /*#__PURE__*/React.createElement("span", {
      key: it.id,
      style: {
        flex: "none"
      }
    }, /*#__PURE__*/React.createElement(FilterChip, {
      icon: it.icon,
      label: it.label,
      toggle: it.toggle,
      hasValue: has,
      valueText: valueText(v),
      onClick: () => it.toggle ? setVal(it.id, has ? [] : ["Yes"]) : open(it.id),
      onClear: it.toggle ? undefined : () => setVal(it.id, [])
    }));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      padding: 16,
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, orders.length > 0 ? orders.map(wo => /*#__PURE__*/React.createElement(WorkOrderCard, {
    key: wo.id,
    wo: wo
  })) : /*#__PURE__*/React.createElement(window.SVEmptyState, {
    query: q,
    compact: true,
    hasFilters: Object.values(filters).some(v => v && v.length),
    onClear: () => setFilters({})
  })), active && active.panel === "multi" && /*#__PURE__*/React.createElement(MobileMultiSheet, {
    title: active.label,
    options: active.list,
    search: active.search,
    value: filters[active.id] || [],
    onChange: v => setVal(active.id, v),
    onClose: closeSheet
  }), active && active.panel === "single" && /*#__PURE__*/React.createElement(MobileSingleSheet, {
    title: active.label,
    options: active.list,
    value: filters[active.id] || [],
    onChange: v => setVal(active.id, v),
    onClose: closeSheet
  }));
}
Object.assign(window, {
  MobileWorkOrders,
  MobileHeader,
  MobileSheet,
  MobileMultiSheet,
  MobileSingleSheet,
  WorkOrderCard,
  MobileSwitch
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "mobile-work-orders.jsx", error: String((e && e.message) || e) }); }

// theme-toggle.js
try { (() => {
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
    try {
      v = localStorage.getItem(KEY);
    } catch (e) {}
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
    try {
      localStorage.setItem(KEY, pref);
    } catch (e) {}
    apply(pref);
    dispatch();
  }
  function cycle() {
    var order = ['light', 'dark', 'system'];
    set(order[(order.indexOf(read()) + 1) % order.length]);
  }
  function dispatch() {
    window.dispatchEvent(new CustomEvent('sv-theme-change', {
      detail: {
        pref: read(),
        resolved: resolved()
      }
    }));
  }

  // Apply immediately (before paint) to avoid a flash.
  apply(read());
  // React live to OS changes while in "system".
  mql.addEventListener('change', function () {
    if (read() === 'system') dispatch();
  });
  window.ShopviewTheme = {
    get: read,
    set: set,
    cycle: cycle,
    resolved: resolved
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "theme-toggle.js", error: String((e && e.message) || e) }); }

// tweaks-panel.jsx
try { (() => {
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "palette": ["#D97757", "#29261b", "#f6f4ef"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#D97757', '#29261b', '#f6f4ef'],
//                                  ['#475569', '#0f172a', '#f1f5f9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;width:100%;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : {
      [keyOrEdits]: val
    };
    setValues(prev => ({
      ...prev,
      ...edits
    }));
    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits
    }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', {
      detail: edits
    }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({
  title = 'Tweaks',
  noDeckControls = false,
  children
}) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  // Auto-inject a rail toggle when a <deck-stage> is on the page. The
  // toggle drives the deck's per-viewer _railVisible via window message;
  // state is mirrored from the same localStorage key the deck reads so
  // the control reflects reality across reloads. The mechanism is the
  // message — authors who want custom placement can post it directly
  // and pass noDeckControls to suppress this one.
  const hasDeckStage = React.useMemo(() => typeof document !== 'undefined' && !!document.querySelector('deck-stage'), []);
  // Hide the toggle until the host has actually enabled the rail (the
  // __omelette_rail_enabled window message, posted only when the
  // omelette_deck_rail_enabled flag is on for this user). The initial read
  // covers TweaksPanel mounting after the message already arrived; the
  // listener covers the common case of mounting first.
  const [railEnabled, setRailEnabled] = React.useState(() => hasDeckStage && !!document.querySelector('deck-stage')?._railEnabled);
  React.useEffect(() => {
    if (!hasDeckStage || railEnabled) return undefined;
    const onMsg = e => {
      if (e.data && e.data.type === '__omelette_rail_enabled') setRailEnabled(true);
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [hasDeckStage, railEnabled]);
  const [railVisible, setRailVisible] = React.useState(() => {
    try {
      return localStorage.getItem('deck-stage.railVisible') !== '0';
    } catch (e) {
      return true;
    }
  });
  const toggleRail = on => {
    setRailVisible(on);
    window.postMessage({
      type: '__deck_rail_visible',
      on
    }, '*');
  };
  const offsetRef = React.useRef({
    x: 16,
    y: 16
  });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth,
      h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = e => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({
      type: '__edit_mode_dismissed'
    }, '*');
  };
  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, __TWEAKS_STYLE), /*#__PURE__*/React.createElement("div", {
    ref: dragRef,
    className: "twk-panel",
    "data-noncommentable": "",
    style: {
      right: offsetRef.current.x,
      bottom: offsetRef.current.y
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-hd",
    onMouseDown: onDragStart
  }, /*#__PURE__*/React.createElement("b", null, title), /*#__PURE__*/React.createElement("button", {
    className: "twk-x",
    "aria-label": "Close tweaks",
    onMouseDown: e => e.stopPropagation(),
    onClick: dismiss
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "twk-body"
  }, children, hasDeckStage && railEnabled && !noDeckControls && /*#__PURE__*/React.createElement(TweakSection, {
    label: "Deck"
  }, /*#__PURE__*/React.createElement(TweakToggle, {
    label: "Thumbnail rail",
    value: railVisible,
    onChange: toggleRail
  })))));
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "twk-sect"
  }, label), children);
}
function TweakRow({
  label,
  value,
  children,
  inline = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: inline ? 'twk-row twk-row-h' : 'twk-row'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label), value != null && /*#__PURE__*/React.createElement("span", {
    className: "twk-val"
  }, value)), children);
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label,
    value: `${value}${unit}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "twk-slider",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange(Number(e.target.value))
  }));
}
function TweakToggle({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "twk-toggle",
    "data-on": value ? '1' : '0',
    role: "switch",
    "aria-checked": !!value,
    onClick: () => onChange(!value)
  }, /*#__PURE__*/React.createElement("i", null)));
}
function TweakRadio({
  label,
  value,
  options,
  onChange
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = o => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({
    2: 16,
    3: 10
  }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = s => {
      const m = options.find(o => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return /*#__PURE__*/React.createElement(TweakSelect, {
      label: label,
      value: value,
      options: options,
      onChange: s => onChange(resolve(s))
    });
  }
  const opts = options.map(o => typeof o === 'object' ? o : {
    value: o,
    label: o
  });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;
  const segAt = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = e => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = ev => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    role: "radiogroup",
    onPointerDown: onPointerDown,
    className: dragging ? 'twk-seg dragging' : 'twk-seg'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-seg-thumb",
    style: {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    type: "button",
    role: "radio",
    "aria-checked": o.value === value
  }, o.label))));
}
function TweakSelect({
  label,
  value,
  options,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("select", {
    className: "twk-field",
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })));
}
function TweakText({
  label,
  value,
  placeholder,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("input", {
    className: "twk-field",
    type: "text",
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakNumber({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) {
  const clamp = n => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({
    x: 0,
    val: 0
  });
  const onScrubStart = e => {
    e.preventDefault();
    startRef.current = {
      x: e.clientX,
      val: value
    };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = ev => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "twk-num-lbl",
    onPointerDown: onScrubStart
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value,
    min: min,
    max: max,
    step: step,
    onChange: e => onChange(clamp(Number(e.target.value)))
  }), unit && /*#__PURE__*/React.createElement("span", {
    className: "twk-num-unit"
  }, unit));
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #fafafa without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, c => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = n >> 16 & 255,
    g = n >> 8 & 255,
    b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}
const __TwkCheck = ({
  light
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 14 14",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M3 7.2 5.8 10 11 4.2",
  fill: "none",
  strokeWidth: "2.2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  stroke: light ? 'rgba(0,0,0,.78)' : '#fff'
}));

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({
  label,
  value,
  options,
  onChange
}) {
  if (!options || !options.length) {
    return /*#__PURE__*/React.createElement("div", {
      className: "twk-row twk-row-h"
    }, /*#__PURE__*/React.createElement("div", {
      className: "twk-lbl"
    }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("input", {
      type: "color",
      className: "twk-swatch",
      value: value,
      onChange: e => onChange(e.target.value)
    }));
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = o => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-chips",
    role: "radiogroup"
  }, options.map((o, i) => {
    const colors = Array.isArray(o) ? o : [o];
    const [hero, ...rest] = colors;
    const sup = rest.slice(0, 4);
    const on = key(o) === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      className: "twk-chip",
      role: "radio",
      "aria-checked": on,
      "data-on": on ? '1' : '0',
      "aria-label": colors.join(', '),
      title: colors.join(' · '),
      style: {
        background: hero
      },
      onClick: () => onChange(o)
    }, sup.length > 0 && /*#__PURE__*/React.createElement("span", null, sup.map((c, j) => /*#__PURE__*/React.createElement("i", {
      key: j,
      style: {
        background: c
      }
    }))), on && /*#__PURE__*/React.createElement(__TwkCheck, {
      light: __twkIsLight(hero)
    }));
  })));
}
function TweakButton({
  label,
  onClick,
  secondary = false
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: secondary ? 'twk-btn secondary' : 'twk-btn',
    onClick: onClick
  }, label);
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "tweaks-panel.jsx", error: String((e && e.message) || e) }); }

// work-orders.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ============================================================================
   Shopview — Work Orders product layer
   ----------------------------------------------------------------------------
   The Work Orders screen grew a newer generation of components inside the
   Work Orders Page project (in `ds-page-fix.js`), ahead of the design system.
   This file is where that work lands, so the system owns it and every screen
   gets it.

   Everything here is published on SV under a product name. Bare globals are
   also set, with the names the Work Orders page already uses, so that page
   keeps working once the copied sections are deleted from `ds-page-fix.js`.

   Sorted after index.js in the bundle, so SV and every primitive already
   exist. Nothing here is dereferenced at load time — the components read the
   globals they need when they render, which keeps this file independent of
   load order.

   Ported, not copied: raw palette steps and literal type/radius values from
   the source have been replaced with tokens. The three rules that were broken
   and are now fixed:
     --sv-grey-100/900  ->  --sv-surface-sunken / --sv-surface-inverse
     --sv-teal-200      ->  --sv-cat-teal-accent
     --sv-shadow-sm/md  ->  --sv-elev-1/2-shadow   (the shadow set never themes)
   ========================================================================== */

(function () {
  const W = window;
  const SV = W.SV = W.SV || {};
  const {
    useState: useWoState
  } = React;

  /* ---------------------------------------------------------------- DATA -- */

  /* Which statuses each Work Orders tab contains. */
  const WO_TAB_STATUS = {
    workOrders: ['Approved', 'In progress', 'Review', 'Ready for Review'],
    estimates: ['Estimate'],
    completed: ['Complete', 'Invoiced', 'Paid']
  };
  const DEPARTMENTS = ['Truck Shop', 'Trailer Shop', 'Mobile Service', 'Welding'];

  /* Columns the By Lead Tech view can render. No Lead Technician column —
     the rows are already grouped by it. */
  const TECH_COLUMN_KEYS = ['waiting', 'unit', 'asset', 'progress', 'techs', 'adv', 'clocked', 'lines', 'total', 'created'];

  /* Staff photos by full name. A name with no photo falls back to initials. */
  const AVATAR_PHOTOS = W.SV_AVATAR_PHOTOS || {
    'Esther Howard': 'assets/avatars/jackie.png',
    'Ralph Edwards': 'assets/avatars/aaron.png',
    'James Smith': 'assets/avatars/danny.png',
    'Floyd Miles': 'assets/avatars/mia.png'
  };

  /* `Approved` moved from info to teal on the Work Orders screen — approved is
     not the same kind of state as in-progress, and the blue was reading as
     "active". Applied to the system's map so every screen agrees. The rest of
     the screen's status vocabulary is registered further down, next to the
     table that resolves it. */
  if (SV.WORK_ORDER_STATUS) SV.WORK_ORDER_STATUS['Approved'] = 'teal';

  /* ------------------------------------------------------------- AVATARS -- */

  /* Photo when we have one, initials otherwise. Same shape as SV.Avatar but
     photo-capable; SV.Avatar stays the initials-only primitive. */
  function StaffAvatar({
    name = '',
    size = 32,
    color,
    src
  }) {
    /* The photo paths point at the consuming project's own assets folder. The
       design system has no avatars/ of its own, and a screen may be missing a
       given face, so a failed load falls back to initials instead of leaving a
       broken-image glyph in the row. */
    const [failed, setFailed] = useWoState(false);
    const photo = src || AVATAR_PHOTOS[name];
    if (photo && !failed) {
      return /*#__PURE__*/React.createElement("img", {
        src: photo,
        alt: name,
        title: name,
        onError: () => setFailed(true),
        style: {
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          objectPosition: 'center top',
          flex: 'none',
          display: 'block',
          background: 'var(--sv-border-subtle)'
        }
      });
    }
    const initials = name.split(' ').map(x => x[0]).slice(0, 2).join('').toUpperCase();
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: size,
        height: size,
        borderRadius: '50%',
        background: color || 'var(--sv-surface-sunken)',
        color: color ? 'var(--sv-accent-on-solid)' : 'var(--sv-text-secondary)',
        fontWeight: 'var(--sv-body-semibold-weight)',
        fontSize: size * 0.4,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 'none'
      }
    }, initials);
  }

  /* Overlapping avatars, last one a +n counter. Hovering a circle names the
     tech; hovering +n lists the rest. The bubble is local rather than
     SV.Tooltip because its content changes per hovered avatar while staying
     anchored to the stack. */
  function TechStack({
    names = [],
    size = 24,
    max = 5
  }) {
    const [hover, setHover] = useWoState(null);
    const list = (names || []).filter(Boolean);
    if (!list.length) return /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--sv-text-muted)'
      }
    }, "-");
    const over = list.length > max ? list.length - (max - 1) : 0;
    const shown = over ? list.slice(0, max - 1) : list;
    const rest = over ? list.slice(max - 1) : [];
    const tip = hover === 'more' ? rest.join(', ') : typeof hover === 'number' ? shown[hover] : null;
    const overlap = -Math.round(size / 3);
    const ring = {
      borderRadius: '50%',
      boxShadow: '0 0 0 2px var(--sv-surface)',
      display: 'flex',
      flex: 'none',
      width: size,
      height: size
    };
    return /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        height: size
      }
    }, shown.map((n, i) => /*#__PURE__*/React.createElement("span", {
      key: n + i,
      onMouseEnter: () => setHover(i),
      onMouseLeave: () => setHover(h => h === i ? null : h),
      style: {
        ...ring,
        marginLeft: i ? overlap : 0,
        zIndex: hover === i ? 10 : i
      }
    }, /*#__PURE__*/React.createElement(StaffAvatar, {
      name: n,
      size: size
    }))), over ? /*#__PURE__*/React.createElement("span", {
      onMouseEnter: () => setHover('more'),
      onMouseLeave: () => setHover(h => h === 'more' ? null : h),
      style: {
        ...ring,
        marginLeft: overlap,
        zIndex: hover === 'more' ? 10 : shown.length,
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--sv-surface-sunken)',
        color: 'var(--sv-text-secondary)',
        fontSize: size >= 32 ? 'var(--sv-body2-size)' : 'var(--sv-micro-size)',
        fontWeight: 'var(--sv-body-semibold-weight)',
        cursor: 'default'
      }
    }, '+' + over) : null, tip ? /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 0,
        bottom: 'calc(100% + 6px)',
        zIndex: 40,
        pointerEvents: 'none',
        padding: '4px 8px',
        borderRadius: 'var(--sv-radius-sm)',
        background: 'var(--sv-surface-inverse)',
        color: 'var(--sv-text-on-inverse)',
        fontSize: 'var(--sv-body2-size)',
        fontWeight: 'var(--sv-body-medium-weight)',
        lineHeight: 'var(--sv-body2-lh)',
        whiteSpace: 'nowrap',
        boxShadow: 'var(--sv-elev-2-shadow)'
      }
    }, tip) : null);
  }

  /* -------------------------------------------------------- VIEW SWITCH --
     Four views. `Kanban` is called **Board** everywhere the user can see it;
     the prop contract is unchanged (view="tech" + layout="columns") so the
     Work Orders page keeps working without an edit. */
  const SEGMENT_TRACK = {
    display: 'flex',
    gap: 2,
    padding: 3,
    borderRadius: 'var(--sv-radius-md)',
    background: 'var(--sv-border-subtle)',
    marginLeft: 4
  };

  /* Declared at module scope on purpose: defining it inside ViewSwitch gave
     React a new component type every render, which remounted the buttons
     mid-click so mouseup landed on a fresh node and no click fired. */
  function ViewSwitchBtn({
    on,
    label,
    onPick,
    icon
  }) {
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      title: label,
      "aria-label": label,
      "aria-pressed": on,
      onClick: onPick,
      style: {
        all: 'unset',
        cursor: 'pointer',
        width: 32,
        height: 30,
        display: 'grid',
        placeItems: 'center',
        borderRadius: 'var(--sv-radius-sm)',
        background: on ? 'var(--sv-surface)' : 'transparent',
        boxShadow: on ? 'var(--sv-elev-1-shadow)' : 'none',
        color: on ? 'var(--sv-text-primary)' : 'var(--sv-text-secondary)'
      }
    }, icon);
  }
  function ViewSwitch({
    view = 'list',
    onChange,
    layout = 'rows',
    onLayoutChange,
    showDetails = false
  }) {
    const active = view === 'details' ? 'details' : view === 'tech' ? layout === 'columns' ? 'board' : 'tech' : 'list';
    const pick = id => {
      if (id === 'list' || id === 'details') {
        onChange?.(id);
        return;
      }
      onLayoutChange?.(id === 'board' ? 'columns' : 'rows');
      onChange?.('tech');
    };
    const items = [{
      id: 'list',
      label: 'Table',
      icon: 'list'
    }, {
      id: 'tech',
      label: 'By Lead Tech',
      icon: 'user-round'
    }, {
      id: 'board',
      label: 'Board',
      icon: 'square-kanban'
    }];
    if (showDetails) items.push({
      id: 'details',
      label: 'Details',
      icon: 'panel-right'
    });
    return /*#__PURE__*/React.createElement("div", {
      style: SEGMENT_TRACK,
      role: "group",
      "aria-label": "View"
    }, items.map(it => /*#__PURE__*/React.createElement(ViewSwitchBtn, {
      key: it.id,
      on: active === it.id,
      label: it.label,
      icon: /*#__PURE__*/React.createElement(SV.Icon, {
        name: it.icon,
        size: 20
      }),
      onPick: () => pick(it.id)
    })));
  }

  /* Rows / Columns shape of the By Lead Tech view. Columns is the Board. */
  function LayoutSwitch({
    layout = 'rows',
    onChange
  }) {
    const Btn = ({
      id,
      label
    }) => {
      const on = layout === id;
      return /*#__PURE__*/React.createElement("button", {
        type: "button",
        "aria-pressed": on,
        onClick: () => onChange?.(id),
        style: {
          all: 'unset',
          cursor: 'pointer',
          height: 30,
          padding: '0 12px',
          display: 'grid',
          placeItems: 'center',
          borderRadius: 'var(--sv-radius-sm)',
          fontSize: 'var(--sv-dense-size)',
          fontWeight: 'var(--sv-body-medium-weight)',
          background: on ? 'var(--sv-surface)' : 'transparent',
          boxShadow: on ? 'var(--sv-elev-1-shadow)' : 'none',
          color: on ? 'var(--sv-text-primary)' : 'var(--sv-text-secondary)'
        }
      }, label);
    };
    return /*#__PURE__*/React.createElement("div", {
      style: SEGMENT_TRACK,
      role: "group",
      "aria-label": "Layout"
    }, /*#__PURE__*/React.createElement(Btn, {
      id: "rows",
      label: "Rows"
    }), /*#__PURE__*/React.createElement(Btn, {
      id: "columns",
      label: "Board"
    }));
  }

  /* ------------------------------------------------------- CELL HELPERS --
     Renderers for the table's non-trivial columns. Each takes a row and
     returns a node, so TableBackdrop stays a layout component. */

  const dash = () => /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--sv-text-muted)'
    }
  }, "-");

  /* A row matches when every term of the query appears in some field. So
     "esther kenworth" narrows rather than widening. */
  function rowMatches(row, query) {
    const q = String(query || '').trim().toLowerCase();
    if (!q) return true;
    const hay = Object.keys(row).filter(k => k !== 'est_color' && k !== 'uid' && k !== 'gid').map(k => row[k]).filter(v => v != null && typeof v !== 'object' && typeof v !== 'function' && v !== '').join(' ').toLowerCase();
    return q.split(/\s+/).every(t => hay.includes(t));
  }

  /* Year / make / model on one line. Unit # is its own column. */
  function assetCell(r) {
    const ymm = r.asset && r.asset !== '-' ? r.asset : '';
    if (!ymm) return dash();
    return /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--sv-body-size)',
        fontWeight: 'var(--sv-body-medium-weight)',
        color: 'var(--sv-text-primary)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        minWidth: 0
      }
    }, ymm);
  }

  /* Every technician on the work order, lead first. */
  function crew(r) {
    const names = (r.techs && r.techs.length ? r.techs : [r.tech]).filter(Boolean);
    if (r.tech && names.indexOf(r.tech) < 0) names.unshift(r.tech);
    return names;
  }

  /* "clocked / estimated hrs". Rows carry clocked as "h:mm" plus a percent;
     the estimate is derived from those, or from line count before anything is
     clocked. */
  function hoursLabel(r) {
    let clocked = 0;
    if (typeof r.clocked === 'number') clocked = r.clocked;else if (typeof r.clocked === 'string' && r.clocked) {
      const [h, m] = r.clocked.split(':').map(Number);
      clocked = h + (m || 0) / 60;
    }
    let est = r.est_hrs != null ? r.est_hrs : typeof r.est === 'number' ? r.est : null;
    if (est == null) est = clocked && r.pct ? clocked / (r.pct / 100) : Math.max(1, (r.lines || 1) * 1.5);
    return clocked.toFixed(1) + ' / ' + est.toFixed(1) + ' hrs';
  }

  /* Avatar next to the name. */
  function personCell(name, size = 24) {
    if (!name) return dash();
    return /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--sv-space-2)',
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement(StaffAvatar, {
      name: name,
      size: size
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, name));
  }

  /* Lines awaiting authorization. Warning colour: the only amber in the row,
     because it is the one thing needing the user's action. */
  function authCell(r) {
    const n = r.authLines || 0;
    if (!n) return dash();
    return /*#__PURE__*/React.createElement(SV.Tooltip, {
      label: n + (n === 1 ? ' line' : ' lines') + ' awaiting authorization'
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        color: 'var(--sv-warning)',
        fontWeight: 'var(--sv-body-medium-weight)',
        lineHeight: 'var(--sv-body2-lh)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, /*#__PURE__*/React.createElement(SV.Icon, {
      name: "triangle-alert",
      size: 16
    }), n));
  }

  /* Ordered parts. The bar is parts in stock out of the total — green only
     when nothing is left to order, blue while it is still informational. */
  function partsCell(r) {
    const total = r.partsOrdered || 0;
    if (!total) return dash();
    const toOrder = Math.min(r.partsReady || 0, total);
    const stock = total - toOrder;
    const done = toOrder === 0;
    return /*#__PURE__*/React.createElement(SV.Tooltip, {
      label: toOrder + (toOrder === 1 ? ' Part' : ' Parts') + ' ready to order',
      sub: stock + (stock === 1 ? ' Part' : ' Parts') + ' in stock'
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--sv-space-2)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-block',
        width: 64,
        height: 6,
        borderRadius: 'var(--sv-radius-pill)',
        background: 'var(--sv-border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        width: stock / total * 100 + '%',
        height: '100%',
        borderRadius: 'var(--sv-radius-pill)',
        background: done ? 'var(--sv-success)' : 'var(--sv-accent)'
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--sv-text-secondary)',
        fontSize: 'var(--sv-body2-size)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, stock + '/' + total)));
  }

  /* ----------------------------------------------------------- USER MENU --
     Avatar -> profile / shop / actions / theme. Two things changed on the way
     in: the action rows now match .sv-menu__row (40px tall, body size) instead
     of carrying their own 15px scale, and --sv-shadow-xs became
     --sv-elev-1-shadow, because the raw shadow set does not theme. */
  function UserMenu({
    name = 'Aaron Keating',
    initials = 'AK',
    shop = 'Heavy Duty'
  }) {
    const [open, setOpen] = useWoState(false);
    const [shopHov, setShopHov] = useWoState(false);
    const [theme, setTheme] = useWoState(() => document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
    React.useEffect(() => {
      if (!open) return;
      const onKey = e => {
        if (e.key === 'Escape') setOpen(false);
      };
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }, [open]);
    const pick = t => {
      if (W.ShopviewTheme) W.ShopviewTheme.set(t);
      setTheme(t);
    };
    const seg = on => ({
      flex: 1,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--sv-space-2)',
      height: 44,
      borderRadius: 'var(--sv-radius-md)',
      cursor: 'pointer',
      fontFamily: 'inherit',
      fontSize: 'var(--sv-body-size)',
      fontWeight: 'var(--sv-body-semibold-weight)',
      color: 'var(--sv-text-primary)',
      transition: 'background 120ms, box-shadow 120ms, border-color 120ms',
      background: on ? 'var(--sv-surface)' : 'transparent',
      border: on ? '1px solid var(--sv-border-default)' : '1px solid transparent',
      boxShadow: on ? 'var(--sv-elev-1-shadow)' : 'none'
    });
    const Row = ({
      icon,
      label
    }) => {
      const [hov, setHov] = useWoState(false);
      return /*#__PURE__*/React.createElement("button", {
        type: "button",
        role: "menuitem",
        onClick: () => setOpen(false),
        onMouseEnter: () => setHov(true),
        onMouseLeave: () => setHov(false),
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          width: '100%',
          height: 40,
          padding: '10px 12px',
          borderRadius: 'var(--sv-radius-md)',
          background: hov ? 'var(--sv-surface-hover)' : 'none',
          border: 0,
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: 'var(--sv-body-size)',
          lineHeight: 'var(--sv-body-lh)',
          fontWeight: 'var(--sv-body-medium-weight)',
          color: 'var(--sv-text-primary)',
          transition: 'background 120ms ease'
        }
      }, icon, label);
    };
    const g = (name, size) => /*#__PURE__*/React.createElement(SV.Icon, {
      name: name,
      size: size || 20,
      style: {
        color: 'var(--sv-text-secondary)',
        flex: 'none'
      }
    });
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        flex: 'none',
        display: 'flex'
      }
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      "aria-label": "User menu",
      "aria-haspopup": "menu",
      "aria-expanded": open,
      onClick: () => setOpen(v => !v),
      style: {
        width: 36,
        height: 36,
        padding: 0,
        borderRadius: '50%',
        border: 0,
        background: 'var(--sv-accent-subtle)',
        color: 'var(--sv-accent-subtle-text)',
        boxShadow: open ? '0 0 0 2px var(--sv-accent)' : '0 0 0 1px var(--sv-border-default)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'var(--sv-body-semibold-weight)',
        fontSize: 'var(--sv-dense-size)',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'box-shadow 120ms ease'
      }
    }, initials), open && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      onClick: () => setOpen(false),
      style: {
        position: 'fixed',
        inset: 0,
        zIndex: 60
      }
    }), /*#__PURE__*/React.createElement("div", {
      role: "menu",
      style: {
        position: 'absolute',
        top: 'calc(100% + 12px)',
        right: 0,
        zIndex: 61,
        width: 308,
        background: 'var(--sv-elev-3-bg)',
        border: '1px solid var(--sv-elev-3-border)',
        borderRadius: 'var(--sv-radius-lg)',
        boxShadow: 'var(--sv-elev-3-shadow)',
        overflow: 'hidden',
        fontFamily: 'var(--sv-font-ui)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: 'var(--sv-space-4)',
        borderBottom: '1px solid var(--sv-border-default)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 44,
        height: 44,
        borderRadius: '50%',
        flex: 'none',
        background: 'var(--sv-accent-subtle)',
        color: 'var(--sv-accent-subtle-text)',
        fontWeight: 'var(--sv-body-semibold-weight)',
        fontSize: 'var(--sv-body-size)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, initials), /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 'var(--sv-body-semibold-weight)',
        fontSize: 'var(--sv-h4-size)',
        lineHeight: 'var(--sv-h4-lh)',
        color: 'var(--sv-text-primary)'
      }
    }, name), /*#__PURE__*/React.createElement("a", {
      href: "#",
      style: {
        display: 'inline-block',
        marginTop: 1,
        textDecoration: 'none',
        fontWeight: 'var(--sv-body-semibold-weight)',
        fontSize: 'var(--sv-body-size)',
        lineHeight: 'var(--sv-body-lh)',
        color: 'var(--sv-accent-text)'
      }
    }, "Edit profile"))), /*#__PURE__*/React.createElement("button", {
      type: "button",
      role: "menuitem",
      onClick: () => setOpen(false),
      onMouseEnter: () => setShopHov(true),
      onMouseLeave: () => setShopHov(false),
      style: {
        width: '100%',
        textAlign: 'left',
        border: 0,
        cursor: 'pointer',
        background: shopHov ? 'var(--sv-surface-hover)' : 'none',
        borderBottom: '1px solid var(--sv-border-default)',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--sv-space-3)',
        fontFamily: 'inherit',
        transition: 'background 120ms ease'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--sv-dense-size)',
        lineHeight: 'var(--sv-dense-lh)',
        fontWeight: 'var(--sv-body-medium-weight)',
        color: 'var(--sv-text-muted)'
      }
    }, "Shop"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--sv-h4-size)',
        lineHeight: 'var(--sv-h4-lh)',
        fontWeight: 'var(--sv-body-semibold-weight)',
        color: 'var(--sv-text-primary)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, shop)), /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--sv-text-secondary)',
        display: 'inline-flex',
        flex: 'none'
      }
    }, g('chevron-right', 18))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 'var(--sv-space-2)',
        borderBottom: '1px solid var(--sv-border-default)'
      }
    }, /*#__PURE__*/React.createElement(Row, {
      icon: g('cog'),
      label: "Account settings"
    }), /*#__PURE__*/React.createElement(Row, {
      icon: g('log-out'),
      label: "Log out"
    })), /*#__PURE__*/React.createElement("div", {
      role: "group",
      "aria-label": "Theme",
      style: {
        padding: 'var(--sv-space-3)',
        background: 'var(--sv-surface-hover)',
        display: 'flex',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => pick('light'),
      style: seg(theme !== 'dark')
    }, g('sun', 16), /*#__PURE__*/React.createElement("span", null, "Light")), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => pick('dark'),
      style: seg(theme === 'dark')
    }, g('moon', 16), /*#__PURE__*/React.createElement("span", null, "Dark"))))));
  }

  /* --------------------------------------------------------- APP HEADER --
     The Work Orders application header: logo, primary nav, global search
     affordance, running time clock, shop name, user menu. This is the newer
     generation of the header that filter-bar.jsx publishes; it renders the
     real UserMenu and guards the clock interval on `clock`.
      Geometry comes from the --sv-header-* tokens, so this header and the
     system's own SV.AppHeader stay the same height and rhythm. */
  function WorkOrdersHeader({
    current = 'Work Orders',
    clock = true,
    onSearchClick,
    searchValue = '',
    nav
  }) {
    const [running, setRunning] = useWoState(true);
    const [secs, setSecs] = useWoState(4324);
    React.useEffect(() => {
      if (!running || !clock) return;
      const id = setInterval(() => setSecs(s => s + 1), 1000);
      return () => clearInterval(id);
    }, [running, clock]);
    const p = n => String(n).padStart(2, '0');
    const time = p(Math.floor(secs / 3600)) + ':' + p(Math.floor(secs / 60) % 60) + ':' + p(secs % 60);
    const items = nav || ['Work Orders', 'Schedule', 'Customers', 'Parts', 'Reports'];
    const kbd = {
      width: 16,
      height: 16,
      borderRadius: 'var(--sv-radius-xs)',
      background: 'var(--sv-surface)',
      border: '1px solid var(--sv-border-default)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'var(--sv-body-medium-weight)',
      fontSize: 'var(--sv-micro-size)',
      lineHeight: 1,
      color: 'var(--sv-text-secondary)'
    };
    return /*#__PURE__*/React.createElement("header", {
      style: {
        height: 'var(--sv-header-height)',
        flex: 'none',
        background: 'var(--sv-surface)',
        borderBottom: '1px solid var(--sv-border-default)',
        display: 'flex',
        alignItems: 'center',
        padding: 'var(--sv-header-padding)',
        gap: 'var(--sv-header-gap)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--sv-space-4)',
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      "aria-label": "ShopView",
      style: {
        width: 'var(--sv-header-logo-size)',
        height: 'var(--sv-header-logo-size)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--sv-accent)'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 100 100",
      fill: "currentColor",
      "aria-hidden": "true",
      style: {
        width: 30,
        height: 30
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M73.0787 60.9336L63.6353 51.4902C66.7831 54.7748 69.9309 57.9226 73.0787 60.9336Z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M84.5575 12.489H31.729C20.6432 12.489 16.1268 17.2792 13.937 27.6806L3.94616 74.8978C3.53557 77.2244 3.125 79.1405 3.125 80.9197C3.125 82.562 3.39871 84.0675 3.94616 85.1624C12.5684 77.635 20.2327 68.8759 28.9918 61.4854C32.687 64.2226 35.698 67.6441 38.1615 71.4763C31.4553 77.635 24.4754 83.6569 18.0429 90.2262H68.1341C79.3568 90.2262 83.7363 85.4361 86.063 75.0347L96.0538 27.8175C96.4644 25.4909 96.875 23.5748 96.875 21.7956C96.7381 15.3631 93.4535 12.489 84.5575 12.489ZM51.8476 82.2883C50.8896 83.1095 50.0684 84.0675 49.1104 84.8886C46.6469 81.8777 43.0885 79.4142 42.6779 75.3084C41.4462 66.5492 34.4662 58.7481 25.844 57.1058C21.6013 56.5584 19.0009 53 16.1268 50.1259L38.9826 27.27L39.2564 26.9963L39.3932 27.1332L63.7545 51.4945C66.9024 54.6423 69.9133 57.7901 73.198 60.9379L51.8476 82.2883ZM74.9772 59.1587L41.0356 25.2171L44.3203 21.9324L78.2618 55.8741L74.9772 59.1587ZM80.041 54.0948L46.0994 20.1533L49.3841 16.8686L83.3257 50.8102L80.041 54.0948Z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M46.0917 59.9816C48.8884 59.9816 51.1556 57.7144 51.1556 54.9177C51.1556 52.121 48.8884 49.8538 46.0917 49.8538C43.295 49.8538 41.0278 52.121 41.0278 54.9177C41.0278 57.7144 43.295 59.9816 46.0917 59.9816Z"
    }))), /*#__PURE__*/React.createElement("nav", {
      "aria-label": "Primary",
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        minWidth: 0,
        overflowX: 'auto',
        scrollbarWidth: 'none'
      }
    }, items.map(n => /*#__PURE__*/React.createElement("span", {
      key: n,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'var(--sv-header-control-height)',
        padding: '8px 10px',
        borderRadius: 'var(--sv-header-control-radius)',
        whiteSpace: 'nowrap',
        fontWeight: 'var(--sv-body-medium-weight)',
        fontSize: 'var(--sv-body-size)',
        lineHeight: 'var(--sv-body-lh)',
        cursor: 'pointer',
        color: 'var(--sv-text-primary)',
        background: n === current ? 'var(--sv-surface-nav-selected)' : 'transparent'
      }
    }, n)))), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement("div", {
      role: "search",
      onClick: onSearchClick,
      style: {
        width: 320,
        flexShrink: 1,
        minWidth: 140,
        boxSizing: 'border-box',
        height: 'var(--sv-header-control-height)',
        borderRadius: 'var(--sv-header-control-radius)',
        background: 'var(--sv-surface-sunken)',
        border: '1px solid var(--sv-border-default)',
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--sv-space-2)',
        fontSize: 'var(--sv-body-size)',
        fontWeight: 'var(--sv-body-medium-weight)',
        color: 'var(--sv-text-secondary)',
        cursor: onSearchClick ? 'text' : 'default'
      }
    }, /*#__PURE__*/React.createElement(SV.Icon, {
      name: "search",
      size: 20,
      style: {
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        color: searchValue ? 'var(--sv-text-primary)' : 'inherit'
      }
    }, searchValue || 'Search customers, work orders, parts...'), /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        display: 'flex',
        gap: 2
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: kbd
    }, "\u2318"), /*#__PURE__*/React.createElement("span", {
      style: kbd
    }, "K"))), clock && /*#__PURE__*/React.createElement("div", {
      style: {
        height: 'var(--sv-header-control-height)',
        flexShrink: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: running ? 9 : 8,
        padding: '0 8px 0 10px',
        borderRadius: 'var(--sv-header-control-radius)',
        border: '1px solid ' + (running ? 'var(--sv-success-border)' : 'var(--sv-border-default)'),
        background: running ? 'var(--sv-success-fill)' : 'var(--sv-surface)'
      }
    }, running ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        width: 7,
        height: 7,
        borderRadius: '50%',
        flexShrink: 0,
        background: 'var(--sv-success)',
        animation: 'svPulse 1.6s ease-in-out infinite'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 'var(--sv-body-semibold-weight)',
        fontSize: 'var(--sv-body-size)',
        lineHeight: 'var(--sv-body-lh)',
        fontVariantNumeric: 'tabular-nums',
        color: 'var(--sv-success-text)',
        minWidth: 62
      }
    }, time), /*#__PURE__*/React.createElement("button", {
      type: "button",
      title: "Stop time clock",
      "aria-label": "Stop time clock",
      onClick: () => setRunning(false),
      style: {
        width: 24,
        height: 24,
        padding: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--sv-radius-sm)',
        border: '1px solid var(--sv-danger-border)',
        background: 'transparent',
        color: 'var(--sv-danger-text)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "9",
      height: "9",
      viewBox: "0 0 9 9",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("rect", {
      x: "0.5",
      y: "0.5",
      width: "8",
      height: "8",
      rx: "1.5",
      fill: "currentColor"
    })))) : /*#__PURE__*/React.createElement("button", {
      type: "button",
      title: "Start time clock",
      onClick: () => {
        setSecs(4324);
        setRunning(true);
      },
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        background: 'none',
        border: 0,
        padding: 0,
        cursor: 'pointer',
        fontFamily: 'inherit',
        fontWeight: 'var(--sv-body-semibold-weight)',
        fontSize: 'var(--sv-body-size)',
        lineHeight: 'var(--sv-body-lh)',
        color: 'var(--sv-text-primary)'
      }
    }, /*#__PURE__*/React.createElement(SV.Icon, {
      name: "clock",
      size: 16,
      style: {
        color: 'var(--sv-text-secondary)'
      }
    }), "Clock in")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        flexShrink: 0,
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      style: {
        background: 'none',
        border: 0,
        padding: 0,
        cursor: 'pointer',
        fontFamily: 'inherit',
        fontWeight: 'var(--sv-body-semibold-weight)',
        fontSize: 'var(--sv-body-size)',
        lineHeight: 'var(--sv-body-lh)',
        color: 'var(--sv-text-primary)',
        whiteSpace: 'nowrap'
      }
    }, "Heavy Duty"), /*#__PURE__*/React.createElement(UserMenu, null)));
  }

  /* --------------------------------------------------------- FILTER BAR --
     Newer generation of the Work Orders filter bar: adds the Technician and
     Department chips, and takes `techList` so a page can narrow the technician
     options to the crew actually on screen.
      Every dropdown and the chip itself come from the system. `Popover`,
     `ASSETS` and `MINE` were closure-local to filter-bar.jsx and are now
     exported from it, so this file builds on them rather than redefining a
     second set. */
  function WorkOrdersFilterBar({
    filters,
    setFilters,
    inline = false,
    hide = [],
    techList = null
  }) {
    const [open, setOpen] = useWoState(null);
    const refs = {
      status: React.useRef(),
      mine: React.useRef(),
      tech: React.useRef(),
      dept: React.useRef(),
      asset: React.useRef()
    };
    const setVal = (k, v) => setFilters({
      ...filters,
      [k]: v
    });
    const valueText = (k, arr) => {
      if (k === 'date') return arr || null;
      if (!arr || arr.length === 0) return null;
      if (arr.length === 1) return arr[0];
      return arr[0] + ', +' + (arr.length - 1);
    };
    const icons = W.SVIcons || {};
    const items = [{
      id: 'status',
      icon: icons.ICON_LOAD,
      label: 'Status',
      list: W.STATUSES || [],
      panel: 'status'
    }, {
      id: 'mine',
      icon: W.ICON_MY_WORK_ORDERS,
      label: 'Assigned to me',
      list: W.MINE || [],
      panel: 'status',
      toggle: true
    }, {
      id: 'tech',
      icon: icons.ICON_WRENCH,
      label: 'Technician',
      list: (techList && techList.length ? techList : W.TECHS) || [],
      panel: 'list'
    }, {
      id: 'dept',
      icon: W.svIcon && W.svIcon('building-2', 16),
      label: 'Department',
      list: DEPARTMENTS,
      panel: 'list'
    }, {
      id: 'asset',
      icon: icons.ICON_TRUCK,
      label: 'Asset on site',
      list: W.ASSETS || [],
      panel: 'single'
    }];
    const shown = items.filter(it => !hide.includes(it.id));
    const panelFor = it => {
      const common = {
        value: filters[it.id] || [],
        onChange: v => setVal(it.id, v),
        onClear: () => setVal(it.id, [])
      };
      if (it.panel === 'date') {
        return /*#__PURE__*/React.createElement(W.DateRangeDropdown, {
          value: filters[it.id] || null,
          onChange: v => setVal(it.id, v),
          onClear: () => setVal(it.id, null)
        });
      }
      if (it.panel === 'single') return /*#__PURE__*/React.createElement(W.SingleSelectDropdown, _extends({
        options: it.list
      }, common));
      if (it.panel === 'status') return /*#__PURE__*/React.createElement(W.StatusDropdown, _extends({
        options: it.list
      }, common));
      return /*#__PURE__*/React.createElement(W.FilterDropdown, _extends({
        title: it.label,
        options: it.list
      }, common));
    };
    return /*#__PURE__*/React.createElement("div", {
      "data-popover-host": true,
      style: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: inline ? 'var(--sv-space-2)' : 'var(--sv-space-3)',
        padding: inline ? 0 : '8px 24px',
        minHeight: inline ? 0 : 60
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'var(--sv-space-1)'
      }
    }, shown.map(it => {
      const v = filters[it.id] || [];
      const has = v.length > 0;
      /* the popover follows its own chip in the DOM, so Tab from an open
         chip lands on its first option — not on the next chip */
      return /*#__PURE__*/React.createElement(React.Fragment, {
        key: it.id
      }, /*#__PURE__*/React.createElement(W.FilterChip, {
        refEl: refs[it.id],
        icon: it.icon,
        label: it.label,
        toggle: it.toggle,
        state: !it.toggle && open === it.id ? 'open' : 'default',
        hasValue: has,
        valueText: valueText(it.id, v),
        onClick: () => it.toggle ? setVal(it.id, has ? [] : ['Yes']) : setOpen(open === it.id ? null : it.id),
        onClear: it.toggle ? undefined : () => setVal(it.id, [])
      }), !it.toggle && /*#__PURE__*/React.createElement(W.Popover, {
        open: open === it.id,
        anchorRef: refs[it.id],
        onClose: () => setOpen(null)
      }, panelFor(it)));
    })));
  }

  /* --------------------------------------------------------------- TABLE --
     The Work Orders table. Renders whatever COLUMN_DEFS says, in the order
     COLUMN_DEFS says, so adding a column is a data edit rather than a code
     edit. `rowHeight` drives a three-step density: 36 small, 48 default,
     64+ large (bigger avatars, md badges, hours under the progress bar).
      Changed on the way in: the ten demo rows it used to carry inline are now
     SV.WO_DEMO_ROWS, and `rows` is a prop. The component no longer knows any
     data; the demo set stays reachable so a new screen can start from
     something that looks real. */

  const TECH_POOL = () => W.TECHS || [];
  /* The signed-in user in every demo: the "AK" in the header. Screens pass
     currentUser to change it. */
  const DEFAULT_USER = 'Aaron Keating';
  const CREW_SIZES = [3, 1, 7, 2, 5, 1, 4, 6, 2, 8];
  const DEMO_BASE = [{
    id: 'S3-8412',
    est: 'Estimate',
    est_color: 'ok',
    cust: 'Transload Trucking',
    unit: 'TRK-118',
    vin: '1FD0W5HY2EEA05499',
    asset: '2022 Freightliner M2',
    adv: 'Esther Howard',
    tech: 'Esther Howard',
    lines: 12,
    total: '$13,408.17'
  }, {
    id: 'S3-3425',
    est: 'Estimate',
    est_color: 'ok',
    cust: 'Hard Rock Industries LLC',
    vin: '1FD0W5HY2EEA05499',
    asset: '-',
    adv: 'Theresa Webb',
    tech: 'Ralph Edwards',
    lines: 14,
    total: '$2,321.53'
  }, {
    id: 'S3-8554',
    est: 'Approved',
    est_color: 'ok',
    cust: 'RF Heavy',
    vin: '1FD0W5HY2EEA05499',
    asset: '-',
    adv: 'Ralph Edwards',
    tech: 'Jenny Wilson',
    lines: 10,
    total: '$5,932.32'
  }, {
    id: 'S3-8423',
    est: 'Estimate',
    est_color: 'err',
    cust: 'Truck Zone',
    vin: '1FD0W5HY2EEA05499',
    asset: '-',
    adv: 'Annette Black',
    tech: 'Leslie Alexander',
    lines: 5,
    total: '$48,013.11'
  }, {
    id: 'S3-9665',
    est: 'Estimate',
    est_color: 'ok',
    cust: '1st Auto Parts Ltd',
    vin: '1FD0W5HY2EEA05499',
    asset: '-',
    adv: 'Jenny Wilson',
    tech: 'Kristin Watson',
    lines: 3,
    total: '$15,182.32'
  }, {
    id: 'S3-1345',
    est: 'Declined',
    est_color: 'err',
    cust: 'Partmaster Ltd',
    vin: '1FD0W5HY2EEA05499',
    asset: '-',
    adv: 'Eleanor Pena',
    tech: 'Esther Howard',
    lines: 2,
    total: '$13,199.51'
  }, {
    id: 'S3-5234',
    est: 'In progress',
    est_color: 'ok',
    cust: 'Auckland Motors Mitsubishi',
    vin: '1FD0W5HY2EEA05499',
    asset: '-',
    adv: 'Leslie Alexander',
    tech: 'Theresa Webb',
    lines: 12,
    total: '$10,075.14'
  }, {
    id: 'S3-9574',
    est: 'Estimate',
    est_color: 'err',
    cust: 'Dodson Autospares',
    vin: '1FD0W5HY2EEA05499',
    asset: '-',
    adv: 'Floyd Miles',
    tech: 'Ralph Edwards',
    lines: 7,
    total: '$242,212.07'
  }, {
    id: 'S3-0937',
    est: 'Estimate',
    est_color: 'ok',
    cust: 'Segedin Truck And Auto Pa…',
    vin: '1FD0W5HY2EEA05499',
    asset: '-',
    adv: 'Kathryn Murphy',
    tech: 'Annette Black',
    lines: 9,
    total: '$13,408.17'
  }, {
    id: 'S3-3456',
    est: 'Declined',
    est_color: 'err',
    cust: 'Repco Grey Lynn',
    vin: '1FD0W5HY2EEA05499',
    asset: '-',
    adv: 'Kristin Watson',
    tech: 'Jenny Wilson',
    lines: 7,
    total: '$10,075.14'
  }];
  const DEMO_EXTRA = [{
    waiting: true,
    waitingParts: 3,
    pct: 0,
    clocked: '2:14',
    created: 'Aug 03, 2026',
    invoiced: '',
    daysopen: 8,
    parts: 4,
    returns: 0,
    partsOrdered: 8,
    partsReady: 3,
    authLines: 3
  }, {
    waiting: false,
    pct: 35,
    clocked: '',
    created: 'Aug 02, 2026',
    invoiced: '',
    daysopen: 9,
    parts: 6,
    returns: 1,
    partsOrdered: 4,
    partsReady: 0
  }, {
    waiting: false,
    pct: 0,
    clocked: '0:48',
    created: 'Jul 29, 2026',
    invoiced: '',
    daysopen: 13,
    parts: 2,
    returns: 0,
    partsOrdered: 6,
    partsReady: 2,
    authLines: 1
  }, {
    waiting: true,
    waitingParts: 5,
    pct: 0,
    clocked: '',
    created: 'Jul 28, 2026',
    invoiced: '',
    daysopen: 14,
    parts: 9,
    returns: 2
  }, {
    waiting: false,
    pct: 100,
    clocked: '5:02',
    created: 'Jul 24, 2026',
    invoiced: 'Aug 01, 2026',
    daysopen: 18,
    parts: 1,
    returns: 0,
    est: 'Complete',
    est_color: 'ok',
    partsOrdered: 3,
    partsReady: 0
  }, {
    waiting: false,
    pct: 0,
    clocked: '',
    created: 'Jul 21, 2026',
    invoiced: 'Jul 30, 2026',
    daysopen: 21,
    parts: 0,
    returns: 0
  }, {
    waiting: true,
    waitingParts: 2,
    pct: 18,
    clocked: '1:36',
    created: 'Jul 19, 2026',
    invoiced: '',
    daysopen: 23,
    parts: 7,
    returns: 1,
    partsOrdered: 9,
    partsReady: 4,
    authLines: 2
  }, {
    waiting: false,
    pct: 100,
    clocked: '',
    created: 'Jul 15, 2026',
    invoiced: 'Jul 31, 2026',
    daysopen: 27,
    parts: 12,
    returns: 3,
    est: 'Invoiced',
    est_color: 'ok'
  }, {
    waiting: false,
    pct: 100,
    clocked: '3:20',
    created: 'Jul 12, 2026',
    invoiced: 'Jul 27, 2026',
    daysopen: 30,
    parts: 5,
    returns: 0,
    est: 'Paid',
    est_color: 'ok'
  }, {
    waiting: true,
    waitingParts: 1,
    pct: 0,
    clocked: '',
    created: 'Jul 08, 2026',
    invoiced: '',
    daysopen: 34,
    parts: 3,
    returns: 1,
    partsOrdered: 2,
    partsReady: 2
  }];

  /* Built lazily, once: the crew lists need window.TECHS, which is set by
     filter-bar.jsx earlier in the bundle but is not guaranteed at the moment
     this file's body runs on a page that loads sources out of order. */
  let _demoRows = null;
  function demoRows() {
    if (_demoRows) return _demoRows;
    const pool = TECH_POOL();
    _demoRows = DEMO_BASE.map((r, i) => {
      const row = Object.assign({}, r, DEMO_EXTRA[i], {
        dept: DEPARTMENTS[i % DEPARTMENTS.length]
      });
      const crewPool = [row.tech].concat(pool.filter(t => t !== row.tech));
      row.techs = crewPool.slice(0, CREW_SIZES[i % CREW_SIZES.length]);
      if (i < 2) row.techs.push(DEFAULT_USER); /* the two demo work orders "assigned to me" */
      return row;
    });
    return _demoRows;
  }

  /* The WO screen spells two statuses differently from the system, and has one
     the system never had. Register the screen's spellings rather than editing
     its data. STATUS_TONE is a spread taken at module load, so mutating
     WORK_ORDER_STATUS does not reach it — the table resolves through
     WORK_ORDER_STATUS first and only falls back to STATUS_TONE. That also
     keeps the finance vocabulary intact: `Invoiced` stays info on an invoice
     and reads success in the work order list. */
  if (SV.WORK_ORDER_STATUS) {
    Object.assign(SV.WORK_ORDER_STATUS, {
      'In progress': 'info',
      // the screen's spelling of 'In Progress'
      'Ready for Review': 'warning',
      'Invoiced': 'success'
    });
  }
  function woTone(status) {
    return SV.WORK_ORDER_STATUS && SV.WORK_ORDER_STATUS[status] || SV.STATUS_TONE && SV.STATUS_TONE[status] || 'neutral';
  }
  function WorkOrderTable({
    rows,
    cols = W.DEFAULT_COLUMNS || [],
    tab = 'All',
    filters = {},
    query = '',
    onClear,
    extraRows = [],
    onCount,
    onRowMenu,
    rowHeight = 48,
    currentUser = DEFAULT_USER,
    isMine
  }) {
    const [hoverRow, setHoverRow] = useWoState(null);
    const base = rows || demoRows();
    /* "Assigned to me": the signed-in user is on the crew, or is the service
       advisor. A page with its own notion of "me" passes isMine(row). */
    const mine = isMine || (r => crew(r).includes(currentUser) || r.adv === currentUser);
    const allRows = extraRows.length ? extraRows.concat(base) : base;
    const tabs = W.WO_TAB_STATUS || WO_TAB_STATUS;
    const visibleRows = tab === 'Estimates' ? allRows.filter(r => tabs.estimates.includes(r.est)) : tab === 'Work Orders' ? allRows.filter(r => tabs.workOrders.includes(r.est)) : tab === 'Completed' ? allRows.filter(r => tabs.completed.includes(r.est)) : allRows;
    const q = query.trim().toLowerCase();
    const stF = filters.status || [];
    const assetF = (filters.asset || [])[0];
    const mineF = (filters.mine || []).length > 0;
    const techF = filters.tech || [];
    const deptF = filters.dept || [];
    const shownRows = visibleRows.filter(r => {
      if (stF.length && !stF.includes(r.est)) return false;
      if (assetF === 'Yes' && r.asset === '-') return false;
      if (assetF === 'No' && r.asset !== '-') return false;
      if (mineF && !mine(r)) return false;
      if (techF.length && !techF.includes(r.tech)) return false;
      if (deptF.length && !deptF.includes(r.dept)) return false;
      if (q && !rowMatches(r, q)) return false;
      return true;
    });
    const report = onCount;
    React.useEffect(() => {
      report && report(shownRows.length);
    }, [shownRows.length, report]);
    const small = rowHeight <= 36;
    const large = rowHeight >= 64;
    const fs = small ? 'var(--sv-dense-size)' : 'var(--sv-body-size)';
    const padX = small ? 12 : 16;
    const badgeSize = large ? 'md' : 'sm';
    const av = large ? 32 : small ? 20 : 24;
    const Th = ({
      children,
      w
    }) => /*#__PURE__*/React.createElement("th", {
      style: {
        textAlign: 'left',
        padding: small ? '8px 12px' : '12px 16px',
        fontWeight: 'var(--sv-body-medium-weight)',
        fontSize: 'var(--sv-body2-size)',
        color: 'var(--sv-text-secondary)',
        background: 'var(--sv-surface)',
        borderBottom: '1px solid var(--sv-border-default)',
        whiteSpace: 'nowrap',
        letterSpacing: 'var(--sv-tracking-wide)',
        width: w
      }
    }, children);
    const Td = ({
      children,
      align
    }) => /*#__PURE__*/React.createElement("td", {
      style: {
        height: rowHeight,
        padding: '0 ' + padX + 'px',
        fontWeight: 'var(--sv-body-medium-weight)',
        fontSize: fs,
        color: 'var(--sv-text-primary)',
        borderBottom: '1px solid var(--sv-border-subtle)',
        transition: 'height 140ms ease-out',
        textAlign: align || 'left',
        whiteSpace: 'nowrap'
      }
    }, children);
    const OnSite = ({
      r
    }) => {
      const bad = r.est_color === 'err';
      return /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-grid',
          placeItems: 'center',
          width: 24,
          height: 24,
          borderRadius: 'var(--sv-radius-sm)',
          background: bad ? 'var(--sv-danger-fill)' : 'var(--sv-success-fill)',
          color: bad ? 'var(--sv-danger-text)' : 'var(--sv-success-text)'
        }
      }, /*#__PURE__*/React.createElement(SV.Icon, {
        name: bad ? 'x' : 'check',
        size: 14
      }));
    };
    const bar = pct => /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-block',
        width: small ? 48 : 64,
        height: small ? 4 : 6,
        borderRadius: 'var(--sv-radius-pill)',
        background: 'var(--sv-border-subtle)',
        verticalAlign: 'middle'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        width: pct + '%',
        height: '100%',
        borderRadius: 'var(--sv-radius-pill)',
        background: pct ? 'var(--sv-accent)' : 'transparent'
      }
    }));
    const muted = () => /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--sv-text-muted)'
      }
    }, "-");
    const num = {
      color: 'var(--sv-text-secondary)',
      fontSize: 'var(--sv-body2-size)',
      fontVariantNumeric: 'tabular-nums'
    };
    const cell = (key, r) => {
      switch (key) {
        case 'onsite':
          return /*#__PURE__*/React.createElement(OnSite, {
            r: r
          });
        case 'status':
          return /*#__PURE__*/React.createElement(SV.Badge, {
            tone: woTone(r.est),
            size: badgeSize
          }, r.est);
        case 'number':
          return r.id;
        case 'cust':
          return r.cust;
        case 'waiting':
          return r.waiting ? /*#__PURE__*/React.createElement("a", {
            href: "#",
            onClick: e => e.preventDefault(),
            style: {
              color: 'var(--sv-accent)',
              fontWeight: 'var(--sv-body-medium-weight)',
              textDecoration: 'none'
            },
            onMouseEnter: e => {
              e.currentTarget.style.textDecoration = 'underline';
            },
            onMouseLeave: e => {
              e.currentTarget.style.textDecoration = 'none';
            }
          }, r.waitingParts, " ", r.waitingParts === 1 ? 'part' : 'parts') : muted();
        case 'unit':
          return r.unit ? r.unit : muted();
        case 'asset':
          return assetCell(r);
        case 'vin':
          return /*#__PURE__*/React.createElement("span", {
            style: {
              color: 'var(--sv-text-secondary)'
            }
          }, r.vin);
        case 'progress':
          if (!large) {
            return /*#__PURE__*/React.createElement(React.Fragment, null, bar(r.pct), /*#__PURE__*/React.createElement("span", {
              style: {
                ...num,
                marginLeft: 8
              }
            }, r.pct, "%"));
          }
          return /*#__PURE__*/React.createElement("span", {
            style: {
              display: 'inline-flex',
              flexDirection: 'column',
              gap: 6,
              verticalAlign: 'middle'
            }
          }, /*#__PURE__*/React.createElement("span", {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }
          }, bar(r.pct), /*#__PURE__*/React.createElement("span", {
            style: num
          }, r.pct, "%")), /*#__PURE__*/React.createElement("span", {
            style: num
          }, hoursLabel(r)));
        case 'adv':
          return personCell(r.adv, av);
        case 'tech':
          return personCell(r.tech, av);
        case 'techs':
          return /*#__PURE__*/React.createElement(TechStack, {
            names: crew(r),
            size: av
          });
        case 'clocked':
          return r.clocked ? /*#__PURE__*/React.createElement(SV.Badge, {
            tone: "neutral",
            shape: "square",
            size: badgeSize
          }, r.clocked) : muted();
        case 'lines':
          return r.lines;
        case 'total':
          return r.total;
        case 'created':
          return /*#__PURE__*/React.createElement("span", {
            style: {
              color: 'var(--sv-text-secondary)'
            }
          }, r.created);
        case 'invoiced':
          return /*#__PURE__*/React.createElement("span", {
            style: {
              color: r.invoiced ? 'var(--sv-text-secondary)' : 'var(--sv-text-muted)'
            }
          }, r.invoiced || '—');
        case 'daysopen':
          return r.daysopen;
        case 'auth':
          return authCell(r);
        case 'partsReady':
          return partsCell(r);
        case 'returns':
          return r.returns;
        default:
          return null;
      }
    };
    const defs = (W.COLUMN_DEFS || []).filter(c => cols.includes(c.key));
    const numeric = ['daysopen', 'returns'];
    const EmptyState = W.SVEmptyState;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("table", {
      style: {
        width: '100%',
        borderCollapse: 'collapse',
        fontFamily: 'var(--sv-font-ui)'
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, defs.map(c => /*#__PURE__*/React.createElement(Th, {
      key: c.key,
      w: c.key === 'onsite' ? 56 : c.key === 'status' ? 120 : undefined
    }, c.key === 'onsite' ? 'On Site' : c.label)), onRowMenu ? /*#__PURE__*/React.createElement(Th, {
      key: "__menu",
      w: 48
    }) : null)), /*#__PURE__*/React.createElement("tbody", null, shownRows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
      key: r.id || i,
      onMouseEnter: () => setHoverRow(i),
      onMouseLeave: () => setHoverRow(null),
      style: {
        background: hoverRow === i ? 'var(--sv-surface-hover)' : 'transparent',
        transition: 'background-color 120ms ease-out'
      }
    }, defs.map(c => /*#__PURE__*/React.createElement(Td, {
      key: c.key,
      align: numeric.includes(c.key) ? 'right' : undefined
    }, cell(c.key, r))), onRowMenu ? /*#__PURE__*/React.createElement(Td, {
      key: "__menu",
      align: "right"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      "aria-label": r.tech ? 'Reassign Lead Tech' : 'Assign Tech',
      title: r.tech ? 'Reassign Lead Tech' : 'Assign Tech',
      onClick: e => {
        e.stopPropagation();
        onRowMenu(r, e.currentTarget.getBoundingClientRect());
      },
      style: {
        all: 'unset',
        cursor: 'pointer',
        width: 24,
        height: 24,
        display: 'grid',
        placeItems: 'center',
        borderRadius: 'var(--sv-radius-sm)',
        color: 'var(--sv-text-muted)',
        opacity: hoverRow === i ? 1 : 0
      }
    }, /*#__PURE__*/React.createElement(SV.Icon, {
      name: "ellipsis",
      size: 16
    }))) : null)))), shownRows.length === 0 && EmptyState && /*#__PURE__*/React.createElement(EmptyState, {
      query: query,
      hasFilters: stF.length > 0 || !!assetF || mineF || techF.length > 0 || deptF.length > 0,
      onClear: onClear
    }));
  }

  /* --------------------------------------------------------------- SHELL --
     The Work Orders screen chrome: header, tabs, inline search, filter bar,
     density menu, columns menu, view switch, New Work Order.
      It renders the table itself for the list view and `children` for every
     other view. That is deliberate and it is the whole contract: the Board and
     By Lead Tech views live in the page that uses this shell, written in
     Claude Design's canvas markup so they stay editable there. The shell owns
     the chrome; the page owns its views.
      A new screen therefore starts by duplicating the Work Orders page, which
     gives it this shell already wired, and replaces the children. */

  const DENSITY_PX = {
    small: 36,
    medium: 48,
    large: 64
  };
  const ROW_DENSITY = [['small', 'Small'], ['medium', 'Medium'], ['large', 'Large']];
  const CARD_DENSITY = [['compact', 'Compact'], ['detailed', 'Detailed']];
  const WO_TABS = ['All', 'Work Orders', 'Estimates', 'Completed'];

  /* Chrome buttons share one shape: 36px square, tinted while their popover is
     open, tinted on hover otherwise. */
  function ChromeBtn({
    title,
    open,
    onClick,
    btnRef,
    children
  }) {
    const [hov, setHov] = useWoState(false);
    return /*#__PURE__*/React.createElement("button", {
      ref: btnRef,
      type: "button",
      title: title,
      "aria-expanded": open,
      onClick: onClick,
      onMouseEnter: () => setHov(true),
      onMouseLeave: () => setHov(false),
      style: {
        all: 'unset',
        cursor: 'pointer',
        width: 36,
        height: 36,
        display: 'grid',
        placeItems: 'center',
        borderRadius: 'var(--sv-radius-md)',
        background: open || hov ? 'var(--sv-border-subtle)' : 'transparent'
      }
    }, children);
  }
  function DensityMenu({
    title,
    options,
    value,
    onPick
  }) {
    const [hov, setHov] = useWoState(null);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 'var(--sv-space-1)',
        width: 232,
        boxSizing: 'border-box',
        fontFamily: 'var(--sv-font-ui)',
        borderRadius: 'var(--sv-radius-md)',
        background: 'var(--sv-elev-2-bg)',
        border: '1px solid var(--sv-elev-2-border)',
        boxShadow: 'var(--sv-elev-2-shadow)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 12px 6px',
        fontSize: 'var(--sv-body2-size)',
        fontWeight: 'var(--sv-body-semibold-weight)',
        color: 'var(--sv-text-secondary)'
      }
    }, title), options.map(([id, label]) => /*#__PURE__*/React.createElement("button", {
      key: id,
      type: "button",
      onClick: () => onPick(id),
      onMouseEnter: () => setHov(id),
      onMouseLeave: () => setHov(null),
      style: {
        all: 'unset',
        cursor: 'pointer',
        boxSizing: 'border-box',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 12px',
        borderRadius: 'var(--sv-radius-sm)',
        background: hov === id ? 'var(--sv-surface-hover)' : 'transparent'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontSize: 'var(--sv-body-size)',
        color: 'var(--sv-text-primary)',
        fontWeight: value === id ? 'var(--sv-body-semibold-weight)' : 'var(--sv-body-medium-weight)'
      }
    }, label), value === id && /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 'none',
        display: 'grid',
        placeItems: 'center',
        color: 'var(--sv-accent)'
      }
    }, /*#__PURE__*/React.createElement(SV.Icon, {
      name: "check",
      size: 16
    })))));
  }
  function WorkOrdersScreen({
    initial = {},
    sharedLink = false,
    showAppliedRow = false,
    onSearchClick,
    searchValue = '',
    extraRows = [],
    rows,
    onRowMenu,
    search = null,
    view = 'list',
    onViewChange,
    onQueryChange,
    onFiltersChange,
    onTabChange,
    techOptions = null,
    techCount = null,
    techLayout = 'rows',
    onTechLayoutChange,
    cardDensity = 'detailed',
    onCardDensityChange,
    rowDensity = 'medium',
    onRowDensityChange,
    showDetailsView = false,
    onColumnsChange,
    currentUser = DEFAULT_USER,
    isMine,
    children
  }) {
    const [filtersByTab, setFiltersByTab] = useWoState({
      All: initial
    });
    const [tab, setTab] = useWoState('All');
    const [tableQuery, setTableQuery] = useWoState('');
    const [fromSearch, setFromSearch] = useWoState(false);
    const [resultCount, setResultCount] = useWoState(0);
    const [colsOpen, setColsOpen] = useWoState(false);
    const [densOpen, setDensOpen] = useWoState(false);
    const [cols, setCols] = useWoState(() => (W.DEFAULT_COLUMNS || []).slice());
    const colsRef = React.useRef();
    const densRef = React.useRef();
    const kanban = view === 'tech' && techLayout === 'columns';
    const details = view === 'details';
    const cards = kanban || details;
    const filters = filtersByTab[tab] || {};
    const setFilters = v => setFiltersByTab(m => ({
      ...m,
      [tab]: typeof v === 'function' ? v(m[tab] || {}) : v
    }));
    React.useEffect(() => {
      onColumnsChange && onColumnsChange(cols);
    }, [cols, onColumnsChange]);
    React.useEffect(() => {
      onQueryChange && onQueryChange(tableQuery);
    }, [tableQuery, onQueryChange]);
    React.useEffect(() => {
      onTabChange && onTabChange(tab);
    }, [tab, onTabChange]);
    React.useEffect(() => {
      onFiltersChange && onFiltersChange(filters);
    }, [filters, onFiltersChange]);

    /* A global-search handoff arrives as { query, tab, key }; a new key
       re-applies it, which is how searching twice for the same term still
       reopens the list. */
    React.useEffect(() => {
      if (!search) return;
      setTableQuery(search.query || '');
      setFromSearch(!!(search.query || '').trim());
      if (search.tab) setTab(search.tab);
    }, [search && search.key]);
    const techList = React.useMemo(() => {
      const grouped = techOptions || [];
      const all = view !== 'list' ? grouped : [].concat(extraRows.map(r => r.tech), grouped, W.TECHS || []);
      return Array.from(new Set(all.filter(Boolean))).sort();
    }, [view, techOptions, extraRows]);
    const densTitle = cards ? 'Card size' : 'Row height';
    const densOpts = cards ? CARD_DENSITY : ROW_DENSITY;
    const densValue = cards ? cardDensity : rowDensity;
    const pickDens = id => {
      setDensOpen(false);
      if (cards) onCardDensityChange && onCardDensityChange(id);else onRowDensityChange && onRowDensityChange(id);
    };
    const Search = W.ExpandingSearch;
    const Applied = W.AppliedFilters;
    const Banner = W.SearchResultsBanner;
    const Shared = W.SharedLinkBanner;
    const Columns = W.ColumnsDropdown;
    const Pop = W.Popover;
    const sep = /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        width: 1,
        height: 20,
        flexShrink: 0,
        margin: '0 4px',
        background: 'var(--sv-border-subtle)'
      }
    });
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--sv-surface)',
        fontFamily: 'var(--sv-font-ui)'
      }
    }, /*#__PURE__*/React.createElement(WorkOrdersHeader, {
      clock: false,
      onSearchClick: onSearchClick,
      searchValue: searchValue
    }), sharedLink && Shared && /*#__PURE__*/React.createElement(Shared, {
      onReset: () => setFilters({})
    }), /*#__PURE__*/React.createElement("div", {
      "data-popover-host": true,
      style: {
        position: 'relative',
        zIndex: 40,
        padding: '16px 24px',
        flex: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 'var(--sv-space-3)'
      }
    }, /*#__PURE__*/React.createElement("nav", {
      style: {
        display: 'flex',
        gap: 'var(--sv-space-1)'
      }
    }, WO_TABS.map(t => /*#__PURE__*/React.createElement("span", {
      key: t,
      onClick: () => setTab(t),
      style: {
        padding: '8px 12px',
        borderRadius: 'var(--sv-radius-md)',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        fontWeight: 'var(--sv-body-medium-weight)',
        fontSize: 'var(--sv-body-size)',
        background: tab === t ? 'var(--sv-border-subtle)' : 'transparent',
        color: tab === t ? 'var(--sv-text-primary)' : 'var(--sv-text-secondary)'
      }
    }, t))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--sv-space-1)',
        flexWrap: 'wrap',
        justifyContent: 'flex-end'
      }
    }, Search && /*#__PURE__*/React.createElement(Search, {
      value: fromSearch ? '' : tableQuery,
      onChange: v => {
        setTableQuery(v);
        setFromSearch(false);
      }
    }), sep, /*#__PURE__*/React.createElement(WorkOrdersFilterBar, {
      filters: filters,
      setFilters: setFilters,
      inline: true,
      techList: techList,
      hide: (view !== 'list' ? [] : ['tech', 'dept']).concat(tab === 'All' ? [] : ['status'])
    }), sep, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--sv-space-1)',
        flexWrap: 'nowrap',
        flex: 'none',
        marginLeft: 'auto'
      }
    }, !details && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ChromeBtn, {
      btnRef: densRef,
      title: densTitle,
      open: densOpen,
      onClick: () => setDensOpen(v => !v)
    }, /*#__PURE__*/React.createElement(SV.Icon, {
      name: kanban ? 'card-height' : 'row-height',
      size: 20
    })), Pop && /*#__PURE__*/React.createElement(Pop, {
      open: densOpen,
      anchorRef: densRef,
      onClose: () => setDensOpen(false),
      align: "right",
      panelWidth: 232
    }, /*#__PURE__*/React.createElement(DensityMenu, {
      title: densTitle,
      options: densOpts,
      value: densValue,
      onPick: pickDens
    }))), !kanban && !details && /*#__PURE__*/React.createElement(ChromeBtn, {
      btnRef: colsRef,
      title: "Columns",
      open: colsOpen,
      onClick: () => setColsOpen(v => !v)
    }, /*#__PURE__*/React.createElement(SV.Icon, {
      name: "columns-3",
      size: 20
    })), !kanban && Pop && Columns && /*#__PURE__*/React.createElement(Pop, {
      open: colsOpen,
      anchorRef: colsRef,
      onClose: () => setColsOpen(false),
      align: "right",
      panelWidth: 288
    }, /*#__PURE__*/React.createElement(Columns, {
      visible: cols,
      onChange: setCols,
      hideLocked: true,
      allowKeys: view === 'tech' ? TECH_COLUMN_KEYS : null
    })), !details && sep, /*#__PURE__*/React.createElement(ViewSwitch, {
      view: view,
      onChange: onViewChange,
      layout: techLayout,
      onLayoutChange: onTechLayoutChange,
      showDetails: showDetailsView
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8
      }
    }), /*#__PURE__*/React.createElement("button", {
      style: {
        all: 'unset',
        cursor: 'pointer',
        height: 36,
        padding: '0 16px',
        flex: 'none',
        borderRadius: 'var(--sv-radius-md)',
        whiteSpace: 'nowrap',
        background: 'var(--sv-accent)',
        color: 'var(--sv-text-on-accent)',
        fontWeight: 'var(--sv-body-semibold-weight)',
        fontSize: 'var(--sv-body-size)'
      }
    }, "New Work Order")))), showAppliedRow && Applied && /*#__PURE__*/React.createElement(Applied, {
      filters: filters,
      setFilters: setFilters,
      labels: {
        status: 'Status',
        mine: 'Assigned to me',
        tech: 'Technician',
        dept: 'Department',
        asset: 'Asset on site'
      }
    }), fromSearch && tableQuery.trim() && Banner && /*#__PURE__*/React.createElement(Banner, {
      query: tableQuery,
      count: view !== 'list' && techCount != null ? techCount : resultCount,
      onClear: () => {
        setTableQuery('');
        setFromSearch(false);
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 1,
        flex: 'none',
        background: 'var(--sv-border-default)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        overflow: 'auto',
        background: view === 'list' ? 'var(--sv-surface)' : 'var(--sv-surface-sunken)'
      }
    }, view !== 'list' ? children : /*#__PURE__*/React.createElement(WorkOrderTable, {
      rows: rows,
      cols: cols,
      tab: tab,
      filters: filters,
      query: tableQuery,
      extraRows: extraRows,
      onRowMenu: onRowMenu,
      currentUser: currentUser,
      isMine: isMine,
      rowHeight: DENSITY_PX[rowDensity] || 48,
      onCount: setResultCount,
      onClear: () => setFilters({})
    })));
  }

  /* ------------------------------------------------------------ PUBLISH -- */

  Object.assign(SV, {
    WO_TAB_STATUS,
    DEPARTMENTS,
    TECH_COLUMN_KEYS,
    AVATAR_PHOTOS,
    WO_DEFAULT_USER: DEFAULT_USER,
    StaffAvatar,
    TechStack,
    ViewSwitch,
    ViewSwitchBtn,
    LayoutSwitch,
    rowMatches,
    assetCell,
    crew,
    hoursLabel,
    personCell,
    authCell,
    partsCell,
    UserMenu,
    WorkOrdersHeader,
    WorkOrdersFilterBar,
    WorkOrderTable,
    WorkOrdersScreen,
    woTone,
    get WO_DEMO_ROWS() {
      return demoRows();
    }
  });

  /* Back-compat: the names the Work Orders page already calls. These exist so
     the copied sections can be deleted from ds-page-fix.js without editing
     the page. New work should use SV.* instead. */
  Object.assign(W, {
    WO_TAB_STATUS,
    DEPARTMENTS,
    TECH_COLUMN_KEYS,
    SV_AVATAR_PHOTOS: AVATAR_PHOTOS,
    SVAvatarFix: StaffAvatar,
    SVTechStack: TechStack,
    svRowMatches: rowMatches,
    svAssetCell: assetCell,
    svCrew: crew,
    svHoursLabel: hoursLabel,
    svPersonCell: personCell,
    svAuthCell: authCell,
    svPartsCell: partsCell,
    UserMenu,
    WorkOrdersHeader,
    WorkOrdersFilterBar,
    TableBackdrop: WorkOrderTable,
    /* The Work Orders page imports these by name from global scope, so they
       keep working the moment the copied sections leave ds-page-fix.js. Its
       markup asks for exactly six globals: SVWorkOrdersPageFix, SVAvatarFix,
       SVTechStack, SVBadgeFix, SVEmptyState (filter-bar.jsx) and
       SVGlobalSearchModalFix (still the page's own). */
    SVWorkOrdersPageFix: WorkOrdersScreen,
    SVBadgeFix: SV.Badge
  });

  /* Two names this file deliberately does NOT take, even though it sorts last
     and would win:
        AppHeader  index.js reclaimed it for the system's own header. Taking it
                  back here would undo that and hand every page the Work Orders
                  header instead. The Work Orders page asks for this one by
                  name: SV.WorkOrdersHeader, or the bare WorkOrdersHeader above.
        FilterBar  filter-bar.jsx's older generation is what Filters.html,
                  Filters V2.html and the mobile artboards render. This one is
                  a superset in behaviour but not in props (no `allCleared`, no
                  date panel), so overwriting the global would be a silent
                  change to six standalone pages. New callers ask for
                  SV.WorkOrdersFilterBar. */
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "work-orders.jsx", error: String((e && e.message) || e) }); }

})();
