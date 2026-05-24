"""
============================================================
  Block-Relief : Bulk Victim Registration on Blockchain
============================================================
  fund_allocation.csv থেকে ১০০ জন verified victim-কে নিয়ে
  smart contract-এ registerVictim() call করে।

  Compatible with তোমার existing CSV format:
    - Victim_ID, NID, Name, Vulnerability_Score, Phone, ...

  - SHA-256 identity hash তৈরি করে (privacy)
  - Score x100 হিসেবে integer-এ পাঠায় (Solidity float support করে না)
  - Ganache accounts cycle করে victim wallet হিসেবে use করে
  - প্রতিটা registration log করে registration_log.csv-তে
============================================================
"""

import json
import hashlib
import time
import pandas as pd
from web3 import Web3

import config


def make_identity_hash(nid: str, name: str) -> bytes:
    """SHA-256(nid + name + salt) → 32 bytes (bytes32 for Solidity)"""
    raw = f"{nid}-{name}-{config.HASH_SALT}".encode("utf-8")
    return hashlib.sha256(raw).digest()   # 32 bytes


def main():
    # ---------- 1. Connect to Ganache ----------
    w3 = Web3(Web3.HTTPProvider(config.GANACHE_URL))
    if not w3.is_connected():
        raise ConnectionError("❌ Cannot connect to Ganache. Is it running?")

    with open(config.ABI_PATH) as f:
        abi_data = json.load(f)
        if isinstance(abi_data, dict) and "abi" in abi_data:
            abi = abi_data["abi"]
        else:
            abi = abi_data

    contract = w3.eth.contract(
        address=Web3.to_checksum_address(config.CONTRACT_ADDRESS),
        abi=abi,
    )

    admin = w3.eth.account.from_key(config.ADMIN_PRIVATE_KEY)
    print(f"✅ Admin           : {admin.address}")
    print(f"✅ Contract        : {config.CONTRACT_ADDRESS}")
    print(f"✅ Chain ID        : {config.CHAIN_ID}")

    # ---------- 2. Load allocation data ----------
    df = pd.read_csv(config.ALLOCATION_CSV)
    print(f"📋 Total victims    : {len(df)}")

    # ---------- 3. Ganache accounts (rotate as victim wallets) ----------
    ganache_accounts = w3.eth.accounts
    print(f"🔑 Ganache accounts : {len(ganache_accounts)}")
    print(f"   (Admin = index 0; victims wallets cycle through 1..{len(ganache_accounts)-1})")
    print()

    logs = []
    nonce = w3.eth.get_transaction_count(admin.address)
    success_count = 0

    # ---------- 4. Loop and register ----------
    for idx, row in df.iterrows():
        try:
            vid    = int(row[config.COL_VICTIM_ID])
            nid    = str(row[config.COL_NID])
            name   = str(row.get(config.COL_NAME, ""))
            score  = float(row[config.COL_SCORE])

            id_hash   = make_identity_hash(nid, name)
            score_int = int(round(score * 100))   # 69.18 -> 6918

            # rotate wallet (skip admin index 0)
            wallet_idx = (idx % (len(ganache_accounts) - 1)) + 1
            wallet     = ganache_accounts[wallet_idx]

            # Build & send tx
            tx = contract.functions.registerVictim(
                id_hash, score_int, wallet
            ).build_transaction({
                "from":     admin.address,
                "nonce":    nonce,
                "gas":      300000,
                "gasPrice": w3.to_wei("20", "gwei"),
                "chainId":  config.CHAIN_ID,
            })

            signed  = w3.eth.account.sign_transaction(tx, config.ADMIN_PRIVATE_KEY)
            tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
            receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)

            ok = (receipt.status == 1)
            success_count += 1 if ok else 0
            status_emoji = "✅" if ok else "❌"

            print(f"{status_emoji} VID {vid:3d} | NID {nid} | Score x100={score_int:5d} "
                  f"| Wallet {wallet[:8]}... | TX {tx_hash.hex()[:14]}...")

            logs.append({
                "Victim_ID":    vid,
                "NID":          nid,
                "Score_x100":   score_int,
                "Wallet":       wallet,
                "TxHash":       tx_hash.hex(),
                "Block":        receipt.blockNumber,
                "GasUsed":      receipt.gasUsed,
                "Status":       "SUCCESS" if ok else "FAILED",
            })

            nonce += 1
            time.sleep(0.05)

        except Exception as e:
            print(f"❌ VID {row.get(config.COL_VICTIM_ID, '?')} ERROR: {e}")
            logs.append({
                "Victim_ID":    int(row.get(config.COL_VICTIM_ID, -1)),
                "NID":          str(row.get(config.COL_NID, "")),
                "Score_x100":   0,
                "Wallet":       "",
                "TxHash":       "",
                "Block":        0,
                "GasUsed":      0,
                "Status":       f"ERROR: {str(e)[:100]}",
            })

    # ---------- 5. Save log ----------
    pd.DataFrame(logs).to_csv(config.REGISTRATION_CSV, index=False)
    print("\n" + "=" * 60)
    print(f"📊 Registration Summary")
    print("=" * 60)
    print(f"   ✅ Successful : {success_count} / {len(df)}")
    print(f"   ❌ Failed     : {len(df) - success_count}")
    print(f"   📁 Log saved  : {config.REGISTRATION_CSV.name}")


if __name__ == "__main__":
    main()
