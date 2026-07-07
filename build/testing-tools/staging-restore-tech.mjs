// staging-restore-tech.mjs — reset the Tech staff member back to the default
// "Time Clock" role after a permission-verification run, then verify.
//
// SECRET-FREE: reads cookies from /tmp/cln/cookies.json (via staging-admin.mjs).
// The UUIDs / email below are non-secret staging entity identifiers for the
// well-known Tech test account (see build/TESTING-RUNBOOK.md). If staging is
// re-seeded these ids may change — update them from an admin org lookup.
//
// Usage: node staging-restore-tech.mjs
import { login, api } from './staging-admin.mjs';

const STAFF = '6fb22c1b-d6c3-40eb-9cac-5cb9c61e36aa';     // Tech staff member id (staging)
const WP = 'b3c8c820-f815-4cf1-8938-10956c5ee71a';        // workplace id (staging)
const TIMECLOCK = '9834b7ec-4625-4fb7-9a82-b69de3703e48'; // default "Time Clock User" role id (staging; re-seeded 2026-07 — was 77b069d1-...)

const { sessCookie } = await login('admin');
let r = await api(sessCookie, 'POST', `/api/staff/${STAFF}/change`, {
  first_name: 'Tech', last_name: 'ShopView', email: 'tech@shopview.com',
  workplace_id: WP, role_id: TIMECLOCK
});
console.log('RESTORE status', r.status, JSON.stringify(r.body).slice(0, 200));

// verify as Tech
const me = await api(await login('tech').then(x => x.sessCookie), 'GET', '/api/auth/me/fe-permissions');
const perms = me.body?.data?.fe_permissions || [];
console.log('TECH now perms count:', perms.length, '| sample:', JSON.stringify(perms.slice(0, 6)), '| view_mode:', me.body?.data?.view_mode);
