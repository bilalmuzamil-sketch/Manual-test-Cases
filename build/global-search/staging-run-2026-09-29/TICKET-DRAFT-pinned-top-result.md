# PREPARED, NOT FILED — no per-ticket permission given for this one (Rule 62 / Rule 113)

**Issue type** `Story Defect` · **Parent** SV-9170 · **Priority** Medium · `relates to` SV-9170

## Title

`Typing A Record Number In Full Does Not Pin It Above The Search Groups`

## Description

Typing a record's number in full is meant to take you straight to that record — it should appear on
its own at the very top of the panel, above all the groups, so you can press Enter and go. It does
not. The record comes back in the ordinary way, inside its group, with nothing above the first
group heading.

For example:

* Type `{{S-34379}}` — the number the row itself labels *Number:* — and one result comes back,
  inside *Work orders (1)*. Nothing sits above the groups.
* Type `{{S2-34379}}` — the identifier the row displays — and the result is the same.

Both return a single unambiguous result, which is as clear an identifier match as the data allows,
and neither is promoted.

## Steps to Reproduce

# Sign in to staging and press `Ctrl`+`K`.
# Type `{{S2-34379}}`.
# Look above the first group heading.
#* One row comes back, under the heading *Work orders (1)*.
#* There is no separate pinned row above the groups.
# Repeat with `{{S-34379}}` — the same.

*Actual Result* — an exact record number returns an ordinary grouped result; no record is pinned
above the groups.

*Expected Result* — the matched record is pinned as a single row at the very top, above the
groups, with its entity icon.

## Environment

Staging — [https://app.staging.shopview.com] · workplace *Staging Heavy Duty - 9919* ·
build `{{v26.39.2-51a35e1}}` · 29 September 2026.

## Sources

*Global Search — Product Requirements v1.5 (2026-09-08), section 6.2:*

{quote}When the top result across all groups has a score > 0.95 (effectively an ID match), it is pinned as a separate single row at the very top, above the groups, labeled by its entity icon — the "if you typed `S2-15276`, jump straight to that WO" experience.{quote}

---

## Why this is separate from SV-10634

SV-10634 is about what a row **displays** once it is drawn. This is about a row that is **never
drawn at all**. Fixing one would not fix the other.
