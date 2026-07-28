// Filter dropdown panel — opens below a chip. Search input + scrollable checkbox list + "Clear selection".
// Matches Figma /Filters/Customer-v1 + /Filters/Customer-v1-selected.

function Checkbox({ checked, partial }) {
  return (
    <span style={{
      width: 16, height: 16, flex: "none", borderRadius: 4,
      border: `1px solid ${checked ? "var(--sv-primary-500)" : "var(--sv-grey-300)"}`,
      background: checked ? "var(--sv-primary-50)" : "var(--sv-surface)",
      color: "var(--sv-primary-500)",
      display: "grid", placeItems: "center",
      transition: "all 120ms ease-out",
    }}>
      {checked && SVIcons.ICON_CHECK}
    </span>
  );
}

function PanelSearch({ value, onChange, placeholder = "Search customer", autoFocus }) {
  const [focused, setFocused] = React.useState(autoFocus);
  return (
    <div style={{ padding: "12px 12px 8px 12px" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        height: 40, padding: "0 12px",
        borderRadius: 8,
        background: "var(--sv-grey-50)",
        border: `${focused ? 2 : 1}px solid ${focused ? "var(--sv-primary-500)" : "var(--sv-grey-200)"}`,
        boxShadow: focused ? "0 0 0 4px rgba(37,124,255,0.18)" : "none",
        transition: "all 120ms ease-out",
      }}>
        <span style={{ color: focused ? "var(--sv-primary-500)" : "var(--sv-grey-500)", display: "grid", placeItems: "center" }}>{SVIcons.ICON_SEARCH}</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            border: "none", outline: "none", background: "transparent",
            flex: 1, height: 36,
            fontFamily: "var(--sv-font-ui)", fontWeight: 500, fontSize: 14, lineHeight: "20px",
            color: "var(--sv-grey-900)",
          }}/>
      </div>
    </div>
  );
}

// Variant A — multi-select with checkboxes + plain search
function FilterDropdown({ title = "Customer", options, value, onChange, onClear, width = 320, withSearch = true, withFooter = true }) {
  const [q, setQ] = React.useState("");
  const filtered = options.filter(o => o.toLowerCase().includes(q.toLowerCase()));
  const toggle = (o) => {
    const s = new Set(value);
    s.has(o) ? s.delete(o) : s.add(o);
    onChange(Array.from(s));
  };

  return (
    <div style={{
      width,
      background: "var(--sv-surface-overlay)",
      borderRadius: 12,
      border: "1px solid var(--sv-grey-200)",
      boxShadow: "var(--sv-shadow-lg)",
      overflow: "hidden",
      fontFamily: "var(--sv-font-ui)",
    }}>
      {withSearch && <PanelSearch value={q} onChange={setQ} placeholder={`Search ${title.toLowerCase()}`} autoFocus />}
      <div style={{ maxHeight: 320, overflow: "auto", padding: "4px 0 8px" }}>
        {filtered.map((o) => {
          const checked = value.includes(o);
          return (
            <label key={o} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 16px", cursor: "pointer",
              fontFamily: "var(--sv-font-ui)", fontWeight: 500, fontSize: 14, lineHeight: "20px",
              color: "var(--sv-grey-900)",
              transition: "background-color 100ms ease-out",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--sv-grey-50)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
              <input type="checkbox" checked={checked} onChange={() => toggle(o)} style={{ position: "absolute", opacity: 0, pointerEvents: "none" }} />
              <Checkbox checked={checked} />
              <span>{o}</span>
            </label>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ padding: "20px 16px", color: "var(--sv-grey-500)", fontSize: 14 }}>No matches</div>
        )}
      </div>
      {withFooter && (
        <div style={{
          borderTop: "1px solid var(--sv-grey-200)",
          padding: "12px 16px",
        }}>
          <button onClick={onClear} style={{
            all: "unset", cursor: "pointer",
            color: "var(--sv-grey-700)",
            fontFamily: "var(--sv-font-ui)", fontWeight: 500, fontSize: 14, lineHeight: "20px",
          }}>Clear selection</button>
        </div>
      )}
    </div>
  );
}

// Variant B — selected/with-pills search input at top (chips inline in the search box)
function FilterDropdownWithPills({ title = "Customer", options, value, onChange, onClear, width = 320 }) {
  const [q, setQ] = React.useState("");
  const filtered = options.filter(o => o.toLowerCase().includes(q.toLowerCase()));
  const toggle = (o) => {
    const s = new Set(value);
    s.has(o) ? s.delete(o) : s.add(o);
    onChange(Array.from(s));
  };

  return (
    <div style={{
      width,
      background: "var(--sv-surface-overlay)",
      borderRadius: 12,
      border: "1px solid var(--sv-grey-200)",
      boxShadow: "var(--sv-shadow-lg)",
      overflow: "hidden",
      fontFamily: "var(--sv-font-ui)",
    }}>
      <div style={{ padding: "12px 12px 8px" }}>
        <div style={{
          position: "relative",
          display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6,
          minHeight: 40, padding: "6px 36px 6px 10px",
          borderRadius: 8,
          background: "var(--sv-grey-50)",
          border: "2px solid var(--sv-primary-500)",
          boxShadow: "0 0 0 4px rgba(37,124,255,0.18)",
        }}>
          {value.map((v) => (
            <span key={v} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              height: 24, padding: "0 4px 0 8px",
              borderRadius: 6, background: "var(--sv-primary-100)",
              border: "1px solid transparent",
              fontWeight: 500, fontSize: 13, lineHeight: "20px",
              color: "var(--sv-primary-500)",
              maxWidth: 200,
            }}>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v}</span>
              <button onClick={() => toggle(v)} style={{ all: "unset", cursor: "pointer", color: "var(--sv-primary-500)", display: "grid", placeItems: "center", padding: 2 }}>{SVIcons.ICON_X}</button>
            </span>
          ))}
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoFocus
            placeholder={value.length ? "" : `Search ${title.toLowerCase()}`}
            style={{
              border: "none", outline: "none", background: "transparent",
              flex: 1, minWidth: 60, height: 24,
              fontFamily: "var(--sv-font-ui)", fontWeight: 500, fontSize: 14, lineHeight: "20px",
              color: "var(--sv-grey-900)",
            }}/>
          <button onClick={onClear} style={{
            all: "unset", cursor: "pointer", color: "var(--sv-grey-500)",
            position: "absolute", right: 8, top: 8,
            width: 20, height: 20, display: "grid", placeItems: "center",
          }}>{SVIcons.ICON_XCIRCLE}</button>
        </div>
      </div>
      <div style={{ maxHeight: 320, overflow: "auto", padding: "4px 0 8px" }}>
        {filtered.map((o) => {
          const checked = value.includes(o);
          return (
            <label key={o} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 16px", cursor: "pointer",
              fontFamily: "var(--sv-font-ui)", fontWeight: 500, fontSize: 14, lineHeight: "20px",
              color: "var(--sv-grey-900)",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--sv-grey-50)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
              <Checkbox checked={checked} />
              <span onClick={() => toggle(o)} style={{ flex: 1 }}>{o}</span>
            </label>
          );
        })}
      </div>
      <div style={{ borderTop: "1px solid var(--sv-grey-200)", padding: "12px 16px" }}>
        <button onClick={onClear} style={{
          all: "unset", cursor: "pointer", color: "var(--sv-grey-700)",
          fontFamily: "var(--sv-font-ui)", fontWeight: 500, fontSize: 14, lineHeight: "20px",
        }}>Clear selection</button>
      </div>
    </div>
  );
}

// Simple single-select status list (for Status chip)
function StatusDropdown({ options, value, onChange, onClear, width = 240 }) {
  return (
    <div style={{
      width,
      background: "var(--sv-surface-overlay)", borderRadius: 12,
      border: "1px solid var(--sv-grey-200)",
      boxShadow: "var(--sv-shadow-lg)",
      overflow: "hidden", fontFamily: "var(--sv-font-ui)",
    }}>
      <div style={{ padding: "8px 0" }}>
        {options.map((o) => {
          const checked = value.includes(o);
          return (
            <label key={o} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 16px", cursor: "pointer",
              fontWeight: 500, fontSize: 14, lineHeight: "20px",
              color: "var(--sv-grey-900)",
            }}
            onClick={() => {
              const s = new Set(value);
              s.has(o) ? s.delete(o) : s.add(o);
              onChange(Array.from(s));
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--sv-grey-50)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
              <Checkbox checked={checked} />
              <span>{o}</span>
            </label>
          );
        })}
      </div>
      <div style={{ borderTop: "1px solid var(--sv-grey-200)", padding: "12px 16px" }}>
        <button onClick={onClear} style={{
          all: "unset", cursor: "pointer", color: "var(--sv-grey-700)",
          fontWeight: 500, fontSize: 14, lineHeight: "20px",
        }}>Clear selection</button>
      </div>
    </div>
  );
}

// Date Range dropdown — single-select preset list with optional custom date inputs
const DATE_PRESETS = ["Today", "Yesterday", "This week", "This month", "Last month", "This quarter", "This year", "Custom"];

function DateRangeDropdown({ value, onChange, onClear, width = 260 }) {
  const selected = value || null;
  const [customRange, setCustomRange] = React.useState("");
  const isCustom = selected === "Custom";

  const pick = (preset) => {
    onChange(preset === selected ? null : preset);
  };

  return (
    <div style={{
      width,
      background: "var(--sv-surface-overlay)", borderRadius: 12,
      border: "1px solid var(--sv-grey-200)",
      boxShadow: "var(--sv-shadow-lg)",
      overflow: "hidden", fontFamily: "var(--sv-font-ui)",
    }}>
      <div style={{ padding: "8px 0" }}>
        {DATE_PRESETS.map((p) => {
          const active = selected === p;
          return (
            <div key={p}>
              <label
                onClick={() => pick(p)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 16px", cursor: "pointer",
                  fontWeight: 500, fontSize: 14, lineHeight: "20px",
                  color: "var(--sv-grey-900)",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--sv-grey-50)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                <span style={{
                  width: 16, height: 16, flex: "none", borderRadius: "50%",
                  border: `${active ? 5 : 1}px solid ${active ? "var(--sv-primary-500)" : "var(--sv-grey-300)"}`,
                  background: "var(--sv-surface)",
                  transition: "all 120ms ease-out",
                }}></span>
                <span>{p}</span>
              </label>
              {p === "Custom" && isCustom && (
                <div style={{ padding: "4px 16px 12px 44px" }}>
                  <input type="text" placeholder="MM/DD/YYYY – MM/DD/YYYY"
                    value={customRange} onChange={(e) => setCustomRange(e.target.value)}
                    onFocus={(e) => e.currentTarget.style.borderColor = "var(--sv-primary-500)"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "var(--sv-grey-200)"}
                    style={{
                      width: "100%", height: 36, padding: "0 10px", borderRadius: 8,
                      border: "1px solid var(--sv-grey-200)", fontFamily: "var(--sv-font-ui)",
                      fontSize: 13, fontWeight: 500, color: "var(--sv-grey-900)",
                      outline: "none", transition: "border-color 120ms ease-out",
                    }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ borderTop: "1px solid var(--sv-grey-200)", padding: "12px 16px" }}>
        <button onClick={onClear} style={{
          all: "unset", cursor: "pointer", color: "var(--sv-grey-700)",
          fontWeight: 500, fontSize: 14, lineHeight: "20px",
        }}>Clear selection</button>
      </div>
    </div>
  );
}

window.FilterDropdown = FilterDropdown;
window.FilterDropdownWithPills = FilterDropdownWithPills;
window.StatusDropdown = StatusDropdown;
window.DateRangeDropdown = DateRangeDropdown;
window.DATE_PRESETS = DATE_PRESETS;
window.Checkbox = Checkbox;
