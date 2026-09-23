// Re-registers page components clobbered by later ui_kits sections in _ds_bundle.js.
// Sections extracted verbatim from the bundle; load AFTER _ds_bundle.js.
(() => {
function run() {
const __ds_ns = (window.ShopviewDesignSystem_fac6ef = window.ShopviewDesignSystem_fac6ef || {});
__ds_ns.__errors = __ds_ns.__errors || [];
const __ds_scope = {};

// badge.jsx
try { (() => {
// Badge — Shopview DS semantic pill.
//   size md (default): Inter 500 · 11px, 22px tall, 2×8 padding
//   size sm:           Inter 600 · 10px, 18px tall, 1×7 padding, +1.5% tracking (Caption scale)
// tone: success | warning | danger | info | neutral · shape: rounded | square · bordered by default.
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
  const t = BADGE_TONES[tone] || BADGE_TONES.neutral || BADGE_TONES.info;
  const s = BADGE_SIZES[size] || BADGE_SIZES.md;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: size === "sm" ? 3 : 4,
      height: s.height,
      padding: s.padding,
      boxSizing: "border-box",
      whiteSpace: "nowrap",
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
})(); } catch (e) { __ds_ns.__errors.push({ path: "badge.jsx", error: String((e && e.message) || e) }); }

// filter-bar.jsx
try { (() => {
// Filter Bar — full toolbar context with table backdrop, plus interactive demo.

const CUSTOMERS = ["Transload Trucking", "Hard Rock Industries LLC", "RF Heavy", "Truck Zone", "1st Auto Parts Ltd", "Partmaster Ltd", "Auckland Motors Mitsubishi", "Dodson Autospares", "Texas Truck And Auto Parts", "Repco Grey Lynn", "Segedin Truck And Auto Pa…"];
const STATUSES = ["Estimate", "Approved", "In progress", "Review", "Complete", "Invoiced", "Paid", "Declined", "Imported"];
const TECHS = ["Eleanor Pena", "Esther Howard", "Jenny Wilson", "Annette Black", "Leslie Alexander", "Floyd Miles", "Theresa Webb", "Ralph Edwards"];
const ADVISORS = ["Kathryn Murphy", "Kristin Watson", "Theresa Webb", "Eleanor Pena", "Jenny Wilson"];
const ASSETS = ["Yes", "No"];
const MINE = ["Yes", "No"];
// Work-order glyph (Lucide clipboard-list) — 16px, matching the other chip icons
const ICON_MY_WORK_ORDERS = window.svIcon("clipboard-list", 16);

// Kanban glyph (Lucide square-kanban) — the DS bundle's icon map lacks it and
// overwrites lucide-icons.js, so register it here, after both have run.
(function () {
  const add = () => {
    window.SV_LUCIDE = window.SV_LUCIDE || {};
    window.SV_LUCIDE["rows-3"] = '<rect width="18" height="18" x="3" y="3" rx="2" /><path d="M21 9H3" /><path d="M21 15H3" />';
    window.SV_LUCIDE["ban"] = '<circle cx="12" cy="12" r="10" /><path d="m4.9 4.9 14.2 14.2" />';
    window.SV_LUCIDE["panel-right"] = '<rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v18" />';
    window.SV_LUCIDE["square-kanban"] = '<rect width="18" height="18" x="3" y="3" rx="2" /><path d="M8 7v7" /><path d="M12 7v4" /><path d="M16 7v9" />';
    window.SV_LUCIDE["chevrons-down-up"] = '<path d="m7 20 5-5 5 5" /><path d="m7 4 5 5 5-5" />';
    window.SV_LUCIDE["chevrons-up-down"] = '<path d="m7 15 5 5 5-5" /><path d="m7 9 5-5 5 5" />';
    window.SV_LUCIDE["triangle-alert"] = '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><path d="M12 9v4" /><path d="M12 17h.01" />';
    window.SV_LUCIDE["row-height"] = '<path d="M3 6h11" /><path d="M3 12h11" /><path d="M3 18h11" /><path d="M20 5v14" /><path d="m17 8 3-3 3 3" /><path d="m17 16 3 3 3-3" />';
    window.SV_LUCIDE["card-height"] = '<rect x="3" y="6" width="11" height="8" rx="2" /><path d="M3 18h11" /><path d="M20 5v14" /><path d="m17 8 3-3 3 3" /><path d="m17 16 3 3 3-3" />';
  };
  add();
  setTimeout(add, 0);
  setTimeout(add, 300);
})();

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
      background: "var(--sv-border-subtle)",
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
      border: "1px solid var(--sv-primary-100, var(--sv-border-subtle))",
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
      background: !expanded && hover ? "var(--sv-border-subtle)" : "transparent",
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
      color: "var(--sv-text-primary)",
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
      color: "var(--sv-accent-text)"
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

window.ICON_MY_WORK_ORDERS = ICON_MY_WORK_ORDERS;
window.AppliedFilters = AppliedFilters;
window.SearchResultsBanner = SearchResultsBanner;
window.SharedLinkBanner = SharedLinkBanner;
window.CUSTOMERS = CUSTOMERS;
window.STATUSES = STATUSES;
window.TECHS = TECHS;
window.SVEmptyState = SVEmptyState;
window.ADVISORS = ADVISORS;
})(); } catch (e) { __ds_ns.__errors.push({ path: "filter-bar.jsx", error: String((e && e.message) || e) }); }

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
  metaIcon = true,
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
      boxShadow: "var(--sv-shadow-xs)"
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
      boxShadow: "var(--sv-shadow-xs)",
      padding: 0
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    src: a.icon,
    size: 16,
    color: "grey500"
  })))));
}
const SEARCH_TABS = ["All", "Work Orders", "Customers", "Contacts", "Assets", "Parts", "Vendors", "Part Sales", "Purchase Orders", "Vendor Invoices"];
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
      boxShadow: "var(--sv-shadow-xs)",
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
      background: 'var(--sv-border-focus)',
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
  type: "contact",
  label: "Contacts",
  tab: "Contacts"
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
  meta: ["James Smith", "·", "Apr 27, 2026"],
  actionLabel: "Add new line"
}, {
  type: "work-order",
  title: "S1-578 Fibridge Commercial",
  badge: "Estimate",
  badgeType: "info",
  meta: ["James Smith", "·", "Apr 27, 2026"],
  actionLabel: "Add new line"
}, {
  type: "work-order",
  title: "S1-511 Fisquare Farms",
  badge: "Invoiced",
  badgeType: "neutral",
  meta: ["Esther Howard", "·", "Apr 12, 2026"],
  actionLabel: "Add new line"
}, {
  type: "work-order",
  title: "S1-498 Fibridge Mining",
  badge: "In progress",
  badgeType: "warning",
  meta: ["Ralph Edwards", "·", "Apr 22, 2026"],
  actionLabel: "Add new line"
}, {
  type: "work-order",
  title: "S1-472 Fibrook Equipment",
  badge: "Approved",
  badgeType: "success",
  meta: ["Jenny Wilson", "·", "Apr 19, 2026"],
  actionLabel: "Add new line"
}, {
  type: "work-order",
  title: "S1-455 Fibridge Commercial",
  badge: "Estimate",
  badgeType: "info",
  meta: ["Theresa Webb", "·", "Apr 16, 2026"],
  actionLabel: "Add new line"
}, {
  type: "work-order",
  title: "S1-431 Fibrook Supply",
  badge: "Invoiced",
  badgeType: "neutral",
  meta: ["Esther Howard", "·", "Apr 09, 2026"],
  actionLabel: "Add new line"
}, {
  type: "work-order",
  title: "S1-402 Fibridge Mining",
  badge: "Estimate",
  badgeType: "info",
  meta: ["Floyd Miles", "·", "Apr 02, 2026"],
  actionLabel: "Add new line"
}, {
  type: "customer",
  title: "Fibridge Commercial",
  badge: "12",
  badgeType: "neutral",
  badgeIcon: ICO.woBadge,
  meta: "923 Ross Islands, X1T 2B1",
  metaIcon: false,
  actionLabel: "New work order"
}, {
  type: "customer",
  title: "Fibrook Equipment",
  badge: "8",
  badgeType: "neutral",
  badgeIcon: ICO.woBadge,
  meta: "418 Delta Road, X1T 4C8",
  metaIcon: false,
  actionLabel: "New work order"
}, {
  type: "contact",
  title: "Dana Fibridge",
  meta: ["Fibridge Commercial", "·", "(780) 555-0142"],
  metaIcon: false,
  actionLabel: "New work order"
}, {
  type: "contact",
  title: "Marcus Reid",
  meta: ["Fibridge Commercial", "·", "(780) 555-0198"],
  metaIcon: false,
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
  actionLabel: "Add to work order"
}, {
  type: "part",
  title: "Rear Shock",
  badge: "12",
  badgeType: "warning",
  meta: "45836",
  metaIcon: false,
  actionLabel: "Add to work order"
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
    meta: ["James Smith", "·", "Apr 27, 2026"],
    actionLabel: "Add new line"
  }, {
    type: "work-order",
    title: "S1-644 Bosquare Excavating",
    badge: "Estimate",
    badgeType: "info",
    meta: ["James Smith", "·", "Apr 27, 2026"]
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
    type: "contact",
    title: "Dana Fibridge",
    meta: ["Fibridge Commercial", "·", "(780) 555-0142"],
    metaIcon: false,
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
    actionLabel: "Add to work order"
  }]
}];
function matches(item, q) {
  const hay = [item.title].concat(Array.isArray(item.meta) ? item.meta : [item.meta || ""]).join(" ").toLowerCase();
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
  const groups = useMemo(() => {
    if (!hasQuery) return [];
    return SECTIONS.filter(sec => activeTab === "All" || sec.tab === activeTab).map(sec => {
      const all = SEARCH_DATA.filter(d => d.type === sec.type && matches(d, q));
      const capped = activeTab === "All" && all.length > maxPerSection;
      return {
        ...sec,
        total: all.length,
        items: capped ? all.slice(0, maxPerSection) : all
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
  }, "Type to start searching for work orders, parts, customers and more"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      flexWrap: "wrap",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(SecondaryBtn, {
    label: "New work order"
  }), /*#__PURE__*/React.createElement(SecondaryBtn, {
    label: "New customer"
  }), /*#__PURE__*/React.createElement(SecondaryBtn, {
    label: "New inventory part"
  }))), !hasQuery && recentGroups.map(g => /*#__PURE__*/React.createElement(React.Fragment, {
    key: g.label
  }, /*#__PURE__*/React.createElement(TimeLabel, {
    label: g.label,
    action: g === recentGroups[0] ? "Clear all" : null,
    onAction: () => setCleared(true)
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
    action: g.total > g.items.length ? "Show all " + g.total : null,
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
  }, "\u201C", q, "\u201D"), activeTab !== "All" && /*#__PURE__*/React.createElement("span", null, " in ", activeTab)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      flexWrap: "wrap",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(SecondaryBtn, {
    label: "New work order"
  }), /*#__PURE__*/React.createElement(SecondaryBtn, {
    label: "New customer"
  }), /*#__PURE__*/React.createElement(SecondaryBtn, {
    label: "New inventory part"
  }))), showAI && hasQuery && /*#__PURE__*/React.createElement("div", {
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
window.SVGlobalSearchModalFix = window.GlobalSearchModal;
}
// Wait until the bundle has fully run (SVIcons comes from its filter-chip.jsx section,
// DEFAULT_COLUMNS from columns-dropdown.jsx) so re-registration always lands last.
(function poll() {
  if (window.SVIcons && window.DEFAULT_COLUMNS && window.svIcon && window.ShopviewDesignSystem_fac6ef) { run(); }
  else { setTimeout(poll, 30); }
})();
})();
