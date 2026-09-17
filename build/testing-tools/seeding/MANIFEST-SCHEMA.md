# THE SEED MANIFEST SCHEMA — every key the engine reads, and what each one is for

**Read this before writing a manifest for a new feature area.** It is derived from the engine itself
(`seed.py`), not from memory, so it is what the code actually honours. The reference implementation
that every key below is exercised by is `build/global-search/seeding/`.

**The one thing to understand first:** `seed.py` is a **GENERIC ENGINE**. Nothing in it knows about
Global Search, or about any feature. It reads a manifest and does four things — **find**, **create if
absent**, **verify every declared field**, **repair what is wrong** — and it is *find-or-create*, so
running it twice is safe and running it ten times is still safe. **A new feature area needs a NEW
MANIFEST, not new engine code.** If you find yourself editing `seed.py` for a feature, stop: either
the manifest can express it, or you have found a genuinely new API shape and the engine gains one
general capability (never a feature-specific branch).

---

## The file

```jsonc
{
  "_README":        "what this universe is for, in plain words",
  "environment":    "which estate these ids belong to — qa | prod",
  "_THE_DESIGN_RULE": "the sentence that makes the whole set hang together (see the skill)",
  "records": [ { …one object per record… } ]
}
```

Anything beginning `_` is a note for the next human. The engine ignores it. **Use them** — the
`_why` on each record is what stops a later session deleting something load-bearing.

---

## A record

| Key | Required | What it does |
|---|---|---|
| `key` | ✅ | The stable handle. Ids are saved against it, other records reference it, and the state files are keyed by it. **Never renamed** — renaming orphans the captured ids and the seeder creates duplicates. |
| `type` | | Human label for the report only. |
| `serves` | ✅ in practice | The list of case ids this record exists for. **This is the audit trail** that satisfies the "every case's data is seeded or accounted for" rule — and it is what tells a future session whether a record is safe to change. |
| `find` | ✅ | How to tell whether it already exists. See the five modes below. |
| `create` | ✅ | `{endpoint, payload}` — the POST that brings it into being. |
| `patch` | | `{endpoint, fields}` — values that cannot be set at create time and need a second call. |
| `verify` | | The field names that MUST be right. The engine reads the record back and compares. |
| `read_as` | | Field-name translation: `{"phone": "telephone"}` when the API **writes** one name and **reads back** another. Skipping this produces a permanent false gap. |
| `write` | | `{endpoint, whole_record}` — how to repair a gap. `whole_record: true` resends the entire record with the field replaced, which some endpoints require and others do not care about. Also takes `resolve_ids`, `id_as`, `also`. |
| `skip_verify` | | Fields that are set but genuinely cannot be read back. Declare them; never quietly drop them from `verify`. |
| `count` | | For a bulk record: how many of this thing must exist. The engine tops up the shortfall and **drops recorded ids that no longer resolve** rather than appending new ones to dead ones. |
| `unique` | | The field that must differ between the copies of a `count` record. |
| `extra_fields` | | Per-copy field overrides for a `count` record. |
| `_why` | strongly advised | Why this record exists. The cheapest thing you can leave the next session. |

---

## The five `find` modes — and why there are five

There are five because **one was not enough, and each extra mode is a scar**. Pick by what the API
actually supports, not by what looks tidiest.

| `mode` | Use it when | Keys |
|---|---|---|
| `search` | The list endpoint supports `?search=` and honours it. **The default.** | `list`, `coll`, `field`, `value`, `control` |
| `page` | `?search=` is absent or unreliable, but pages work. | `list`, `coll`, `field`, `value` or `prefix` |
| `ids` | **`?search=` silently matches nothing** on this endpoint (measured true of work orders). The only honest route is to verify by the ids the seeder captured when it created them. | `list`, `view` (`/api/x/view/{id}`), `coll`, `ids` |
| `child` | The record lives INSIDE its parent and has **no list endpoint of its own** — a contact is the case that forced this. Finding the parent and calling that "present" is the trap: the company exists whether or not anyone works there. | `parent` (another record's `key`), `view`, `path` (dotted, e.g. `company.contacts`), `field`, `value` |
| — | | |

### `control` — the single most valuable key in the file

`control` names a record **known to exist in this estate**. Before believing "my record is missing",
the engine searches for the control. **If a record known to exist comes back empty, the probe is
broken and the "missing" verdict is thrown away.** Without this, a flaky read does not merely
miscount — it triggers a CREATE, and therefore a DUPLICATE of a record that was there all along.

🔴 **A control belongs to ONE estate.** Point the seeder at a different environment and the control
vanishes, which looks exactly like a broken probe. The engine therefore falls back to calibrating
against whatever is actually in front of it: read a row off an unfiltered page and search for a word
out of it. **Keep that fallback.** It is what separates the three cases honestly — search is broken /
the endpoint is simply empty / search works and ours is genuinely missing.

---

## Two resolver blocks, for when the API will not take a name

Both exist for the same reason: **when the lookup table is not exposed, the existing data IS the
lookup table.** Hardcoding an id instead would rot on the next redeploy.

- **`resolve_ids`** (inside `write`) — the endpoint accepts only an id where the manifest names a
  thing. Keys: `list`, `match_field`, `take`, `take_as`, `also_take`. Example: no vehicle-models
  endpoint answers at all, but the branch holds dozens of Cascadias, so the model id is taken off one
  of them.
- **`resolve_nested`** — the payload needs an array of objects built from ids that already exist
  (`bins: [{id, isDefault, quantity}]`). Keys: `list`, `search`, `take_path`, `template`, where `@`
  in the template is substituted with what was dug out. It sweeps an unfiltered page if the named
  example is absent, **because the named example was never the point** — any row carrying the path
  will do.

---

## The non-negotiables, in one place

1. **A 2xx is not evidence a write landed.** `/api/vehicles/change` answers 201 to a model NAME and
   changes nothing. Always read the record back — that is what `verify` is for.
2. **Ids are keyed by universe AND environment.** One estate's ids must never be written into
   another's state file. It has happened, and four records read as MISSING while sitting there.
3. **A single empty read is not a missing record.** Retry before believing it; the engine retries 3×.
4. **"The record exists" is not "the search returns it".** A seeding run is finished when the
   VERIFIER passes, never when the seeder prints its count.
5. **Records that cannot be found by searching cannot be de-duplicated by searching.** Lose their
   captured ids and the next run creates twins. Guard the state file; it is as valuable as the code.
