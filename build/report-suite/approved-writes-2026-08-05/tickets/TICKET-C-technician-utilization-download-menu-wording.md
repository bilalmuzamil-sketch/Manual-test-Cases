# Technician Utilization: the download menu options are worded differently from every other report

**Summary line for Jira:** `Technician Utilization download menu drops the word Download from all four options, unlike the other reports`

| Field | Value |
|---|---|
| Type | Bug |
| Priority | **Low** |
| Severity | Low |
| Product Area | Reports & Dashboards |
| Parent | **SV-8582** (the epic) |
| Links | **Relates** → SV-8654 (Technician Utilization, the downloads story) |
| Labels | `reports-suite`, `qa-found` |

---

## 1 · Description

Every report in this suite has a three-dot menu for downloading it. On Sales By Customer and Sales By
Representative the four options in that menu read:

- **Download Summary (PDF)**
- **Download Expanded View (PDF)**
- **Download Summary (CSV)**
- **Download Expanded View (CSV)**

On **Technician Utilization** the same four options read:

- **Summary (PDF)**
- **Summary (CSV)**
- **Expanded (PDF)**
- **Expanded (CSV)**

The word **Download** is missing from the front of all four, and **Expanded View** has become
**Expanded**. Technician Utilization is the odd one out rather than the whole suite being different.

**Why it matters:** it is the same menu, doing the same thing, worded two different ways in one
product. The product owner's answer when shown this was simply: **"B) is correct here. Consistency is
key."** — meaning bring this report into line with the others.

---

## 2 · Branch / Environment

| | |
|---|---|
| Application | `https://sv8582.qa.shopview.com` |
| API host | `https://sv8582api.qa.shopview.com` |
| Build marker (`<meta name="app-version">`) | **`v3.4.1-0ed4433`** |
| Observed on | **2026-08-03** |
| Organisation | Staging Foothills Group Inc |
| Location selection | **All locations** (the default) |
| Signed in as | `admin@shopview.com` (Administrator) |
| Date range | **This Year** (the report's own default) |

---

## 3 · Steps to reproduce

1. Sign in as `admin@shopview.com` (Administrator) at `https://sv8582.qa.shopview.com`.
2. Open **Reports → Technician Utilization**.
3. Leave every control at its default: date range **This Year**, **Technician** = *All technicians*,
   **Location** = *All locations*.
4. Click the **three-dot** button — it is the leftmost button in the group at the top right of the
   report, immediately before the column-selection button.
5. Read the four options in the menu, word for word.
6. Now open **Reports → Sales By Customer**, click its three-dot button, and read its four options.
7. Compare the two lists.

**What was tried and ruled out:**

| Tried | Result |
|---|---|
| **Sales By Customer** and **Sales By Representative** | Both show the longer **"Download …"** wording, matching their own written descriptions |
| Date range **This Year** and **This Month** on Technician Utilization | Same four short labels either way |
| With technicians selected and with none selected | Same four short labels either way |
| The button's position in the toolbar | **Correct** — leftmost, with the column-selection button immediately after it. Only the wording inside the menu is wrong |

---

## 4 · Expected behaviour

The Technician Utilization menu uses the same wording as the other reports:

- **Download Summary (PDF)**
- **Download Expanded View (PDF)**
- **Download Summary (CSV)**
- **Download Expanded View (CSV)**

The product owner's decision, 2026-08-05, choosing the option that read *"Bring it into line with
Sales By Customer and Sales By Representative - the longer 'Download …' wording"*:

> "B) is correct here. Consistency is key."

---

## 5 · Current behaviour

The menu holds these four items, read straight off the screen:

- **Summary (PDF)**
- **Summary (CSV)**
- **Expanded (PDF)**
- **Expanded (CSV)**

No **Download** prefix on any of them, and **Expanded** rather than **Expanded View**.

---

## 6 · Images

**No image is attached.** The whole of the evidence is the four label strings, and they are quoted
word for word in section 5 exactly as they were read from the open menu. A screenshot of an open
dropdown would carry no information the quoted list does not.

---

## 7 · Technical details for developers

**Live observation.** Recorded in
`build/report-suite/viu-2026-08-03/batch-pv-tu/VERDICTS.md`, with the raw capture in
`build/report-suite/viu-2026-08-03/batch-pv-tu/evidence/tu/ui/tu-ui-3.json` (that file records
`"clicked": "Summary (CSV)"`, one of the short labels, being used):

> The three-dot menu IS leftmost in the action cluster, followed by Column Selection, then the
> date-range picker, the technician filter and the location filter — matching the spec exactly. But the
> menu holds FOUR items, not three: "Summary (PDF)", "Summary (CSV)", "Expanded (PDF)", "Expanded
> (CSV)" — no "Download" prefix anywhere, and a second CSV variant the spec does not describe.

**Specification references.** Technician Utilization description, version 5 (2026-07-29): `S7-R2`
*'an option labeled "Download Summary (PDF)"'*, `S7-R3` *'"Download Expanded View (PDF)"'*, `S7-R4`
*'"Download (CSV)"'*. Sales By Customer version 13 `S15-R1`/`S15-R2` and Sales By Representative
version 15 carry the longer four-item wording, which their builds match.

**A second, related question that is NOT part of this ticket, recorded so it is not lost.** The
description for this report names **three** menu items; the build ships **four** — a separate
spreadsheet option for the Summary and the Expanded views. The product owner's answer settles the
**wording** in his own words but does not explicitly state the **count**; that the menu should end up
with four is our reading of *"bring it into line with"* the two reports he named, both of which offer
four. **A one-word confirmation from him is outstanding**, so please treat the option count as
his to confirm and the wording as decided.

**Also worth knowing while this menu is being touched:** two other findings on the same report's
downloads were recorded on the same day — the Summary PDF omits its Summary row, and the PDF file
names are lower-case where the description gives them in Title Case. They are not part of this ticket
and have not been raised separately; mentioned only because the same code is likely involved.
