"""Import every case module once (shared by render_setup.py and render_outputs.py)."""
import importlib, os
import ct_lib as L
MODS = ["cases_s1", "cases_s2", "cases_s3", "cases_s4", "cases_s5", "cases_s6", "cases_s7", "cases_s8", "cases_s9", "cases_s10",
        "cases_s11", "cases_s12", "cases_data", "cases_design"]
for m in MODS:
    if os.path.exists(f"{L.D}/{m}.py"): importlib.import_module(m)
