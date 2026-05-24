"""
============================================================
  Block-Relief : Blockchain Event Listener (Orchestrator)
============================================================
  এটাই তোমার পুরো system-এর "অর্কেস্ট্রেটর" — যেটা সব কিছু
  একসাথে যুক্ত করে।

  কাজের ধারা:
   1. Smart contract-এর FundReleased event listen করো
   2. Event এলেই:
        a. Bank simulator-এ টাকা যোগ করো
        b. Receipt তৈরি করো
        c. SMS পাঠাও (Bengali)
   3. LotteryWinnerSelected event-ও handle করো (donor SMS)
   4. AllFundsDistributed event এলে summary print করো

  চালু করো:  python event_listener.py
   - Terminal খোলা থাকবে, background-এ listen করবে
   - Ctrl+C দিলে stop হবে
============================================================
"""

import json
import time
from web3 import Web3

import config
import bank_simulator
import receipt_manager
import sms_alert


# ============================================================
#   Web3 connection helper
# ============================================================
def get_contract():
    w3 = Web3(Web3.HTTPProvider(config.GANACHE_URL))
    if not w3.is_connected():
        raise ConnectionError("❌ Ganache-এ connect করা যাচ্ছে না! Ganache চলছে?")

    with open(config.ABI_PATH, "r") as f:
        abi_data = json.load(f)
        if isinstance(abi_data, dict) and "abi" in abi_data:
            abi = abi_data["abi"]
        else:
            abi = abi_data

    contract = w3.eth.contract(
        address=Web3.to_checksum_address(config.CONTRACT_ADDRESS),
        abi=abi,
    )
    return w3, contract


# ============================================================
#   Event Handlers
# ============================================================
def handle_fund_released(event):
    """একজন victim-কে fund পাঠানো হয়েছে → bank → receipt → SMS"""
    args      = event["args"]
    victim_id = int(args["victimId"])
    amount    = int(args["amount"])             # wei
    wallet    = args["wallet"]
    tx_hash   = event["transactionHash"].hex()

    print(f"\n💸 FundReleased | Victim_ID={victim_id} | "
          f"{amount/10**18:.6f} ETH → {wallet[:10]}...")

    # 1. Bank credit
    try:
        bank_result = bank_simulator.credit_victim(victim_id, amount)
        print(f"   🏦 Bank: {bank_result['bdt_amount']:,.0f} BDT credited to "
              f"{bank_result['account_number']} ({bank_result['account_holder']})")
    except Exception as e:
        print(f"   ❌ Bank error: {e}")
        return

    # 2. Receipt
    try:
        receipt = receipt_manager.generate_receipt(bank_result, tx_hash)
    except Exception as e:
        print(f"   ❌ Receipt error: {e}")
        return

    # 3. SMS
    mobile = bank_result.get("mobile", "")
    sms_alert.send_relief_confirmation(mobile, receipt)


def handle_lottery_winner(event):
    args   = event["args"]
    winner = args["winner"]
    amount = int(args["amount"])
    rank   = int(args["rank"])
    tx     = event["transactionHash"].hex()

    print(f"\n🎉 Lottery Rank #{rank} | {winner[:10]}... won "
          f"{amount/10**18:.4f} ETH")

    # NOTE: Donors are wallet-only, no phone. In production you'd
    # have a donor profile DB. For thesis we just log it.
    # If you want to test SMS for a winner, uncomment below:
    # sms_alert.send_lottery_winner_notice("+8801XXXXXXXXX", rank,
    #                                      amount/10**18, tx)


def handle_all_distributed(event):
    args       = event["args"]
    total      = int(args["totalDistributed"]) / 10**18
    recipients = int(args["recipients"])
    lottery    = int(args["lotteryPool"]) / 10**18
    print("\n" + "=" * 60)
    print(f"🏁 ALL FUNDS DISTRIBUTED")
    print(f"   Total to Victims : {total:.6f} ETH")
    print(f"   Lottery Pool     : {lottery:.6f} ETH")
    print(f"   Recipients       : {recipients}")
    print("=" * 60 + "\n")


def handle_donation(event):
    args   = event["args"]
    donor  = args["donor"]
    amount = int(args["amount"]) / 10**18
    ticket = int(args["ticketNumber"])
    total  = int(args["totalDonated"]) / 10**18
    print(f"💰 Donation | {donor[:10]}... gave {amount:.4f} ETH "
          f"| Ticket #{ticket} | Total raised: {total:.4f} ETH")


# ============================================================
#   Main Loop
# ============================================================
def main():
    print("=" * 60)
    print("🎧 Block-Relief Event Listener")
    print("=" * 60)
    w3, contract = get_contract()
    print(f"✅ Connected to    : {config.GANACHE_URL}")
    print(f"✅ Contract        : {config.CONTRACT_ADDRESS}")
    print(f"✅ Latest block    : {w3.eth.block_number}")
    print(f"✅ SMS Gateway     : {'ENABLED' if config.SMS_GATEWAY_ENABLED else 'SIMULATED'}")
    print("\n👂 Listening for events...  (Ctrl+C to stop)\n")

    from_block = w3.eth.block_number
    donation_filter = contract.events.DonationReceived.create_filter(from_block=from_block)
    fund_filter     = contract.events.FundReleased.create_filter(from_block=from_block)
    lottery_filter  = contract.events.LotteryWinnerSelected.create_filter(from_block=from_block)
    final_filter    = contract.events.AllFundsDistributed.create_filter(from_block=from_block)

    try:
        while True:
            for ev in donation_filter.get_new_entries():
                handle_donation(ev)
            for ev in fund_filter.get_new_entries():
                handle_fund_released(ev)
            for ev in lottery_filter.get_new_entries():
                handle_lottery_winner(ev)
            for ev in final_filter.get_new_entries():
                handle_all_distributed(ev)
            time.sleep(2)
    except KeyboardInterrupt:
        print("\n👋 Listener stopped by user.")


if __name__ == "__main__":
    main()
