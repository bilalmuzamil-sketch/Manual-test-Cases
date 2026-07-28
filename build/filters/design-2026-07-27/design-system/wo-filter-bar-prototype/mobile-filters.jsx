// Mobile All Filters bottom sheet — matches /Filters/Mobile (Apply filters CTA at bottom).
function MobileFilters({ onClose }) {
  const sections = [
    { icon: SVIcons.ICON_LOAD, label: "Status", value: null },
    { icon: SVIcons.ICON_USER, label: "Customer", value: null },
    { icon: SVIcons.ICON_WRENCH, label: "Lead Technician", value: null },
    { icon: SVIcons.ICON_HEADSET, label: "Service Advisor", value: null },
    { icon: SVIcons.ICON_TRUCK, label: "Asset on site", value: null },
  ];
  return (
    <div style={{
      width: 402, height: 720,
      background: "var(--sv-surface-overlay)",
      display: "flex", flexDirection: "column",
      fontFamily: "var(--sv-font-ui)",
      borderRadius: 12, overflow: "hidden",
      border: "1px solid var(--sv-grey-200)",
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 16px 12px 16px",
        borderBottom: "1px solid var(--sv-grey-100)",
      }}>
        <span style={{ fontWeight: 600, fontSize: 16, color: "var(--sv-grey-900)" }}>All Filters</span>
        <button onClick={onClose} style={{ all: "unset", cursor: "pointer", color: "var(--sv-grey-500)", padding: 4 }}>{SVIcons.ICON_X}</button>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: "8px 16px" }}>
        {sections.map((s, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 4px",
            borderBottom: i === sections.length - 1 ? "none" : "1px solid var(--sv-grey-100)",
          }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 10, color: "var(--sv-grey-700)", fontWeight: 500, fontSize: 14 }}>
              <span style={{ color: "var(--sv-grey-500)" }}>{s.icon}</span>
              {s.label}
            </span>
            <span style={{ color: "var(--sv-grey-400)", transform: "rotate(-90deg)" }}>{SVIcons.ICON_CHEVRON}</span>
          </div>
        ))}
      </div>
      <div style={{ padding: 16, borderTop: "1px solid var(--sv-grey-100)" }}>
        <button style={{
          all: "unset", cursor: "pointer",
          width: "100%", height: 44, display: "grid", placeItems: "center",
          borderRadius: 8, background: "var(--sv-primary-500)",
          color: "var(--sv-text-on-accent)", fontWeight: 600, fontSize: 14,
        }}>Apply filters</button>
      </div>
    </div>
  );
}

window.MobileFilters = MobileFilters;
