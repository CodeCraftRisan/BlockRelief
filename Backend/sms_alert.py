"""
============================================================
  Block-Relief : Android SMS Gateway Bridge (Offline-Capable)
============================================================
  কাজ:
   - Receipt তৈরি হলে victim-কে Bengali SMS পাঠাও
   - Internet না থাকলেও কাজ করে — কারণ Android phone GSM ব্যবহার করে
   - এই script শুধু local WiFi-এ Android phone-এর HTTP server-এ
     request পাঠায়; phone নিজে GSM দিয়ে SMS পাঠায়।

  Recommended Android App (free, open source):
   "SMS Gateway" by Capcom6
    Play Store: https://play.google.com/store/apps/details?id=com.capcom.smsgateway
    Phone-এ install করো → Local Server ON করো → Auth disable করো (testing-এ)
    Phone-এর IP note করে config.py-তে SMS_GATEWAY_URL set করো।

  Mode:
   - SMS_GATEWAY_ENABLED = False  → simulation (console + CSV log)
   - SMS_GATEWAY_ENABLED = True   → real SMS via phone GSM
============================================================
"""

import requests
from datetime import datetime
import pandas as pd

import config


def _log_sms(mobile: str, message: str, status: str, response: str = ""):
    """প্রতিটা SMS attempt log করো (thesis evaluation-এর জন্য)।"""
    row = {
        "Timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "Mobile":    mobile,
        "Message":   message[:300],
        "Status":    status,
        "Response":  str(response)[:200],
    }
    df_new = pd.DataFrame([row])
    if config.SMS_LOG_CSV.exists():
        df = pd.concat([pd.read_csv(config.SMS_LOG_CSV), df_new], ignore_index=True)
    else:
        df = df_new
    df.to_csv(config.SMS_LOG_CSV, index=False)


def send_sms_via_android(mobile: str, message: str) -> bool:
    """
    Local WiFi-এ Android phone-এ HTTP POST → phone GSM দিয়ে SMS পাঠায়।
    """
    if not mobile or mobile.strip() == "":
        _log_sms("", message, status="NO_NUMBER")
        print("   ⚠️  No mobile number provided")
        return False

    if not config.SMS_GATEWAY_ENABLED:
        # Simulation mode — console + log
        print(f"   📱 [SIMULATED SMS → {mobile}]")
        for line in message.split("\n"):
            print(f"      {line}")
        _log_sms(mobile, message, status="SIMULATED")
        return True

    try:
        # Capcom6 SMS Gateway endpoint
        payload = {
            "message":      message,
            "phoneNumbers": [mobile],
        }
        url = f"{config.SMS_GATEWAY_URL}/message"
        r = requests.post(url, json=payload, timeout=10)
        if r.status_code in (200, 201, 202):
            _log_sms(mobile, message, status="SENT", response=r.text)
            print(f"   ✅ SMS sent to {mobile}")
            return True
        _log_sms(mobile, message, status="FAILED", response=r.text)
        print(f"   ❌ SMS failed [{r.status_code}]: {r.text[:100]}")
        return False
    except Exception as e:
        _log_sms(mobile, message, status="ERROR", response=str(e))
        print(f"   ⚠️  SMS error: {e}")
        return False


def send_relief_confirmation(mobile: str, receipt: dict) -> bool:
    """Victim-কে Bengali confirmation SMS পাঠাও।"""
    msg = (
        "Block-Relief\n"
        "প্রিয় সুবিধাভোগী,\n"
        "আপনার ত্রাণ তহবিল নিশ্চিত হয়েছে।\n"
        f"পরিমাণ: {receipt['Amount_BDT']:,.0f} BDT\n"
        f"Receipt: {receipt['ReceiptID']}\n"
        f"তারিখ: {receipt['Timestamp'][:10]}"
    )
    return send_sms_via_android(mobile, msg)


def send_lottery_winner_notice(mobile: str, rank: int, amount_eth: float, tx_hash: str) -> bool:
    """Lucky donor-কে English SMS পাঠাও (since wallet-only, no Bengali name available)."""
    msg = (
        f"🎉 Block-Relief Lottery!\n"
        f"Congrats! You won Rank #{rank}\n"
        f"Prize: {amount_eth:.4f} ETH\n"
        f"TX: {tx_hash[:18]}..."
    )
    return send_sms_via_android(mobile, msg)


# ---- CLI Self-Test ----
if __name__ == "__main__":
    print("📱 SMS Alert — Self Test (Simulation mode)")
    print("=" * 60)
    dummy_receipt = {
        "ReceiptID":   "FRD-2026-0001",
        "Amount_BDT":  1682.0,
        "Timestamp":   "2026-06-15 14:32:07",
    }
    send_relief_confirmation("+8801517136029", dummy_receipt)
