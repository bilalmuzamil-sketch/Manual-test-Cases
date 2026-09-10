# SV-9833 harness — the reusable half

Cookies are **never** in here. Each script reads them from `/tmp/sv9833/cookies.json` (branch) and
`/tmp/sv9833/stg-cookies.json` (staging), as `{"sv_sso_session":"…","PHPSESSID":"…","cf_clearance":"…"}`.
`/tmp` is wiped when the container restarts, so on a fresh session the QA lead re-supplies them.

| File | What it is |
|---|---|
| `lib.mjs` | API-only helpers: `marker(env)` reads the build marker, `sess(env,key)` does quick-login and swaps in the fresh `PHPSESSID`, `j()` is a JSON fetch. `QA` and `STG` are the two environments. |
| `b.mjs` | `boot(envName, key)` — headless Chromium through the agent proxy, cookies + localStorage hydrated, **with a network recorder** that keeps every non-GET request to the app's API host with its body, status and response. That recorder is what proved the payload difference between the builds. `SV_VW`/`SV_VH` override the viewport (2400 wide was needed to get Total Quantity and Average Cost into frame). |
| `po.mjs` | The UI driver, and the part worth keeping: `qSelect` handles a Quasar select whose test-id sits on the `<input>` (type, don't click) and retries once through the debounced "No results"; `clickId` clicks by element centre; `typeId` fills. |
| `t1.mjs` | Create an inventory PO with one plain control line, on the create screen. `node t1.mjs <qa\|stg> "<vendor>" <partNumber>` |
| `t2.mjs` | Add a PACKAGE line through **Add Order Item** on a saved PO — the SV-9833 path. `node t2.mjs <env> <poId> <part> <qty> <itemsPerPkg> <cost> <tag>` |
| `t7.mjs` | The same package line added **while creating** the PO — the contrast path. |
| `t9.mjs` | A **brand-new** part via `add_new_special_order_part` + Package — the front-end half of the fix. |
| `recv.mjs` | Receive on the flat screen `/accept-delivery/{id}`, including the **Delivery status** partial/fulfilled dialog. `node recv.mjs <env> <poId> <invoiceNo> <qty,qty> <tag> <partial\|fulfilled>` |
| `t15.mjs` | Receive through the product's own **Receive** button (the vendor-grouped screen) — ticks each `checkbox_item_*` and verifies `aria-checked` first, which is the only way it submits. |
| `geo.mjs` | Screenshot an Inventory row **plus its element geometry** (`getBoundingClientRect` per cell) to JSON, so annotations are drawn from real coordinates rather than eyeballed. |
| `inv.mjs` | Plain Inventory capture for a part number. |

`make_exhibits.py` (parent folder) consumes the `geo-*.json` + `geo-*.png` pairs. `build_comment.py`
builds the Jira ADF.

Recipes and the traps these scripts work around are written up in
`build/APP-ACTIONS-PLAYBOOK.md` **§AF**.
