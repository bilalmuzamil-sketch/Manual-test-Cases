# SV-10028 — prep, written before the QA branch exists (2026-09-15)

**Ticket:** *"Parts sale contact change fails with 'invalid uuid' and defaults to a different contact"*
Bug · **High** · status **Code Review** · assignee **Dusan Radulovic** · reporter Ryan Fyfe (via
PowerTools) · Product Area **Parts** · labels `ai-unverified-repro`, `bug-report`, `source-intercom`.
No linked issues. One comment (Chris Ward, 14 Sep).

## What is actually reported

Customer **Ashton Selleck**, *Selleck Truck & Trailer Repair*, 14 users, via Intercom.

Changing the **Contact** on a parts sale fails with an **"Invalid UUID"** error; the parts sale
**defaults to "Brian Arthurs"** and no other contact can be selected.

**Chris Ward confirmed it, 14 Sep:** *"Confirmed in production AND staging. This seems to happen
regardless of work order status, or new/old contacts. Unsure of the root cause."* — and gave the exact
gesture: *"Clicked contact dropdown, selected a new contact, the 'are you sure' modal pops up, hit
'okay' and then this happens."*

## What his screenshot shows (read, not skimmed)

* He reproduced it **inside Account Access Mode** — the banner reads *"Account Access Mode: Ashton
  Selleck in Selleck Truck & Trailer Repair"*. Worth knowing: the surface may matter, and we know how
  to get there (profile menu → Customer Portal is a different thing; Account Access Mode is the
  in-app banner).
* Part Sale **P-33**, status **Estimate**, with an **Over Limit** badge.
* Customer **EMPLOYEE**, Contact showing **Brian Arthurs**, Phone (613) 349-7499, Authorizer None.
* Parts (0); all Financial Info values $0.00.
* Red toast, bottom right: **"Invalid UUID — Please try to resolve this."**

## The lead worth testing first — but NOT assumed

The customer's own words: the customer record is **"EMPLOYEE"**, which they use for **"the 65 people we
have working here"**. So the failing customer has a **very large contact list**.

That points at the contact dropdown loading only a page of contacts while the chosen contact's id is
not in the loaded set — which would produce exactly an "invalid uuid" on save. **This is a hypothesis
to test, not a finding.** The first experiment is therefore: a customer with *many* contacts versus one
with *few*, same gesture, same build.

Chris's "regardless of work order status, or new/old contacts" narrows it usefully — it is not about
the part sale's state and not about contact age.

## Test plan, ready to run the moment the branch lands

1. Re-read the ticket first — it is in Code Review, so a developer handoff comment may have appeared
   by then, and that changes what to check (Rule 59).
2. **Capture the BEFORE on production first**, before touching the branch — production credentials are
   already held this session, and production is a *credentials* login, not cookies (playbook §K.1).
   Reproduce: parts sale → Contact dropdown → pick another contact → confirm → expect the Invalid UUID
   toast and the contact reverting.
3. Reproduce the reported gesture on the fix branch, in the **same** shape.
4. Vary the one thing the customer's words point at: contact-list size (seed a customer with many
   contacts if the branch has none).
5. Check the surfaces separately: ordinary staff view **and** Account Access Mode, since that is where
   the screenshot was taken.
6. Check the neighbours: does the same dropdown on a **Work Order** behave the same? Does the
   **Authorizer** dropdown on the same card?
7. Watch the network on every attempt — the payload that carries the contact id is the evidence.

## What is needed from the QA lead

* The **QA branch URL** and its three cookies (`sv_sso_session`, `PHPSESSID`, `cf_clearance`).
* Nothing else — production access is already in hand.
