"""
============================================================
  Block-Relief : Central Configuration File
============================================================
  সব scripts এই file থেকে settings পড়বে।
  শুধু এই file edit করলেই হবে — অন্য কোথাও hardcoded value নেই।
============================================================
"""

import os
from pathlib import Path

# ---- Project paths ----
BASE_DIR      = Path(__file__).resolve().parent.parent
DATA_DIR      = BASE_DIR / "data"
CONTRACT_DIR  = BASE_DIR / "contracts"
RECEIPT_DIR   = DATA_DIR / "receipts"
DATA_DIR.mkdir(exist_ok=True)
RECEIPT_DIR.mkdir(exist_ok=True)

# ---- Blockchain (Ganache) ----
GANACHE_URL       = "http://127.0.0.1:7545"
CHAIN_ID          = 1337
CONTRACT_ADDRESS  = "0x05eD32f416a3D9142921299891AF1B28EdAac463"   # ⚠️ Remix থেকে copy করে paste করো
ABI_PATH          = CONTRACT_DIR / "FloodRelief_abi.json"

# ---- Admin wallet (Ganache 1st account) ----
ADMIN_PRIVATE_KEY = "0x50312d839dfad6df6ea1cf220d78f6b1070b98663dc7a93c070a0fa42ae95d27"        # ⚠️ Ganache 1st account-এর key
ADMIN_ADDRESS     = "0x0cbCeF2b1BB02321534F71A951d9B2469e51D264"

# ---- Data files (match তোমার existing pipeline) ----
NID_DB_CSV          = DATA_DIR / "National_ID_Database.csv"
VOLUNTEER_CSV       = DATA_DIR / "volunteer_input.csv"
VERIFIED_CSV        = DATA_DIR / "verified_victims.csv"
REJECTED_CSV        = DATA_DIR / "rejected_entries.csv"
WEIGHTS_CSV         = DATA_DIR / "fuzzy_ahp_weights.csv"
SCORED_CSV          = DATA_DIR / "scored_victims.csv"
ALLOCATION_CSV      = DATA_DIR / "fund_allocation.csv"
REGISTRATION_CSV    = DATA_DIR / "registration_log.csv"
BANK_ACCOUNTS_CSV   = DATA_DIR / "bank_accounts.csv"
RECEIPTS_CSV        = DATA_DIR / "receipts.csv"
SMS_LOG_CSV         = DATA_DIR / "sms_log.csv"

# ---- Column name constants (তোমার CSV অনুযায়ী) ----
COL_VICTIM_ID  = "Victim_ID"
COL_NID        = "NID"
COL_SCORE      = "Vulnerability_Score"
COL_NAME       = "Name"
COL_PHONE      = "Phone"
COL_ALLOCATED  = "Allocated_Fund_BDT"
# Bank account columns
COL_ACC_NUM    = "Account_Number"
COL_ACC_HOLDER = "Account_Holder"
COL_BALANCE    = "Current_Balance"
COL_MFS        = "MFS_Linked"

# ---- Currency conversion ----
# 1 ETH (simulation) = 100,000 BDT
# So total fund pool 1 ETH ≈ 1,00,000 BDT for demonstration
ETH_TO_BDT_RATE     = 100000

# ---- SMS Gateway (Android phone over WiFi) ----
SMS_GATEWAY_URL     = "http://192.168.0.100:8080"   # ⚠️ তোমার Android-এর local IP
SMS_GATEWAY_ENABLED = False                         # True করলে real SMS পাঠাবে

# ---- Salt for SHA-256 identity hashing ----
HASH_SALT           = "BlockRelief2026"


# ---- Helper to format phone number ----
def normalize_phone(raw) -> str:
    """
    তোমার CSV-তে Phone format `8801517136029.0` (float হয়ে গেছে)।
    এটাকে `+8801517136029` বানাও।
    """
    if raw is None:
        return ""
    s = str(raw).strip()
    if not s or s.lower() == "nan":
        return ""
    # remove trailing .0 if present
    if s.endswith(".0"):
        s = s[:-2]
    # remove any leading + or non-digit chars
    digits = "".join(c for c in s if c.isdigit())
    if not digits:
        return ""
    # if already starts with 88, add +; else assume Bangladesh and prepend +880
    if digits.startswith("880"):
        return "+" + digits
    if digits.startswith("0"):
        return "+88" + digits
    return "+880" + digits
