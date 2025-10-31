import json
from pathlib import Path

def load_invoices():
    """
    Loads invoice data from backend/data/invoices.json
    and returns a Python list.
    """
    data_path = Path(__file__).parent / "data" / "invoices.json"
    with open(data_path, "r") as f:
        invoices = json.load(f)
    return invoices
