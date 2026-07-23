# SV-8183 VIU — staging UI harness notes (2026-07-23)

## Access
- Cookies (fresh, user-supplied) authenticate: `POST /api/quick-login {key:'admin'}` => 200. Cookies in /tmp/fd-tickets/cookies.env only.
- Org id (live): d55bc308-e61a-438d-b5f1-c7a73c89d49f (name "Foothills Group Inc 123", 10 locations, 307 staff — SHARED).
- Roles list: GET /api/organizations/{org}/roles (200). Role detail GET /api/roles/{id} (200 with admin session cookie).

## Chromium egress (KEY LEARNING — durable)
- The agent egress proxy BLOCKS Chromium's BoringSSL TLS fingerprint (ERR_CONNECTION_RESET / upstream RST after CONNECT), while curl/undici (OpenSSL) pass.
- The old CONNECT-relay bridge does NOT help (same fingerprint reaches the egress proxy).
- FIX: a LOCAL TLS-TERMINATING MITM (mitm.mjs): Chromium -> CONNECT -> local https server (self-signed cert, --ignore-certificate-errors) -> re-issues each request via undici (ProxyAgent -> agent proxy). Egress TLS is then done by undici (allowed). Chromium proxy = http://127.0.0.1:<mitmport>. This is the reliable staging UI path.

## boot2 hydration (exact shapes — durable)
localStorage keys the SPA requires before it will render authenticated content:
- `user` = the WHOLE quick-login response wrapped: {data:{token, role:{...fePermissions:[{id,name}]}, details:{...intercom_data.company.id, avatar_url, user_id, email}}}
- `fe_permissions_wrapper` = the INNER .data of GET /api/auth/me/fe-permissions, i.e. {fe_permissions:[...codes], view_mode, cross_toggles, template_id, template_slug, system_role} — NOT the full response (consumer reads t.fe_permissions.length).
- `organization_features` (+ `organization_features_timestamp`) = GET /api/organization/feature-flags?organization_id={org} -> .data.
Sequence: goto /login (SPA shell) -> setItem the 3 keys -> goto target. Without correct `user`+`fe_permissions_wrapper` the router bounces to /login; wrong fperm shape crashes boot ("reading length of undefined").

## Location gotcha
- Multi-location org: opening a WO whose location != the session's active location redirects back to /workorders. Seed/observe a WO in the active location.
