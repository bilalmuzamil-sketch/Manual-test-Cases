# SV-11869 exhibits: export dialog, the downloaded file as plain text, and the file opened in Calc vs a control copy.
import sys, json; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN
B=json.load(open('ev/raw-file.boxes.json')); BLUE=(30,90,200)
def bx(k,pad=2): a=B[k]; return (a[0]-pad,a[1]-1,a[2]+pad,a[3]+1)
guard=[bx("'+Top up coolant"),bx("'=Replace hose"),bx("'-A12: Hose clamp"),bx('tabFull'),bx("'@Alignment"),bx("'-Brake check"),bx('crQuote'),bx('crText'),bx("'-10% fleet")]
plain=[bx('"ZZ Tab line'),bx('"Rotate tires'),bx('"Replace = hose')]
boxes=[(*b,GRN,1) for b in guard]+[(*b,BLUE,2) for b in plain]+[(*bx('-2.50,-2.50'),GRN,3)]
a=panel('ev/raw-file.png',(0,100,1010,352),'The downloaded Customer Invoice file, opened as plain text (staging, 28 Oct 2026)',boxes,
 [(1,GRN,"Each line text that starts with =, +, -, @, a tab or a carriage return now has one apostrophe in front: '+Top up coolant, '=Replace hose, '-A12: Hose clamp (part), the tab line, '@Alignment, '-Brake check, the carriage-return line (its apostrophe sits before the line break) and '-10% fleet (discount)."),
  (2,BLUE,"No apostrophe where the text starts with a letter, or where = is in the middle: ZZ Tab line, Rotate tires, Replace = hose."),
  (3,GRN,"The discount amount stays a plain number: -2.50.")],scale=2)
a.save('ev/SV-11869-01-file-plain-text.png')
d=panel('ev/customer-invoice-staging-dialog.png',(390,330,1030,560),'Reports → Export Reports',[(440,400,1000,440,GRN,1),(440,455,1000,495,GRN,2)],
 [(1,GRN,'Report Name: Customer Invoice.'),(2,GRN,'Date Range: Today, then Export.')],scale=1)
d.save('ev/SV-11869-02-export-dialog.png')
r=panel('ev/sheet/view-real.png',(110,150,830,490),'The same file opened in a spreadsheet (LibreOffice Calc, formulas switched on)',[(445,214,800,244,GRN,1)],
 [(1,GRN,"'=Replace hose - Leaking shows as text. Nothing is calculated. (Calc shows the apostrophe in the cell.)")],scale=1)
c=panel('ev/sheet/view-control.png',(110,150,830,490),'Comparison only: the same file with the apostrophes removed by hand (not a ShopView file)',[(445,214,800,244,RED,1)],
 [(1,RED,'Without the apostrophe, =Replace hose - Leaking is run as a formula and shows Err:509. This is what the fix prevents.')],scale=1)
stack([r,c]).save('ev/SV-11869-03-spreadsheet-vs-without.png')
print('ok')
