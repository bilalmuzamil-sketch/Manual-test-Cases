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

  // ── plain-language layer ─────────────────────────────────────────────────────────────────────
  // Every change also carries `plain`: a headline, what changed, why it matters and how to check
  // it, written for someone who has never seen the code. No route paths, code names or HTTP
  // terms appear in it; those stay in the technical fields beside it.
  const qt = (x) => '“' + x + '”';
  const andList = (xs) => (xs.length <= 1 ? (xs[0] || '') : xs.slice(0, -1).join(', ') + ' and ' + xs[xs.length - 1]);
  const EDITOR = 'Administration › Roles and Permissions';
  function plainLabel(A, B, k) { return String(labelOf(A, B, k)).replace(/\s*\(derived[^)]*\)/, ''); }
  function plainAction(id) {
    const parts = String(id || '').split(' ');
    const m = (parts[0] || '').split(/[^A-Z]/)[0];
    const verb = { GET: 'Viewing', POST: 'Creating or running', PUT: 'Changing', PATCH: 'Changing', DELETE: 'Deleting' }[m] || 'Using';
    const words = (parts[1] || '').replace(/^\/api\//, '').split('/').filter((x) => x && !x.startsWith('{'))
      .map((x) => x.replace(/[-_]/g, ' ')).join(' › ');
    return `${verb} ${words || 'this part of the app'}`;
  }
  function plainAtom(a) {
    return String(a).replace(/^PermissionEnum::/, '').replace(/^ROLE_/, '').replace(/::/g, ' ').replace(/_/g, ' ').toLowerCase();
  }
  /** A readable list of permission names: all of them when there are three or fewer. */
  function few(labels) {
    if (!labels.length) return 'the right permission';
    if (labels.length <= 3) return andList(labels.map(qt));
    return `one of ${labels.length} permissions (for example ${qt(labels[0])} or ${qt(labels[1])})`;
  }
  function withAndWithout(labels) {
    const L = labels.length > 3 ? 'one of the permissions listed' : labels.length ? andList(labels.map(qt)) : 'the permission involved';
    return [`Log in as someone whose role has ${L} and try it: it should work.`,
      `Log in as someone whose role ${labels.length > 1 ? 'has none of them' : 'does not have it'} and try it: it should be blocked, and the button or page should not be shown.`];
  }

  function change(A, B, o) {
    o.title = o.title || o.type;
    o.workflows = o.permission ? workflowsFor(A, B, o.permission) : (o.workflows || []);
    o.qa_scenarios = scenarios(o.type, { label: o.permission ? labelOf(A, B, o.permission) : (o.label || ''),
      roleName: o.role ? roleName(A, B, o.role) : null, after: o.afterBool, endpoint: o.endpoint,
      childLabel: o.childLabel, parentLabel: o.parentLabel });
    o.verification_status = 'Not Tested';
    o.plain = Object.assign({ headline: o.title, what: '', why: o.risk_reason, check: [], group: 'behind',
      before: null, after: null }, o.plain || {});
    o.plain.priority = { High: 'High priority', Medium: 'Medium priority', Low: 'Low priority' }[o.risk] || o.risk;
    o.plain.area = o.permission ? ((B.perms[o.permission] || A.perms[o.permission] || {}).group || (B.perms[o.permission] || A.perms[o.permission] || {}).section || null) : null;
    o.plain.roles = (o.affected_roles || []).map((r) => roleName(A, B, r));
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
      affected_roles: [r], evidence: { b: B.roles[r] },
      plain: { group: 'access', headline: `New role: ${roleName(A, B, r)}`,
        what: `A new role called ${qt(roleName(A, B, r))} can now be given to staff.`,
        why: 'Everything this role is allowed to do is new access for whoever gets it.',
        check: [`Open ${EDITOR} and check ${qt(roleName(A, B, r))} is in the list.`,
          'Give the role to a test user and check they can do only what the role allows.'] } })));
    minus(rolesA, rolesB).forEach((r) => changes.push(change(A, B, { type: 'role_assignment_changed', category: 'role_assignment_changed',
      title: `System role removed: ${roleName(A, B, r)}`, role: r, before: 'exists', after: '— (role does not exist)',
      risk: 'High', risk_reason: 'Users on this role must be migrated; their access changes.',
      affected_roles: [r], evidence: { a: A.roles[r] },
      plain: { group: 'access', headline: `Role removed: ${roleName(A, B, r)}`,
        what: `The ${qt(roleName(A, B, r))} role is no longer in the app.`,
        why: 'People who had this role now have different access.',
        check: [`Open ${EDITOR} and check ${qt(roleName(A, B, r))} is gone.`,
          'Log in as someone who had that role and check they still have the access they need, and nothing extra.'] } })));
    rolesA.filter((r) => B.roles[r]).forEach((r) => {
      [['editable', 'Can be edited when it is a system role'], ['deletable', 'Can be deleted when it is a system role'],
        ['clock', 'Can clock in']].forEach(([f, lbl]) => {
        const a = A.roles[r][f], b = B.roles[r][f];
        if (a !== undefined && b !== undefined && a !== null && b !== null && a !== b) {
          changes.push(change(A, B, { type: 'role_assignment_changed', category: 'role_assignment_changed',
            title: `${roleName(A, B, r)} — ${lbl}: ${a ? 'yes' : 'no'} → ${b ? 'yes' : 'no'}`, role: r,
            before: a ? 'yes' : 'no', after: b ? 'yes' : 'no', risk: 'Medium', risk_reason: 'Changes who can alter or use this role.',
            affected_roles: [r], evidence: {},
            plain: { group: 'access', headline: `${roleName(A, B, r)}: ${lbl.toLowerCase()} is now ${b ? 'yes' : 'no'}`,
              what: `For the ${qt(roleName(A, B, r))} role, the answer to ${qt(lbl)} changed from ${a ? 'yes' : 'no'} to ${b ? 'yes' : 'no'}.`,
              why: 'This changes who can change this role, or what people with it can do.',
              before: a ? 'Yes' : 'No', after: b ? 'Yes' : 'No',
              check: [`Open ${EDITOR}, find ${qt(roleName(A, B, r))} and check that ${lbl.toLowerCase()} is now ${b ? 'allowed' : 'not allowed'}.`] } }));
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
        affected_roles: holders, afterBool: true, evidence: { b: B.perms[k] },
        plain: { group: 'access', headline: `New permission: ${plainLabel(A, B, k)}`,
          what: `A new permission called ${qt(plainLabel(A, B, k))} was added. ` + (holders.length
            ? `It is switched on automatically for: ${andList(holders.map((r) => roleName(A, B, r)))}.`
            : 'It is switched off for every role, so nobody has it until a shop turns it on.'),
          why: holders.length ? 'People with these roles get new access as soon as they move to this release.'
            : 'Nobody gets new access automatically, but the new permission must work when a shop turns it on.',
          before: 'Did not exist', after: holders.length ? 'On for ' + holders.length + ' role' + (holders.length > 1 ? 's' : '') : 'Off for every role',
          check: [`Open a role in ${EDITOR} and check ${qt(plainLabel(A, B, k))} is listed, in the right section, with the right name.`]
            .concat(withAndWithout([plainLabel(A, B, k)]))
            .concat(holders.length ? [`Check it is switched on for ${andList(holders.map((r) => roleName(A, B, r)))}, and off for every other role.`] : []) } }));
    });
    minus(permsA, permsB).forEach((k) => {
      const holders = rolesA.filter((r) => has(A, r, k));
      changes.push(change(A, B, { type: 'permission_removed', category: 'removed_permission', permission: k,
        title: `Permission removed: ${labelOf(A, B, k)}`, before: `exists; default ON for ${holders.map((r) => roleName(A, B, r)).join(', ') || 'no system role'}`,
        after: '— (does not exist)', risk: 'High', risk_reason: 'Capability now governed elsewhere or removed; roles that held it may lose or keep access unexpectedly.',
        affected_roles: holders, evidence: { a: A.perms[k] },
        plain: { group: 'access', headline: `Permission removed: ${plainLabel(A, B, k)}`,
          what: `The permission ${qt(plainLabel(A, B, k))} no longer exists.` + (holders.length ? ` It used to be switched on for: ${andList(holders.map((r) => roleName(A, B, r)))}.` : ''),
          why: 'People may have gained or lost access without anyone choosing it.',
          before: 'Existed', after: 'Removed',
          check: [`Open a role in ${EDITOR} and check ${qt(plainLabel(A, B, k))} is no longer listed.`,
            'Open and save a role that used to have it: there should be no error.',
            'Log in as someone who had it and check they can still do their job, and nothing extra.'] } }));
    });
    permsA.filter((k) => B.perms[k]).forEach((k) => {
      const la = A.perms[k].label, lb = B.perms[k].label;
      if (la && lb && la !== lb && A.kind === B.kind) {
        changes.push(change(A, B, { type: 'modified_permission', category: 'modified_permission', permission: k,
          title: `Label changed: ${la} → ${lb}`, before: la, after: lb, risk: 'Low',
          risk_reason: 'Wording only — check the role editor and permission summary show the new label.', affected_roles: [], evidence: {},
          plain: { group: 'access', headline: `Permission renamed: ${la} → ${lb}`,
            what: `Only the name changed. ${qt(la)} is now called ${qt(lb)}.`, why: 'Wording only. What it allows has not changed.',
            before: la, after: lb, check: [`Open a role in ${EDITOR} and check the new name ${qt(lb)} is shown.`] } }));
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
            plain: { group: 'access', headline: `${roleName(A, B, r)}: ${qt(plainLabel(A, B, k))} is now switched ${b ? 'on' : 'off'}`,
              what: `Before, the ${qt(roleName(A, B, r))} role had ${qt(plainLabel(A, B, k))} switched ${a ? 'on' : 'off'}. Now it is switched ${b ? 'on' : 'off'}.`,
              why: (b ? 'People with this role can now do this without anyone changing their role.'
                : 'People with this role can no longer do this.') + (sensitive ? ' This one is sensitive (money, deleting things, or settings).' : ''),
              before: a ? 'Switched on' : 'Switched off', after: b ? 'Switched on' : 'Switched off',
              check: [`Log in as a user who has the ${qt(roleName(A, B, r))} role (not edited) and check they ${b ? 'can' : 'cannot'} use ${qt(plainLabel(A, B, k))}.`,
                `Open the ${qt(roleName(A, B, r))} role in ${EDITOR} and check ${qt(plainLabel(A, B, k))} is ${b ? 'ticked' : 'not ticked'}.`,
                `Check no other role changed for ${qt(plainLabel(A, B, k))}.`,
                'Roles that shops saved before this release keep their old settings until someone edits them. Check one.'] },
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
      evidence: { [added ? 'b' : 'a']: d },
      plain: (() => {
        const c = qt(plainLabel(A, B, d.child)), p = qt(plainLabel(A, B, d.parent));
        const link = d.kind === 'implies' ? `also turns on ${p}` : `needs ${p} to be on`;
        return { group: 'access', headline: added ? `Turning on ${c} now ${link}` : `Turning on ${c} no longer ${link.replace(/^also /, '')}`,
          what: added ? `When a role gets ${c}, it ${link}. This happens automatically.` : `${c} can now be on without ${p}.`,
          why: added ? 'Giving someone one permission now gives them another one as well.'
            : 'Check this does not let people reach something they should not.',
          before: added ? 'Not linked' : 'Linked', after: added ? 'Linked' : 'Not linked',
          check: added ? [`Edit a role, tick ${c}, and check ${p} is ticked too.`, `Untick ${p} and check ${c} is unticked as well.`]
            : [`Edit a role, tick ${c}, and check ${p} is not ticked automatically.`,
              `Log in as someone with ${c} but not ${p} and check they cannot reach anything that belongs to ${p}.`] };
      })() });
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
            affected_roles: rolesB.filter((r) => has(B, r, k)), evidence: { atoms_added: add, atoms_removed: rem },
            plain: { group: 'access', headline: `${qt(plainLabel(A, B, k))} now allows ${add.length && rem.length ? 'different things' : add.length ? 'more' : 'less'}`,
              what: `What this permission lets people do inside the app changed.` + (add.length ? ` It now also covers: ${andList(add.map(plainAtom))}.` : '')
                + (rem.length ? ` It no longer covers: ${andList(rem.map(plainAtom))}.` : ''),
              why: add.length ? 'Everyone whose role has this permission can now do more than before, without anyone changing their role.'
                : 'Everyone whose role has this permission can now do less than before.',
              check: [`Log in as someone with ${qt(plainLabel(A, B, k))} and check they can do ${add.length ? 'the newly covered things' : 'what they still should'}.`,
                rem.length ? 'Check they can no longer do what was removed, unless another permission they have still allows it.'
                  : `Log in as someone without ${qt(plainLabel(A, B, k))} and check those things are blocked.`] } }));
        }
        const ca = EA.beChecks[k] || [], cb = EB.beChecks[k] || [];
        if (minus(cb, ca).length || minus(ca, cb).length) {
          changes.push(change(A, B, { type: 'backend_enforcement_changed', category: 'backend_enforcement_changed', permission: k,
            title: `Server code that checks "${labelOf(A, B, k)}" directly changed`,
            before: ca.join(', ') || '(none)', after: cb.join(', ') || '(none)', risk: 'Medium',
            risk_reason: 'A handler/voter reads this permission directly; its enforcement moved.',
            affected_roles: [], evidence: { files_added: minus(cb, ca), files_removed: minus(ca, cb) },
            plain: { group: 'behind', headline: `Where the app checks ${qt(plainLabel(A, B, k))} moved`,
              what: 'The app now checks this permission in different places behind the scenes. Usually nothing changes for users.',
              why: 'A check that moved can stop working without anyone noticing on screen.',
              check: withAndWithout([plainLabel(A, B, k)]) } }));
        }
        const fa = EA.fe[k] || [], fb = EB.fe[k] || [];
        if (minus(fb, fa).length || minus(fa, fb).length) {
          changes.push(change(A, B, { type: 'frontend_behavior_changed', category: 'frontend_behavior_changed', permission: k,
            title: `Screens that use "${labelOf(A, B, k)}" changed`, before: `${fa.length} file(s)`, after: `${fb.length} file(s)`,
            risk: 'Low', risk_reason: 'Front end now reads this permission in different places — a screen may show/hide differently.',
            affected_roles: [], evidence: { files_added: minus(fb, fa), files_removed: minus(fa, fb) },
            plain: { group: 'screens', headline: `Screens that depend on ${qt(plainLabel(A, B, k))} changed`,
              what: `The app now shows or hides things based on this permission in a different set of places (before: ${fa.length}, now: ${fb.length}).`,
              why: 'A button, menu item or page may now appear or disappear for some people.',
              before: `${fa.length} places`, after: `${fb.length} places`,
              check: [`Log in as someone with ${qt(plainLabel(A, B, k))}: the related buttons, menus and pages are shown and work.`,
                `Log in as someone without it: they are hidden.`] } }));
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
            evidence: { controller: b.controller },
            plain: (() => { const labs = permsForAtoms(a.atoms.concat(b.atoms), a.bundles.concat(b.bundles)).map((x) => plainLabel(A, B, x));
              return { group: 'behind', headline: `${plainAction(id)}: the permission check changed`, permissions: labs,
                what: loosened ? `${plainAction(id)} now checks less than before.` : `${plainAction(id)} is now protected by a different permission check.`,
                why: loosened ? 'People who used to be blocked might now get through.' : 'The wrong people could be allowed in, or the right people blocked.',
                check: withAndWithout(labs) }; })() }));
        }
      });
      minus(epB, epA).forEach((id) => {
        const b = EB.endpoints[id];
        if (!b.atoms.length && !b.bundles.length) return;
        changes.push(change(A, B, { type: 'backend_enforcement_changed', category: 'backend_enforcement_changed',
          permission: permsForAtoms(b.atoms, b.bundles)[0] || null, endpoint: id,
          title: `New API endpoint guarded by a permission: ${id}`, before: '— (endpoint did not exist)', after: b.expr,
          risk: 'Low', risk_reason: 'New capability; confirm the guard matches the permission the PRD/story names.',
          affected_roles: [], affected_permissions: permsForAtoms(b.atoms, b.bundles), evidence: { controller: b.controller },
          plain: (() => { const labs = permsForAtoms(b.atoms, b.bundles).map((x) => plainLabel(A, B, x));
            return { group: 'behind', headline: `New protected action: ${plainAction(id)}`, permissions: labs,
              what: `There is a new action in the app (${plainAction(id).toLowerCase()}). Only people with ${few(labs)} can use it.`,
              why: 'A new feature: make sure the right people can use it and nobody else can.',
              check: withAndWithout(labs) }; })() }));
      });
      minus(epA, epB).forEach((id) => {
        const a = EA.endpoints[id];
        if (!a.atoms.length && !a.bundles.length) return;
        changes.push(change(A, B, { type: 'backend_enforcement_changed', category: 'backend_enforcement_changed',
          permission: null, endpoint: id, title: `Guarded API endpoint removed: ${id}`, before: a.expr, after: '— (endpoint gone)',
          risk: 'Medium', risk_reason: 'A permission-guarded capability disappeared or moved — confirm where it went.',
          affected_roles: [], affected_permissions: sortU(Object.entries(EA.atoms).filter(([, xs]) => xs.some((x) => a.atoms.includes(x))).map(([p]) => p)),
          evidence: { controller: a.controller },
          plain: { group: 'behind', headline: `Protected action removed: ${plainAction(id)}`,
            what: `${plainAction(id)} is no longer in the app, or has moved.`,
            why: 'A feature disappeared or moved. Check it still works for the right people wherever it went.',
            check: ['Find the feature on screen and check it still works for people who should have it.',
              'Check people who should not have it are still blocked.'] } }));
      });
      if (EA.feLogic && EB.feLogic && EA.feLogic.fingerprint !== EB.feLogic.fingerprint) {
        changes.push(change(A, B, { type: 'frontend_behavior_changed', category: 'frontend_behavior_changed',
          title: 'Role editor dependency logic changed (front end)', before: EA.feLogic.fingerprint.slice(0, 12), after: EB.feLogic.fingerprint.slice(0, 12),
          risk: 'Medium', risk_reason: 'The editor\'s auto-tick / confirm-dialog code changed (comments ignored). Re-test the editor cascades and confirmation dialogs.',
          affected_roles: [], label: 'Role editor', workflows: ['Administration › Roles and Permissions › Create / Edit role'],
          evidence: { file: EB.feLogic.file, functions_added: minus(EB.feLogic.functions, EA.feLogic.functions),
                      functions_removed: minus(EA.feLogic.functions, EB.feLogic.functions) },
          plain: { group: 'screens', headline: 'The role editor’s automatic ticking changed',
            what: 'The part of the role editor that ticks and unticks related permissions for you was changed.',
            why: 'Editing a role could now tick, untick or warn differently.',
            check: [`Open ${EDITOR}, edit a role, and tick permissions that depend on others. Check the related ones tick and untick as expected.`,
              'Turn off a permission that others depend on and check the warning message still appears.'] } }));
      }
      const oa = [...EA.officeEditable], ob = [...EB.officeEditable];
      if (minus(ob, oa).length || minus(oa, ob).length) {
        changes.push(change(A, B, { type: 'role_assignment_changed', category: 'role_assignment_changed', role: 'office',
          title: 'Which Office permissions a shop may edit changed', before: oa.join(', '), after: ob.join(', '),
          risk: 'Medium', risk_reason: 'Office is a protected system role; this list is its only editable part.',
          affected_roles: ['office'], evidence: {},
          plain: { group: 'access', headline: 'What shops may change on the Office role changed',
            what: `The Office role is protected, except for a short list of permissions shops may change. Before: ${andList(oa.map((x) => qt(plainLabel(A, B, x)))) || 'none'}. Now: ${andList(ob.map((x) => qt(plainLabel(A, B, x)))) || 'none'}.`,
            why: 'This decides what a shop can adjust on a protected role.',
            check: [`Open the Office role in ${EDITOR} and check only these permissions can be changed: ${andList(ob.map((x) => qt(plainLabel(A, B, x)))) || 'none'}.`] } }));
      }
    }

    const order = { High: 0, Medium: 1, Low: 2 };
    changes.sort((x, y) => (order[x.risk] - order[y.risk]) || x.category.localeCompare(y.category) || x.title.localeCompare(y.title));
    changes.forEach((c, i) => { c.id = `${c.category}:${c.permission || c.endpoint || c.role || 'x'}:${c.role || ''}:${i}`; });
    const counts = {};
    changes.forEach((c) => { counts[c.category] = (counts[c.category] || 0) + 1; });
    return {
      engine_version: '1.2.0',
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
      // the same verdict in plain words, for people who have never seen the code
      const PLAIN_STATUS = { 'Matches original PRD': 'Matches the plan', 'Different from original PRD': 'Changed since the plan',
        'Approved post-PRD change': 'Changed, with approval', 'Possible undocumented behavior': 'Not in the plan',
        'Needs clarification': 'Question for the product owner' };
      let plainDetail;
      const nm = (M, xs) => andList(xs.map((d) => d.role_name));
      if (status === 'Matches original PRD') plainDetail = 'The app does what the original plan says.';
      else if (status === 'Approved post-PRD change') plainDetail = `The app is different from the original plan, and the change was approved by ${appr.approved_by} on ${appr.date}.`;
      else if (status === 'Needs clarification' && inI && I.perms[k].derived) {
        const who = diffs.filter((d) => d.latest_prd === false).map((d) => d.role_name);
        plainDetail = `The newer plan gives ${andList(who)} access to part of this area, but also says the area itself is switched off for them. Both cannot be true, so the product owner needs to say which is right.`;
      } else if (status === 'Needs clarification' && !diffs.length) plainDetail = 'Who has it matches the plan, but which other permissions it turns on is different. The product owner needs to confirm which is right.';
      else if (status === 'Needs clarification') plainDetail = `The app is different from the original plan for ${nm(I, diffs)}, and the newer plan does not say either way. The product owner needs to confirm.`;
      else if (status === 'Different from original PRD' && inO && inI) plainDetail = `The app is different from the original plan for ${nm(I, diffs)}. The newer version of the plan (July 2026) describes exactly what the app does, so this looks like a planned change. Nobody has recorded an approval yet.`;
      else if (status === 'Different from original PRD' && inI && !inO) plainDetail = ext ? `This permission was not in the original plan. It is described in a separate document, ${qt(ext.title)}. Nobody has recorded an approval yet.` : 'This permission was not in the original plan. The newer version of the plan adds it. Nobody has recorded an approval yet.';
      else if (status === 'Different from original PRD') plainDetail = 'This permission is in the original plan but does not exist in the app.';
      else if (status === 'Possible undocumented behavior' && inO && inI) plainDetail = `The app is different from the plan for ${nm(I, diffs)}, and neither version of the plan describes what the app does.`;
      else {
        const cc = (I.perms[k] || {}).codeComment;
        plainDetail = /^accounting|^hrPageAccess$/.test(k)
          ? 'This is an Accounting or HR permission. Neither version of the plan mentions it, and no other document describing it was found.'
          : cc && cc.tickets && cc.tickets.length ? `Neither version of the plan mentions this permission. The developers’ notes point to ticket ${andList(cc.tickets)}, but that is not an approval.`
          : 'Neither version of the plan mentions this permission.';
      }
      return { key: k, label: (I.perms[k] || O.perms[k]).label, group: (I.perms[k] || {}).group || null,
        plain_label: String((I.perms[k] || O.perms[k]).label).replace(/\s*\(derived[^)]*\)/, ''),
        plain_status: PLAIN_STATUS[status] || status, plain_detail: plainDetail,
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

  // ── what to retest after a release ───────────────────────────────────────────────────────────
  /** Turns one release's changes into a manual-QA retest checklist, in plain words:
   *   1. each change to who can do what, on its own, with the roles to log in as;
   *   2. one re-check per app area for screen and behind-the-scenes changes (a release can carry
   *      dozens of these, so they are grouped by area rather than listed one by one);
   *   3. a few quick checks that apply after ANY permission change.
   * `impl` is an implementation snapshot used only to suggest which roles to log in as. */
  function retestPlan(report, impl) {
    const changes = (report && report.changes) || [];
    const perms = {}; ((impl && impl.permissions) || []).forEach((p) => { perms[p.key] = p; });
    const roles = (impl && impl.roles) || [];
    const defaults = (impl && impl.role_defaults) || {};
    const size = (r) => (defaults[r.key] || []).length;
    const lab = (k) => String((perms[k] || {}).label || k).replace(/\s*\(derived[^)]*\)/, '');
    /** Roles to log in as: the SMALLEST role that has it, and the LARGEST role that does not, so
     * the test sits right on the boundary. Based on the built-in roles of `impl`. */
    function rolesFor(k) {
      if (!k || !perms[k]) return null;
      const has = roles.filter((r) => (defaults[r.key] || []).includes(k)).sort((a, b) => size(a) - size(b));
      const not = roles.filter((r) => !(defaults[r.key] || []).includes(k)).sort((a, b) => size(b) - size(a));
      return { with: has[0] ? has[0].name : null, without: not[0] ? not[0].name : null };
    }
    const rank = { High: 0, Medium: 1, Low: 2 };
    const worst = (xs) => xs.map((c) => c.risk).sort((a, b) => rank[a] - rank[b])[0] || 'Low';
    const pr = (r) => ({ High: 'High priority', Medium: 'Medium priority', Low: 'Low priority' }[r] || r);
    const items = [];

    changes.filter((c) => (c.plain || {}).group === 'access').forEach((c) => {
      const R = c.category === 'default_changed' ? null : rolesFor(c.permission);
      const steps = (c.plain.check || []).slice();
      if (R && R.with && R.without && c.category !== 'removed_permission') {
        steps.unshift(`Suggested logins: ${R.with} (has ${qt(lab(c.permission))}) and ${R.without} (does not have it).`);
      }
      items.push({ id: ['change', c.category, c.permission || '', c.role || '', c.endpoint || ''].join(':'), kind: 'change',
        priority: pr(c.risk), risk: c.risk, area: c.plain.area || 'Roles', title: c.plain.headline, what: c.plain.what, why: c.plain.why,
        steps, roles: R });
    });

    // Which app area a change belongs to: its own permission's area; else the area its address
    // names (work-orders → Work Orders); else the area most of its permissions belong to.
    const norm = (x) => String(x).toLowerCase().replace(/[^a-z]/g, '').replace(/s$/, '');
    const groupsByNorm = {}; Object.values(perms).forEach((p) => { if (p.group) groupsByNorm[norm(p.group)] = p.group; });
    const ALIAS = { invoice: 'Invoicing & Payments', payment: 'Invoicing & Payments', customerpayment: 'Invoicing & Payments',
      vendororder: 'Vendor Order Management', purchaseorder: 'Vendor Order Management', vendor: 'Vendor Order Management',
      partscatalogue: 'Catalog & Inventory', inventory: 'Catalog & Inventory', catalog: 'Catalog & Inventory',
      appointment: 'Schedule', timesheet: 'Timesheets', reporting: 'Reports', report: 'Reports', partsale: 'Part Sales',
      contact: 'Customers', vehicle: 'Customers', organization: 'Settings', setting: 'Settings', accounting: 'Accounting' };
    function areaOf(c) {
      // an address-level change: the address names its area better than the first of the many
      // permissions that happen to allow it
      if (c.endpoint) {
        const seg = norm(((String(c.endpoint).split(' ')[1] || '').replace(/^\/api\//, '').split('/')[0]) || '');
        if (groupsByNorm[seg]) return groupsByNorm[seg];
        if (ALIAS[seg] && Object.values(groupsByNorm).includes(ALIAS[seg])) return ALIAS[seg];
      } else if (c.plain.area) return c.plain.area;
      const n = {};
      (c.affected_permissions || []).forEach((k) => { const g = (perms[k] || {}).group; if (g) n[g] = (n[g] || 0) + 1; });
      return Object.keys(n).sort((a, b) => n[b] - n[a])[0] || 'Other parts of the app';
    }
    const byArea = {};
    changes.filter((c) => ['screens', 'behind'].includes((c.plain || {}).group)).forEach((c) => {
      const area = areaOf(c);
      (byArea[area] = byArea[area] || []).push(c);
    });
    Object.entries(byArea).forEach(([area, cs]) => {
      const count = {};
      cs.forEach((c) => [c.permission].concat(c.affected_permissions || []).filter(Boolean)
        .forEach((k) => { count[k] = (count[k] || 0) + 1; }));
      const ranked = Object.keys(count).sort((a, b) => count[b] - count[a] || a.localeCompare(b));
      // the permission to test with: the most-involved one that belongs to this area
      const main = ranked.find((k) => (perms[k] || {}).group === area) || ranked[0];
      const permsInvolved = [main].concat(ranked.filter((k) => k !== main)).filter(Boolean).map(lab);
      // "with" = the smallest role holding the main permission; "without" = the largest role holding
      // NONE of the permissions that allow these actions (holding any one of them lets you through)
      const allKeys = Object.keys(count);
      const R = main ? (() => {
        const r0 = rolesFor(main) || {};
        const none = roles.filter((r) => !allKeys.some((k) => (defaults[r.key] || []).includes(k))).sort((a, b) => size(b) - size(a));
        return { with: r0.with || null, without: none[0] ? none[0].name : null };
      })() : null;
      const nS = cs.filter((c) => c.plain.group === 'screens').length, nB = cs.length - nS;
      const actions = uniq(cs.filter((c) => c.endpoint).map((c) => plainAction(c.endpoint)));
      const screens = uniq(cs.filter((c) => c.plain.group === 'screens').map((c) => c.plain.headline));
      const what = [nS && `${nS} change${nS > 1 ? 's' : ''} to which screens show or hide things`,
        nB && `${nB} change${nB > 1 ? 's' : ''} to behind-the-scenes checks`].filter(Boolean).join(' and ');
      const steps = [];
      if (!main) cs.forEach((c) => (c.plain.check || []).forEach((x) => { if (!steps.includes(x)) steps.push(x); }));
      else if (R && R.with) steps.push(`Log in as ${R.with}, who has ${qt(lab(main))}. Go to ${area} and use the features listed below. Everything should work as before.`);
      else if (main) steps.push(`Log in as someone who has ${qt(lab(main))}. Go to ${area} and use the features listed below. Everything should work as before.`);
      const allowedBy = permsInvolved.length > 1 ? `at least one of the ${permsInvolved.length} permissions listed below` : qt(lab(main));
      if (R && R.without) steps.push(`Log in as ${R.without}, who ${permsInvolved.length > 1 ? 'has none of the permissions listed below' : 'does not have ' + qt(lab(main))}. The same buttons, menus and pages should be hidden, and the actions should be refused.`);
      else if (main) steps.push(`Every built-in role has ${allowedBy}, so make a test role with ${permsInvolved.length > 1 ? 'all of them' : 'it'} switched off. Log in with it: the same buttons, menus and pages should be hidden, and the actions should be refused.`);
      if (permsInvolved.length > 1) steps.push(`Any one of these permissions is enough to allow the actions. If time allows, check a role that has only one of them, for example ${permsInvolved.slice(1, 3).map(qt).join(' or ')}.`);
      items.push({ id: 'area:' + area, kind: 'area', priority: pr(worst(cs)), risk: worst(cs), area,
        title: `${area}: re-check who can use it`, what: `This release made ${what} in ${area}.`,
        why: 'These are easy to miss on screen. If one is wrong, someone could see or do something they should not, or lose something they need.',
        steps, roles: R, permissions: permsInvolved, actions, screens, change_count: cs.length });
    });
    items.sort((a, b) => (a.kind === b.kind ? 0 : a.kind === 'change' ? -1 : 1) || rank[a.risk] - rank[b.risk] || a.title.localeCompare(b.title));

    const spot = changes.length ? [
      { id: 'spot:open-save', title: 'Built-in roles still open and save', steps: [`Open ${EDITOR}. Open each built-in role and press save without changing anything.`, 'No error should appear, and no permission should change.'] },
      { id: 'spot:old-custom-role', title: 'Custom roles made before this release are unchanged', steps: [`Open a custom role that was made before this release. Check its permissions are exactly as they were.`, 'Log in as a user with that role and check they can still do their normal work.'] },
      { id: 'spot:role-change-logout', title: 'Changing someone’s role still logs them out', quote: 'Changing a user’s role triggers a forced logout for the affected user. The new role takes effect when they log back in.',
        steps: ['Give a test user a different role while they are logged in.', 'They should be logged out. When they log back in, they should have only what the new role allows.'] },
    ] : [];
    return { release: (report && report.to) || null, compared_with: (report && report.from) || null,
      needs_retest: changes.length > 0, change_count: changes.length, items, spot_checks: spot };
  }

  return { compare, prdVsImpl, retestPlan, normalise, version: '1.2.0' };
});
