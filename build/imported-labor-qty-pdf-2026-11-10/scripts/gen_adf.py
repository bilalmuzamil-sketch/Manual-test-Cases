import json,sys
media=json.loads(sys.argv[1]) if len(sys.argv)>1 else {}
COL='upload-user-collection-1343233018'
def t(s,**m):
    n={"type":"text","text":s}; marks=[]
    if m.get('b'): marks.append({"type":"strong"})
    if m.get('link'): marks.append({"type":"link","attrs":{"href":m['link']}})
    if marks: n["marks"]=marks
    return n
def p(*c): return {"type":"paragraph","content":list(c)}
def h(s): return {"type":"heading","attrs":{"level":3},"content":[t(s)]}
def li(*c): return {"type":"listItem","content":[p(*c)]}
def ol(*items): return {"type":"orderedList","content":list(items)}
def ul(*items): return {"type":"bulletList","content":list(items)}
def men(i,name): return {"type":"mention","attrs":{"id":i,"text":"@"+name}}
def img(key,cap,w=1000):
    if key not in media: return [p(t(f"[{cap}]"))]
    return [{"type":"mediaSingle","attrs":{"layout":"center","width":w,"widthType":"pixel"},"content":[{"type":"media","attrs":{"type":"file","id":media[key],"collection":COL}}]}, p(t(cap))]
def row(cells,head=False):
    typ="tableHeader" if head else "tableCell"
    return {"type":"tableRow","content":[{"type":typ,"content":[p(t(c,b=head))]} for c in cells]}
PROD='https://app.shopview.com/imported-work-orders/006fbf58-fcbe-43f0-992b-e95060fb7318'
QA='https://sv12435.qa.shopview.com/imported-work-orders/17d4bce6-8cbe-473e-9747-d77741df130c'
c=[]
c.append(p(t("Found while testing "),t("SV-12435",link="https://shopview.atlassian.net/browse/SV-12435")))
c.append(h("Summary"))
c.append(p(t("On an imported invoice, the "),t("Quantity",b=True),t(" of a labor or sublet line is right on screen but wrong in the downloaded PDF. The PDF shows the hours multiplied by 60 (the minutes): 2.5 hours prints as "),t("150.00",b=True),t(", 3 hours as "),t("180.00",b=True),t(". Part quantities are fine. A customer who receives the PDF sees 150.00 × $40.00 = $100.00, which does not add up.")))
c.append(p(t("Where it happens: ",b=True),t("Reproducible on production, and also on the QA environment it was found on: "),t("sv12435.qa.shopview.com",link="https://sv12435.qa.shopview.com"),t(". It was not caused by the SV-12435 fix (that fix only changed colours on the screen).")))
c.append(h("Steps to reproduce (production)"))
c.append(ol(
 li(t("Log in to "),t("app.shopview.com",link="https://app.shopview.com"),t(". Check that the location at the top right says "),t("Trucks Hill 2",b=True),t(" (change it there if not).")),
 li(t("In the top menu click "),t("Work Orders",b=True),t(" and stay on the "),t("All",b=True),t(" tab.")),
 li(t("On the right of the filter bar, click the list view button (three lines with dots, box 1 in Picture 1).")),
 li(t("Click "),t("Status",b=True),t(", tick only "),t("Imported",b=True),t(", then click anywhere outside the menu. The button now reads "),t("Status: Imported",b=True),t(" (box 2).")),
 li(t("Click the row "),t("ZZQTYPDF-P",b=True),t(" (customer aqeel transport 56, box 3). The imported invoice opens.")),
 li(t("Look at the "),t("Quantity",b=True),t(" column on screen: Tow in "),t("3.00",b=True),t(", Brake inspection "),t("2.50",b=True),t(", Brake pad "),t("4",b=True),t(". These match the import file.")),
 li(t("At the top right of the invoice click the "),t("Download",b=True),t(" button (arrow pointing down, box A in Picture 2) and open the PDF.")),
 li(t("In the PDF the Quantity column shows Tow in "),t("180.00",b=True),t(", Brake inspection "),t("150.00",b=True),t(", Brake pad "),t("4.00",b=True),t(". The Rate and Amount columns are the same as on screen."))))
c+=img('loc',"Picture 1 (production): where to click to reach the imported invoice: 1 list view, 2 Status: Imported, 3 the invoice ZZQTYPDF-P.")
c+=img('prod',"Picture 2 (production): the same invoice on screen (top) and in the downloaded PDF (bottom). Red: labor and sublet quantities, right on screen, multiplied by 60 in the PDF. Green: the part quantity is correct in both.",760)
c.append(p(t("Fastest way to see it: ",b=True),t("open "),t("this imported invoice on production",link=PROD),t(", then click the Download button at the top right and compare the Quantity column with the screen.")))
c.append(h("Expected behaviour"))
c.append(p(t("The PDF shows the same quantity as the screen and the import file (2.50, not 150.00). Source: "),t("History Import - Overview",link="https://shopview.atlassian.net/wiki/spaces/PM/pages/141099010/History+Import+-+Overview"),t(": “All values import exactly as they appear in the file.” and "),t("History Import - Internal Training",link="https://shopview.atlassian.net/wiki/spaces/PM/pages/140967940/History+Import+-+Internal+Training"),t(" §9.1 Labor Rows: “Store Line Title, Line Description, Tech Story, Qty, Rate, Total, Tax.” (§9.5: Sublet “Behaves like Labor rows.”)")))
c.append(p(men("712020:1f21c3b6-c183-4d46-9561-7b79f0e197ab","Milos Vasic"),t(" "),men("712020:aa00b8d6-a71f-4259-8919-82a304227c20","Chris Ward"),t(" please confirm: should the PDF be fixed to show the hours, or should it stay as it is?")))
c.append(h("Current behaviour"))
c.append(p(t("The downloaded PDF prints labor and sublet quantities in minutes (hours × 60). The screen shows them in hours.")))
c.append({"type":"table","attrs":{"isNumberColumnEnabled":False,"layout":"default"},"content":[
 row(["Environment","Imported invoice","Line","Qty in file","On screen","In PDF"],True),
 row(["Production","ZZQTYPDF-P","Labor (Brake inspection)","2.5","2.50","150.00"]),
 row(["Production","ZZQTYPDF-P","Sublet (Tow in)","3","3.00","180.00"]),
 row(["Production","ZZQTYPDF-P","Part (Brake pad)","4","4","4.00"]),
 row(["Production","ZZ9818-P","Labor","1","1.00","60.00"]),
 row(["QA sv12435","ZZQTYPDF-QA","Labor / Sublet / Part","2.5 / 3 / 4","2.50 / 3.00 / 4","150.00 / 180.00 / 4.00"]),
 row(["QA sv12435","ZZ12435-INV1","Labor","1","1.00","60.00"])]})
c+=img('qa',"Picture 3 (QA environment sv12435): same result on the branch where it was found.",760)
c.append(p(t("Note: "),t("SV-12501",link="https://shopview.atlassian.net/browse/SV-12501"),t(" plans to build the on-screen imported invoice from the same template as the PDF. If that is done before this is fixed, the screen would show 150.00 too.")))
c.append(p(t("Where it is in the code: ",b=True),t("the import stores the labor/sublet quantity × 60 ("),t("ImportCommandHandler.php L253-L264",link="https://github.com/ShopView/shopview/blob/1c2403e5636cd25f1d43e59860c1fab5c7102ad0/api/src/Administration/Import/Application/WorkOrderHistorical/ImportCommandHandler.php#L253-L264"),t("). The screen turns it back into hours ("),t("ImportedInvoice.vue L205",link="https://github.com/ShopView/shopview/blob/1c2403e5636cd25f1d43e59860c1fab5c7102ad0/app/src/components/ts/work-orders/imported/ImportedInvoice.vue#L205"),t("), but the PDF template prints the stored number as it is ("),t("imported-invoice.html.twig L545",link="https://github.com/ShopView/shopview/blob/1c2403e5636cd25f1d43e59860c1fab5c7102ad0/api/templates/invoices/imported-invoice.html.twig#L545"),t(").")))
c.append(p(t("Environment: ",b=True),t("production app.shopview.com build v26.45.3-fc08f23 and QA environment sv12435.qa.shopview.com build v26.45.3-8f11821, checked 10 Nov 2026 around 17:00 UTC, Chrome on desktop 1600 × 900, admin user.")))
print(json.dumps({"type":"doc","version":1,"content":c}))
