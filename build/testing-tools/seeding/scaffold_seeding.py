#!/usr/bin/env python3
"""STAND UP A SEEDING KIT FOR A NEW FEATURE AREA — one command, no rediscovery.

    python3 build/testing-tools/seeding/scaffold_seeding.py <project-slug> "<Feature Name>"

It copies the PROVEN engine out of the reference implementation and leaves you with exactly one
thing to write: the manifest. That is the design — the engine is generic and already carries every
trap the reference implementation paid for; only the records differ between features.

WHAT IT CREATES in build/<project-slug>/seeding/
    seed.py                 the engine, copied verbatim from the reference (DO NOT fork its logic)
    dump_seed_manifest.py   regenerates the human-readable record inventory from live
    build_manifest.py       a STUB generator you fill in — never hand-edit the JSON it emits
    reseed.sh               the one-command rebuild, with the step order and the environment split
    verify.py               a STUB verifier — the step that decides whether a reseed is finished
    README.md               what to do next, in order

WHAT IT DOES NOT DO
    It does not invent your records, and it does not guess your endpoints. Read
    build/testing-tools/seeding/MANIFEST-SCHEMA.md and the skill first.
"""
import os, shutil, sys, textwrap

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
REF  = os.path.join(ROOT, 'build', 'global-search', 'seeding')
ENGINE = ['seed.py', 'dump_seed_manifest.py']


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    slug, feature = sys.argv[1], sys.argv[2]
    dest = os.path.join(ROOT, 'build', slug, 'seeding')
    if os.path.exists(dest):
        sys.exit(f"{dest} already exists — refusing to overwrite a live kit")
    if not os.path.isdir(REF):
        sys.exit(f"reference implementation not found at {REF}")
    os.makedirs(dest)

    for f in ENGINE:
        src = os.path.join(REF, f)
        if os.path.exists(src):
            shutil.copy2(src, os.path.join(dest, f))
            print(f"  copied  {f}")
        else:
            print(f"  MISSING in reference, skipped: {f}")

    open(os.path.join(dest, 'build_manifest.py'), 'w').write(textwrap.dedent(f'''\
        #!/usr/bin/env python3
        """GENERATE seed-manifest-{slug}.json FOR {feature}.

        🔴 NEVER HAND-EDIT THE JSON. It is generated, and a hand edit is lost on the next run.

        THE DESIGN RULE — write yours here before you write a single record:
            <one sentence that makes the whole set hang together. In the reference implementation it
             was "name the CUSTOMER and the VENDOR after the search term and every dependent record
             inherits the match", which collapsed dozens of separate seeds into one family.>

        Schema: build/testing-tools/seeding/MANIFEST-SCHEMA.md
        """
        import json, os

        RECORDS = [
            # {{
            #   "key": "...", "type": "...", "serves": [<case ids>],
            #   "find":   {{"mode": "search", "list": "/api/...", "coll": "collection",
            #              "field": "name", "value": "ZZAUTOTEST ...",
            #              "control": "<a record you KNOW exists in this estate>"}},
            #   "create": {{"endpoint": "/api/.../create", "payload": {{}}}},
            #   "verify": ["name"],
            #   "write":  {{"endpoint": "/api/.../change", "whole_record": True}},
            #   "_why":   "why this record exists, for the session that finds it in six months"
            # }},
        ]

        MANIFEST = {{
            "_README": "{feature} — seeded test data. Every record is tagged ZZAUTOTEST.",
            "environment": os.environ.get("SEED_ENV", "qa"),
            "_THE_DESIGN_RULE": "TODO",
            "records": RECORDS,
        }}

        if __name__ == "__main__":
            here = os.path.dirname(os.path.abspath(__file__))
            out = os.path.join(here, "seed-manifest-{slug}.json")
            json.dump(MANIFEST, open(out, "w"), indent=1)
            print(f"wrote {{out}} — {{len(RECORDS)}} records")
    '''))

    open(os.path.join(dest, 'verify.py'), 'w').write(textwrap.dedent(f'''\
        #!/usr/bin/env python3
        """PROVE THE DATA IS FINDABLE FOR {feature} — the step that decides a reseed is finished.

        🔴 A RESEED IS NOT FINISHED WHEN THE SEEDER PRINTS ITS COUNT. "The record exists" is not
        "the feature returns it". This script is the difference, and it is the ONLY thing that
        entitles anyone to say the data is good.

        WRITE ONE CHECK PER THING A TESTER WILL ACTUALLY DO, and check the IDENTITY of what comes
        back — never the row count. A count of 1 has already produced a false PASS on a real
        regression in this repo.

        🔴 IF THE FEATURE BEHAVES DIFFERENTLY PER ENVIRONMENT, WRITE ONE VERIFIER PER ENVIRONMENT
        and have the reseed script choose. Running the wrong one reports a dead environment that is
        perfectly healthy, and somebody then reseeds something that was never broken.
        """
        import sys
        print("TODO: write the checks for {feature}")
        sys.exit(1)
    '''))

    open(os.path.join(dest, 'reseed.sh'), 'w').write(textwrap.dedent(f'''\
        #!/usr/bin/env bash
        # ONE COMMAND REBUILDS THE {feature.upper()} TEST DATA.
        #
        #   ./reseed.sh qa     (keyword: RESEED {slug.upper()} QA)
        #   ./reseed.sh live   (keyword: RESEED {slug.upper()} LIVE)
        #
        # WHY A SCRIPT AND NOT A LIST OF STEPS IN A DOCUMENT: the steps depend on each other, and
        # the VERIFICATION STEP CAN BE A DIFFERENT PROGRAM ON EACH ENVIRONMENT. Getting that wrong
        # does not fail loudly. Encoding it removes the choice.
        #
        # SAFE TO RUN ANY NUMBER OF TIMES: every step measures first and creates only the difference.
        set -uo pipefail
        cd "$(dirname "$0")"

        # 🔴 THE ENGINE TAKES THE HOST FROM THE PROFILE FILE ITSELF (its "api" and "host" keys),
        # not from anything exported here. HOST below is used ONLY to read the build marker.
        # The env vars seed.py actually reads: SEED_PROFILE (the credentials/cookie file, default
        # /tmp/qa/cookies.json), SEED_MANIFEST, SEED_WORKPLACE (production needs it — the engine
        # lists the valid names in its error if you get it wrong), SEED_COUNT_CALLS (diagnostics).
        # Secrets live in /tmp at chmod 600 and are NEVER committed — this repo is public.
        case "${{1:-}}" in
          qa)   HOST="https://<branch>.qa.shopview.com"
                export SEED_PROFILE=/tmp/qa/cookies.json ;;
          live) HOST="https://app.shopview.com"
                export SEED_PROFILE=/tmp/prod/creds.json
                export SEED_WORKPLACE="<the workplace name>" ;;
          *) echo "usage: $0 qa|live"; exit 2 ;;
        esac
        export SEED_MANIFEST=seed-manifest-{slug}.json

        echo "build marker before: $(curl -s --max-time 20 "$HOST/" | grep -o 'content="v[^"]*"' | head -1)"

        step() {{ local label="$1"; shift; echo; echo "---- $label"
                 if ! "$@"; then echo; echo "🔴 STOPPED at: $label"; exit 1; fi; }}

        # 🔴 NO SEPARATE --check STEP. `--confirm` IS find-or-create: it measures every record
        # before it creates anything, so a --check first just measures everything twice.
        step "1/2  create the records, verify fields"  python3 seed.py --confirm
        step "2/2  PROVE IT"                           python3 verify.py

        echo "build marker after:  $(curl -s --max-time 20 "$HOST/" | grep -o 'content="v[^"]*"' | head -1)"
        echo "🔴 COMMIT THE STATE FILES — git is the only durable store, the container is not."
    '''))
    os.chmod(os.path.join(dest, 'reseed.sh'), 0o755)

    open(os.path.join(dest, 'README.md'), 'w').write(textwrap.dedent(f'''\
        # {feature} — seeding kit

        Scaffolded from the reference implementation at `build/global-search/seeding/`.
        Method: `build/skills/20-FEATURE-DATA-SEEDING.md`. Schema:
        `build/testing-tools/seeding/MANIFEST-SCHEMA.md`.

        ## Do these in order

        1. **Read the cases first, not a summary of them.** Extract what the tester will literally
           type or open. A term named only as "for example" still gets typed by somebody.
        2. **Write the design rule** at the top of `build_manifest.py` — the one sentence that makes
           one family of records serve dozens of cases.
        3. **Measure the environment before you create anything.** Some of what you need is already
           there, and seeding a duplicate is worse than seeding nothing.
        4. **Fill in `RECORDS`**, one `serves` list per record, then `python3 build_manifest.py`.
        5. **`python3 seed.py --check`** — a preview that writes nothing. Read it.
        6. **`python3 seed.py --confirm`**, then write `verify.py` and make it pass.
        7. **Point `reseed.sh` at the real host**, run it twice, and confirm the second run changes
           nothing. That is what "idempotent" means, and it is not true until you have seen it.
        8. **Commit the state files**, register the keywords `RESEED {slug.upper()} QA` /
           `RESEED {slug.upper()} LIVE` in `build/global-search/seeding/RESEED.md`, and write down
           every trap you hit while it is still fresh.
    '''))

    print(f"\n✅ scaffolded {dest}")
    print("   next: read build/testing-tools/seeding/MANIFEST-SCHEMA.md, then that folder's README.md")


if __name__ == '__main__':
    main()
