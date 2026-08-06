# -*- coding: utf-8 -*-
import sys, json
sys.path.insert(0,'/tmp/rs3/jira')
from tu_tickets import curl

def p(t, strong=False):
    return {"type":"paragraph","content":[{"type":"text","text":t,**({"marks":[{"type":"strong"}]} if strong else {})}]}
def bullets(items):
    return {"type":"bulletList","content":[{"type":"listItem","content":[p(i)]} for i in items]}

NEW_SUMMARY = 'PDF heading shows an end date one day later than the range asked for, on three reports'

content = []
content.append(p("1. What happens now", True))
content.append(p("Three of the new reports print a heading line in their PDF describing the date range the file "
  "covers, and that line always shows an end date one day later than the one that was asked for. It happens "
  "on Parts Velocity, on Technician Utilization and on Sales By Customer. On Parts Velocity and Technician "
  "Utilization the line also begins with a stray word - it reads \"Start Date Range:\" rather than "
  "\"Date Range:\". Sales By Customer gets that part right and only has the wrong date."))
content.append(p("The spreadsheet download of exactly the same view prints the correct end date, so the two files "
  "disagree with each other about the same report."))

content.append(p("2. What should happen instead", True))
content.append(p("The heading should describe the range the report was actually run for - if you ask for a range "
  "ending on 6 August, the heading should say 6 August. And the label should read \"Date Range:\", the way it "
  "already does on Sales By Customer."))

content.append(p("3. How to see it", True))
content.append(p("On Parts Velocity: sign in as a user who can see reports and open Reports > Parts Velocity. In "
  "the report's own search box type BRAKECLEAN, so the view is small enough to download. Open the date picker, "
  "build a range from 1 January 2026 to 31 July 2026, and press Apply. Open the three-dot menu and choose "
  "Download (PDF), then read the heading line under the report title. Then choose Download (CSV) for the same "
  "view and read its first line."))
content.append(p("On Technician Utilization: open Reports > Technician Utilization, set the date range to This "
  "Year, and choose Summary (PDF) from the three-dot menu. Read the heading line."))
content.append(p("On Sales By Customer: open Reports > Sales By Customer, leave the date range on This Month, and "
  "choose Download Summary (PDF). Read the heading line."))
content.append(p("Exact test data this was seen with: organisation Staging Foothills Group Inc; signed-in user "
  "Admin ShopView; locations Staging Heavy Duty - 9919 and Staging Lethbridge - 4310. On Parts Velocity, part "
  "number BRAKECLEAN with Type set to Both, and three separate ranges were tried. On Technician Utilization, "
  "This Year, which returns 29 technicians. On Sales By Customer, This Month, which runs 1 to 6 August 2026."))

content.append(p("4. What was actually in the file", True))
content.append(p("Parts Velocity, three ranges, each read from the PDF heading:"))
content.append(bullets([
  "Asked for 1 Jan 2026 to 31 Jul 2026 - the heading read \"Start Date Range: Jan 1, 2026 - Aug 1, 2026\".",
  "Asked for 1 Feb 2026 to 28 Feb 2026 - the heading read \"Start Date Range: Feb 1, 2026 - Mar 1, 2026\".",
  "Asked for 1 Jan 2026 to 6 Aug 2026 - the heading read \"Start Date Range: Jan 1, 2026 - Aug 7, 2026\", "
  "while the spreadsheet for the same view read \"Date Range: Jan 1, 2026 - Aug 6, 2026\".",
]))
content.append(p("Technician Utilization, asked for 1 Jan 2026 to 6 Aug 2026 - the heading read \"Start Date "
  "Range: Jan 1, 2026 - Aug 7, 2026\"."))
content.append(p("Sales By Customer, asked for 1 Aug 2026 to 6 Aug 2026 - the heading read \"Date Range: Aug 1, "
  "2026 - Aug 7, 2026\". The label is right here; only the end date is a day late."))

content.append(p("5. What was ruled out", True))
content.append(p("It is not the calendar month rolling over. It happens in the middle of a month too - 28 "
  "February came out as 1 March, and 31 July came out as 1 August."))
content.append(p("It is not \"today\" being printed instead. On 6 August the report was asked for a range ending "
  "31 July and the heading read 1 August, not 6 August."))
content.append(p("It is not the spreadsheet. The spreadsheet for the same view printed the correct end date on "
  "every report checked, so only the PDF heading is affected."))
content.append(p("It is not one report's own code. The same one-day-late end date appears on three different "
  "reports, which points at the shared piece that builds the PDF heading."))
content.append(p("It is not every report. Work In Progress was checked separately and prints its heading "
  "correctly - asked for 1 to 2 January 2020 it printed \"Jan 1, 2020 - Jan 2, 2020\"."))
content.append(p("It was NOT possible to show that any report's actual figures are wrong. Only the heading line "
  "was proven wrong. On Parts Velocity the one part checked at the boundary had no sales near those dates, so "
  "nothing was found either way about the numbers - it may be the heading only."))

content.append(p("6. How often", True))
content.append(p("Every time. Three PDF downloads out of three on Parts Velocity, and every download taken on "
  "Technician Utilization and Sales By Customer."))

content.append(p("7. Where it was seen", True))
content.append(p("Reports > Parts Velocity, Reports > Technician Utilization and Reports > Sales By Customer, on "
  "the QA branch, build v3.5-16cf83f, on 6 August 2026."))

# ---- the mandatory source block, at the very bottom after a line break ----
content.append(p(" "))
content.append(p("Where this expected behaviour comes from: the report specifications, and each of the three "
  "reports says it in its own words."))
content.append(bullets([
  "The Sales By Customer report specification, version 15, requirement S15-R11, which says: \"The header date "
  "range shows the start and end dates in the format 'Mon D, YYYY,' joined by an em dash - for example, "
  "'May 1, 2026 - May 31, 2026.'\" The dates it shows are the ones the report was run for.",
  "The Parts Velocity report specification, version 5, requirement S6-R2, which says: \"Both exports reflect "
  "the date range, type, category, vendor, bin location, location, and search active at the time of export.\"",
  "The Technician Utilization report specification, version 6, requirement S7-R9, which says: \"Every download "
  "covers the date range that is currently active on the report.\"",
]))
content.append(p("One honest caveat about the label. None of the three specifications writes down the exact "
  "words the heading should begin with, so \"Start Date Range:\" is not breaking a written rule. What makes it "
  "wrong is that the same heading on Sales By Customer reads \"Date Range:\", so the same line is worded two "
  "different ways across reports that are meant to match. If the product owner would rather keep \"Start Date "
  "Range:\", that half of this ticket can simply be dropped - the wrong end date stands on its own."))

body={"type":"doc","version":1,"content":content}
st,d=curl('PUT','/rest/api/3/issue/SV-8937?returnIssue=false',{"fields":{"summary":NEW_SUMMARY},"update":{"description":[{"set":body}]}})
print('PUT HTTP',st,str(d)[:200])
json.dump({'http':st},open('/tmp/rs3/jira/widen-8937.json','w'))
