# Live Confluence spec capture — 2026-08-03

**This is an ADDITIVE capture. The 2026-07-31 captures in `../../spec-current-2026-07-31/` were NOT
overwritten and remain the record of that day.**

| Spec | pageId | Live `lastModified` | Captured here? | Why |
|---|---|---|---|---|
| **SBC** Sales By Customer | 577634305 | **Jul 31, 2026** | ✅ `Sales-By-Customer-Report-current-2026-08-03.md` | **The 07-31 mirror was STALE (v12)** and still carried the abolished dedicated-permission requirement. This is the refresh. |
| **SBR** Sales By Representative | 585629698 | Jul 29, 2026 | ✅ `Sales-By-Representative-Report-current-2026-08-03.md` | Unchanged, captured because it was read live for the export-header contradiction check. |
| **PV** Parts Velocity | 620888066 | Jul 29, 2026 | ✅ `Parts-Velocity-Report-current-2026-08-03.md` | Unchanged, captured because it is the governing spec for the group-E rescope (Rule 41). |
| **TU** Technician Utilization | 641400833 | Jul 29, 2026 | ❌ not re-written | **Read LIVE and IN FULL this run**; the live modified date matches the version already held at `spec-current-2026-07-31/` (v5), so that mirror is provably current. Verbatim quotes are in `../VERIFICATION.md`. |
| **WIP** Work In Progress | 703660034 | Jul 29, 2026 | ❌ not re-written | Same — mirror v6 is current. |
| **IV** Inventory Value | 720142338 | Jul 29, 2026 | ❌ not re-written | Same — mirror v3 is current. |

## UPDATE 2026-08-03 (later) — TRUE version integers ARE available

`mcp__Atlassian__fetch` with a Confluence **ARI** (`ari:cloud:confluence:<cloudId>:page/<id>`) returns
`metadata.version`. Read live 2026-08-03: **SBC 13 · SBR 15 · PV 4 · TU 5 · WIP 6 · IV 3**. Our
`spec-current-2026-07-31` mirrors are **SBC 12 · SBR 15 · PV 4 · TU 5 · WIP 6 · IV 3** — so **five of
six mirrors are the SAME VERSION as live** (not merely same-dated) and **only SBC is stale, by exactly
one version**. Caveat 2 below is therefore WITHDRAWN; no Confluence cookies are needed for versions.
Full SBC v12→v13 delta: `../ADDENDUM-full-versions-SBC-delta-epic.md` + the raw structural diff
`../SBC-v12-to-v13-structural-diff.txt`.

## Two honest caveats (caveat 2 now WITHDRAWN)

1. **Pipeline change — do NOT byte-diff against the 2026-07-31 captures.** Those were produced from
   the Confluence REST storage format via `html2text`; these are Atlassian-MCP markdown (`html2text`
   is not installed in this container). Compare by **requirement text**, not by bytes.
2. ~~**No Confluence version integers.**~~ **WITHDRAWN — see the update above.** For the record, the original limitation was: `getConfluencePage` and `searchConfluenceUsingCql` return
   `lastModified` (date only) and no `version` object, and the REST cookie file the earlier passes
   used (`/tmp/fd-tickets/all-cookie-header.txt`) no longer exists — `/tmp` is ephemeral. The
   version column in `../VERIFICATION.md` is therefore derived from the live `lastModified` plus the
   newest in-body Change Log row, and says so. **Re-supply Confluence session cookies to restore
   true version reads.**

Method reference: `../../spec-current-2026-07-31/capture_specs_2026-07-31.py` (the REST pipeline, for
when cookies are available again).
