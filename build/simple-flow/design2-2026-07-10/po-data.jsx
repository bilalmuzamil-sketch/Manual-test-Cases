// Demo PO scenarios for the receiving flow. Exports window.PO_SCENARIOS.
window.PO_SCENARIOS = {
  // Multiple vendors + one Vendor Missing (matches the reference screenshots)
  multi: {
    workOrder: 'S2-15735', dateOrdered: 'Jun 11, 2026', orderedBy: 'Admin ShopView', note: '—',
    vendors: [
      { id: 'v1', name: 'Achester Logistics', invoice: '', tax: 0, parts: [
        { number: '4--PET-10', desc: '(SS HOSE CLAMP (3/4" - 1-1/6"), 1/2" WIDE)', cost: 0, ordered: 10, received: 10, selected: true },
      ]},
      { id: 'v2', name: 'Achester Landscaping', invoice: '', tax: 0, parts: [
        { number: '4--N66-HYD003', desc: '#04 - #12 STEEL NPT JUMP SIZE HYD ADAPTER ASSORTMENT', cost: 0, ordered: 2, received: 2, selected: true },
      ]},
      { id: 'vm', missing: true, invoice: '', tax: 0, parts: [
        { number: '', desc: 'Testing the flow', cost: 0, ordered: 2, received: 2, selected: true },
      ]},
    ],
  },

  // Single vendor (simplest edge case)
  single: {
    workOrder: 'S2-15614', dateOrdered: 'Jun 4, 2026', orderedBy: 'Kayla Ford', note: '—',
    vendors: [
      { id: 'v1', name: 'Quimill Equipment', invoice: '', tax: 0, parts: [
        { number: 'DC-9981', desc: 'Drive Coupler', cost: 64.00, ordered: 1, received: 1, selected: true },
        { number: 'BA-3320', desc: 'Bearing Assembly', cost: 24.00, ordered: 2, received: 2, selected: true },
      ]},
    ],
  },

  // Single Vendor Missing only (no named vendors on the PO)
  missingOnly: {
    workOrder: 'S2-15741', dateOrdered: 'Jun 18, 2026', orderedBy: 'Admin ShopView', note: '—',
    vendors: [
      { id: 'vm', missing: true, invoice: '', tax: 0, parts: [
        { number: '7092', desc: 'Spark Plugs (Set of 4)', cost: 0, ordered: 1, received: 1, selected: true },
        { number: 'IC-3380', desc: 'Ignition Coil', cost: 0, ordered: 2, received: 2, selected: true },
      ]},
    ],
  },

  // Outcome A — "Yes, Merge": missing items folded into existing Achester Landscaping
  merged: {
    workOrder: 'S2-15735', dateOrdered: 'Jun 11, 2026', orderedBy: 'Admin ShopView', note: '—',
    vendors: [
      { id: 'v1', name: 'Achester Logistics', invoice: '', tax: 0, parts: [
        { number: '4--PET-10', desc: '(SS HOSE CLAMP (3/4" - 1-1/6"), 1/2" WIDE)', cost: 0, ordered: 10, received: 10, selected: true },
      ]},
      { id: 'v2', name: 'Achester Landscaping', invoice: '', tax: 0, merged: true, parts: [
        { number: '4--N66-HYD003', desc: '#04 - #12 STEEL NPT JUMP SIZE HYD ADAPTER ASSORTMENT', cost: 0, ordered: 2, received: 2, selected: true },
        { number: '', desc: 'Testing the flow', cost: 0, ordered: 2, received: 2, selected: true },
      ]},
    ],
  },

  // Outcome B — "No, Keep Separate": items become their own Achester Landscaping section
  // (distinct invoice) — note two separate Achester Landscaping blocks now exist.
  separate: {
    workOrder: 'S2-15735', dateOrdered: 'Jun 11, 2026', orderedBy: 'Admin ShopView', note: '—',
    vendors: [
      { id: 'v1', name: 'Achester Logistics', invoice: '', tax: 0, parts: [
        { number: '4--PET-10', desc: '(SS HOSE CLAMP (3/4" - 1-1/6"), 1/2" WIDE)', cost: 0, ordered: 10, received: 10, selected: true },
      ]},
      { id: 'v2', name: 'Achester Landscaping', invoice: 'AL-3391', tax: 0, parts: [
        { number: '4--N66-HYD003', desc: '#04 - #12 STEEL NPT JUMP SIZE HYD ADAPTER ASSORTMENT', cost: 0, ordered: 2, received: 2, selected: true },
      ]},
      { id: 'v3', name: 'Achester Landscaping', invoice: '', tax: 0, separate: true, parts: [
        { number: '', desc: 'Testing the flow', cost: 0, ordered: 2, received: 2, selected: true },
      ]},
    ],
  },
};
