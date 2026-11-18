# ---- Rule 141 (18 Nov 2026, QA lead "Only the two cases now"): REL-01 and REL-02 rewritten top to bottom so both sides are seen under the
# same conditions (same Admin user, same location chosen in the top-right switcher, that location's time zone and the computer's time zone,
# same as-of date), the after side is screenshotted, and dates are judged in the location's time zone against a control document created at
# midday location time. The old version cannot be opened after the release, so the before side is the before-release record, accepted only
# because its preconditions name the same conditions (Rule 141 point 6 gate). Quotes stay on PRD version 13 (the 16 Nov PRD change is handled
# separately, QA lead 18 Nov 2026).
def _rel141(what, party, docs, reports, control, changes):
    pre = [f'Sign in to production as the same Admin user (the "Admin" role) who took the before-release pictures.',
           f"Have the before-release pictures of the three {what} reports, taken untouched before the release was installed: every row and the "
           f"Totals row of {reports[0]}, {reports[1]} and {reports[2]}.",
           "Have, with them, pictures of the conditions they were taken under: the user, the location chosen in the top-right location switcher, "
           "that location's time zone (Settings, then Locations), the computer's time zone, the as-of date, and the day and time they were taken.",
           f"Have a control {control} in those pictures: {'an' if control[0] in 'aeiou' else 'a'} {control} created for this test at about 12:00 noon location time, on or before the "
           "as-of date, with its date written down.",
           "Have open documents at two locations, so the Location chip shows.",
           "In the top-right location switcher, choose the location the before-release pictures show, even if it is already selected, so the "
           "app uses that location's time zone.",
           "Make sure that location's time zone (Settings, then Locations) and the computer's time zone are the ones the before-release pictures show.",
           "Use a desktop browser window 1440 px wide."]
    chip = "The Location chip reads \"Location: All locations\": an untouched report is the organization-wide report it was before."
    asof = "The date chip shows the as-of date the before-release pictures show, and the report reloads for that date."
    same = f"Side by side with the before-release pictures of this report, the same {{who}} and the same amounts, shown the same way (same $ sign, commas, two decimals and credit format)."
    tz = "Dates are read in the time zone of the location chosen in the top-right switcher, the same one the before-release pictures were taken in."
    steps, res = [], []
    for i, r in enumerate(reports):
        steps += [f"Open {r} from the Reports menu.", "Set the as-of date to the one the before-release pictures show, touching no other filter."]
        res += [[chip], [asof]]
        if i == 1:
            steps.append(f"Find the control {control} in the report.")
            res.append([f"The control {control} shows the date written down for it, the same day as in its "
                        "before-release picture (a \"Today\", \"Yesterday\" or \"2 days ago\" there counts back from the day that picture was taken).",
                        tz,
                        "If it shows another day, the two sides were seen on different clocks: do not compare the reports, and record what each "
                        "picture shows for the location and the two time zones."])
        steps.append("Take screenshots of every row and the Totals row.")
        res.append([same.format(who=party if i == 0 else docs)] + ([tz] if i else []) + changes[i])
    return pre, steps, res

_P, _S, _R = _rel141("A/R", "customers", "documents", ["A/R Summary", "A/R Detail", "A/R Collection"], "invoice", [
    ["Only the order may differ, and, as PRD section 2 lists for this release, a credit memo or deposit dated exactly on the as-of date now "
     "counts in Current, where it was in 1-30 Days. For customers with an overpaid invoice the Totals row may differ too."],
    ["Only the order may differ, and these three changes PRD section 2 lists for this release: Date and Due Date are plain dates (for example "
     "\"Nov 4, 2026\") where the before-release picture shows \"Today\", \"Yesterday\" or \"2 days ago\"; a credit shows \"Credit Memo\" or "
     "\"Deposit\" under Transaction Type where it shows \"Credit\"; and a credit memo or deposit dated exactly on the as-of date is in \"Current\", "
     "where it was in \"1-30 days past due\"."],
    ["Only the order may differ, and these three changes PRD section 2 lists for this release: Date and Due Date are plain dates (for example "
     "\"Nov 4, 2026\") where the before-release picture shows \"Today\", \"Yesterday\" or \"2 days ago\"; a credit shows \"Credit Memo\" or "
     "\"Deposit\" under Transaction Type where it shows \"Credit\"; and a credit memo or deposit dated exactly on the as-of date shows Past Due 0, "
     "where it showed 1."]])
MODEL["REL-01"] = dict(title="On release day an untouched A/R report shows the same rows and amounts", pre=_P, steps=_S, results=_R)
_P, _S, _R = _rel141("A/P", "vendors", "documents", ["A/P Summary", "A/P Detail", "A/P Unpaid Invoices"], "bill", [
    ["Only the order may differ, and, as PRD section 2 lists for this release, a vendor credit dated exactly on the as-of date now counts in "
     "Current, where it was in 1-30 Days."],
    ["Only the order may differ, and these three changes PRD section 2 lists for this release: Date and Due Date are plain dates (for example "
     "\"Nov 4, 2026\") where the before-release picture shows \"Today\", \"Yesterday\" or \"2 days ago\"; a vendor credit shows \"Vendor Credit\" "
     "under Transaction Type where it shows \"Credit\"; and a vendor credit dated exactly on the as-of date is in \"Current\" with Past Due 0, "
     "where it was in \"1-30 days past due\" with Past Due 1."],
    ["Only the order may differ, and these two changes PRD section 2 lists for this release: Date and Due Date are plain dates (for example "
     "\"Nov 4, 2026\") where the before-release picture shows \"Today\", \"Yesterday\" or \"2 days ago\"; and a vendor credit shows \"Vendor "
     "Credit\" under Transaction Type where it shows \"Credit\"."]])
REWRITE_141 = {"REL-01", "REL-02"}
MODEL["REL-02"] = dict(title="On release day an untouched A/P report shows the same rows and amounts", pre=_P, steps=_S, results=_R)
