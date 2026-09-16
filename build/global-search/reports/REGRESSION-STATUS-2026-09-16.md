# Global Search regression suite — where it stands, 16 September 2026

**Run 415** — https://shopview.testrail.io/index.php?/runs/view/415 · test branch `sv9160`

## The suite

| | Checks | Meaning |
|---|---|---|
| The old-search safety net | **68** | Every one has been run. |
| — worked | 48 | The new search does these as the old one does. |
| — did not work | 18 | Each one has a report against it. |
| — could not be checked | 2 | One needs a person with no workplace set; one is an internal event nothing on screen shows. |
| The feature checks | **99** | Test the new search against its own written requirements. **None started.** |
| **Total in the run** | **167** | |

## Every report, and the check behind it

| Report | Status | What a person cannot do | Check | Result |
|---|---|---|---|---|
| [SV-10001](https://shopview.atlassian.net/browse/SV-10001) | Open | a part that is in the catalogue but has never been stocked cannot be found at all | [C45153](https://shopview.testrail.io/index.php?/tests/view/2738734) [C53601](https://shopview.testrail.io/index.php?/tests/view/2959367) | Failed |
| [SV-10002](https://shopview.atlassian.net/browse/SV-10002) | Open | a customer cannot be found by their postcode | [C53582](https://shopview.testrail.io/index.php?/tests/view/2959359) | Failed |
| [SV-10003](https://shopview.atlassian.net/browse/SV-10003) | Open | a customer cannot be found by their website address | [C53583](https://shopview.testrail.io/index.php?/tests/view/2959360) | Failed |
| [SV-10004](https://shopview.atlassian.net/browse/SV-10004) | Open | a company cannot be found by a contact's job title | [C53603](https://shopview.testrail.io/index.php?/tests/view/2959369) | Failed |
| [SV-10005](https://shopview.atlassian.net/browse/SV-10005) | Open | a Vendor cannot be found by their postcode | [C53585](https://shopview.testrail.io/index.php?/tests/view/2959362) | Failed |
| [SV-10006](https://shopview.atlassian.net/browse/SV-10006) | Open | a Vendor cannot be found by the state they are in, although a customer can | [C53606](https://shopview.testrail.io/index.php?/tests/view/2959372) | Failed |
| [SV-10007](https://shopview.atlassian.net/browse/SV-10007) | Open | a vehicle cannot be found by its number plate | [C53516](https://shopview.testrail.io/index.php?/tests/view/2902696) | Failed |
| [SV-10008](https://shopview.atlassian.net/browse/SV-10008) | Open | jobs can no longer be found by typing the stage they are at | [C55658](https://shopview.testrail.io/index.php?/tests/view/2977470) | Failed |
| [SV-10014](https://shopview.atlassian.net/browse/SV-10014) | Open | a vehicle found by its VIN number is missing from the Assets section | — | — |
| [SV-10015](https://shopview.atlassian.net/browse/SV-10015) | QA Complete | a Vendor found by a contact's email is missing from the Vendors section | — | — |
| [SV-10016](https://shopview.atlassian.net/browse/SV-10016) | QA Complete | a part found by its part number is missing from the Parts section | — | — |
| [SV-10017](https://shopview.atlassian.net/browse/SV-10017) | QA Complete | a job found by part of its number is missing from the Work orders section | — | — |
| [SV-10025](https://shopview.atlassian.net/browse/SV-10025) | Open | a correctly spelled name brings back records that have nothing to do with it | [C55685](https://shopview.testrail.io/index.php?/tests/view/2984234) | Failed |
| [SV-10031](https://shopview.atlassian.net/browse/SV-10031) | QA Complete | Part Sales — a new part sale is created but the app cannot open it, and shows two errors | — | — |
| [SV-10055](https://shopview.atlassian.net/browse/SV-10055) | Open | a vehicle cannot be found by its year and make typed together | [C53605](https://shopview.testrail.io/index.php?/tests/view/2959371) | Failed |
| [SV-10056](https://shopview.atlassian.net/browse/SV-10056) | QA Complete | a newly created job is not findable by its number for about 85 seconds | — | — |
| [SV-10057](https://shopview.atlassian.net/browse/SV-10057) | QA Complete | a customer cannot be found by part of their telephone number | [C55662](https://shopview.testrail.io/index.php?/tests/view/2977474) [C55670](https://shopview.testrail.io/index.php?/tests/view/2980692) | Failed |
| [SV-10058](https://shopview.atlassian.net/browse/SV-10058) | Open | a vehicle cannot be found by part of its VIN number | [C55669](https://shopview.testrail.io/index.php?/tests/view/2980691) | Failed |
| [SV-10059](https://shopview.atlassian.net/browse/SV-10059) | QA Complete | the recently viewed list does not come back after a search that finds nothing | — | — |
| [SV-10060](https://shopview.atlassian.net/browse/SV-10060) | Open | part of a word finds the record in the company name and the street, but not in the town | [C55660](https://shopview.testrail.io/index.php?/tests/view/2977472) | Failed |
| [SV-10061](https://shopview.atlassian.net/browse/SV-10061) | Open | moving the mouse across the results changes which record Enter opens, and it stays changed | [C55673](https://shopview.testrail.io/index.php?/tests/view/2980695) | Failed |
| [SV-10109](https://shopview.atlassian.net/browse/SV-10109) | Open | a Vendor cannot be found by their address line 2, although a customer can | [C53604](https://shopview.testrail.io/index.php?/tests/view/2959370) | Failed |
| [SV-10110](https://shopview.atlassian.net/browse/SV-10110) | Open | a Vendor cannot be found by their website address | [C55692](https://shopview.testrail.io/index.php?/tests/view/2990950) | Failed |

## Worth your eye

**SV-10057 is marked QA Complete, but its two checks are still recorded as failing** (C55662 and
C55670, the partial telephone number). Either it has been fixed since 15 September and the checks
need re-running, or the status went on early. The branch cannot be signed in to at the moment, so it
has not been re-checked.

**SV-10014 has a QA-passed comment from me but is still Open** — the status is yours to set.

**Nothing can be re-run right now.** The test branch took a new build overnight and its quick sign-in
is gone; the page now asks for a Google account. Every result above still stands, but no check can be
repeated until that is sorted.

