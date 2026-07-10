// Purchase Order Details — receiving flow component.
// Depends on: React, ReactDOM, components.jsx (Icon). Exports window.PODetails + window.PO_DEMO.
const { useState, useRef, useEffect } = React;

// Vendors that already exist in the system (for the "Select Vendor" picker)
const SYSTEM_VENDORS = [
  'Achester Landscaping', 'Achester Logistics', 'Quimill Equipment',
  'Leview Ventures', 'Piplains Holdings', 'Juton Enterprises',
  'Qemoor Construction', 'Suport Supply', 'Oosquare Works',
];

// ── Select Vendor dropdown ──────────────────────────────────
function VendorSelect({ value, existingNames, onPick, defaultOpen = false }) {
  const { Icon } = window;
  const [open, setOpen] = useState(defaultOpen);
  const [q, setQ] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  const list = SYSTEM_VENDORS.filter(v => v.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="vendor-select" ref={ref}>
      <button className={`vendor-select-btn ${value ? 'assigned' : ''}`} onClick={() => setOpen(o => !o)}>
        {value && <span className="vsb-float">Select Vendor</span>}
        <span>{value || 'Select Vendor'}</span>
        <span className="chev"><Icon name="chevron-down" size={18} /></span>
      </button>
      {open && (
        <div className="vendor-menu">
          <div className="vendor-menu-search">
            <Icon name="search" size={16} style={{ color: 'var(--sv-fg-tertiary)' }} />
            <input autoFocus placeholder="Search vendors" value={q} onChange={e => setQ(e.target.value)} />
          </div>
          {list.map(name => (
            <div key={name} className="vendor-opt" onClick={() => { setOpen(false); onPick(name); }}>
              <span className="vo-ic"><Icon name="store" size={16} /></span>
              {name}
              {existingNames.includes(name) && <span className="vo-badge">On this PO</span>}
            </div>
          ))}
          {list.length === 0 && <div className="vendor-opt" style={{ color: 'var(--sv-fg-tertiary)' }}>No matches</div>}
        </div>
      )}
    </div>
  );
}

// ── Parts table + totals ────────────────────────────────────
function PartsTable({ parts, onToggle, onQty }) {
  const { Icon } = window;
  return (
    <table className="parts-tbl">
      <thead>
        <tr>
          <th className="cbx-cell"></th>
          <th>Part Number</th>
          <th>Description</th>
          <th>Cost</th>
          <th>Quantity Ordered</th>
          <th>Quantity Received</th>
          <th className="r">Total</th>
        </tr>
      </thead>
      <tbody>
        {parts.map((p, i) => (
          <tr key={i}>
            <td className="cbx-cell">
              <span className={`cbx ${p.selected ? 'checked' : ''}`} onClick={() => onToggle(i)}>
                {p.selected && <Icon name="check" size={13} stroke={3} style={{ color: '#fff' }} />}
              </span>
            </td>
            <td className="pn">{p.number || '—'}</td>
            <td className="desc">{p.desc}</td>
            <td className="cost">${Number(p.cost).toFixed(5)}</td>
            <td>{p.ordered}</td>
            <td>
              <input className="qty-recv" value={p.received}
                     onChange={e => onQty(i, e.target.value)} />
            </td>
            <td className="total-cell r">${(Number(p.cost) * Number(p.received || 0)).toFixed(2)}</td>
          </tr>
        ))}
        <tr className="subtotal-row">
          <td colSpan="6" className="tot-label">Subtotal:</td>
          <td className="tot-val r">
            ${parts.reduce((s, p) => s + Number(p.cost) * Number(p.received || 0), 0).toFixed(2)}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

// ── A single vendor block ───────────────────────────────────
function VendorBlock({ vendor, existingNames, onPickVendor, onToggle, onQty, openDropdown }) {
  const { Icon } = window;
  const subtotal = vendor.parts.reduce((s, p) => s + Number(p.cost) * Number(p.received || 0), 0);
  const tax = Number(vendor.tax || 0);
  const partsLabel = `${vendor.parts.length} ${vendor.parts.length === 1 ? 'part' : 'parts'}`;
  const anySelected = vendor.parts.some(p => p.selected);

  return (
    <section className="vendor-block">
      <div className="vb-head">
        {vendor.missing ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span className="vb-title missing">
              <span className="store-ic"><Icon name="store" size={20} /></span> Vendor Missing
            </span>
            <VendorSelect value={vendor.assignedName || ''} existingNames={existingNames}
                          onPick={(name) => onPickVendor(vendor.id, name)} defaultOpen={openDropdown} />
          </div>
        ) : (
          <span className="vb-title">
            <span className="store-ic"><Icon name="store" size={20} /></span> {vendor.name}
            {vendor.merged && <span className="merged-tag"><Icon name="git-merge" size={12} /> Merged</span>}
            {vendor.separate && <span className="merged-tag" style={{ color: 'var(--sv-grey-600)', background: 'var(--sv-grey-100)', borderColor: 'var(--sv-grey-200)' }}>Separate invoice</span>}
          </span>
        )}
        <span className="vb-count">{partsLabel}</span>
      </div>

      <div className="vb-body">
        <div className="invoice-row">
          <div className="field">
            <input placeholder="Invoice Number" defaultValue={vendor.invoice || ''} />
          </div>
          <div className="field has-label with-icon">
            <span className="field-float-label">Invoice Date</span>
            <input defaultValue={vendor.invoiceDate || '06/23/2026'} />
            <span className="field-ic"><Icon name="calendar" size={18} /></span>
          </div>
        </div>

        <h3 className="section-title">Receive Parts</h3>
        <PartsTable parts={vendor.parts}
                    onToggle={(i) => onToggle(vendor.id, i)}
                    onQty={(i, v) => onQty(vendor.id, i, v)} />

        <div className="totals-block">
          <div className="tot-line bordered">
            <span className="tot-label">Tax:</span>
            <div className="tax-input-wrap">
              <span className="tax-float">Tax</span>
              <span className="cur" style={{ top: 22 }}>$</span>
              <input className="tax-input" defaultValue={tax.toFixed(2)} />
            </div>
          </div>
          <div className="tot-line">
            <span className="tot-label">Total:</span>
            <span className="tot-val" style={{ minWidth: 80 }}>${(subtotal + tax).toFixed(2)}</span>
          </div>
        </div>

        <div className="delivery">
          <h3>Delivery note</h3>
          <textarea placeholder="Delivery Note"></textarea>
        </div>

        <div className="vb-actions">
          <button className="receive-btn" disabled={!anySelected || vendor.missing}>Receive</button>
        </div>
      </div>
    </section>
  );
}

// ── Top-level page (sidebar + vendor blocks + merge modal) ──
function PODetails({ data, openDropdownVendorId = null, forceMerge = null, contained = false }) {
  const { Icon } = window;
  const [po, setPo] = useState(data);
  // forceMerge = { fromId, targetName } to render the modal open (canvas screens)
  const [merge, setMerge] = useState(forceMerge);

  // vendor blocks: missing-vendor blocks always sort last
  const ordered = [...po.vendors].sort((a, b) => (a.missing === b.missing) ? 0 : a.missing ? 1 : -1);
  const existingNames = po.vendors.filter(v => !v.missing).map(v => v.name);

  const mutate = (fn) => setPo(prev => {
    const next = { ...prev, vendors: prev.vendors.map(v => ({ ...v, parts: v.parts.map(p => ({ ...p })) })) };
    fn(next);
    return next;
  });

  const onToggle = (vid, i) => mutate(n => { const v = n.vendors.find(x => x.id === vid); v.parts[i].selected = !v.parts[i].selected; });
  const onQty = (vid, i, val) => mutate(n => { const v = n.vendors.find(x => x.id === vid); v.parts[i].received = val.replace(/[^0-9.]/g, ''); });

  const onPickVendor = (vid, name) => {
    // if the chosen vendor already has a block on this PO → ask to merge
    if (existingNames.includes(name)) {
      setMerge({ fromId: vid, targetName: name });
      // tentatively show the assigned name on the dropdown
      mutate(n => { n.vendors.find(x => x.id === vid).assignedName = name; });
    } else {
      // brand-new vendor for this PO → assign in place
      mutate(n => { const v = n.vendors.find(x => x.id === vid); v.assignedName = name; v.name = name; v.missing = false; });
    }
  };

  const doMerge = () => {
    mutate(n => {
      const from = n.vendors.find(x => x.id === merge.fromId);
      const target = n.vendors.find(x => !x.missing && x.name === merge.targetName);
      target.parts = [...target.parts, ...from.parts];
      target.merged = true;
      n.vendors = n.vendors.filter(x => x.id !== merge.fromId);
    });
    setMerge(null);
  };

  const keepSeparate = () => {
    // becomes its own named block (separate invoice), no longer "missing"
    mutate(n => { const v = n.vendors.find(x => x.id === merge.fromId); v.name = merge.targetName; v.missing = false; v.separate = true; });
    setMerge(null);
  };

  return (
    <div>
      <div className="po-page">
        <aside className="po-aside">
          <h2>Purchase Order Details</h2>
          <div className="aside-row">
            <div className="aside-label">Work Order Number</div>
            <a href="#" className="aside-link">{po.workOrder} <Icon name="external-link" size={14} /></a>
          </div>
          <div className="aside-row">
            <div className="aside-label">Date Ordered</div>
            <div className="aside-value">{po.dateOrdered}</div>
          </div>
          <div className="aside-row">
            <div className="aside-label">Vendor</div>
            <div className="aside-value">
              {po.vendors.map((v, i) => <div key={i}>{v.missing ? (v.assignedName || 'Vendor Missing') : v.name}</div>)}
            </div>
          </div>
          <div className="aside-row">
            <div className="aside-label">Ordered By</div>
            <div className="aside-value">{po.orderedBy}</div>
          </div>
          <div className="aside-row">
            <div className="aside-label">Note</div>
            <div className="aside-value">{po.note || '—'}</div>
          </div>
        </aside>

        <main className="po-main">
          {ordered.map(v => (
            <VendorBlock key={v.id} vendor={v} existingNames={existingNames}
                         onPickVendor={onPickVendor} onToggle={onToggle} onQty={onQty}
                         openDropdown={openDropdownVendorId === v.id} />
          ))}
        </main>
      </div>

      {merge && (
        <div className={`modal-backdrop ${contained ? 'contained' : ''}`} onClick={(e) => { if (e.target.classList.contains('modal-backdrop')) setMerge(null); }}>
          <div className="modal-card">
            <div className="modal-icon"><Icon name="git-merge" size={24} /></div>
            <h3 className="modal-title">Add to {merge.targetName}?</h3>
            <p className="modal-body">These items will be added to the existing <b>{merge.targetName}</b> section and can be received together.</p>
            <div className="modal-actions">
              <button className="modal-link" onClick={keepSeparate}>No, Keep Separate</button>
              <button className="modal-btn" onClick={doMerge}>Yes, Merge</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

window.PODetails = PODetails;
window.SYSTEM_VENDORS = SYSTEM_VENDORS;
