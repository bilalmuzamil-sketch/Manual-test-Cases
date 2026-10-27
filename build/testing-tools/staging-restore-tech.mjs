// staging-restore-tech.mjs — put the Tech staff member back on its baseline role after a
// permission-verification run, then verify.
//
// BASELINE (CLAUDE.md, resolved 2026-07-23): on the shared staging org the Tech user's default role is
// "Technician", NOT "Time Clock User". The old hard-coded Time Clock default was removed 2026-10-27 because
// it would have left Tech on the wrong role for every session sharing the org. Pass the role id explicitly
// (Settings > Roles & Permissions, or GET /api/organizations/<org>/roles), and RESET THAT ROLE TO TEMPLATE
// FIRST (Standing Rule 105).
//
// SECRET-FREE: reads cookies from /tmp/cln/cookies.json (via staging-admin.mjs).
// The UUIDs / email below are non-secret staging entity identifiers for the
// well-known Tech test account (see build/TESTING-RUNBOOK.md). If staging is
// re-seeded these ids may change — update them from an admin org lookup.
//
// Usage: node staging-restore-tech.mjs <roleId>
import { login, api } from './staging-admin.mjs';

const STAFF = '6fb22c1b-d6c3-40eb-9cac-5cb9c61e36aa';     // Tech staff member id (staging)
const WP = 'b3c8c820-f815-4cf1-8938-10956c5ee71a';        // workplace id (staging)
const ROLE = process.argv[2];
if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(ROLE || '')) {
  console.error('usage: node staging-restore-tech.mjs <roleId>  (the full id of the "Technician" role on staging; reset it to template first)');
  process.exit(2);
}

const { sessCookie } = await login('admin');
let r = await api(sessCookie, 'POST', `/api/staff/${STAFF}/change`, {
  first_name: 'Tech', last_name: 'ShopView', email: 'tech@shopview.com',
  workplace_id: WP, role_id: ROLE
});
console.log('RESTORE status', r.status, JSON.stringify(r.body).slice(0, 200));

// verify as Tech
const me = await api(await login('tech').then(x => x.sessCookie), 'GET', '/api/auth/me/fe-permissions');
const perms = me.body?.data?.fe_permissions || [];
console.log('TECH now perms count:', perms.length, '| sample:', JSON.stringify(perms.slice(0, 6)), '| view_mode:', me.body?.data?.view_mode);
