// Filter Bar — full toolbar context with table backdrop, plus interactive demo.

const CUSTOMERS = [
  "Transload Trucking", "Hard Rock Industries LLC", "RF Heavy", "Truck Zone",
  "1st Auto Parts Ltd", "Partmaster Ltd", "Auckland Motors Mitsubishi",
  "Dodson Autospares", "Texas Truck And Auto Parts", "Repco Grey Lynn",
  "Segedin Truck And Auto Pa…",
];
const STATUSES = ["Estimate", "Approved", "In progress", "Review", "Complete", "Invoiced", "Paid", "Declined", "Imported"];
const TECHS = ["Eleanor Pena", "Esther Howard", "Jenny Wilson", "Annette Black", "Leslie Alexander", "Floyd Miles", "Theresa Webb", "Ralph Edwards"];
const ADVISORS = ["Kathryn Murphy", "Kristin Watson", "Theresa Webb", "Eleanor Pena", "Jenny Wilson"];
const ASSETS = ["Yes", "No"];

// Mini stub of a Work Orders table so the filter bar sits in real context
function TableBackdrop() {
  const rows = [
    { id: "S3-8412", est: "Estimate", est_color: "ok", cust: "Transload Trucking", asset: "Freightliner M2", vin: "1FD0W5HY2EEA05499", adv: "Esther Howard", tech: "Esther Howard", lines: 12, total: "$13,408.17" },
    { id: "S3-3425", est: "Estimate", est_color: "ok", cust: "Hard Rock Industries LLC", asset: "—", vin: "1FD0W5HY2EEA05499", adv: "Theresa Webb", tech: "Ralph Edwards", lines: 14, total: "$2,321.53" },
    { id: "S3-8554", est: "Estimate", est_color: "ok", cust: "RF Heavy", asset: "—", vin: "1FD0W5HY2EEA05499", adv: "Ralph Edwards", tech: "Jenny Wilson", lines: 10, total: "$5,932.32" },
    { id: "S3-8423", est: "Estimate", est_color: "err", cust: "Truck Zone", asset: "—", vin: "1FD0W5HY2EEA05499", adv: "Annette Black", tech: "Leslie Alexander", lines: 5, total: "$48,013.11" },
    { id: "S3-9665", est: "Estimate", est_color: "ok", cust: "1st Auto Parts Ltd", asset: "—", vin: "1FD0W5HY2EEA05499", adv: "Jenny Wilson", tech: "Kristin Watson", lines: 3, total: "$15,182.32" },
    { id: "S3-1345", est: "Declined", est_color: "err", cust: "Partmaster Ltd", asset: "—", vin: "1FD0W5HY2EEA05499", adv: "Eleanor Pena", tech: "Esther Howard", lines: 2, total: "$13,199.51" },
    { id: "S3-5234", est: "Estimate", est_color: "ok", cust: "Auckland Motors Mitsubishi", asset: "—", vin: "1FD0W5HY2EEA05499", adv: "Leslie Alexander", tech: "Theresa Webb", lines: 12, total: "$10,075.14" },
    { id: "S3-9574", est: "Estimate", est_color: "err", cust: "Dodson Autospares", asset: "—", vin: "1FD0W5HY2EEA05499", adv: "Floyd Miles", tech: "Ralph Edwards", lines: 7, total: "$242,212.07" },
    { id: "S3-0937", est: "Estimate", est_color: "ok", cust: "Segedin Truck And Auto Pa…", asset: "—", vin: "1FD0W5HY2EEA05499", adv: "Kathryn Murphy", tech: "Annette Black", lines: 9, total: "$13,408.17" },
    { id: "S3-3456", est: "Declined", est_color: "err", cust: "Repco Grey Lynn", asset: "—", vin: "1FD0W5HY2EEA05499", adv: "Kristin Watson", tech: "Jenny Wilson", lines: 7, total: "$10,075.14" },
  ];
  const Th = ({ children, w }) => (
    <th style={{
      textAlign: "left", padding: "12px 16px", fontWeight: 500, fontSize: 12,
      color: "var(--sv-grey-500)", borderBottom: "1px solid var(--sv-grey-200)",
      whiteSpace: "nowrap", background: "var(--sv-surface)", width: w,
    }}>{children}</th>
  );
  const Td = ({ children, align }) => (
    <td style={{
      padding: "14px 16px", fontWeight: 500, fontSize: 14, color: "var(--sv-grey-900)",
      borderBottom: "1px solid var(--sv-grey-100)", textAlign: align || "left",
      whiteSpace: "nowrap",
    }}>{children}</td>
  );
  const [hoverRow, setHoverRow] = React.useState(null);
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--sv-font-ui)" }}>
      <thead>
        <tr>
          <Th w={56}>On Site</Th>
          <Th w={120}></Th>
          <Th>Number</Th>
          <Th>Customer</Th>
          <Th>Asset</Th>
          <Th>Unit</Th>
          <Th>VIN/Serial #</Th>
          <Th>Progress</Th>
          <Th>Service Advisor</Th>
          <Th>Lead Technician</Th>
          <Th>Lines</Th>
          <Th>Total Price</Th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}
            onMouseEnter={() => setHoverRow(i)}
            onMouseLeave={() => setHoverRow(null)}
            style={{ background: hoverRow === i ? "var(--sv-grey-50)" : "transparent", transition: "background-color 120ms ease-out" }}>
            <Td>
              <span style={{
                display: "inline-grid", placeItems: "center", width: 24, height: 24, borderRadius: 6,
                background: r.est_color === "err" ? "var(--sv-error-50)" : "var(--sv-success-50)",
                color: r.est_color === "err" ? "var(--sv-error-500)" : "var(--sv-success-600)",
              }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 1.333L1.333 4.667v3.333c0 3.682 2.985 6.667 6.667 6.667s6.667-2.985 6.667-6.667V4.667L8 1.333z"/>
                </svg>
              </span>
            </Td>
            <Td>
              <span style={{
                display: "inline-flex", alignItems: "center", height: 22, padding: "0 10px",
                borderRadius: 999, fontSize: 12, fontWeight: 600,
                background: r.est_color === "err"
                  ? (hoverRow === i ? "var(--sv-error-100)" : "var(--sv-error-50)")
                  : (hoverRow === i ? "var(--sv-primary-100)" : "var(--sv-primary-50)"),
                color: r.est_color === "err" ? "var(--sv-error-700)" : "var(--sv-primary-700)",
                border: `1px solid ${r.est_color === "err" ? "var(--sv-error-200)" : "var(--sv-primary-200)"}`,
                transition: "background-color 120ms ease-out",
                cursor: "pointer",
              }}>{r.est}</span>
            </Td>
            <Td>{r.id}</Td>
            <Td>{r.cust}</Td>
            <Td>{r.asset}</Td>
            <Td>—</Td>
            <Td><span style={{ color: "var(--sv-grey-500)" }}>{r.vin}</span></Td>
            <Td>
              <span style={{
                display: "inline-block", width: 64, height: 6, borderRadius: 999,
                background: "var(--sv-grey-100)", verticalAlign: "middle",
              }} />
              <span style={{ marginLeft: 8, color: "var(--sv-grey-500)", fontSize: 12 }}>0%</span>
            </Td>
            <Td>{r.adv}</Td>
            <Td>{r.tech}</Td>
            <Td>{r.lines}</Td>
            <Td>{r.total}</Td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Anchored popover wrapper
function Popover({ open, anchorRef, children, onClose, offset = 8 }) {
  const [pos, setPos] = React.useState(null);
  React.useLayoutEffect(() => {
    if (!open || !anchorRef.current) return;
    const r = anchorRef.current.getBoundingClientRect();
    const host = anchorRef.current.closest("[data-popover-host]");
    const h = host ? host.getBoundingClientRect() : { left: 0, top: 0 };
    setPos({ left: r.left - h.left, top: r.bottom - h.top + offset });
  }, [open]);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (anchorRef.current && anchorRef.current.contains(e.target)) return;
      const pop = document.getElementById("__open_popover");
      if (pop && pop.contains(e.target)) return;
      onClose && onClose();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, onClose]);
  if (!open || !pos) return null;
  return (
    <div id="__open_popover" style={{ position: "absolute", left: pos.left, top: pos.top, zIndex: 10 }}>
      {children}
    </div>
  );
}

// Top-level filter bar
function FilterBar({ filters, setFilters, allCleared = false }) {
  const [open, setOpen] = React.useState(null); // which filter id is open
  const statusRef = React.useRef(); const custRef = React.useRef();
  const techRef = React.useRef(); const advRef = React.useRef(); const assetRef = React.useRef();
  const dateRef = React.useRef();

  const setVal = (k, v) => setFilters({ ...filters, [k]: v });
  const valueText = (k, arr) => {
    if (k === "date") {
      if (!arr) return null;
      return arr; // date stores a string, not an array
    }
    if (!arr || arr.length === 0) return null;
    if (arr.length === 1) return arr[0];
    return `${arr[0]}, +${arr.length - 1}`;
  };

  const items = [
    { id: "status", icon: SVIcons.ICON_LOAD,    label: "Status",          ref: statusRef, list: STATUSES, panel: "status" },
    { id: "cust",   icon: SVIcons.ICON_USER,    label: "Customer",        ref: custRef,   list: CUSTOMERS, panel: "search" },
    { id: "tech",   icon: SVIcons.ICON_WRENCH,  label: "Lead Technician", ref: techRef,   list: TECHS,    panel: "search" },
    { id: "adv",    icon: SVIcons.ICON_HEADSET, label: "Service Advisor", ref: advRef,    list: ADVISORS, panel: "search" },
    { id: "asset",  icon: SVIcons.ICON_TRUCK,   label: "Asset on site",   ref: assetRef,  list: ASSETS,   panel: "status" },
    { id: "date",   icon: SVIcons.ICON_CALENDAR, label: "Date Range",     ref: dateRef,   list: null,     panel: "date" },
  ];
  const hasAny = Object.entries(filters).some(([k, v]) => k === "date" ? !!v : (v && v.length > 0));

  return (
    <div data-popover-host style={{ position: "relative", display: "flex", alignItems: "center", gap: 12, padding: "8px 24px", height: 60 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {items.map((it) => {
          const v = filters[it.id] || (it.panel === "date" ? null : []);
          const has = it.panel === "date" ? !!v : v.length > 0;
          return (
            <FilterChip
              key={it.id}
              refEl={it.ref}
              icon={it.icon}
              label={it.label}
              state={open === it.id ? "open" : "default"}
              hasValue={has}
              valueText={valueText(it.id, v)}
              onClick={() => setOpen(open === it.id ? null : it.id)}
              onClear={() => setVal(it.id, [])}
            />
          );
        })}
      </div>
      {hasAny && (
        <button onClick={() => { setFilters({}); setOpen(null); }} style={{
          all: "unset", cursor: "pointer",
          color: "var(--sv-primary-500)", fontWeight: 500, fontSize: 14, lineHeight: "20px",
          padding: "0 8px",
        }}>Clear filters</button>
      )}

      {items.map((it) => (
        <Popover key={it.id} open={open === it.id} anchorRef={it.ref} onClose={() => setOpen(null)}>
          {it.panel === "date" ? (
            <DateRangeDropdown value={filters[it.id] || null}
              onChange={(v) => setVal(it.id, v)}
              onClear={() => setVal(it.id, null)} />
          ) : it.panel === "status" ? (
            <StatusDropdown options={it.list} value={filters[it.id] || []}
              onChange={(v) => setVal(it.id, v)}
              onClear={() => setVal(it.id, [])} />
          ) : (
            <FilterDropdown title={it.label} options={it.list} value={filters[it.id] || []}
              onChange={(v) => setVal(it.id, v)}
              onClear={() => setVal(it.id, [])} />
          )}
        </Popover>
      ))}
    </div>
  );
}

// Shared-link notification banner — uses the DS inline-alert "info" vocabulary
// (info-fill / info-border / info-text), sized per spec: radius 12, padding 12/14.
const ICON_LINK = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);

function SharedLinkBanner({ onReset }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 14px", borderRadius: 12,
      background: "var(--sv-info-fill)",
      border: "1px solid var(--sv-info-border)",
      color: "var(--sv-info-text)",
      fontFamily: "var(--sv-font-ui)",
      fontSize: "var(--sv-body-size)",
      lineHeight: "var(--sv-body-lh)",
      fontWeight: "var(--sv-body-weight)",
    }}>
      <span style={{ display: "grid", placeItems: "center", flex: "none", color: "currentColor" }}>{ICON_LINK}</span>
      <span>Viewing a shared link - your own saved filters aren't applied</span>
      <button
        onClick={onReset}
        style={{
          all: "unset", cursor: "pointer", marginLeft: "auto", flex: "none",
          height: 32, padding: "0 14px", borderRadius: 8,
          border: "1px solid currentColor", color: "currentColor",
          background: "transparent",
          fontFamily: "var(--sv-font-ui)",
          fontSize: "var(--sv-body-size)",
          lineHeight: "var(--sv-body-lh)",
          fontWeight: "var(--sv-body-semibold-weight)",
          transition: "background-color 120ms ease-out",
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "var(--sv-info-border)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
        Back to my view
      </button>
    </div>
  );
}

// Full page chrome (header + tabs + filter bar + table)
function WorkOrdersPage({ initial = {}, frozenOpen = null, sharedLink = false }) {
  const [filters, setFilters] = React.useState(initial);

  return (
    <div style={{
      width: 1440, height: 900, overflow: "hidden",
      background: "var(--sv-surface)", fontFamily: "var(--sv-font-ui)",
      display: "flex", flexDirection: "column",
      border: "1px solid var(--sv-grey-200)",
    }}>
      {/* Header */}
      <div style={{
        height: 64, padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid var(--sv-grey-200)", flex: "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <img src="assets/symbol-primary.svg" alt="Shopview" style={{ width: 28, height: 28 }} />
          <nav style={{ display: "flex", gap: 4 }}>
            {["Work Orders", "Schedule", "Customers", "Parts", "Reports"].map((n, i) => (
              <span key={n} style={{
                padding: "8px 12px", borderRadius: 8,
                background: i === 0 ? "var(--sv-grey-100)" : "transparent",
                color: i === 0 ? "var(--sv-grey-900)" : "var(--sv-grey-500)",
                fontWeight: 500, fontSize: 14, cursor: "pointer",
              }}>{n}</span>
            ))}
          </nav>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          width: 360, height: 36, padding: "0 12px",
          background: "var(--sv-grey-50)", borderRadius: 8,
          border: "1px solid var(--sv-grey-200)",
        }}>
          <span style={{ color: "var(--sv-grey-500)" }}>{SVIcons.ICON_SEARCH}</span>
          <span style={{ flex: 1, color: "var(--sv-grey-500)", fontSize: 14 }}>Search</span>
          <span style={{ fontSize: 12, color: "var(--sv-grey-500)", padding: "2px 6px", border: "1px solid var(--sv-grey-200)", borderRadius: 4 }}>⌘ K</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: "var(--sv-grey-700)" }}>Heavy Duty</span>
          <span style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "var(--sv-primary-100)", color: "var(--sv-primary-700)",
            display: "grid", placeItems: "center", fontWeight: 600, fontSize: 13,
          }}>HD</span>
        </div>
      </div>

      {/* Tabs row */}
      <div style={{
        padding: "16px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flex: "none",
      }}>
        <nav style={{ display: "flex", gap: 4 }}>
          {["All", "Estimates", "Completed", "My Work Orders"].map((t, i) => (
            <span key={t} style={{
              padding: "8px 12px", borderRadius: 8,
              background: i === 0 ? "var(--sv-grey-100)" : "transparent",
              color: i === 0 ? "var(--sv-grey-900)" : "var(--sv-grey-500)",
              fontWeight: 500, fontSize: 14, cursor: "pointer",
            }}>{t}</span>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button title="Search" style={{
            all: "unset", cursor: "pointer", height: 36, padding: "0 12px",
            display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 8,
            color: "var(--sv-grey-700)", fontWeight: 500, fontSize: 14,
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "var(--sv-grey-100)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
            <img src="assets/icon-search.svg" width="20" height="20" alt="" />
            Search
          </button>
          <button title="Toggle filters" style={{
            all: "unset", cursor: "pointer", width: 36, height: 36,
            display: "grid", placeItems: "center", borderRadius: 8,
            background: "var(--sv-grey-100)",
          }}>
            <img src="assets/icon-filter-toggle.svg" width="20" height="20" alt="" />
          </button>
          <button title="Columns" style={{
            all: "unset", cursor: "pointer", width: 36, height: 36,
            display: "grid", placeItems: "center", borderRadius: 8,
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "var(--sv-grey-100)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
            <img src="assets/icon-columns.svg" width="20" height="20" alt="" />
          </button>
          <span style={{ width: 8 }} />
          <button style={{
            all: "unset", cursor: "pointer", height: 36, padding: "0 16px",
            borderRadius: 8, background: "var(--sv-primary-500)",
            color: "var(--sv-text-on-accent)", fontWeight: 600, fontSize: 14,
          }}>New Work Order</button>
        </div>
      </div>

      {sharedLink && (
        <div style={{ padding: "12px 24px 0", flex: "none" }}>
          <SharedLinkBanner onReset={() => setFilters({})} />
        </div>
      )}

      {/* Filter Bar */}
      <FilterBar filters={filters} setFilters={setFilters} />

      <div style={{ height: 1, background: "var(--sv-grey-200)", flex: "none" }} />

      {/* Table */}
      <div style={{ flex: 1, overflow: "auto", background: "var(--sv-surface)" }}>
        <TableBackdrop />
      </div>
    </div>
  );
}

window.WorkOrdersPage = WorkOrdersPage;
window.SharedLinkBanner = SharedLinkBanner;
window.FilterBar = FilterBar;
window.CUSTOMERS = CUSTOMERS;
window.STATUSES = STATUSES;
window.TECHS = TECHS;
window.ADVISORS = ADVISORS;
