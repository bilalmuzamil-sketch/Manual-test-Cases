import openpyxl
from openpyxl.styles import Font, PatternFill
f='Prod-vs-Staging-LIVE-VERIFIED-2026-07-14.xlsx'
wb=openpyxl.load_workbook(f)
TAB='Pass-11 LIVE (2026-07-16)'
if TAB in wb.sheetnames: del wb[TAB]
ws=wb.create_sheet(TAB)
hdr=Font(bold=True,color='FFFFFF'); hf=PatternFill('solid',fgColor='305496')
less=PatternFill('solid',fgColor='FFC7CE'); more=PatternFill('solid',fgColor='FFEB9C')
match=PatternFill('solid',fgColor='C6EFCE'); nv=PatternFill('solid',fgColor='D9D9D9')
rows=[
 ['PASS-11 (2026-07-16) — CLOSED the two Pass-10 residuals: prod See-AP/AR (all 11) + prod Part Return (all 13). OBSERVED-LIVE only; never inferred (Rules 10/12).'],
 [],
 ['Staging role','Capability','Prod (LIVE-OBSERVED)','Staging (LIVE-OBSERVED)','Dual verdict','Confidence / method'],
 # ===== See AP/AR (CLOSED) =====
 ['Administrator','See AP/AR (A/R+A/P Aging reports)','SHOWN (full tiles rendered)','SHOWN','MATCH','OBSERVED-LIVE both; prod real-holder switch-user'],
 ['Office User','See AP/AR','SHOWN (full tiles rendered)','SHOWN','MATCH','OBSERVED-LIVE both; prod real-holder switch-user'],
 ['Service Manager','See AP/AR','HIDDEN (whole Reports surface FE-gated off; own punch-clock report also bounces)','SHOWN','STAGING-MORE','OBSERVED-LIVE both; role-swap+switch-user (Admin CONTROL renders => path validated)'],
 ['Parts Manager','See AP/AR','HIDDEN (Reports surface gated off)','SHOWN','STAGING-MORE','OBSERVED-LIVE both; role-swap+switch-user'],
 ['Sales Representative','See AP/AR','HIDDEN (Reports nav no-ops; route bounces)','SHOWN','STAGING-MORE','OBSERVED-LIVE both; prod real-holder switch-user'],
 ['Senior Service Advisor','See AP/AR','HIDDEN (SA/SA-Tech/SA-No-Reports all bounce)','hidden','MATCH','OBSERVED-LIVE both'],
 ['Service Advisor','See AP/AR','HIDDEN (SA-Limited-View bounces)','hidden','MATCH','OBSERVED-LIVE both'],
 ['Foreman','See AP/AR','HIDDEN (bounce, no Reports nav)','hidden','MATCH','OBSERVED-LIVE both'],
 ['Technician','See AP/AR','HIDDEN (no Reports nav; bounce)','hidden','MATCH','OBSERVED-LIVE both; prod real holder'],
 ['Parts Technician','See AP/AR','HIDDEN (bounce)','hidden','MATCH','OBSERVED-LIVE both'],
 ['Time Clock User','See AP/AR','HIDDEN (no Reports nav; bounce)','hidden','MATCH','OBSERVED-LIVE both; prod real holder'],
 [],
 # ===== Part Return (CLOSED) =====
 ['Administrator','Part Return ("Return" in picked-part context menu)','SHOWN (Move/Core OK/Return)','SHOWN','MATCH','OBSERVED-LIVE both; prod on S1-719 via role-swap+self-login'],
 ['Service Manager','Part Return','SHOWN','SHOWN','MATCH','OBSERVED-LIVE both'],
 ['Senior Service Advisor','Part Return','SHOWN (SA/SA-Tech/SA-No-Reports)','SHOWN','MATCH','OBSERVED-LIVE both'],
 ['Service Advisor','Part Return','SHOWN (SA-Limited-View)','SHOWN','MATCH','OBSERVED-LIVE both'],
 ['Foreman','Part Return','SHOWN','SHOWN','MATCH','OBSERVED-LIVE both'],
 ['Technician','Part Return','SHOWN','SHOWN','MATCH','OBSERVED-LIVE both'],
 ['Parts Manager','Part Return','SHOWN','SHOWN','MATCH','OBSERVED-LIVE both'],
 ['Parts Technician','Part Return','SHOWN','SHOWN','MATCH','OBSERVED-LIVE both'],
 ['Sales Representative','Part Return','HIDDEN (WO detail not accessible; bounces)','SHOWN','STAGING-MORE','OBSERVED-LIVE both'],
 ['Office User','Part Return','HIDDEN (part menu = "Move" only, no Return)','SHOWN','STAGING-MORE','OBSERVED-LIVE both'],
 ['Time Clock User','Part Return','HIDDEN (WO detail not accessible; bounces)','NOT VERIFIED (staging, prior pass)','PARTIAL','prod OBSERVED-LIVE; staging Time-Clock still NV from prior pass'],
 [],
 ['METHOD NOTES:'],
 ['- Prod AP/AR: real-holder switch-user (6 roles) + role-swap-test-staff+switch-user (holderless). Switch-user render path VALIDATED by test-staff-as-Administrator CONTROL rendering full A/R+A/P tiles. Deep-link + proof-of-shell (punch-clock) confirm the whole Reports surface is a single FE all-or-nothing gate.'],
 ['- Prod Part Return: switch-user bounces WO-detail (null active location); used role-swap test-staff + SELF-LOGIN (has active location) on S1-719 (Truck Hill 1) which carries a returnable picked part.'],
 ['- Reporting prod role: role-swap yielded perms=0 / bounced to /no-location; it merges into Sales Representative whose verdict is anchored by the real Sales Rep holder.'],
]
for r in rows: ws.append(r)
ws['A1'].font=Font(bold=True,size=11)
for c in ws[3]: c.font=hdr; c.fill=hf
for row in ws.iter_rows(min_row=4):
    v=(row[4].value or '') if len(row)>4 else ''
    fill=None
    if 'STAGING-LESS' in v: fill=less
    elif 'STAGING-MORE' in v: fill=more
    elif v=='MATCH': fill=match
    elif 'PARTIAL' in v or 'NOT VERIFIED' in v: fill=nv
    if fill:
        for c in row: c.fill=fill
widths=[26,44,46,26,16,72]
for i,w in enumerate(widths,1): ws.column_dimensions[openpyxl.utils.get_column_letter(i)].width=w
wb.move_sheet(TAB, -(len(wb.sheetnames)-2))
wb.save(f)
print('saved; sheets now:', wb.sheetnames)
