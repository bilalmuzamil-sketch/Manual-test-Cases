"""Every on-screen word of the 43 screenshots, as transcribed by viewing each picture (TRANSCRIPTS.md has the full description with
positions and styles). UI = labels, headings, chips, menu rows, messages, buttons (letter case exactly as drawn). DATA = example records:
names, document numbers, dates, amounts, counts, phone numbers, location names. Used by make_inventory.py and fed to
spec_to_design_check.py (only the after pictures, the design's target)."""
CHROME_OLD = ["ShopHub", "Work Orders", "Schedule", "Customers", "Parts", "Reports", "Search customers, work...", "Ctrl", "K", "Clock In", "AS"]
CHROME_NEW = ["ShopHub", "Work Orders", "Schedule", "Customers", "Parts", "Reports", "Dashboard", "Searc...", "Ctrl", "K", "Clock In", "AS"]
SIDEBAR = ["LABOR", "Timesheet Activities", "PERFORMANCE", "Sales", "Technician Efficiency", "Advisor Analysis", "Shop Efficiency",
           "Work In Progress", "Technician Utilization", "Sales By Customer", "Sales By Representative", "PARTS", "Parts Velocity",
           "Inventory Value", "FINANCE", "Sales Tax Collected", "ACCOUNTS RECEIVABLE", "A/R Aging Summary", "A/R Aging Detail",
           "A/R Aging Collection", "ACCOUNTS PAYABLE", "A/P Aging Summary", "A/P Aging Detail", "A/P Unpaid Invoices", "ACCOUNTING"]
LOCS = ["Staging Heavy Duty - 9919", "Staging Lethbridge - 4310"]
SUM_COLS_AR = ["Customer", "Location", "Current", "1-30 Days", "31-60 Days", "61-90 Days", "91 And Over", "Total", "Totals"]
SUM_COLS_AP = ["Vendor", "Location", "Current", "1-30 Days", "31-60 Days", "61-90 Days", "91 And Over", "Total", "Totals"]
APD_COLS = ["Date", "Location", "Transaction Type", "No.", "Vendor Name", "Due Date", "Past Due", "Amount", "Open Balance", "Totals", "Total"]
ARC_COLS = ["Date", "Location", "Transaction Type", "ID", "Due Date", "Past Due", "Amount", "Open Balance", "Totals", "Total"]
ARD_COLS = ["Date", "Location", "Transaction Type", "ID", "Customer Full Name", "Due Date", "Amount", "Open Balance", "Totals"]
CHIPS_AR = ["As of: 10/19/2026", "Customer: All customers", "Past due: Any", "Location: All locations"]
CHIPS_AP = ["As of: 10/19/2026", "Vendor: All vendors", "Past due: Any", "Location: All locations"]
BUCKETS = ["91 or more days past due", "61-90 days past due", "31-60 days past due", "1-30 days past due", "Current"]

S = {}
def s(iid, after, ui, data, chrome=True):
    S[iid] = dict(after=after, ui=(CHROME_NEW if after else CHROME_OLD) + SIDEBAR + ui if chrome else ui, data=data)

AR_SUM_ROWS_OLD = ["Mobile Truck & Trailer Repair Island Lake", "Inland Heavy Duty Truck Repair", "CMLZ Truck Repair - Talladega", "Wellington Truck Repair",
                   "Mobile Truck & Trailer Repair Blackfoot", "Dorr Truck Center", "Spaulding Truck Center", "Halfmoon Truck Repair", "Rockaway Mobile Truck Repair",
                   "North Kensington Truck and Trailer Repair", "Andrews' Truck & Trailer Repair LLC", "Lansing Truck & Trailer Repair", "Needles Truck & Equipment Repair",
                   "$1,483.90", "$7,298.24", "$6,300.00", "$314.40", "$1,867.94", "$2,182.34", "$3,316.84", "$4,973.89", "$6,265.32", "$14,556.05", "$1,270.34",
                   "$7.04", "$11,806.51", "$451.89", "$152.25", "$604.14", "$-2,062.66", "$8,600.85", "$1,113.83", "$432.75", "$54.78", "$487.53",
                   "$60,731.46", "$147,056.62", "$100,953.40", "$118,114.86", "$35,900.72", "$462,757.06", "Staging Heavy Duty - 9919"]
s("I01", False, ["A/R Aging Summary", "Date: 2026-10-15"] + SUM_COLS_AR[:1] + SUM_COLS_AR[2:], AR_SUM_ROWS_OLD)
s("I06", False, ["A/R Aging Summary", "Date: 2026-10-15"] + SUM_COLS_AR[:1] + SUM_COLS_AR[2:], AR_SUM_ROWS_OLD)
s("I02", False, ["A/P Aging Detail", "Date: 2026-10-15", "Date", "Transaction Type", "No.", "Vendor Name", "Location Name", "Due Date", "Past Due", "Amount",
                 "Open Balance", "Total", "Totals"] + BUCKETS,
  ["(11234)", "(776)", "(700)", "(604)", "(223)", "$3,830,561.21", "$3,830,561.23", "$243,187.09", "$340,823.56", "$340,823.58", "$245,080.58",
   "$75,055.45", "$4,734,707.89", "$4,734,707.93", "Staging Heavy Duty - 9919"])
AR_SUM_NEW = ["10 Trucking", "2 Trucking", "Andrews' Truck & Trailer Repair LLC", "Apollo Beach Truck & Equipment Repair", "Bancescu & Sons Truck & Trailer Repair",
              "Carrick & Sons Truck & Trailer Repair", "CMLZ Truck Repair - Talladega", "Colesville Diesel Repair", "Cope Truck Center - Desloge",
              "Coughlin & Sons Truck & Trailer Repair", "Desert Edge Truck Service & Repair", "Doi Truck Center", "$-100.00", "$-500.00", "$-400.00", "$8,600.85",
              "$1,491.58", "$-1,880.00", "$8,953.54", "$6,300.00", "$4,417.57", "$2,529.62", "$1,609.31", "$58,359.47", "$56,737.55", "$86,538.81",
              "$30,283.11", "$231,918.94", "$528.95", "$-75.20", "$453.75", "$60,731.46", "$145,530.62", "$102,479.40", "$109,512.83", "$43,002.75",
              "$461,257.06"] + LOCS
s("I03", True, ["A/R Aging Summary", "⋯"] + CHIPS_AR + SUM_COLS_AR, AR_SUM_NEW)
s("I08", True, ["A/R Aging Summary", "⋯"] + CHIPS_AR + SUM_COLS_AR, AR_SUM_NEW)
s("I04", True, ["A/R Aging Summary", "⋯"] + CHIPS_AR + SUM_COLS_AR + ["Multiple"],
  ["Desert Edge Truck Service & Repair", "Monroe Truck Service & Repair", "Tucson Truck Center", "Mobile Truck & Trailer Repair Blackfoot",
   "Sheppard Truck & Equipment Repair", "Halfmoon Truck Repair", "Henderson Mobile Truck Repair", "Carrick & Sons Truck & Trailer Repair",
   "Andrews' Truck & Trailer Repair LLC", "Inland Heavy Duty Truck Repair", "Leland Diesel & Fleet Repair", "CMLZ Truck Repair - Talladega",
   "Zero Truck and Trailer Repair", "$231,918.94", "$81,817.15", "$25,210.55", "$14,556.05", "$12,489.08", "$11,806.51", "$10,640.79", "$8,953.54",
   "$8,600.85", "$7,298.24", "$6,564.73", "$6,300.00", "$5,047.60", "$60,731.46", "$19,831.23", "$1,254.46", "$8,593.88", "$14,498.93",
   "$1,195.80", "$921.94", "$3,316.84", "$4,973.89", "$6,265.32", "$1,200.00", "$9,440.79", "$461,257.06"] + LOCS)
s("I05", True, ["A/P Aging Detail", "⋯"] + CHIPS_AP + APD_COLS + BUCKETS,
  ["(11334)", "(793)", "(658)", "(594)", "(161)", "$3,882,781.90", "$3,882,781.92", "$238,082.87", "$310,152.63", "$310,152.65", "$237,589.40",
   "$66,041.09", "$4,734,647.89", "$4,734,647.93", "Staging Heavy Duty - 9919"])
s("I07", False, ["A/P Aging Summary", "Date: 2026-10-15"] + SUM_COLS_AP[:1] + SUM_COLS_AP[2:],
  ["Abadi's Diesel Repair", "Adams Diesel Repair", "Akal's Mobile Truck Repair", "Alameda Mechanical Services", "Alzuhairi Truck & Machine Service",
   "Amani & Sons Truck & Trailer Repair", "Amherst Truck Center", "Amimi Diesel Services Inc", "Andover Fleet Services", "Antioch Diesel & Fleet Repair",
   "Apex Truck & Trailer Repair", "Asbury Park Truck Repair", "Athens Roadside Truck Repair", "$215.25", "$2,100.00", "$4,798.78", "$26,143.03",
   "$4,553.50", "$25,198.61", "$-1,050.00", "$0.00", "$590.55", "$990.48", "$256.20", "$272.17", "$21,479.55", "$26.10", "$32,833.58",
   "$75,055.45", "$245,080.58", "$340,823.58", "$243,187.09", "$3,830,561.23", "$4,734,707.93", "Staging Heavy Duty - 9919"])
s("I09", True, ["A/R Aging Summary", "⋯", "Download (PDF)", "Download (CSV)"] + CHIPS_AR + SUM_COLS_AR, AR_SUM_NEW)
s("I10", True, ["A/P Aging Summary", "⋯"] + CHIPS_AP + SUM_COLS_AP + ["Multiple"],
  ["10 Trucking Parts", "2 Trucking Parts", "Abadi's Diesel Repair", "Adams Diesel Repair", "Akal's Mobile Truck Repair", "Alameda Mechanical Services",
   "Alzuhairi Truck & Machine Service", "Amani & Sons Truck & Trailer Repair", "Amherst Truck Center", "Amimi Diesel Services Inc", "Andover Fleet Services",
   "Antioch Diesel & Fleet Repair", "Apex Truck & Trailer Repair", "$-10.00", "$-50.00", "$215.25", "$2,100.00", "$4,798.78", "$26,143.03",
   "$4,553.50", "$25,198.61", "$590.55", "$990.48", "$256.20", "$272.17", "$21,479.55", "$66,041.09", "$237,589.40", "$310,152.65",
   "$238,082.87", "$3,882,781.92", "$4,734,647.93"] + LOCS)
s("I11", True, ["A/P Aging Detail", "⋯"] + CHIPS_AP + APD_COLS + BUCKETS +
  ["This report is too large for PDF. Export it as CSV, or narrow the filters, then try again.", "Close"],
  ["(11334)", "(793)", "(658)", "(594)", "(161)", "$4,734,647.89", "$4,734,647.93"])
ARC_OLD = ["A/R Aging Collection", "Customer", "Date: 2026-10-15", "Date", "Transaction Type", "ID", "Location Full Name", "Due Date", "Past Due",
           "Amount", "Open Balance", "Total", "Totals", "Invoice", "Total for Mobile Truck & Trailer Repair Island Lake", "Total for Inland Heavy Duty Truck Repair"]
s("I12", False, ARC_OLD, ["Mobile Truck & Trailer Repair Island Lake (2)", "Inland Heavy Duty Truck Repair (2)", "CMLZ Truck Repair - Talladega (5)",
  "Wellington Truck Repair (2)", "Mobile Truck & Trailer Repair Blackfoot (6)", "Dorr Truck Center (1)", "Spaulding Truck Center (1)", "S2-17102", "S2-17530",
  "S2-8771", "S2-8092", "Aug 27, 2026", "Aug 28, 2026", "Sep 26, 2026", "Sep 27, 2026", "Jul 23, 2025", "19", "18", "449", "$1,179.44", "$304.46",
  "$1,483.90", "$870.85", "$6,427.39", "$7,298.24", "$6,300.00", "$2,182.34", "$14,556.05", "$1,270.34", "$27,454.37", "$7.04", "$429,961.92",
  "$402,025.60", "Staging Heavy Duty - 9919"])
s("I13", False, ["A/R Aging Collection", "Customer", "Date: 2026-10-15", "Date", "Transaction Type", "ID", "Location Full Name", "Due Date", "Past Due",
  "Amount", "Open Balance", "Total", "Totals"], ["Rockaway Mobile Truck Repair (3)", "North Kensington Truck and Trailer Repair (1)",
  "Andrews' Truck & Trailer Repair LLC (1)", "Lansing Truck & Trailer Repair (1)", "Needles Truck & Equipment Repair (2)", "Apollo Beach Truck & Equipment Repair (1)",
  "Lamkin Diesel Services Inc (1)", "Sheppard Truck & Equipment Repair (1)", "Monroe Truck Service & Repair (7)", "Cope Truck Center - Desloge (2)",
  "Universal City Truck Repair (1)", "Union Springs Truck Center (1)", "Desert Edge Truck Service & Repair (74)", "$604.14", "$-2,062.66", "$8,600.85",
  "$1,113.83", "$487.53", "$1,491.58", "$1,874.40", "$12,489.08", "$21,085.69", "$2,529.62", "$901.46", "$-812.34", "$231,918.94", "$429,961.92", "$402,025.60"])
ARC_NEW = ["A/R Aging Collection", "⋯"] + CHIPS_AR + ARC_COLS + ["Phone:", "Credit term:", "Credit", "Invoice", "Total for"]
s("I14", True, ARC_NEW + ["Total for 10 Trucking", "Total for 2 Trucking", "Total for Andrews' Truck & Trailer Repair LLC", "COD", "Net 30"],
  ["10 Trucking (1)", "2 Trucking (2)", "2 Trucking (1)", "Andrews' Truck & Trailer Repair LLC (1)", "257-911-9306", "343-203-3967", "CM2-99", "CM2-100",
   "CM2-101", "S2-16654", "Jun 5, 2025", "Aug 27, 2026", "Sep 26, 2026", "501", "23", "$-100.00", "$-200.00", "$-300.00", "$-500.00", "$-400.00",
   "$8,600.85", "$428,461.92", "$400,525.60", "Staging Heavy Duty - 9919"])
s("I15", True, ARC_NEW + ["Total for Bancescu & Sons Truck & Trailer Repair", "Total for Carrick & Sons Truck & Trailer Repair", "COD", "Net 30", "Net 15"],
  ["Apollo Beach Truck & Equipment Repair (1)", "Bancescu & Sons Truck & Trailer Repair (1)", "Carrick & Sons Truck & Trailer Repair (1)",
   "CMLZ Truck Repair - Talladega (5)", "833-303-1757", "257-911-9306", "665-284-6874", "543-029-3894", "CM2-552", "S3-16679", "S3-14690", "S3-14693",
   "S3-15660", "S3-14691", "S3-14692", "Jun 5, 2025", "Jul 30, 2026", "Aug 14, 2026", "Aug 27, 2026", "Sep 26, 2026", "501", "66", "23", "$-1,880.00",
   "$8,953.54", "$1,260.00", "$428,461.92", "$400,525.60"] + LOCS)
APU_NEW = ["A/P Unpaid Invoices Report", "⋯"] + CHIPS_AP + APD_COLS + ["Invoice", "Credit", "—", "Total for"]
s("I16", True, APU_NEW + ["Total for Adams Diesel Repair", "Total for Akal's Mobile Truck Repair"],
  ["Adams Diesel Repair (8)", "Akal's Mobile Truck Repair (6)", "Alameda Mechanical Services (43)", "Akal's Mobile Truck Repair", "Alameda Mechanical Services",
   "11966", "11967", "11989", "C-1224", "12887", "13286", "IN00267805", "IN00267944", "Mar 7, 2025", "Mar 17, 2025", "Jan 7, 2026", "Apr 24, 2026",
   "Jan 13, 2025", "Jan 21, 2025", "Mar 14, 2025", "Mar 22, 2025", "591", "581", "285", "178", "584", "576", "$2,100.00", "$4,411.18", "$56.42", "$22.44",
   "$-93.65", "$327.56", "$74.83", "$4,798.78", "$743.83", "$1,066.43", "$4,734,647.89", "$4,734,647.93", "Staging Heavy Duty - 9919"])
APD_OLD_SCROLL = ["A/P Aging Detail", "Date: 2026-10-15", "Transaction Type", "No.", "Vendor Name", "Location Name", "Due Date", "Past Due", "Amount", "Open Balance",
                  "Invoice", "Credit"]
APD_OLD_DATA = ["547769C", "547740C", "4172", "C-835", "C-834", "P77573", "548037C", "CALINV134346", "P77621", "C-3759", "545086179-2", "545086179-1", "2312",
                "East Shoreham Truck & Equipment Repair", "Sarasota Truck Repair", "Apex Truck & Trailer Repair", "New Castle Diesel Performance",
                "Kannapolis Truck & Equipment Repair", "La Salle Truck Repair", "Oxon Hill Truck Shop", "Kinder Truck Repair", "Newman's Diesel Repair",
                "Jan 6, 2025", "Jan 7, 2025", "Jan 9, 2025", "Jan 10, 2025", "Jan 11, 2025", "Jan 13, 2025", "647", "646", "644", "643", "642", "640", "$86.89",
                "$7,028.83", "$31.50", "$-193.50", "$-55.03", "$412.62", "$169.64", "$51.96", "$34.61", "$-735.00", "$57.79", "$23.51", "$306.60",
                "$4,734,707.89", "$4,734,707.93"] + LOCS
s("I17", False, APD_OLD_SCROLL, APD_OLD_DATA)
s("I18", False, APD_OLD_SCROLL, APD_OLD_DATA)
ARC_COLLAPSED_DATA = ["10 Trucking (1)", "2 Trucking (2)", "2 Trucking (1)", "Andrews' Truck & Trailer Repair LLC (1)", "Apollo Beach Truck & Equipment Repair (1)",
                      "Bancescu & Sons Truck & Trailer Repair (1)", "Carrick & Sons Truck & Trailer Repair (1)", "CMLZ Truck Repair - Talladega (5)",
                      "Colesville Diesel Repair (2)", "Cope Truck Center - Desloge (2)", "Coughlin & Sons Truck & Trailer Repair (2)",
                      "Desert Edge Truck Service & Repair (74)", "Doi Truck Center (2)", "257-911-9306", "343-203-3967", "833-303-1757", "665-284-6874",
                      "543-029-3894", "776-767-2768", "283-464-0262", "812-656-9196", "605-175-8825", "286-557-2913", "$-100.00", "$-500.00", "$-400.00",
                      "$8,600.85", "$1,491.58", "$-1,880.00", "$8,953.54", "$6,300.00", "$4,417.57", "$2,529.62", "$1,609.31", "$231,918.94", "$453.75",
                      "$428,461.92", "$400,525.60"]
ARC_COLLAPSED_UI = ["A/R Aging Collection", "⋯"] + CHIPS_AR + ARC_COLS + ["Phone:", "Credit term:", "COD", "Net 30", "Net 15", "Net 45"]
TIP = "Overdue invoices, unused credit memos and deposits for each customer to help you follow up on payments. Excludes invoices that aren’t due yet."
s("I19", True, ARC_COLLAPSED_UI, ARC_COLLAPSED_DATA)
s("I20", True, ARC_COLLAPSED_UI + [TIP], ARC_COLLAPSED_DATA)
s("I21", True, ARC_COLLAPSED_UI, ARC_COLLAPSED_DATA)
s("I22", True, ARC_COLLAPSED_UI + [TIP], ARC_COLLAPSED_DATA)
APD_OPEN_DATA = ["91 or more days past due (11334)", "98", "99", "100", "106", "107", "110", "111", "116", "11966", "11967", "11989", "12887", "13286",
                 "Adams Diesel Repair", "Akal's Mobile Truck Repair", "Nov 17, 2025", "Dec 12, 2025", "Dec 18, 2025", "Jan 10, 2026", "Mar 7, 2025",
                 "Mar 17, 2025", "Jan 7, 2026", "Apr 24, 2026", "336", "311", "305", "282", "591", "581", "285", "178", "$262.50", "$4,411.18", "$56.42",
                 "$22.44", "$327.56", "$74.83", "$4,734,647.89", "$4,734,647.93", "Staging Heavy", "Duty - 9919"]
s("I23", True, ["A/P Aging Detail", "⋯"] + CHIPS_AP + APD_COLS + ["Invoice"], APD_OPEN_DATA)
s("I24", True, ["A/P Aging Detail", "⋯"] + CHIPS_AP + APD_COLS + ["Invoice"], APD_OPEN_DATA)
s("I25", True, APU_NEW + ["Total for 10 Trucking Parts", "Total for 2 Trucking Parts", "Total for Abadi's Diesel Repair"],
  ["10 Trucking Parts (1)", "2 Trucking Parts (2)", "Abadi's Diesel Repair (1)", "Adams Diesel Repair (8)", "10 Trucking Parts", "2 Trucking Parts",
   "Abadi's Diesel Repair", "Adams Diesel Repair", "C-99", "C-100", "5956", "98", "99", "May 28, 2026", "May 5, 2026", "Oct 27, 2025", "Nov 17, 2025",
   "167", "357", "336", "$-10.00", "$-20.00", "$-30.00", "$-50.00", "$215.25", "$262.50", "$4,734,647.89", "$4,734,647.93"] + LOCS)
s("I26", False, ["A/R Aging Detail", "Date: 2026-10-15", "Date", "Transaction Type", "ID", "Customer Full Name", "Location Full Name", "Due Date", "Amount",
                 "Open Ba", "91 or more days past due", "Invoice", "Credit", "Totals"],
  ["(24)", "S2-8092", "S2-8771", "S2-8650", "S2-15067", "S2-15192", "S2-7302", "CM2-395", "S3-14144", "S2-14129", "CM2-418", "S2-15319", "S2-15086",
   "Inland Heavy Duty Truck Repair", "Wellington Truck Repair", "Mobile Truck & Trailer Repair Blackfoot", "North Kensington Truck and Trailer Repair",
   "Apollo Beach Truck & Equipment Repair", "Monroe Truck Service & Repair", "Union Springs Truck Center", "Desert Edge Truck Service & Repair",
   "$6,427.39", "$870.85", "$1,867.94", "$753.32", "$2,973.31", "$2,538.69", "$-2,062.66", "$1,491.58", "$1,254.46", "$-812.34", "$307.86",
   "$1,895.79", "$490,693.38"] + LOCS)
s("I27", False, ["All", "Estimates", "Work Orders", "Completed", "Search", "Assigned to me", "Asset on Site", "Create Work Order", "On Site", "Status",
                 "Number", "Customer", "Asset", "Unit", "VIN/Serial #", "Progress", "Service Advisor", "Lead Technician", "Clocked", "Approved",
                 "WorkOrder not found.", "Please try to resolve this.", "Request failed with status code 400", "Error fetching work order", "Close"],
  ["S2-17435", "S2-17578", "S2-17579", "S2-17415", "S2-16912", "S2-17477", "S2-15887", "S2-17277", "S2-17554", "S2-16747", "S2-17388", "S2-17095",
   "S2-17481", "Gerald Ortiz", "Becky Gonzales", "Unassigned", "Cameron Johnston", "Melanie Garner", "Daniel Montoya", "Hino Incomplete Vehicle",
   "INTERNATIONAL 7400", "XCMG ES125PD", "Western Star 4700", "Cummins QSX15-G9", "0%", "23%", "2%", "92%", "74%", "16%"])
ARD_NEW = ["A/R Aging Detail", "⋯"] + CHIPS_AR + ARD_COLS + BUCKETS[:2] + ["Invoice", "Credit", "Total for 91 or more days past due"]
s("I28", True, ARD_NEW, ["(42)", "(23)", "S3-8848", "CM2-2821", "S3-14900", "S3-15401", "S3-15628", "CM2-418", "S2-8650", "S3-16679", "S2-15113", "S2-15356",
  "Oakland City Truck & Trailer Repair", "Sledge Truck & Trailer Repair", "Tucson Truck Center", "Union Springs Truck Center", "Wellington Truck Repair",
  "Carrick & Sons Truck & Trailer Repair", "Desert Edge Truck Service & Repair", "$98.26", "$-231.00", "$69.62", "$782.70", "$-812.34", "$1,867.94",
  "$43,491.74", "$43,002.75", "$8,953.54", "$666.50", "$1,206.33", "$489,193.38", "$461,257.06"] + LOCS)
ARD_DESERT = ["(42)", "CM2-99", "CM2-100", "CM2-101", "CM2-552", "S3-14144", "S2-14703", "S2-14868", "S2-14949", "S2-15023", "S2-15086", "S2-15312", "10 Trucking",
              "2 Trucking", "Apollo Beach Truck & Equipment Repair", "Bancescu & Sons Truck & Trailer Repair", "Desert Edge Truck Service & Repair", "$-100.00",
              "$-200.00", "$-300.00", "$-400.00", "$1,491.58", "$-1,880.00", "$1,455.23", "$757.07", "$16,757.05", "$508.08", "$1,895.79", "$1,241.58",
              "$489,193.38", "$461,257.06"] + LOCS
s("I29", True, ARD_NEW[:-1] + ["Switch location?", "This work order is in Staging Lethbridge - 4310. Switch your active location to view it?", "Cancel",
                               "Switch Location", "×"], ARD_DESERT)
s("I30", True, ARD_NEW[:-1], ARD_DESERT)
s("I31", False, ["A/R Aging Detail", "Date: 2026-10-15", "Date", "Transaction Type", "ID", "Customer Full Name", "Location Full Name", "Due Date", "Amount",
                 "Open Ba", "Credit", "Invoice", "Total for 91 or more days past due", "61-90 days past due", "Totals"],
  ["(36)", "CM2-2821", "S2-14001", "CM2-552", "S3-16408", "S3-8848", "S3-15628", "S3-15401", "S3-14900", "S2-16146", "S2-15682", "S2-16051",
   "Sledge Truck & Trailer Repair", "McGarvie Mechanical Services", "Dunn Truck and Trailer Repair", "$36,389.71", "$490,693.38"] + LOCS)
s("I32", True, ARD_NEW[:-1], ARD_DESERT)
s("I33", True, ARD_NEW[:-1] + ["Select all", "2 selected", "Clear selection", "×"], ARD_DESERT)
s("I34", True, ["A/R Aging Detail", "⋯", "As of: 10/19/2026", "Customer: All customers", "Past due: Any", "Location: Staging Lethbri...", "Select all",
                "1 selected", "Clear selection", "Date", "Transaction Type", "ID", "Customer Full Name", "Amount", "Open Balance", "Total", "Totals"] + BUCKETS,
  ["(6)", "(3)", "(26)", "(34)", "(1)", "$3,008.12", "$2,519.13", "$10,074.14", "$16,136.37", "$35,684.63", "$1,040.11", "$65,943.37", "$65,454.38"] + LOCS)
s("I35", True, ["A/R Aging Detail", "⋯", "As of: 10/19/2026", "Customer: All customers", "Past due: Any", "Location: No locations", "Date",
                "Transaction Type", "ID", "Customer Full Name", "Due Date", "Amount", "Open Balance", "Totals", "No record matches these filters",
                "Try changing filters to widen your results.", "Clear all filters"], ["$0.00"])
s("I36", True, ["A/R Aging Summary", "⋯"] + CHIPS_AR + SUM_COLS_AR + ["Multiple"],
  ["Mobile Truck & Trailer Repair Blackfoot", "Monroe Truck Service & Repair", "10 Trucking", "2 Trucking", "Andrews' Truck & Trailer Repair LLC",
   "Bancescu & Sons Truck & Trailer Repair", "Colesville Diesel Repair", "Coughlin & Sons Truck & Trailer Repair", "Desert Edge Truck Service & Repair",
   "Dorr Truck Center", "Émile's Test Fleet", "Glendale Diesel & Fleet Repair", "$14,556.05", "$81,817.15", "$-500.00", "$592.17", "$461,257.06"] + LOCS)
s("I37", True, ["A/R Aging Collection", "⋯", "As of: 09/30/2026", "Customer: 10 Trucking", "Past due: Any", "Location: All locations"] + ARC_COLS +
  ["Phone:", "Credit term:", "COD"], ["10 Trucking (1)", "257-911-9306", "$-100.00"])
s("I38", True, ["A/R Aging Summary", "⋯"] + CHIPS_AR + SUM_COLS_AR + ["Any", "All ranges are included. Pick one or more to narrow.", "1-30 days", "31-60 days",
                                                                   "61-90 days", "91+ days"], AR_SUM_NEW)
s("I39", True, ["A/R Aging Summary", "⋯", "As of: 10/19/2026", "Customer: All customers", "Past due: 2 ranges", "Location: All locations"] + SUM_COLS_AR + ["Multiple"],
  ["Apollo Beach Truck & Equipment Repair", "Coughlin & Sons Truck & Trailer Repair", "Desert Edge Truck Service & Repair", "Doi Truck Center",
   "Dunn Truck and Trailer Repair", "Glendale Diesel & Fleet Repair", "Henderson Mobile Truck Repair", "Inland Heavy Duty Truck Repair",
   "McGarvie Mechanical Services", "Mobile Truck & Trailer Repair Blackfoot", "Monroe Truck Service & Repair", "Needles Truck & Equipment Repair",
   "Oakland City Truck & Trailer Repair", "$1,391.84", "$0.55", "$1,392.39", "$7.35", "$71,469.23", "$97,100.20", "$49,488.75", "$381,269.04"] + LOCS)
s("I40", True, ["A/P Aging Summary", "⋯"] + CHIPS_AP + SUM_COLS_AP + ["Search vendor", "All vendors", "All vendors are included. Pick one or more to narrow."],
  ["Carolina Truck & Trailer Repair", "Venice Gardens Truck Repair", "Lee Truck Center - Plainville", "Hillcrest Heavy Truck Repair Inc", "Khaled's Diesel Repair",
   "M & V Truck & Trailer Repair", "Hays Heavy Duty Truck & Equipment Repair", "Holly Springs Mobile Truck Repair", "Forrest City Diesel & Fleet Repair",
   "10 Trucking Parts", "2 Trucking Parts", "Abadi's Diesel Repair", "Adams Diesel Repair", "$4,734,647.93"] + LOCS)
s("I41", True, ["A/R Aging Summary", "⋯", "As of: 10/19/2026", "Customer: 2 customers", "Past due: Any", "Location: All locations", "All customers",
                "2 selected", "×"] + SUM_COLS_AR,
  ["10 Trucking", "4 Star Truck Repair", "2 Trucking", "7 Star Truck Repair", "A & J Truck & Trailer Repair", "Aberdeen Diesel Services LLC",
   "Aberdeen Truck Repair", "Abilene Mechanical Services", "$-100.00", "$0.00", "Staging H"])
s("I42", True, ["A/R Aging Collection", "⋯", "As of: 10/19/2026", "Customer: Andrews' Truck ...", "Past due: Any", "Location: All locations"] + ARC_COLS +
  ["Phone:", "Credit term:", "Net 30"], ["Andrews' Truck & Trailer Repair LLC (1)", "343-203-3967", "$8,600.85"])
s("I43", True, APU_NEW + ["Total for Adams Diesel Repair", "Total for Akal's Mobile Truck Repair"],
  ["Adams Diesel Repair (8)", "Akal's Mobile Truck Repair (6)", "Alameda Mechanical Services (43)", "C-1224", "11966", "11967", "11989", "12887", "13286",
   "IN00267805", "$2,100.00", "$-93.65", "$4,798.78", "$743.83", "$4,734,647.89", "$4,734,647.93", "Staging Heavy Duty - 9919"])
assert len(S) == 43, len(S)
