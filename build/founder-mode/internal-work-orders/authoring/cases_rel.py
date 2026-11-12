"""Release day (Story 13 for existing organizations, and S9-R14 rule zero): checks that need records and figures noted on production
shortly before the release reaches it, and are run there after it (precedent: Credit terms 26 Oct 2026, Bill To 10 Nov 2026). They go
in the "Run on Production After Release" folder."""
from iwo_lib import C, PRE_REL
from common import *

S = "REL"
PROD = "Use the production test account."

C("REL-01", S, "After the release an organization has the categories and the setting off",
  [ADMIN, PROD, cust("A", ", named like the shop's own fleet, with one open billable work order, work order 1, made before the release")],
  ["Open Administration > Service > Internal Work Orders.", "Open Settings > Work Orders.", "Open customer A's page.", OPEN_WO],
  [['General Internal (Default), Warranty, Goodwill and Comeback are listed once each; Warranty and Comeback show "Required".'],
   ['The "Internal Work Orders" toggle is off and nothing new shows on the tab beyond it.'], ['Customer A shows no "Internal" badge: no customer was flagged.'],
   ['Work order 1 is still billable, with no badge, and offers "Create invoice".']],
  ["S13-R1", "S13-R5", "S13-R6", "OV-0"], marker=PRE_REL)
C("REL-02", S, "After the release every QuickBooks location has four empty category rows",
  [ADMIN, PROD, "Use a location connected to QuickBooks Online before the release."],
  ["Open Integrations > QuickBooks.", "Open ShopView Accounts."],
  [["The QuickBooks page opens."], ["Four category rows show under Cost of Parts, each empty, with no hint while the setting is off; the other rows are as they were."]],
  ["S13-R2", "S13-R5", "S5-R5"], marker=PRE_REL)
C("REL-03", S, "After the rollout an AccountingHub organization has all starting mappings",
  [ADMIN, PROD, "Use an organization on AccountingHub before the release, and note its chart of accounts and Account Mappings before the release."],
  ["Open Accounting > Account Mappings.", "Open Accounting's chart of accounts."],
  [["All four starting category rows are mapped, Comeback included: General Internal to a Vehicle Expenses account, Warranty and Goodwill to a Warranty & Goodwill Expense account, Comeback to a Comeback Expense account.",
    "Every mapping noted before the release that was valid is unchanged."],
   ["An active expense account whose name matched was reused, not duplicated.", "A missing account was created; if its default number was taken by an unrelated account, it sits at a free number and that account is unchanged."]],
  ["S6-R2", "S13-R3", "S13-E1", "S13-R5"], marker=PRE_REL)
C("REL-04", S, "Billable report figures are the same to the cent after the release",
  [ADMIN, PROD, "Before the release, export Sales, Sales By Customer, Sales By Representative, Advisor Analysis, Technician Efficiency, Shop Efficiency, Parts Velocity, Sales Tax Collected, A/R Aging, Requested Parts, Payroll Timesheet and the dashboard cards for the last 12 months, and keep the files.",
   "Make sure no internal or no-charge work order and no no-charge line exists in the organization after the release."],
  ["Export the same reports for the same 12 months."],
  [["Every row and every total equals the file kept before the release, to the cent.", "The $0 invoices made before the release are still in them as billable invoices."]],
  ["S9-R14", "S9-R15", "S9-E2", "OOS-08", ("Jira SV-12297", "After the deployment, with no internal or no-charge work order and no no-charge line in the sample, export the same reports for the same range: every row and every total is identical.")],
  marker=PRE_REL)
C("REL-05", S, "Existing work orders stay billable and nothing new shows until it is on",
  [ADMIN, PROD, "Use an organization that has not turned the Internal Work Orders setting on."],
  ["Open the work orders list.", "Click New Work Order.", "Open the Customers list."],
  [['No "Classification" chip shows and no row carries an "Internal" or "No Charge" badge.'], ['The window shows no "No Charge" checkbox and no "Internal" badge.'],
   ['No customer shows an "Internal" badge.']],
  ["KD-NOFLAG", ("Jira SV-11973", "Migrations apply and `doctrine:migrations:diff` reports no changes; every existing work order, line and invoice reads `billable`.")],
  marker=PRE_REL)
