import pandas as pd
import numpy as np
import os

# --- File Paths ---
SCORED_VICTIMS_PATH = '../data/scored_victims.csv'
FUND_ALLOCATION_PATH = '../data/fund_allocation.csv'

# --- Configuration ---
TOTAL_FUND_POOL_BDT = 1000000   # 10 Lakh BDT total donation pool
MIN_RELIEF_BDT = 2000           # Minimum 2000 BDT per victim
MAX_RELIEF_BDT = 25000          # Maximum 25000 BDT per victim


def allocate_proportional_funds():
    """
    Dynamic Fund Allocation using proportional scoring.
    Formula: Victim Fund = Total Fund * (Individual Score / Total Score)
    With minimum floor and maximum cap.
    """
    print("=" * 60)
    print("DYNAMIC FUND ALLOCATION")
    print("=" * 60)

    try:
        scored_df = pd.read_csv(SCORED_VICTIMS_PATH)
        print(f"Scored victims loaded: {len(scored_df)} records")
    except FileNotFoundError:
        print(f"Error: File not found at '{SCORED_VICTIMS_PATH}'")
        return

    total_score = scored_df['Vulnerability_Score'].sum()
    if total_score == 0:
        print("Error: Total vulnerability score is zero. Cannot allocate funds.")
        return

    # --- Proportional Allocation ---
    scored_df['Raw_Allocation_BDT'] = (
        TOTAL_FUND_POOL_BDT * (scored_df['Vulnerability_Score'] / total_score)
    ).round(0)

    # --- Apply Floor and Cap ---
    scored_df['Allocated_Fund_BDT'] = scored_df['Raw_Allocation_BDT'].clip(
        lower=MIN_RELIEF_BDT,
        upper=MAX_RELIEF_BDT
    )

    # --- Redistribute Excess (from capping) ---
    total_allocated = scored_df['Allocated_Fund_BDT'].sum()
    difference = TOTAL_FUND_POOL_BDT - total_allocated

    if abs(difference) > 1:
        # Distribute remaining to uncapped victims proportionally
        uncapped_mask = (
            (scored_df['Allocated_Fund_BDT'] > MIN_RELIEF_BDT) &
            (scored_df['Allocated_Fund_BDT'] < MAX_RELIEF_BDT)
        )
        if uncapped_mask.any():
            uncapped_scores = scored_df.loc[uncapped_mask, 'Vulnerability_Score']
            adjustment = difference * (uncapped_scores / uncapped_scores.sum())
            scored_df.loc[uncapped_mask, 'Allocated_Fund_BDT'] += adjustment.round(0)

    # --- Traditional Comparison ---
    equal_amount = TOTAL_FUND_POOL_BDT / len(scored_df)
    scored_df['Traditional_Equal_BDT'] = round(equal_amount, 0)

    # --- Save ---
    output_cols = ['Victim_ID', 'NID', 'Vulnerability_Score',
                   'Allocated_Fund_BDT', 'Traditional_Equal_BDT']
    
    available_cols = [c for c in output_cols if c in scored_df.columns]
    scored_df[available_cols + [c for c in scored_df.columns if c not in available_cols]].to_csv(
        FUND_ALLOCATION_PATH, index=False
    )

    print(f"Fund allocation saved to '{FUND_ALLOCATION_PATH}'")

    # --- Summary ---
    print("\n--- Allocation Summary ---")
    print(f"Total Fund Pool:         {TOTAL_FUND_POOL_BDT:>12,.0f} BDT")
    print(f"Total Allocated:         {scored_df['Allocated_Fund_BDT'].sum():>12,.0f} BDT")
    print(f"Min Allocation:          {scored_df['Allocated_Fund_BDT'].min():>12,.0f} BDT")
    print(f"Max Allocation:          {scored_df['Allocated_Fund_BDT'].max():>12,.0f} BDT")
    print(f"Mean Allocation:         {scored_df['Allocated_Fund_BDT'].mean():>12,.0f} BDT")
    print(f"Traditional Equal Share: {equal_amount:>12,.0f} BDT")

    print("\n--- Top 5 Recipients ---")
    print(scored_df[available_cols].sort_values(
        by='Allocated_Fund_BDT', ascending=False).head().to_string(index=False))

    print("\n--- Bottom 5 Recipients ---")
    print(scored_df[available_cols].sort_values(
        by='Allocated_Fund_BDT', ascending=True).head().to_string(index=False))


if __name__ == "__main__":
    allocate_proportional_funds()