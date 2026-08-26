# PO DECISION REGISTER — Global Search V1 → V2 (2026-08-26)

One row per code-vs-document conflict and per HIGH-collateral / dangerous silence. The affected case is
HELD to the decision (Rule 58); never decided by us, never resolved by looking at the build.

| # | What the system DOES today (fact) | What the V2 PRD says | Options | Our recommendation | DECISION + date |
|---|---|---|---|---|---|
| PO-REG-1 | The FE search permission gate **reuses the whole app's routing map** (`routingService.ts` getPermittedRoutesMap, used by ~20 router guards + post-login redirect). | Silent — V2 changes search permissions/§9 without noting this shared code. | (a) keep the shared map; (b) give search its own gate. | HIGH collateral — do **not** change the shared map for search alone; if V2 re-gates search, verify routing + post-login are unaffected. | — |
| PO-REG-2 | **Time Clock role returns an entirely empty** global-search result (INV-71). | Silent. | (a) keep Time Clock excluded; (b) allow some results. | Keep excluded (dangerous silence — an access boundary). Confirm. | — |
| PO-REG-3 | Search requires a **minimum of 2 characters** (INV-10). | Silent (gives 150 ms debounce, no min stated). | (a) keep 2-char min; (b) different threshold. | Keep 2-char min unless PRD says otherwise. | — |
| PO-REG-4 | Selecting a result fires a **Google Analytics `global_search_use`** event (INV-48). | §6.4 defines a **new** telemetry schema (impressions/clicks). | (a) keep GA event AND add new telemetry; (b) replace GA with new telemetry. | Confirm whether the existing GA event remains alongside §6.4 telemetry. | — |
| PO-REG-5 | Non-WO result types have **no deterministic order** (INV-18). | §6 introduces relevance ranking (a change). | (a) new ranking replaces undefined order (change); (b) keep. | Treat as a V2 change (ranking), not a regression — recorded for completeness. | — |
| PO-REG-6 | At PRD **v11**, Work Orders were indexed on **status**; at **v12** "status" was **removed** from WO indexed fields (§4), with **no change-log entry**. | v12 (unlogged edit). | (a) intended removal; (b) accidental. | Confirm the v12 edit was intended; log it. Meanwhile WO-status search is treated as removed (not a regression). | — |

Route these rows into the PO question sheet (07-PO-QUESTIONS.md), plain words, sent last (Rule 66).
