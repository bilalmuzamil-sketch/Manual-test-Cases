# STAGE 1 SEED-VERIFY — per-tab prefix group (C72120 · C72121 · C72122): **GREEN, released to Stage 2**

**Per `SEQUENCED-HANDOFF-SEED-THEN-BUILDVERIFY-2026-09-20.md`:** data is seeded first, the group
passes its seed-verify gate, and only then does it move to build verification. **This group has
passed.**

| | |
|---|---|
| **Cases** | C72120 (Parts tab) · C72121 (Vendors tab) · C72122 (Assets tab) — folder *Ranking and Prioritization* |
| **Build** | `https://sv9160.qa.shopview.com` — **`v26.36.8-d146c39`**, measured **2026-09-20** |
| **Data** | ✅ **14/14 records, 0 field gaps.** Each case returns **exactly three rows** in its own tab with **zero foreign rows** |
| **Rebuild** | `SEED_MANIFEST=seed-manifest-per-tab-prefix.json python3 seed.py --confirm` from `build/global-search/seeding/` · generator `build_per_tab_prefix_manifest.py` — **never hand-edit the JSON** |

---

## 1 · What to type, and what is there

Each case uses **its own keyword**, sharing no stem with the others — the search is deliberately
fuzzy, and keywords a character or two apart match each other, which is how an earlier scheme in
this project broke. All six tokens (three keywords and three typo siblings) were measured at **zero
rows before anything was created**, with a live control proving the search was answering.

| Case | Type this | Open this tab | The three rows, in the order the product returns them |
|---|---|---|---|
| **C72120** | `ZZKRYPTON` | Parts | `ZZKRYPTON Brake Kit` · `Heavy Duty ZZKRYPTON Filter` · `ZZKRYPTOM Wheel Seal` |
| **C72121** | `ZZMAGENTA` | Vendors | `ZZMAGENTA Supply Co` · `Northgate ZZMAGENTA Parts` · `ZZMAGENTO Traders` |
| **C72122** | `ZZOBSIDIAN` | Assets | `2019 ZZOBSIDIAN Trucks Hauler` · `2019 Western Heavy ZZOBSIDIAN Hauler` · `2019 ZZOBSIDIAM Trucks Hauler` |

Everything else is held flat, as the cases require: the parts have **no stock, the same bin, the
same cost and price**, and have never been sold or opened; the vendors share an address and
telephone and have **no purchase orders**; the three vehicles share **one owner, one year and one
model**, with neutral VINs and unit numbers.

---

## 2 · 🔴 C72120 IS EXPECTED TO FAIL, AND FAILING IS THE CORRECT OUTCOME

C72120 is a regression test for **[SV-10279](https://shopview.atlassian.net/browse/SV-10279)**,
which is **open**. The data is correct; the product is not.

Measured on this build, with the match label the API returns for each row:

| Case | A — name *begins with* the query | B — name *contains* it | C — typo |
|---|---|---|---|
| **C72120 Parts** | **`word`** 🔴 score 1 | `word` score 1 | `fuzzy` score 0.41 |
| **C72121 Vendors** | **`prefix`** ✅ score 1 | `word` score 1 | `fuzzy` score 0.36 |
| **C72122 Assets** | **`prefix`** ✅ score 1 | `word` score 1 | `fuzzy` score 0.41 |

Two tabs, seeded identically in the same pass, label the begins-with row `prefix`. **Parts labels
it `word`** — the product does not recognise the prefix at all, so A and B tie and their order
falls to whichever was touched most recently.

**Record C72120 as FAILED against SV-10279. Do not raise a new defect, and do not rewrite the
Expected** — the expectation comes from PRD §6.1 and §4 (Rule 57). C72121 and C72122 should pass.

🔴 **Do not judge C72120 by row order alone.** With A and B tied the order is a recency artefact and
can flip between runs. **The evidence is the match label**, which is stable — §4 shows how to read it.

---

## 3 · Two traps this group already fell into, so you do not have to

**A part number that carries the keyword hides the description.** The first attempt numbered the
parts with the keyword; both rows then matched on `part_number` as a prefix and the description —
the field the case is actually about — never came into it. The numbers are deliberately neutral
(`PERTAB-700x`).

**Make and model are indexed separately, not as one displayed name.** The assets first came back
*backwards*: `make` = the keyword exactly made A an **exact** match, while B's model *began* with
the keyword and made B a **prefix** match, ranking the contains row above the begins-with row for a
reason unrelated to the rule. The keyword now starts a field on A without being the whole field,
and sits mid-field on B.

Both were found by measuring the result, not by reading the seed log — the seeder reported a clean
14/14 in both cases.

---

## 4 · Reading the match label (the reliable check)

```bash
curl -s "https://sv9160api.qa.shopview.com/api/search?q=ZZKRYPTON" \
  -H "Cookie: $COOKIES" -H 'Accept: application/json' \
  | python3 -c 'import sys,json
for g in json.load(sys.stdin)["data"]["groups"]:
    for i in g.get("items") or []:
        m=i.get("match") or {}
        print(f"{g[\"type\"]:10} {m.get(\"kind\"):8} {m.get(\"field\"):12} {i.get(\"primary\")}")'
```

What the labels mean, measured rather than assumed: the keyword at the **start of a field** gives
`prefix`; at the start of a **later token** gives `word`; **mid-token** is not matched at all.

🔴 **The branch switches itself off.** A `403 AccessDenied` usually means the environment is asleep,
not that your login expired — the two-second test and the wake command are in
`build/APP-ACTIONS-PLAYBOOK.md` §R.

---

## OUTSTANDING — what I need from you

| # | Item | Who |
|---|---|---|
| 1 | **Stage 1 is green; this group is released to Stage 2.** Nothing blocks build verification of the three cases | — |
| 2 | **C72120 will fail against the open SV-10279.** Expected, and it should be recorded as such rather than raised as a new defect | build-verify session |
| 3 | The fuller four-entity comparison for SV-10279 — including a correction to the ticket's "it works on Customers" claim — is in `SV-10279-Parts-Prefix-Ranking-Comparison-Evidence.md` | QA lead |
| 4 | The other groups in the sequenced handoff (permissions, toggle, ranking, fuzzy) were seeded and verified earlier in this session and are already green | — |
