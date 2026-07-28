// Shopview Filter Chip — pill-style filter trigger that lives in a Filter Bar.
// States mirror the Figma source: Default, Hover, Selected (item picked), Empty‑selected (open + no items yet).

// SVG-file icons are rendered as CSS masks (not <img>) so they inherit currentColor.
const maskIcon = (src, size = 16) => (
  <span aria-hidden="true" style={{
    width: size, height: size, display: "block", flex: "none",
    backgroundColor: "currentColor",
    WebkitMaskImage: `url(${src})`, maskImage: `url(${src})`,
    WebkitMaskSize: "contain", maskSize: "contain",
    WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat",
    WebkitMaskPosition: "center", maskPosition: "center",
  }} />
);

const ICON_LOAD    = maskIcon("assets/icon-status.svg");
const ICON_USER    = maskIcon("assets/icon-customer.svg");
const ICON_WRENCH  = maskIcon("assets/icon-technician.svg");
const ICON_HEADSET = maskIcon("assets/icon-advisor.svg");
const ICON_TRUCK   = maskIcon("assets/icon-asset.svg");

const ICON_CHEVRON = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 7.5L10 12.5L15 7.5"/>
  </svg>
);

const ICON_XCIRCLE = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="6.667"/><path d="M10 6L6 10M6 6l4 4"/>
  </svg>
);

const ICON_X = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.5 3.5l-7 7M3.5 3.5l7 7"/>
  </svg>
);

const ICON_SEARCH = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9.167" cy="9.167" r="5.833"/><path d="M17.5 17.5l-4.167-4.167"/>
  </svg>
);

const ICON_CHECK = (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 3L4.5 8.5L2 6"/>
  </svg>
);

const ICON_BARS = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 4h10M3 8h10M3 12h10"/>
  </svg>
);

const ICON_BACK = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.5 5L7.5 10L12.5 15"/>
  </svg>
);

const ICON_CALENDAR = maskIcon("assets/icon-calendar.svg");

// Filter chip — exact figma spec:
// 28px tall pill, radius 100, padding 0 10px, gap 8px between children
// Default: transparent bg, icon #364152, label Inter 500/14 #364152, chevron 20px
// Hover: bg #EEF2F6 (grey-100)
// Selected: bg #D8ECFF (primary-100), text + icon #257CFF (primary-500), chevron shown
// Selected + hover: chevron fades out, X-circle fades in over it for clear action
function FilterChip({ icon, label, state = "default", onClick, hasValue = false, valueText, onClear, refEl }) {
  const [hovered, setHovered] = React.useState(false);

  const isSelected = state === "selected" || hasValue;
  const isHover = state === "hover" || hovered;
  const isOpen = state === "open";

  const bg =
    isSelected ? "var(--sv-primary-100)" :
    isHover || isOpen ? "var(--sv-grey-100)" : "transparent";

  const color = isSelected ? "var(--sv-primary-500)" : "var(--sv-grey-700)";

  // Whether to show the clear icon overlay (selected + hovering)
  const showClear = isSelected && hovered && onClear;

  return (
    <button
      ref={refEl}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
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
        transition: "background-color 120ms ease-out",
      }}>
      <span style={{ width: 16, height: 16, display: "grid", placeItems: "center", flex: "none", color }}>{icon}</span>
      <span>
        {hasValue && valueText
          ? <><span style={{ color: "var(--sv-primary-500)" }}>{label}: </span><span style={{ color: "var(--sv-primary-500)", fontWeight: "var(--sv-body-semibold-weight)" }}>{valueText}</span></>
          : label}
      </span>
      {/* Trailing icon: always chevron, but X-circle overlays it on hover when selected */}
      <span style={{ position: "relative", width: 20, height: 20, display: "grid", placeItems: "center", marginLeft: -4, flexShrink: 0 }}>
        {/* Chevron — always present, fades out on hover when selected */}
        <span style={{
          position: "absolute", inset: 0,
          display: "grid", placeItems: "center", color,
          opacity: showClear ? 0 : 1,
          transition: "opacity 140ms ease",
          pointerEvents: "none",
        }}>
          {ICON_CHEVRON}
        </span>
        {/* X-circle — only rendered when selected; fades in on hover */}
        {isSelected && onClear && (
          <span
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            style={{
              position: "absolute", inset: 0,
              display: "grid", placeItems: "center",
              color,
              opacity: showClear ? 1 : 0,
              transition: "opacity 140ms ease",
              cursor: "pointer",
            }}>
            {ICON_XCIRCLE}
          </span>
        )}
      </span>
    </button>
  );
}

window.FilterChip = FilterChip;
window.SVIcons = { ICON_LOAD, ICON_USER, ICON_WRENCH, ICON_HEADSET, ICON_TRUCK, ICON_CHEVRON, ICON_XCIRCLE, ICON_X, ICON_SEARCH, ICON_CHECK, ICON_BARS, ICON_BACK, ICON_CALENDAR };
