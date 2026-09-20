# SV-10279 — Parts prefix ranking: the comparison, and what it shows

**Ticket:** <https://shopview.atlassian.net/browse/SV-10279> · **Cases:** C55707 (the rule, stated
for *any* entity type), C55724 (the same rule on Customers)
**Environment:** `https://sv9160.qa.shopview.com` · build **`v26.36.8-d146c39`** · measured
**2026-09-20**
**Data:** seeded and verified — 12 records, 0 field gaps. Keyword **`ZZVORTAC`**, confirmed to
return **zero** rows before anything was created.

---

## 1 · The one-line version

Type **`ZZVORTAC`**. Customers and Vendors label a name that *begins* with it **`prefix`**. Parts
label the identical shape of match **`word`** — the product never recognises the prefix at all.

**The evidence is the product's own label, not our opinion about row order.**

---

## 2 · One query, four record types, one variable

Every record below was created in the same pass with every other signal deliberately flat: same
address, city and telephone; no contacts; no work orders; both assets share **one** owner; both
parts have **zero stock, the same bin, the same cost and the same price** — the exact conditions
the ticket says its own pair was created under. The **only** difference within each pair is *where
the keyword sits*.

| Group | Row | `match.kind` | `match.field` | score |
|---|---|---|---|---|
| **Customers** | `ZZVORTAC Freight Ltd` — begins with | **`prefix`** ✅ | name | 1 |
| | `Bolton ZZVORTAC Services` — mid-name | `word` | name | 1 |
| **Vendors** | `ZZVORTAC Supply Co` — begins with | **`prefix`** ✅ | name | 1 |
| | `Northgate ZZVORTAC Parts` — mid-name | `word` | name | 1 |
| **Parts** | `ZZVORTAC Brake Kit` — **begins with** | **`word`** 🔴 | description | 1 |
| | `Heavy Duty ZZVORTAC Filter` — mid-name | `word` | description | 1 |

Two record types get it right. Parts does not. Same query, same response, same moment — so
*"maybe your test records differed"* is not available as an explanation.

🔴 **The part numbers are deliberately neutral** (`PARITYPN-9001`, `PARITYPN-9002`). A first
attempt numbered them `ZZVORTAC-900x`, and both rows then matched on **part number** as a prefix,
which hid the description completely. The ticket is about the **description**, so the keyword lives
only there.

---

## 3 · What the evidence actually diagnoses

Three measurements together describe the matcher exactly:

| Where the keyword sits | Result |
|---|---|
| At the very **start of the field** | `kind=prefix` |
| At the start of a **later token** in the field | `kind=word` |
| **Mid-token** (no delimiter before it) | **not matched at all** |

That third row was proved with a control: asset B's unit is `UNITBZZVORTACX2`, and it **is**
findable by searching its own unit or its VIN — but it never comes back for `ZZVORTAC`.

So the matcher is token-based, and *prefix* means *"matches at offset 0 of the field"*.

> **The diagnosis:** the offset-0 check is applied to the **name** field (customers, vendors) and to
> the **unit** field (assets), but **not to a part's `description`** — which PRD §4 names as the
> field displayed as a part's name. A description beginning with the query is therefore scored as an
> ordinary token match.

That is a single, concrete thing for a developer to look at, rather than "ranking feels wrong".

---

## 4 · 🔴 A CORRECTION TO THE TICKET — "it works on Customers" is only half true

The ticket says Customers behave correctly. **By label, yes. By score, no.**

`ZZVORTAC Freight Ltd` (prefix) and `Bolton ZZVORTAC Services` (word) both come back on
**score = 1** — exactly like the two parts. The same is true of the ticket's own `ZZPREFIX` pair.

So the prefix bonus is being **recognised** on customers but is **not separating the two rows**
there either, which leaves their order to the same recency fallback the ticket complains about on
Parts. PRD §6.1 sets prefix `+0.70` against whole-word `+0.50`; no such gap is visible in any
response we measured, on any entity type.

**Stated as measurement, not as a second defect.** It may be that the response normalises the top
score to 1 and the gap exists internally. Either way the ticket should not rest on *"Customers are
fine"* — the part of that claim which holds is the **label**, and that is the part worth putting in
front of a developer.

---

## 5 · How to reproduce it in ten seconds

**In the app:** press `Ctrl`+`K`, type **`ZZVORTAC`**, and open the Customers, Vendors and Parts
tabs in turn.

**Against the API**, which is the version that shows the labels:

```bash
curl -s "https://sv9160api.qa.shopview.com/api/search?q=ZZVORTAC" \
  -H "Cookie: $COOKIES" -H 'Accept: application/json' \
  | python3 -c 'import sys,json
d=json.load(sys.stdin)["data"]["groups"]
for g in d:
    for i in g.get("items") or []:
        m=i.get("match") or {}
        print(f"{g[\"type\"]:12} {m.get(\"kind\"):8} {m.get(\"field\"):12} {i.get(\"primary\")}")'
```

Expected output today — note `parts` is the only group where a begins-with row is not `prefix`:

```
customers    prefix   name         ZZVORTAC Freight Ltd
customers    word     name         Bolton ZZVORTAC Services
vendors      prefix   name         ZZVORTAC Supply Co
vendors      word     name         Northgate ZZVORTAC Parts
parts        word     description  ZZVORTAC Brake Kit          <-- should be prefix
parts        word     description  Heavy Duty ZZVORTAC Filter
```

---

## 6 · The records, so nothing has to be re-derived

| Key | Record | Role |
|---|---|---|
| `pfx_cust_a` / `pfx_cust_b` | `ZZVORTAC Freight Ltd` / `Bolton ZZVORTAC Services` | working control |
| `pfx_vend_a` / `pfx_vend_b` | `ZZVORTAC Supply Co` / `Northgate ZZVORTAC Parts` | working control |
| `pfx_part_a_cat` + `_inv` | `ZZVORTAC Brake Kit`, part number `PARITYPN-9001`, qty 0 | **the defect** |
| `pfx_part_b_cat` + `_inv` | `Heavy Duty ZZVORTAC Filter`, part number `PARITYPN-9002`, qty 0 | **the defect** |
| `pfx_asset_a` / `pfx_asset_b` | units `ZZVORTAC-A1` / `UNITBZZVORTACX2`, one shared owner | shows the mid-token rule |

**Rebuild after a wipe:** `SEED_MANIFEST=seed-manifest-prefix-parity.json python3 seed.py --confirm`
from `build/global-search/seeding/`. Generator: `build_prefix_parity_manifest.py` — **never
hand-edit the JSON**.

🔴 **Assets are NOT a like-for-like control.** They match on `unit`, a code field, not on a name.
Customers and Vendors are the honest comparison for a *name* prefix rule; the asset pair is here
because it pins down the mid-token behaviour in §3.

🔴 **The branch switches itself off.** A `403 AccessDenied` usually means the environment is asleep,
not that your login expired — the two-second test and the wake command are in
`build/APP-ACTIONS-PLAYBOOK.md` §R.

---

## OUTSTANDING — what I need from you

| # | Item | Who |
|---|---|---|
| 1 | **The comparison data is seeded and verified; nothing blocks the write-up.** 12/12 records, 0 gaps, on `v26.36.8-d146c39` | — |
| 2 | **§4 is a candidate addition to SV-10279** — that scores tie at 1 on customers too, so "it works on Customers" holds only for the label. I have **not** edited the ticket: that needs the QA lead's go-ahead | QA lead |
| 3 | No new TestRail case was created for a Parts-specific prefix check. C55707 already states the rule for *any* entity type, so this may be a coverage question rather than a new case | QA lead |
