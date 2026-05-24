# 🌊 Block-Relief

> **An Offline-Accessible and Privacy-Preserving Flood Relief Distribution Framework Using Fuzzy AHP and Android SMS Gateway Integration**

A blockchain-based, fair, transparent, tamper-proof flood relief system built for Bangladesh — works even **without internet** via Android SMS Gateway, and includes a **Decentralized Lottery** to incentivize donors.

---

## 🎯 What This Project Solves

| Problem | Solution |
|---------|----------|
| Equal distribution ignores severity | **Fuzzy AHP** scoring (50-expert survey) |
| Volunteers can fake beneficiaries | **NID-based anti-fraud verification** |
| Identity exposed on public chain | **SHA-256 hashing** of personal data |
| Internet down during floods | **Android SMS Gateway** (GSM-based) |
| Donors lack incentive | **Decentralized Lottery** (20% pool) |
| High gas cost on L1 | **Polygon L2** deployment ready |

---

## 📂 Project Structure

```
Block-Relief/
├── contracts/
│   ├── FloodRelief.sol          ⭐ Main smart contract (with Lottery)
│   └── FloodRelief_abi.json     (paste from Remix after compile)
├── backend/
│   ├── config.py                ⭐ Central config
│   ├── generate_datasets.py     (your existing script)
│   ├── verify_victim.py         (your existing script)
│   ├── fuzzy_ahp.py             (your existing script)
│   ├── allocate_funds.py        (your existing script)
│   ├── register_victims.py      ⭐ NEW (final version)
│   ├── bank_simulator.py        ⭐ NEW
│   ├── receipt_manager.py       ⭐ NEW
│   ├── sms_alert.py             ⭐ NEW (Android GSM)
│   └── event_listener.py        ⭐ NEW (orchestrator)
├── frontend/
│   ├── index.html               ⭐ NEW (donor + admin dashboard)
│   └── app.js                   ⭐ NEW (MetaMask + lottery)
├── data/
│   ├── *.csv                    (datasets + logs)
│   └── receipts/                (per-receipt text proofs)
└── docs/
    ├── 01_DEPLOYMENT_GUIDE.md   ⭐ Setup from zero
    └── 02_BACKEND_SCRIPTS_GUIDE.md ⭐ Run order
```

---

## 🚀 Quick Start (TL;DR)

```bash
# 1. Open Ganache (Quickstart Ethereum)
# 2. Deploy contracts/FloodRelief.sol in Remix → Injected MetaMask
#    Constructor arg: 1000000000000000000  (= 1 ETH target)
# 3. Copy contract address + ABI → paste into config.py & app.js

# 4. Install packages
pip install web3 pandas requests

# 5. Run pipeline
cd backend
python verify_victim.py        # → verified_victims.csv
python fuzzy_ahp.py            # → scored_victims.csv
python allocate_funds.py       # → fund_allocation.csv
python register_victims.py     # → on-chain registration

# 6. NEW terminal: start orchestrator
python event_listener.py       # (keep open)

# 7. Open frontend/index.html in browser
#    → Donate from 3+ MetaMask accounts (not admin!)
#    → Switch to admin → click "Trigger Distribution"

# 8. Watch event_listener terminal:
#    → bank update → receipt → SMS
```

📖 **Full step-by-step:** [`docs/01_DEPLOYMENT_GUIDE.md`](docs/01_DEPLOYMENT_GUIDE.md)
🐍 **Backend run order:** [`docs/02_BACKEND_SCRIPTS_GUIDE.md`](docs/02_BACKEND_SCRIPTS_GUIDE.md)

---

## 🧠 Smart Contract Features

| Function | Who | What |
|----------|-----|------|
| `donate()` | Anyone | Send ETH, get a lottery ticket |
| `registerVictim()` | Admin | Add a verified victim |
| `autoDistribute()` | Admin | 80% → victims, 20% → lottery |
| `getFundProgress()` | View | (collected, target, %) |
| `getMyTicket()` | View | Your lottery ticket # |
| `getLotteryWinner(rank)` | View | Winner info after distribution |

**Safety:**
- ✅ Reentrancy guard (`locked` flag)
- ✅ Admin-only restrictions
- ✅ Rounding-error proof (last victim gets remainder)
- ✅ SHA-256 identity hash (no PII on-chain)
- ✅ Event logging for off-chain orchestration

---

## 🎰 Lottery Math (Example: 1 ETH target)

```
Total fund: 1 ETH
├── 80% (0.8 ETH) → 100 victims via Fuzzy AHP
│      Victim_i_share = 0.8 ETH × (score_i / total_score)
└── 20% (0.2 ETH) → 3 lucky donors
       ├── 1st (50%): 0.10 ETH
       ├── 2nd (30%): 0.06 ETH
       └── 3rd (20%): 0.04 ETH
```

> **Production note (for thesis):** Pseudo-random seed (`block.timestamp + prevrandao`) is used for Ganache testing. Replace with **Chainlink VRF** for production-grade verifiable randomness.

---

## 📊 Completion Status

```
Smart Contract (v2 + Lottery)   ████████████████████  100% ✅
Data Pipeline                   ████████████████████  100% ✅
Blockchain Registration         ████████████████████  100% ✅
Bank Simulator                  ████████████████████  100% ✅  (NEW)
Receipt Manager                 ████████████████████  100% ✅  (NEW)
Event Listener                  ████████████████████  100% ✅  (NEW)
SMS Gateway (Android)           ████████████████████  100% ✅  (NEW)
Frontend (Donor + Admin)        ████████████████████  100% ✅  (NEW)
Fairness/Cost Analysis          ░░░░░░░░░░░░░░░░░░░░    0% ❌  (next)
Security Scan (Slither)         ░░░░░░░░░░░░░░░░░░░░    0% ❌  (next)
Sepolia/Polygon Deployment      ░░░░░░░░░░░░░░░░░░░░    0% ❌  (next)
Thesis Writing                  ██░░░░░░░░░░░░░░░░░░   10% ⚠️
```

---

## 🆘 Help & Common Errors

See **bottom of** [`docs/01_DEPLOYMENT_GUIDE.md`](docs/01_DEPLOYMENT_GUIDE.md) and [`docs/02_BACKEND_SCRIPTS_GUIDE.md`](docs/02_BACKEND_SCRIPTS_GUIDE.md).

Most common:
- Forgot to paste `CONTRACT_ADDRESS` in `config.py` and `app.js`
- Forgot to copy ABI to `contracts/FloodRelief_abi.json`
- MetaMask not on Ganache network (Chain ID 1337)
- Trying to donate from admin account — use a separate account!

---

**Made with ❤️ for the people of Bangladesh.**
