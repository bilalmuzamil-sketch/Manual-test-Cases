#!/usr/bin/env python3
"""PROOF, RUNNABLE, OF EVERY CAPABILITY THE OLD SEARCH HAD.

    python3 prove_all_v1_capabilities.py            # the table
    python3 prove_all_v1_capabilities.py --md       # the same, as markdown for the register

Each row is one capability. Where the capability is about MATCHING, the row is an assertion that
runs against the re-created old search (`v1_search.py`) and passes or fails. Where it is about
something matching cannot speak for - a keyboard shortcut, a row icon, an analytics event, how the
panel looked on a phone, or scoping done in the database - the row says NOT SIMULATABLE and rests
on its code citation. Those are listed, never quietly dropped: a register that hid them would be
claiming more than it can show.

Exit code 0 means every runnable assertion passed.
"""
import sys
from v1_search import work_order, vendor, customer, vehicle, part, search, finds, GROUP_OF

# ─── the fixtures: the same records the live test data uses, so this mirrors reality ─────────
CUST = customer("ZZAUTOTEST Bridgeport Hauling", "1450 Kestrelway Industrial", "Dock 7B",
                "Ohio", "44872-9931", "Fernvale", "(419) 555-0143", "bridgeporthauling-zzt.com",
                contacts=[("Marlene", "Okonkwo", "Dispatch Supervisor", "(419) 555-0177")])
VEND = vendor("ZZAUTOTEST Kestrel Parts Supply", "88 Halbrook Trace", "Bay 12C", "Ohio",
              "43055-2210", "Marnston", "(614) 555-0188", "parts@kestrelsupply-zzt.com")
VEH  = vehicle("2019", "Freightliner", "Cascadia", "ZZT-4471", "1FUJGLDR9KLZZ4471", "OHZZT471",
               owner="ZZAUTOTEST Bridgeport Hauling")
WO   = work_order("S-17611", "ZZAUTOTEST Bridgeport Hauling", "estimate", shop_id="9160",
                  kind="service", raw_number="17611")
WOQ  = work_order("S-17612", "ZZAUTOTEST Bridgeport Hauling", "quality_check", shop_id="9160",
                  kind="service", raw_number="17612")
PS   = work_order("P-253", "ZZAUTOTEST Bridgeport Hauling", "open", shop_id="9160",
                  kind="parts", raw_number="253")
PART = part("ZZAUTOTEST Airline Coupler Vernway", "ZZT-77-3300")
NEAR = customer("ZZAUTOTEST Darlene Cartage", "77 Ridgeway Spur", "", "Ohio", "44872-4411", "Fernvale")
ALL  = [CUST, VEND, VEH, WO, WOQ, PS, PART, NEAR]
HIST = [{"group": "Recent", "label": "something opened earlier", "type": "Customer"}]

F, B, N = "field", "behaviour", "not-simulatable"
ROWS = []
def row(kind, cid, plain, cite, cases, check=None):
    ROWS.append((kind, cid, plain, cite, cases, check))

SQL = "FetchDataQueryHandler.php"
TS  = "useGlobalSearch.ts"

# ══ WHAT YOU COULD TYPE TO FIND A JOB OR A PART SALE ════════════════════════════════════════
row(F, "job-1", "A job, by its plain number with nothing in front", f"{SQL}:96 wo.raw_number", "C55672",
    lambda: finds("17611", ALL))
row(F, "job-2", "A job, by its number as it is written", f"{SQL}:98-111 wo.number", "C53579",
    lambda: finds("S-17611", ALL))
row(F, "job-3", "A job, by its number with the shop number in front (four written forms)",
    f"{SQL}:100-110 four shop-prefixed variants", "C53579",
    # The four forms the query actually writes, from "S-17611" with shop 9160. An earlier version
    # of this assertion invented a fifth form ("S917611") that the SQL never produces, and the
    # suite failed on it - which is the point of having the suite rather than reasoning it out.
    lambda: all(finds(q, ALL) for q in ("S17611", "S916017611", "S9160-17611", "9160-17611")))
row(F, "job-4", "A job, by the name of the customer it is for", f"{SQL}:112 c.name", "C53578",
    lambda: finds("Bridgeport", ALL))
row(F, "job-5", "A part sale, by the name of the customer it is for",
    f"{SQL}:112 - the same query returns part sales", "C55665",
    lambda: any(r["group"] == "Part Sales" for r in search("Bridgeport", [PS])["rows"]))
row(F, "job-6", "A job, by typing its status - and a two-word status typed as one word",
    f"{SQL}:113-116 wo.status, underscores removed, quality_check becomes qualitycheckqc", "C55658",
    lambda: finds("estimate", ALL) and finds("qualitycheck", [WOQ]))

# ══ A CUSTOMER ══════════════════════════════════════════════════════════════════════════════
row(F, "cust-1", "A customer, by its company name", f"{SQL}:229 c.name", "C55667",
    lambda: finds("ZZAUTOTEST Bridgeport", ALL))
row(F, "cust-2", "A customer, by its company name typed with no spaces at all",
    f"{SQL}:230 the name is written a second time with spaces removed", "C53602",
    lambda: finds("ZZAUTOTESTBridgeportHauling", ALL))
row(F, "cust-3", "A customer, by its street address", f"{SQL}:231 c.address_1", "C53582",
    lambda: finds("Kestrelway", ALL))
row(F, "cust-4", "A customer, by the second line of its address", f"{SQL}:232 c.address_2", "C53604",
    lambda: finds("Dock 7B", ALL))
row(F, "cust-5", "A customer, by its county or state", f"{SQL}:233 c.state_or_province", "C53582",
    lambda: finds("Ohio", ALL))
row(F, "cust-6", "A customer, by its postcode", f"{SQL}:234 c.postal_code", "C53582",
    lambda: finds("44872-9931", ALL))
row(F, "cust-7", "A customer, by its town", f"{SQL}:235 c.city", "C53582",
    lambda: finds("Fernvale", ALL))
row(F, "cust-8", "A customer, by its own switchboard number (written with dashes)",
    f"{SQL}:236 c.telephone, brackets stripped and ) turned into -", "C55662",
    lambda: finds("419-555-0143", ALL))
row(F, "cust-9", "A customer, by its website", f"{SQL}:237 c.website", "C53583",
    lambda: finds("bridgeporthauling-zzt.com", ALL))
row(F, "cust-10", "A customer, by a contact's first name", f"{SQL}:238-244 cu.first_name", "C55670",
    lambda: finds("Marlene", ALL))
row(F, "cust-11", "A customer, by a contact's surname", f"{SQL}:238-244 cu.last_name", "C55670",
    lambda: finds("Okonkwo", ALL))
row(F, "cust-12", "A customer, by a contact's job title", f"{SQL}:238-244 cu.title", "C53603",
    lambda: finds("Dispatch Supervisor", ALL))
row(F, "cust-13", "A customer, by a contact's own phone number", f"{SQL}:238-244 cu.telephone", "C55662 · C53603",
    lambda: finds("419-555-0177", ALL))

# ══ A VENDOR ════════════════════════════════════════════════════════════════════════════════
row(F, "vend-1", "A vendor, by its name", f"{SQL}:157 v.name", "C55668",
    lambda: finds("ZZAUTOTEST Kestrel", ALL))
row(F, "vend-2", "A vendor, by its street address", f"{SQL}:158 v.address_1", "C53585",
    lambda: finds("Halbrook", ALL))
row(F, "vend-3", "A vendor, by the second line of its address", f"{SQL}:159 v.address_2", "C53604",
    lambda: finds("Bay 12C", ALL))
row(F, "vend-4", "A vendor, by its county or state", f"{SQL}:160 v.state_or_province", "C53606",
    lambda: finds("Ohio", [VEND]))
row(F, "vend-5", "A vendor, by its postcode", f"{SQL}:161 v.postal_code", "C53585",
    lambda: finds("43055-2210", ALL))
row(F, "vend-6", "A vendor, by its town", f"{SQL}:162 v.city", "C53585",
    lambda: finds("Marnston", ALL))
row(F, "vend-7", "A vendor, by its phone number", f"{SQL}:163 v.telephone", "C55663",
    lambda: finds("614-555-0188", ALL))
row(F, "vend-8", "A vendor, by its email address", f"{SQL}:164 v.email", "C53584",
    lambda: finds("parts@kestrelsupply-zzt.com", ALL))

# ══ A VEHICLE ═══════════════════════════════════════════════════════════════════════════════
row(F, "veh-1", "A vehicle, by the name of the customer who owns it", f"{SQL}:287 c.name", "C53581",
    lambda: any(r["group"] == "Assets" for r in search("Bridgeport", [VEH])["rows"]))
row(F, "veh-2", "A vehicle, by its year", f"{SQL}:288 v.year", "C53605", lambda: finds("2019", ALL))
row(F, "veh-3", "A vehicle, by its make", f"{SQL}:289 vmk.name", "C55664", lambda: finds("Freightliner", ALL))
row(F, "veh-4", "A vehicle, by its model", f"{SQL}:290 vm.name", "C55664", lambda: finds("Cascadia", ALL))
row(F, "veh-5", "A vehicle, by its unit number", f"{SQL}:291 v.unit", "C53580", lambda: finds("ZZT-4471", ALL))
row(F, "veh-6", "A vehicle, by its chassis number - whole, or any part of it",
    f"{SQL}:292 v.vin, matched anywhere by {TS}:84-93", "C55669",
    lambda: finds("1FUJGLDR9KLZZ4471", ALL) and finds("ZZ4471", ALL) and finds("LDR9KL", ALL))
row(F, "veh-7", "A vehicle, by its number plate", f"{SQL}:293 v.licence_plate", "C53516",
    lambda: finds("OHZZT471", ALL))
row(F, "veh-8", "A vehicle, by its year typed together with its make",
    f"the visible label is '<year> <make> <model>', {SQL}:273-280, matched by {TS}:76-82", "C53605",
    lambda: finds("2019 Freightliner", ALL) and not finds("Cascadia 2019", ALL))

# ══ A PART ══════════════════════════════════════════════════════════════════════════════════
row(F, "part-1", "A part, by its description", f"{SQL}:326 cp.name", "C53607",
    lambda: finds("Airline Coupler", ALL))
row(F, "part-2", "A part, by its part number - with the dashes or without them",
    f"{SQL}:327-328 part_number written twice, once with dashes removed", "C55666",
    lambda: finds("ZZT-77-3300", ALL) and finds("ZZT773300", ALL))
row(F, "part-3", "A part the shop has NEVER stocked - the catalogue is the only source",
    f"{SQL}:330 reads CataloguePart. There is no inventory join anywhere in the query", "C53601 · C45153",
    lambda: finds("Vernway", ALL))

# ══ HOW IT BEHAVED ══════════════════════════════════════════════════════════════════════════
row(B, "INV-10", "Nothing is matched until you have typed two characters", f"{TS}:66-71", "C45161",
    lambda: search("a", ALL, history=HIST)["showing_history"])
row(B, "INV-11", "Records whose visible name STARTS with what you typed come first",
    f"{TS}:76-82 then :156-180", "C55667 · C55668 · C55686",
    lambda: search("2019 Freightliner", ALL)["rows"][0]["group"] == "Assets")
row(B, "INV-12", "What you typed is looked for ANYWHERE inside the record, not just at the start",
    f"{TS}:84-93", "C55659 · C55660", lambda: finds("idgepor", ALL) and finds("ernva", ALL))
row(B, "INV-13", "Capitals never mattered", f"{TS}:67, 81, 91", "C55671",
    lambda: finds("bRiDgEpOrT", ALL) and finds("BRIDGEPORT", ALL))
row(B, "INV-14/15", "Three rows per kind of record, and NO limit on the total",
    f"{TS}:152 MAX_PER_TYPE = 3, with no overall cap", "C55661",
    lambda: (lambda rs: sum(r["group"] == "Customers" for r in rs) == 3
                        and sum(r["group"] == "Vendors" for r in rs) == 3 and len(rs) == 6)(
        search("ZZAUTOTEST", [customer(f"ZZAUTOTEST Cust {i}") for i in range(5)] +
                             [vendor(f"ZZAUTOTEST Vend {i}") for i in range(5)])["rows"]))
row(B, "INV-16", "A record that matches in more than one way is still listed only once", f"{TS}:182-184", "C45157",
    lambda: sum(1 for r in search("ZZAUTOTEST Bridgeport Hauling", [CUST])["rows"]) == 1)
row(B, "INV-17", "Matching a contact still returns the company they work for", f"{TS}:186-190", "C55670",
    lambda: search("Okonkwo", [CUST])["rows"][0]["label"] == "ZZAUTOTEST Bridgeport Hauling")
row(B, "INV-20", "Vehicles are shown to people under the heading 'Assets'", f"{TS}:100-137", "C45155",
    lambda: GROUP_OF["Vehicle"] == "Assets")
row(B, "INV-44/63", "A search that matches nothing brings the recently-viewed list back",
    f"{TS}:229-231", "C55675 · C55679",
    lambda: search("zzqqxxnothing", ALL, history=HIST)["showing_history"])
row(B, "INV-71", "A Time Clock user gets no search results at all", f"{TS}:140-150", "C45147",
    lambda: not search("ZZAUTOTEST", ALL, permitted=set())["rows"])
row(B, "INV-72", "Each kind of result appears only for users allowed that area", f"{TS}:140-150",
    "C45142 · C45144 · C45145 · C45146",
    lambda: {r["group"] for r in search("ZZAUTOTEST", ALL, permitted={"Customer", "Contact"})["rows"]} == {"Customers"})
row(B, "INV-73", "Parts appear only for users with the catalogue and inventory area", f"{TS}:140-150", "C45143",
    lambda: not any(r["group"] == "Parts" for r in
                    search("Vernway", ALL, permitted={"Customer", "Vendor"})["rows"]))
row(B, "INV-74", "A kind of result nobody recognised was hidden, not shown by accident", f"{TS}:140-150", "C45148",
    lambda: not search("anything", [{"type": "SomethingNew", "label": "anything at all", "search": "anythingatall"}],
                       permitted={"Customer"})["rows"])
row(B, "INV-95", "ONLY records containing what you typed came back - never a different spelling",
    f"{TS}:76-93 - literal comparison, no allowance for near spellings", "C55685",
    lambda: finds("Marlene", [CUST]) and not finds("Marlene", [NEAR]))
row(B, "INV-96", "The record you actually typed was never pushed below a looser match",
    f"{TS}:156-180 - pass one is appended before pass two", "C55686",
    lambda: search("ZZAUTOTEST Kestrel Parts Supply", [CUST, VEND])["rows"][0]["group"] == "Vendors")

# ══ TRUE OF V1, BUT MATCHING CANNOT SPEAK FOR IT ════════════════════════════════════════════
for cid, plain, cite, cases in [
    ("INV-18", "Newer jobs were listed above older ones", f"{SQL} ORDER BY wo.start_date DESC", "C53588"),
    ("INV-33", "A record you had just created was findable straight away",
     f"{TS}:305-312 invalidateSearchData, called from 5 places incl. WorkOrders.vue:1914", "C53586 · C53587"),
    ("INV-34", "A user with no default branch did not break search", "the workplace decorator in the query", "C45159"),
    ("INV-40", "The keyboard shortcut opened search", "GlobalSearch.vue:128-131", "C45156"),
    ("INV-41", "The first result was highlighted, and Enter opened it", "GlobalSearch.vue:157-190", "C55673"),
    ("INV-42", "Group headings could not be selected with the arrow keys", "GlobalSearch.vue:157-159", "C55680"),
    ("INV-43", "A loading state showed while results were not ready yet", "GlobalSearch.vue", "C53589"),
    ("INV-46", "Choosing a result opened the right record", "routingService.ts:75", "C45153"),
    ("INV-47", "Choosing the record you were already on did not reload the page", "GlobalSearch.vue", "C45154"),
    ("INV-48", "Choosing a result recorded a usage event", "GlobalSearch.vue", "C45160"),
    ("INV-50", "Search was reachable on a phone and a tablet as well as a desktop", "GlobalSearch.vue", "C55674"),
    ("INV-64", "Recent items the user could no longer open were hidden", f"{TS} permittedHistory", "C45149"),
    ("INV-80", "No search ever returned another organisation's records",
     f"{SQL} organizationDecorator on all five queries", "C45150"),
    ("INV-81", "Only jobs and part sales were limited to your branch; the rest were company-wide",
     f"{SQL} workplaceDecorator on the job query only", "C45151"),
    ("INV-82", "Switching branch refreshed the results", f"{TS}:286-299", "C45152 · C55684"),
    ("INV-90", "No setting or flag had to be switched on to get search", "no flag exists in the code", "C45158"),
    ("INV-92", "Every result row carried an icon saying what kind of record it was",
     f"GlobalSearch.vue:60-62 with {TS}:96-137", "C55682"),
    ("INV-93", "The keyboard shortcut was written on the search box, correct for Mac or Windows",
     "GlobalSearch.vue:40-47, 128-131", "C55683"),
    ("INV-94", "The old branch's rows were cleared before the new ones arrived", f"{TS}:286-299", "C55684"),
]:
    row(N, cid, plain, cite, cases, None)

# ─── run and report ─────────────────────────────────────────────────────────────────────────
def run():
    out, npass, nfail, nsim = [], 0, 0, 0
    for kind, cid, plain, cite, cases, check in ROWS:
        if check is None:
            verdict, nsim = "NOT SIMULATABLE", nsim + 1
        else:
            try:
                ok = bool(check())
            except Exception as e:
                ok = False; plain += f"  [error: {e}]"
            verdict = "PROVED" if ok else "🔴 FAILED"
            npass, nfail = npass + (1 if ok else 0), nfail + (0 if ok else 1)
        out.append((kind, cid, plain, cite, cases, verdict))
    return out, npass, nfail, nsim

def main():
    out, npass, nfail, nsim = run()
    md = "--md" in sys.argv
    if md:
        print("| # | What a user could do in V1 | Proved? | Where it is established | Test case |")
        print("|---|---|---|---|---|")
        for kind, cid, plain, cite, cases, v in out:
            mark = {"PROVED": "✅ runs green", "NOT SIMULATABLE": "— code citation only"}.get(v, "🔴 **FAILED**")
            print(f"| `{cid}` | {plain} | {mark} | `{cite}` | {cases} |")
    else:
        print(f"{'id':<12}{'verdict':<18}what a user could do in V1")
        print("-" * 104)
        for kind, cid, plain, cite, cases, v in out:
            print(f"{cid:<12}{v:<18}{plain[:70]}")
    total = len(out)
    print(f"\n{total} capabilities  ·  {npass} proved by running  ·  {nfail} failed  ·  "
          f"{nsim} not simulatable (code citation only)")
    print("Baseline: ShopView product repository @ commit 55767168")
    return 1 if nfail else 0

if __name__ == "__main__":
    sys.exit(main())
