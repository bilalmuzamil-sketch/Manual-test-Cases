/*
 * Custom Roles & Permissions Evolution Tracker — the comparison engine.
 *
 * ONE implementation, used by BOTH the browser portal and the command-line Track Changes tool
 * (node tools/engine/cli.js a.json b.json), so what QA sees and what gets recorded can never
 * disagree.
 *
 * It compares MEANING, never text: two snapshots are normalised into
 *   roles · permissions · role defaults · dependencies · back-end enforcement · front-end use
 * and only differences in those are reported. A comment edit, a re-ordered list or a moved line
 * produces no change. Every change carries its evidence, a risk with its reason, the affected
 * roles and workflows, and SUGGESTED QA scenarios (suggestions, not proof).
 *
 * Works for any pair: PRD vs PRD, PRD vs implementation, implementation vs implementation.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CRPEngine = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const CRUD_AREAS = ['workOrders', 'schedule', 'customers', 'partSales', 'catalogInventory',
    'vendorOrderManagement', 'invoicingPayments'];
  const PARTS_CHILDREN = ['partSales', 'catalogInventory', 'vendorOrderManagement'];
  const SETTINGS_PREFIX = 'settings';
  const SENSITIVE = /Delete|^see|^settings|^accounting|^hr|Wages|invoicing|billingPortal|woReceivedLater/;

  const uniq = (xs) => Array.from(new Set(xs));
  const sortU = (xs) => uniq(xs).sort();
  const minus = (a, b) => { const s = new Set(b); return a.filter((x) => !s.has(x)); };

  // ── normalisation ────────────────────────────────────────────────────────────────────────────
  /** A role's key in the shared vocabulary: the implementation template slug. PRD roles map onto
   * it through the PRD snapshot's own impl_role field; a PRD role with no counterpart keeps a
   * "prd:" key so it is reported, never silently dropped. */
  function roleKey(snap, r) {
    if (snap.kind === 'implementation') return r.key;
    return r.impl_role || ('prd:' + r.key);
  }

  function normalise(snap) {
    const m = { kind: snap.kind, roles: {}, perms: {}, defaults: {}, coverage: null, deps: {},
      enforcement: null, meta: snap };
    const prdToKey = {};
    (snap.roles || []).forEach((r) => {
      const k = roleKey(snap, r);
      prdToKey[r.key] = k;
      m.roles[k] = { key: k, name: r.name, editable: r.editable_when_system, deletable: r.deletable_when_system,
        clock: r.clock_capable, description: r.description_verbatim || null, source_key: r.key };
    });
    (snap.permissions || []).forEach((p) => {
      m.perms[p.key] = { key: p.key, label: p.label, group: p.group || null, prdOnly: !!p.prd_only,
        controls: p.controls_verbatim || null, section: p.prd_section || null, codeComment: p.code_comment || null,
        keyEvidence: p.key_mapping_evidence || null };
    });
    Object.entries(snap.role_defaults || {}).forEach(([r, codes]) => {
      m.defaults[prdToKey[r] || r] = new Set(codes);
    });
    if (snap.kind === 'prd') {
      // which cells the PRD actually STATES (absent row != OFF)
      m.coverage = {};
      Object.entries(snap.matrix_coverage || {}).forEach(([perm, roles]) => {
        m.coverage[perm] = new Set(roles.map((r) => prdToKey[r] || r));
      });
    } else {
      // The PRD's parent gates are not stored permissions in code; derive them so the two sides
      // can be compared, and mark them as derived.
      Object.entries(m.defaults).forEach(([r, set]) => {
        if ([...set].some((c) => PARTS_CHILDREN.some((a) => c.startsWith(a)))) set.add('partsDepartment');
        if ([...set].some((c) => c.startsWith(SETTINGS_PREFIX))) set.add('settings');
      });
      m.perms.partsDepartment = { key: 'partsDepartment', label: 'Parts Department (derived: holds any Parts area)',
        group: 'Page access', derived: true };
      m.perms.settings = { key: 'settings', label: 'Settings (derived: holds any settings sub-setting)',
        group: 'Settings', derived: true };
      m.enforcement = {
        atoms: {}, beChecks: {}, fe: {}, endpoints: {}, feLogic: snap.fe_dependency_logic || null,
        officeEditable: new Set((snap.permissions || []).filter((p) => p.office_editable).map((p) => p.key)),
        outside: {},
      };
      (snap.permissions || []).forEach((p) => {
        m.enforcement.atoms[p.key] = sortU(p.atoms || []);
        m.enforcement.beChecks[p.key] = sortU(p.backend_bundle_checks || []);
        m.enforcement.fe[p.key] = sortU(p.fe_references || []);
        if (p.enforced_outside_repo) m.enforcement.outside[p.key] = p.enforced_outside_repo;
      });
      (snap.endpoints || []).forEach((e) => {
        m.enforcement.endpoints[e.id] = { atoms: sortU(e.atoms || []), bundles: sortU(e.bundles || []),
          controller: e.controller, guarded: (e.guards || []).length > 0,
          expr: (e.guards || []).map((g) => g.where + ': ' + g.expression).join(' AND ') };
      });
    }
    (snap.dependencies || []).forEach((d) => {
      m.deps[d.child + '→' + d.parent] = { child: d.child, parent: d.parent, kind: d.kind,
        quote: d.quote || null, enforcedBy: d.enforced_by || null };
    });
    return m;
  }

  // ── helpers for reports ──────────────────────────────────────────────────────────────────────
  function labelOf(A, B, k) {
    return ((B.perms[k] || A.perms[k] || {}).label) || k;
  }
  function roleName(A, B, r) {
    return ((B.roles[r] || A.roles[r] || {}).name) || r;
  }
  function workflowsFor(A, B, k) {
    const out = [];
    const p = B.perms[k] || A.perms[k] || {};
    if (p.group) out.push(p.group);
    if (p.controls) out.push('PRD: ' + p.controls.slice(0, 160) + (p.controls.length > 160 ? '…' : ''));
    const enf = B.enforcement || A.enforcement;
    if (enf) {
      const atoms = enf.atoms[k] || [];
      const eps = Object.entries(enf.endpoints).filter(([, e]) => e.atoms.some((a) => atoms.includes(a)) || e.bundles.includes(k))
        .map(([id]) => id);
      const areas = sortU(eps.map((id) => (id.split(' ')[1] || '').split('/').slice(0, 3).join('/')));
      if (areas.length) out.push('API areas: ' + areas.slice(0, 8).join(', ') + (areas.length > 8 ? ` (+${areas.length - 8} more)` : ''));
      const screens = sortU((enf.fe[k] || []).map((f) => f.replace(/^app\/src\//, '').split('/').slice(0, 4).join('/')));
      if (screens.length) out.push('Screens/code: ' + screens.slice(0, 6).join(', ') + (screens.length > 6 ? ` (+${screens.length - 6} more)` : ''));
    }
    return out;
  }

  function scenarios(type, ctx) {
    const P = ctx.label, R = ctx.roleName || 'the affected role';
    const s = [];
    switch (type) {
      case 'default_changed':
        s.push(`Positive: sign in as a user on the system role "${R}" (no edits to the role) and confirm "${P}" is ${ctx.after ? 'available' : 'NOT available'} where the permission applies.`);
        s.push(`Role editor: open Administration › Roles and Permissions › "${R}" and confirm "${P}" is shown ${ctx.after ? 'ticked' : 'unticked'} by default.`);
        s.push(`Cross-role: confirm the change did not alter "${P}" for any other system role.`);
        s.push(`API: call an endpoint guarded by "${P}" as that role and confirm ${ctx.after ? '2xx' : '403'} (front end hiding is not enough).`);
        s.push('Existing roles: a role created BEFORE this release keeps its stored set until edited (server does not retro-normalise) — check one.');
        break;
      case 'permission_added':
        s.push(`Role editor: "${P}" appears in the right section with the right label, OFF for custom roles unless the template grants it.`);
        s.push(`Positive: a role WITH "${P}" can perform the action; negative: a role WITHOUT it cannot (UI hidden AND API 403).`);
        s.push(`Dependency: ticking "${P}" auto-ticks its required parents; unticking a parent clears it.`);
        s.push('Defaults: check every system role holds or lacks it exactly as the change report lists.');
        break;
      case 'permission_removed':
        s.push(`Role editor: "${P}" no longer appears; roles that held it still open and save without error.`);
        s.push(`Regression: the capability "${P}" used to control is now governed by its replacement — confirm no role silently gained or lost access.`);
        s.push('API: endpoints that checked it still enforce something — none became unguarded.');
        break;
      case 'dependency_changed':
        s.push(`Role editor: ${ctx.after ? 'ticking' : 'with the change, ticking'} "${ctx.childLabel}" ${ctx.after ? 'now auto-ticks' : 'no longer auto-ticks'} "${ctx.parentLabel}".`);
        s.push('API (bypassing the editor): create a role with only the child permission via the role API and confirm what the server stores.');
        s.push('Negative: unticking the parent clears the child.');
        break;
      case 'backend_enforcement_changed':
        s.push(`API authorisation: call ${ctx.endpoint || 'the affected endpoint(s)'} as a role WITH and a role WITHOUT "${P}" — expect 2xx and 403.`);
        s.push('Front end: the matching screen action is shown only to roles the API allows (front end blocks + back end allows = pass; the reverse is a defect).');
        s.push('Cross-role: try the same call as each system role whose defaults include or exclude the permission.');
        break;
      case 'frontend_behavior_changed':
        s.push(`Screens: open the screens listed and confirm controls tied to "${P}" show/hide/disable correctly for a role with and without it.`);
        s.push('Nav: top-level navigation items for the area appear only for roles holding the permission.');
        break;
      case 'role_assignment_changed':
        s.push(`Roles list: "${R}" shows with the right editability / deletability and template.`);
        s.push('Staff page: assigning the role works; the user is logged out on role change (PRD rule).');
        break;
      default:
        s.push('Review the evidence and decide whether a manual check is needed.');
    }
    return s;
  }

  function change(A, B, o) {
    o.title = o.title || o.type;
    o.workflows = o.permission ? workflowsFor(A, B, o.permission) : (o.workflows || []);
    o.qa_scenarios = scenarios(o.type, { label: o.permission ? labelOf(A, B, o.permission) : (o.label || ''),
      roleName: o.role ? roleName(A, B, o.role) : null, after: o.afterBool, endpoint: o.endpoint,
      childLabel: o.childLabel, parentLabel: o.parentLabel });
    o.verification_status = 'Not Tested';
    return o;
  }

  // ── the comparison ───────────────────────────────────────────────────────────────────────────
  function compare(snapA, snapB) {
    const A = normalise(snapA), B = normalise(snapB);
    const changes = [];
    const stated = (M, perm, role) => !M.coverage || (M.coverage[perm] && M.coverage[perm].has(role));
    const has = (M, role, perm) => !!(M.defaults[role] && M.defaults[role].has(perm));

    // roles
    const rolesA = Object.keys(A.roles), rolesB = Object.keys(B.roles);
    minus(rolesB, rolesA).forEach((r) => changes.push(change(A, B, { type: 'role_assignment_changed', category: 'role_assignment_changed',
      title: `System role added: ${roleName(A, B, r)}`, role: r, before: '— (role does not exist)', after: 'exists',
      risk: 'High', risk_reason: 'A new system role becomes assignable; every default it carries is new access.',
      affected_roles: [r], evidence: { b: B.roles[r] } })));
    minus(rolesA, rolesB).forEach((r) => changes.push(change(A, B, { type: 'role_assignment_changed', category: 'role_assignment_changed',
      title: `System role removed: ${roleName(A, B, r)}`, role: r, before: 'exists', after: '— (role does not exist)',
      risk: 'High', risk_reason: 'Users on this role must be migrated; their access changes.',
      affected_roles: [r], evidence: { a: A.roles[r] } })));
    rolesA.filter((r) => B.roles[r]).forEach((r) => {
      [['editable', 'Can be edited when it is a system role'], ['deletable', 'Can be deleted when it is a system role'],
        ['clock', 'Can clock in']].forEach(([f, lbl]) => {
        const a = A.roles[r][f], b = B.roles[r][f];
        if (a !== undefined && b !== undefined && a !== null && b !== null && a !== b) {
          changes.push(change(A, B, { type: 'role_assignment_changed', category: 'role_assignment_changed',
            title: `${roleName(A, B, r)} — ${lbl}: ${a ? 'yes' : 'no'} → ${b ? 'yes' : 'no'}`, role: r,
            before: a ? 'yes' : 'no', after: b ? 'yes' : 'no', risk: 'Medium', risk_reason: 'Changes who can alter or use this role.',
            affected_roles: [r], evidence: {} }));
        }
      });
    });

    // permissions
    const permsA = Object.keys(A.perms), permsB = Object.keys(B.perms);
    minus(permsB, permsA).forEach((k) => {
      const holders = rolesB.filter((r) => has(B, r, k));
      changes.push(change(A, B, { type: 'permission_added', category: 'added_permission', permission: k,
        title: `Permission added: ${labelOf(A, B, k)}`, before: '— (does not exist)', after: `exists; default ON for ${holders.length ? holders.map((r) => roleName(A, B, r)).join(', ') : 'no system role'}`,
        risk: holders.length ? 'High' : 'Medium',
        risk_reason: holders.length ? 'New permission granted by default to existing system roles — users gain access on upgrade.'
          : 'New permission, OFF for every system role — no one gains access until a shop grants it.',
        affected_roles: holders, afterBool: true, evidence: { b: B.perms[k] } }));
    });
    minus(permsA, permsB).forEach((k) => {
      const holders = rolesA.filter((r) => has(A, r, k));
      changes.push(change(A, B, { type: 'permission_removed', category: 'removed_permission', permission: k,
        title: `Permission removed: ${labelOf(A, B, k)}`, before: `exists; default ON for ${holders.map((r) => roleName(A, B, r)).join(', ') || 'no system role'}`,
        after: '— (does not exist)', risk: 'High', risk_reason: 'Capability now governed elsewhere or removed; roles that held it may lose or keep access unexpectedly.',
        affected_roles: holders, evidence: { a: A.perms[k] } }));
    });
    permsA.filter((k) => B.perms[k]).forEach((k) => {
      const la = A.perms[k].label, lb = B.perms[k].label;
      if (la && lb && la !== lb && A.kind === B.kind) {
        changes.push(change(A, B, { type: 'modified_permission', category: 'modified_permission', permission: k,
          title: `Label changed: ${la} → ${lb}`, before: la, after: lb, risk: 'Low',
          risk_reason: 'Wording only — check the role editor and permission summary show the new label.', affected_roles: [], evidence: {} }));
      }
    });

    // role defaults (only cells BOTH sides state)
    const commonPerms = permsA.filter((k) => B.perms[k]);
    commonPerms.forEach((k) => {
      rolesA.filter((r) => B.roles[r]).forEach((r) => {
        if (!stated(A, k, r) || !stated(B, k, r)) return;
        const a = has(A, r, k), b = has(B, r, k);
        if (a !== b) {
          const sensitive = SENSITIVE.test(k);
          changes.push(change(A, B, { type: 'default_changed', category: 'default_changed', permission: k, role: r,
            title: `${roleName(A, B, r)} — ${labelOf(A, B, k)}: ${a ? 'ON' : 'OFF'} → ${b ? 'ON' : 'OFF'} by default`,
            before: a ? 'ON by default' : 'OFF by default', after: b ? 'ON by default' : 'OFF by default',
            risk: sensitive || b ? 'High' : 'Medium',
            risk_reason: b ? (sensitive ? 'Sensitive access newly granted by default.' : 'Access newly granted by default.')
              : (sensitive ? 'Sensitive access removed by default — users on this role lose it.' : 'Access removed by default — users on this role lose it.'),
            affected_roles: [r], afterBool: b,
            evidence: { a: (A.meta.cell_evidence || {})[(A.roles[r] || {}).source_key || r]?.[k] || null,
                        b: (B.meta.cell_evidence || {})[(B.roles[r] || {}).source_key || r]?.[k] || null,
                        code_comment: ((snapB.default_code_comments || {})[r] || {})[k] || ((snapB.default_code_comments || {})[r] || {})._role || null } }));
        }
      });
    });

    // dependencies
    const depsA = Object.keys(A.deps), depsB = Object.keys(B.deps);
    const depChange = (d, added, M) => change(A, B, { type: 'dependency_changed', category: 'dependency_changed', permission: d.child,
      title: `Dependency ${added ? 'added' : 'removed'}: ${labelOf(A, B, d.child)} ${d.kind === 'implies' ? '⇒' : '→'} ${labelOf(A, B, d.parent)}`,
      before: added ? 'no such dependency' : `${d.kind} ${labelOf(A, B, d.parent)}`, after: added ? `${d.kind} ${labelOf(A, B, d.parent)}` : 'no such dependency',
      risk: added ? 'Medium' : 'High',
      risk_reason: added ? 'Granting the child now also grants (or requires) the parent.' : 'The child can now exist without the parent — check nothing becomes reachable that should not.',
      affected_roles: [], afterBool: added, childLabel: labelOf(A, B, d.child), parentLabel: labelOf(A, B, d.parent),
      evidence: { [added ? 'b' : 'a']: d } });
    if (A.kind === B.kind) {
      minus(depsB, depsA).forEach((k) => changes.push(depChange(B.deps[k], true, B)));
      minus(depsA, depsB).forEach((k) => changes.push(depChange(A.deps[k], false, A)));
    }

    // enforcement (implementation vs implementation only)
    if (A.enforcement && B.enforcement) {
      const EA = A.enforcement, EB = B.enforcement;
      commonPerms.forEach((k) => {
        const a = EA.atoms[k] || [], b = EB.atoms[k] || [];
        const add = minus(b, a), rem = minus(a, b);
        if (add.length || rem.length) {
          changes.push(change(A, B, { type: 'backend_enforcement_changed', category: 'backend_enforcement_changed', permission: k,
            title: `What "${labelOf(A, B, k)}" grants on the server changed`,
            before: a.join(', ') || '(nothing)', after: b.join(', ') || '(nothing)',
            risk: 'High', risk_reason: (add.length ? `Every role holding it now also passes ${add.join(', ')}. ` : '') + (rem.length ? `It no longer grants ${rem.join(', ')}.` : ''),
            affected_roles: rolesB.filter((r) => has(B, r, k)), evidence: { atoms_added: add, atoms_removed: rem } }));
        }
        const ca = EA.beChecks[k] || [], cb = EB.beChecks[k] || [];
        if (minus(cb, ca).length || minus(ca, cb).length) {
          changes.push(change(A, B, { type: 'backend_enforcement_changed', category: 'backend_enforcement_changed', permission: k,
            title: `Server code that checks "${labelOf(A, B, k)}" directly changed`,
            before: ca.join(', ') || '(none)', after: cb.join(', ') || '(none)', risk: 'Medium',
            risk_reason: 'A handler/voter reads this permission directly; its enforcement moved.',
            affected_roles: [], evidence: { files_added: minus(cb, ca), files_removed: minus(ca, cb) } }));
        }
        const fa = EA.fe[k] || [], fb = EB.fe[k] || [];
        if (minus(fb, fa).length || minus(fa, fb).length) {
          changes.push(change(A, B, { type: 'frontend_behavior_changed', category: 'frontend_behavior_changed', permission: k,
            title: `Screens that use "${labelOf(A, B, k)}" changed`, before: `${fa.length} file(s)`, after: `${fb.length} file(s)`,
            risk: 'Low', risk_reason: 'Front end now reads this permission in different places — a screen may show/hide differently.',
            affected_roles: [], evidence: { files_added: minus(fb, fa), files_removed: minus(fa, fb) } }));
        }
      });
      // endpoints: guards changed, or new/removed guarded endpoints
      const epA = Object.keys(EA.endpoints), epB = Object.keys(EB.endpoints);
      const permsForAtoms = (atoms, bundles) => sortU(Object.entries(EB.atoms).filter(([, xs]) => xs.some((x) => atoms.includes(x))).map(([p]) => p)
        .concat(bundles || []));
      epA.filter((id) => EB.endpoints[id]).forEach((id) => {
        const a = EA.endpoints[id], b = EB.endpoints[id];
        const add = minus(b.atoms, a.atoms), rem = minus(a.atoms, b.atoms);
        const badd = minus(b.bundles, a.bundles), brem = minus(a.bundles, b.bundles);
        if (add.length || rem.length || badd.length || brem.length || a.guarded !== b.guarded) {
          const loosened = (rem.length || brem.length || (a.guarded && !b.guarded)) && !(add.length || badd.length);
          changes.push(change(A, B, { type: 'backend_enforcement_changed', category: 'backend_enforcement_changed',
            permission: permsForAtoms(a.atoms.concat(b.atoms), a.bundles.concat(b.bundles))[0] || null, endpoint: id,
            title: `API guard changed: ${id}`, before: a.expr || '(unguarded)', after: b.expr || '(unguarded)',
            risk: loosened ? 'High' : 'Medium', risk_reason: loosened ? 'The endpoint now checks LESS — roles that were refused may now succeed.' : 'The endpoint now checks something different.',
            affected_roles: [], affected_permissions: permsForAtoms(a.atoms.concat(b.atoms), a.bundles.concat(b.bundles)),
            evidence: { controller: b.controller } }));
        }
      });
      minus(epB, epA).forEach((id) => {
        const b = EB.endpoints[id];
        if (!b.atoms.length && !b.bundles.length) return;
        changes.push(change(A, B, { type: 'backend_enforcement_changed', category: 'backend_enforcement_changed',
          permission: permsForAtoms(b.atoms, b.bundles)[0] || null, endpoint: id,
          title: `New API endpoint guarded by a permission: ${id}`, before: '— (endpoint did not exist)', after: b.expr,
          risk: 'Low', risk_reason: 'New capability; confirm the guard matches the permission the PRD/story names.',
          affected_roles: [], affected_permissions: permsForAtoms(b.atoms, b.bundles), evidence: { controller: b.controller } }));
      });
      minus(epA, epB).forEach((id) => {
        const a = EA.endpoints[id];
        if (!a.atoms.length && !a.bundles.length) return;
        changes.push(change(A, B, { type: 'backend_enforcement_changed', category: 'backend_enforcement_changed',
          permission: null, endpoint: id, title: `Guarded API endpoint removed: ${id}`, before: a.expr, after: '— (endpoint gone)',
          risk: 'Medium', risk_reason: 'A permission-guarded capability disappeared or moved — confirm where it went.',
          affected_roles: [], affected_permissions: sortU(Object.entries(EA.atoms).filter(([, xs]) => xs.some((x) => a.atoms.includes(x))).map(([p]) => p)),
          evidence: { controller: a.controller } }));
      });
      if (EA.feLogic && EB.feLogic && EA.feLogic.fingerprint !== EB.feLogic.fingerprint) {
        changes.push(change(A, B, { type: 'frontend_behavior_changed', category: 'frontend_behavior_changed',
          title: 'Role editor dependency logic changed (front end)', before: EA.feLogic.fingerprint.slice(0, 12), after: EB.feLogic.fingerprint.slice(0, 12),
          risk: 'Medium', risk_reason: 'The editor\'s auto-tick / confirm-dialog code changed (comments ignored). Re-test the editor cascades and confirmation dialogs.',
          affected_roles: [], label: 'Role editor', workflows: ['Administration › Roles and Permissions › Create / Edit role'],
          evidence: { file: EB.feLogic.file, functions_added: minus(EB.feLogic.functions, EA.feLogic.functions),
                      functions_removed: minus(EA.feLogic.functions, EB.feLogic.functions) } }));
      }
      const oa = [...EA.officeEditable], ob = [...EB.officeEditable];
      if (minus(ob, oa).length || minus(oa, ob).length) {
        changes.push(change(A, B, { type: 'role_assignment_changed', category: 'role_assignment_changed', role: 'office',
          title: 'Which Office permissions a shop may edit changed', before: oa.join(', '), after: ob.join(', '),
          risk: 'Medium', risk_reason: 'Office is a protected system role; this list is its only editable part.',
          affected_roles: ['office'], evidence: {} }));
      }
    }

    const order = { High: 0, Medium: 1, Low: 2 };
    changes.sort((x, y) => (order[x.risk] - order[y.risk]) || x.category.localeCompare(y.category) || x.title.localeCompare(y.title));
    changes.forEach((c, i) => { c.id = `${c.category}:${c.permission || c.endpoint || c.role || 'x'}:${c.role || ''}:${i}`; });
    const counts = {};
    changes.forEach((c) => { counts[c.category] = (counts[c.category] || 0) + 1; });
    return {
      engine_version: '1.0.0',
      from: describe(snapA), to: describe(snapB),
      permission_related_change: changes.length > 0,
      counts, changes,
    };
  }

  function describe(s) {
    if (s.kind === 'prd') return { kind: 'prd', id: s.snapshot_id, version: s.source.version, label: `PRD v${s.source.version}` };
    return { kind: 'implementation', id: s.snapshot_id, ref: s.release.ref, commit: s.release.commit,
      build_marker: s.release.build_marker, label: `${s.release.ref} (${(s.release.commit || '').slice(0, 7)})` };
  }

  // ── PRD vs implementation, per permission ────────────────────────────────────────────────────
  /** For each permission: what the ORIGINAL PRD expects, what the implementation does, whether
   * they match, and a careful classification. A difference is never automatically a bug. */
  function prdVsImpl(original, latestPrd, impl, ledger) {
    const O = normalise(original), L = latestPrd ? normalise(latestPrd) : null, I = normalise(impl);
    const approvals = (ledger && ledger.approvals) || {};
    const keys = sortU(Object.keys(O.perms).concat(Object.keys(I.perms)));
    const roles = sortU(Object.keys(O.roles).concat(Object.keys(I.roles)));
    const has = (M, r, k) => !!(M && M.defaults[r] && M.defaults[r].has(k));
    const stated = (M, k, r) => M && (!M.coverage || (M.coverage[k] && M.coverage[k].has(r)));
    return keys.map((k) => {
      const inO = !!O.perms[k], inI = !!I.perms[k], inL = !!(L && L.perms[k]);
      const diffs = [];
      roles.forEach((r) => {
        if (!O.roles[r] || !I.roles[r] || !stated(O, k, r)) return;
        const o = has(O, r, k), i = has(I, r, k);
        if (o !== i) {
          const l = L && L.roles[r] && stated(L, k, r) ? has(L, r, k) : null;
          diffs.push({ role: r, role_name: (I.roles[r] || O.roles[r]).name, prd: o, impl: i, latest_prd: l,
            evidence_prd: ((original.cell_evidence || {})[O.roles[r].source_key] || {})[k] || { table: 'Permission Matrix', cell: '—' },
            evidence_latest: l === null ? null : (((latestPrd.cell_evidence || {})[L.roles[r].source_key] || {})[k] || { cell: '—' }) });
        }
      });
      // Only "implies" rules are stored server-side; the PRD's "gated by"/"requires" rules are
      // role-editor behaviour (parent toggles, confirmation dialogs) and are listed for on-screen
      // verification instead of being counted as a mismatch.
      const depsO = Object.values(O.deps).filter((d) => d.child === k && d.kind === 'implies').map((d) => d.parent);
      const depsI = Object.values(I.deps).filter((d) => d.child === k && d.kind === 'implies').map((d) => d.parent);
      const editorRules = Object.values(O.deps).filter((d) => d.child === k && d.kind !== 'implies')
        .map((d) => ({ parent: d.parent, kind: d.kind, quote: d.quote }));
      const depMismatch = minus(depsO, depsI).length > 0 || minus(depsI, depsO).length > 0;
      const ext = ((ledger && ledger.external_docs) || {})[k];
      let status, detail = '';
      const appr = approvals[k];
      if (inO && inI && !diffs.length && !depMismatch) {
        status = 'Matches original PRD';
      } else if (inI && I.perms[k].derived && diffs.length && L) {
        // a derived parent gate: check whether the latest PRD contradicts ITSELF (grants a child
        // area while leaving the parent gate off)
        const children = k === 'partsDepartment' ? ['partSales', 'catalogInventory', 'vendorOrderManagement'] : ['settings'];
        const contradictions = diffs.filter((d) => d.latest_prd === false && L.defaults[d.role] &&
          [...L.defaults[d.role]].some((c) => children.some((a) => c.startsWith(a) && c !== k)));
        status = contradictions.length ? 'Needs clarification' : 'Different from original PRD';
        detail = contradictions.length
          ? `The latest PRD grants ${contradictions.map((d) => d.role_name).join(', ')} a child area of this gate while setting the gate itself OFF — the PRD contradicts itself. The implementation has no stored gate; it follows the child permissions.`
          : 'Derived gate differs from the original PRD.';
      } else if (appr) {
        status = 'Approved post-PRD change';
        detail = `Approval recorded: ${appr.approved_by} on ${appr.date} (${appr.evidence}).`;
      } else if (inO && inI && !diffs.length && depMismatch) {
        status = 'Needs clarification';
        detail = `Defaults match, but the dependency rules differ — PRD: ${depsO.join(', ') || 'none'}; implementation: ${depsI.join(', ') || 'none'}.`;
      } else if (inO && inI) {
        const allDocumented = diffs.every((d) => d.latest_prd !== null && d.latest_prd === d.impl);
        status = allDocumented ? 'Different from original PRD' : (diffs.some((d) => d.latest_prd === null) ? 'Needs clarification' : 'Possible undocumented behavior');
        detail = allDocumented ? 'Every difference is what the LATEST PRD states — documented after the original. Approval: Not Documented.'
          : (diffs.some((d) => d.latest_prd === null) ? 'The latest PRD does not state this cell; the implementation differs from the original.'
            : 'Neither the original nor the latest PRD states what the implementation does for these roles.');
      } else if (inI && !inO) {
        const cc = (I.perms[k] || {}).codeComment;
        const outside = ((I.enforcement || { outside: {} }).outside || {})[k];
        status = inL || ext ? 'Different from original PRD' : (I.perms[k].derived ? 'Matches original PRD' : 'Possible undocumented behavior');
        detail = inL ? 'Not in the original PRD; the latest PRD documents it. Approval: Not Documented.'
          : ext ? `Not in this PRD; documented in "${ext.title}" (${ext.url}), linked by ${ext.linked_by} on ${ext.date}. Approval: Not Documented.`
          : (cc && cc.tickets && cc.tickets.length ? `Not in either PRD version. Code cites ${cc.tickets.join(', ')} — a lead, not an approval.`
            : (outside || /^accounting|^hrPageAccess$/.test(k)) ? 'An accounting-module permission, not described in the Custom Roles PRD. No requirements page for it was found by Confluence search on 2026-10-29 — link one in the evidence ledger if it exists.'
            : 'Not in either PRD version, and no ticket is cited in the code.');
      } else if (inO && !inI) {
        status = O.perms[k].prdOnly ? 'Matches original PRD' : 'Different from original PRD';
        detail = O.perms[k].prdOnly ? 'A role-editor parent gate in the PRD; the implementation derives it from the child permissions.'
          : 'In the original PRD; no permission with this key exists in the implementation.';
      }
      return { key: k, label: (I.perms[k] || O.perms[k]).label, group: (I.perms[k] || {}).group || null,
        in_original: inO, in_latest_prd: inL, in_implementation: inI,
        prd_expectation: inO ? { controls_verbatim: O.perms[k].controls, section: O.perms[k].section } : null,
        latest_prd: inL ? { label: L.perms[k].label, controls_verbatim: L.perms[k].controls, section: L.perms[k].section, key_evidence: L.perms[k].keyEvidence } : null,
        implementation: inI ? { label: I.perms[k].label, derived: !!I.perms[k].derived,
          atoms: (I.enforcement || { atoms: {} }).atoms[k] || [], outside: (I.enforcement || { outside: {} }).outside[k] || null,
          holders: Object.keys(I.roles).filter((r) => has(I, r, k)) } : null,
        default_differences: diffs,
        dependency_differences: { prd_only: minus(depsO, depsI), impl_only: minus(depsI, depsO) },
        editor_rules_to_verify_on_screen: editorRules,
        status, detail, verification_status: 'Not Tested' };
    });
  }

  return { compare, prdVsImpl, normalise, version: '1.0.0' };
});
