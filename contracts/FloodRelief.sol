// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * ============================================================
 *   Block-Relief : FloodRelief Smart Contract (Final Version)
 * ============================================================
 *
 *  Author       : (Your Name)
 *  Thesis Title : Block-Relief: An Offline-Accessible and
 *                 Privacy-Preserving Flood Relief Distribution
 *                 Framework Using Fuzzy AHP and Android SMS
 *                 Gateway Integration
 *
 *  Features:
 *   1. Donations (anyone can donate ETH)
 *   2. Victim Registration (admin only, SHA-256 hash for privacy)
 *   3. Auto Distribution (proportional to Fuzzy AHP vulnerability score)
 *   4. Incentivized Donation via Decentralized Lottery
 *        - 80% of fund -> victims (Fuzzy AHP based)
 *        - 20% of fund -> 3 lucky donors (1st 50%, 2nd 30%, 3rd 20%)
 *   5. Reentrancy Protection
 *   6. Rounding-Error Safe (last victim gets remainder)
 *   7. Full event logging for off-chain listener (SMS Gateway)
 *
 *  Tested on : Remix IDE + Ganache (chain id 1337)
 *  Target    : Ganache (dev) -> Sepolia (testnet) -> Polygon (Layer-2)
 *
 * ============================================================
 */
contract FloodRelief {

    // ============================================================
    //  SECTION 1 : STATE VARIABLES
    // ============================================================

    address public admin;             // contract deployer = admin
    uint256 public targetFund;        // target ETH (in wei) to trigger distribute
    uint256 public totalDonated;      // total ETH (wei) received so far
    uint256 public totalScore;        // sum of all victim scores (for proportional share)
    uint256 public victimCount;       // total registered victims
    bool    public isDistributed;     // true after autoDistribute() runs
    bool    private locked;           // reentrancy guard

    // ----- Lottery configuration -----
    uint256 public lotteryPrizePercent = 20;   // 20% of fund -> lottery pool
    uint256 public constant NUM_WINNERS = 3;   // 3 lucky donors
    bool    public lotteryCompleted;           // true after lottery picked

    // ============================================================
    //  SECTION 2 : STRUCTS
    // ============================================================

    struct Victim {
        uint256  id;              // 1..victimCount
        bytes32  identityHash;    // SHA-256/keccak hash of NID + name + salt
        uint256  score;           // Fuzzy AHP vulnerability score (e.g. 8810 = 88.10)
        uint256  reliefAmount;    // wei sent to this victim
        address  walletAddress;   // victim wallet (or admin custodian)
        bool     isRegistered;
        bool     isPaid;
    }

    struct Donor {
        address  donorAddress;
        uint256  totalAmount;     // cumulative donation
        uint256  ticketNumber;    // lottery ticket id
        uint256  donatedAt;
    }

    struct LotteryPrize {
        address winner;
        uint256 amount;
        uint256 rank;             // 1, 2, or 3
        bool    claimed;          // true if transfer succeeded
    }

    // ============================================================
    //  SECTION 3 : MAPPINGS & ARRAYS
    // ============================================================

    mapping(uint256 => Victim) public victims;       // id -> Victim
    mapping(address => uint256) public donorIndex;   // donor -> index in donors[] (1-based, 0 = not donor)
    Donor[] public donors;                           // all donors list
    LotteryPrize[] public lotteryWinners;            // winners (filled after autoDistribute)

    // ============================================================
    //  SECTION 4 : EVENTS  (off-chain listener uses these)
    // ============================================================

    event DonationReceived(address indexed donor, uint256 amount, uint256 ticketNumber, uint256 totalDonated);
    event VictimRegistered(uint256 indexed victimId, bytes32 identityHash, uint256 score, address wallet);
    event FundReleased(uint256 indexed victimId, uint256 amount, address wallet);
    event LotteryWinnerSelected(address indexed winner, uint256 amount, uint256 rank);
    event AllFundsDistributed(uint256 totalDistributed, uint256 recipients, uint256 lotteryPool);
    event TargetFundUpdated(uint256 newTarget);

    // ============================================================
    //  SECTION 5 : MODIFIERS
    // ============================================================

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }

    modifier noReentrant() {
        require(!locked, "Reentrancy blocked");
        locked = true;
        _;
        locked = false;
    }

    // ============================================================
    //  SECTION 6 : CONSTRUCTOR
    // ============================================================

    /**
     * @param _targetFundInWei   e.g. 1 ETH = 1000000000000000000 wei
     */
    constructor(uint256 _targetFundInWei) {
        admin       = msg.sender;
        targetFund  = _targetFundInWei;
    }

    // ============================================================
    //  SECTION 7 : ADMIN FUNCTIONS
    // ============================================================

    /**
     * Register one verified victim (called from register_victims.py).
     * @param _identityHash  keccak256(NID + name + salt) — generated off-chain
     * @param _score         Fuzzy AHP score scaled x100 (e.g. 88.10 -> 8810)
     * @param _wallet        victim's wallet (or admin-controlled custodian wallet)
     */
    function registerVictim(
        bytes32 _identityHash,
        uint256 _score,
        address _wallet
    ) external onlyAdmin {
        require(!isDistributed, "Distribution already done");
        require(_score > 0, "Score must be > 0");
        require(_wallet != address(0), "Invalid wallet");

        victimCount += 1;
        victims[victimCount] = Victim({
            id:             victimCount,
            identityHash:   _identityHash,
            score:          _score,
            reliefAmount:   0,
            walletAddress:  _wallet,
            isRegistered:   true,
            isPaid:         false
        });

        totalScore += _score;
        emit VictimRegistered(victimCount, _identityHash, _score, _wallet);
    }

    /**
     * Admin can update target fund before distribution (optional).
     */
    function updateTargetFund(uint256 _newTargetInWei) external onlyAdmin {
        require(!isDistributed, "Already distributed");
        targetFund = _newTargetInWei;
        emit TargetFundUpdated(_newTargetInWei);
    }

    // ============================================================
    //  SECTION 8 : DONATE FUNCTIONS
    // ============================================================

    /**
     * Anyone can donate ETH. Each donation issues a lottery ticket.
     */
    function donate() public payable {
        require(msg.value > 0, "Donation must be > 0");
        require(!isDistributed, "Distribution already done");

        totalDonated += msg.value;

        uint256 ticket;
        if (donorIndex[msg.sender] == 0) {
            // first time donor
            donors.push(Donor({
                donorAddress: msg.sender,
                totalAmount:  msg.value,
                ticketNumber: donors.length + 1,
                donatedAt:    block.timestamp
            }));
            donorIndex[msg.sender] = donors.length;   // 1-based index
            ticket = donors.length;
        } else {
            // existing donor -> just add amount, keep same ticket
            uint256 idx = donorIndex[msg.sender] - 1;
            donors[idx].totalAmount += msg.value;
            donors[idx].donatedAt    = block.timestamp;
            ticket = donors[idx].ticketNumber;
        }

        emit DonationReceived(msg.sender, msg.value, ticket, totalDonated);
    }

    /**
     * Fallback: direct ETH transfer to contract is treated as donate().
     */
    receive() external payable {
        donate();
    }

    // ============================================================
    //  SECTION 9 : AUTO DISTRIBUTION (Main Logic)
    // ============================================================

    /**
     * When target reached, admin clicks "Distribute" button.
     *  - 80% goes proportionally to victims (Fuzzy AHP score)
     *  - 20% goes to 3 lucky donors (lottery)
     */
    function autoDistribute() external onlyAdmin noReentrant {
        require(totalDonated >= targetFund, "Target fund not reached");
        require(!isDistributed,              "Already distributed");
        require(victimCount > 0,             "No victims registered");
        require(totalScore  > 0,             "Total score is zero");

        isDistributed = true;

        uint256 totalBalance = address(this).balance;
        uint256 lotteryPool  = (totalBalance * lotteryPrizePercent) / 100;
        uint256 victimPool   = totalBalance - lotteryPool;

        // ---- Step 1 : pay each victim proportionally ----
        uint256 distributed = 0;
        for (uint256 i = 1; i <= victimCount; i++) {
            Victim storage v = victims[i];
            if (!v.isRegistered || v.isPaid) continue;

            uint256 share;
            if (i == victimCount) {
                // last victim gets remainder -> fixes rounding loss
                share = victimPool - distributed;
            } else {
                share = (victimPool * v.score) / totalScore;
            }

            v.reliefAmount = share;
            v.isPaid       = true;
            distributed   += share;

            (bool ok, ) = payable(v.walletAddress).call{value: share}("");
            if (ok) {
                emit FundReleased(i, share, v.walletAddress);
            }
        }

        // ---- Step 2 : run lottery for donors ----
        if (donors.length >= NUM_WINNERS && lotteryPool > 0) {
            _pickLotteryWinners(lotteryPool);
        }

        emit AllFundsDistributed(distributed, victimCount, lotteryPool);
    }

    /**
     * Internal lottery winner selection (pseudo-random for Ganache testing).
     * For production -> replace seed with Chainlink VRF.
     */
    function _pickLotteryWinners(uint256 pool) internal {
        // prize split: 50% / 30% / 20%
        uint256[3] memory prizes;
        prizes[0] = (pool * 50) / 100;
        prizes[1] = (pool * 30) / 100;
        prizes[2] =  pool - prizes[0] - prizes[1];   // remainder -> 3rd

        // seed (pseudo-random, OK for Ganache + thesis demo)
        uint256 seed = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            totalDonated,
            donors.length,
            address(this).balance
        )));

        bool[] memory picked = new bool[](donors.length);

        for (uint256 i = 0; i < NUM_WINNERS; i++) {
            // derive next index from seed
            uint256 idx = uint256(keccak256(abi.encodePacked(seed, i))) % donors.length;

            // skip duplicates
            uint256 safety = 0;
            while (picked[idx]) {
                idx = (idx + 1) % donors.length;
                safety++;
                if (safety > donors.length) break;   // failsafe
            }
            picked[idx] = true;

            address winner = donors[idx].donorAddress;
            uint256 prize  = prizes[i];

            lotteryWinners.push(LotteryPrize({
                winner:  winner,
                amount:  prize,
                rank:    i + 1,
                claimed: false
            }));

            (bool ok, ) = payable(winner).call{value: prize}("");
            if (ok) {
                lotteryWinners[lotteryWinners.length - 1].claimed = true;
                emit LotteryWinnerSelected(winner, prize, i + 1);
            }
        }

        lotteryCompleted = true;
    }

    // ============================================================
    //  SECTION 10 : VIEW FUNCTIONS  (used by frontend)
    // ============================================================

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getDonorCount() external view returns (uint256) {
        return donors.length;
    }

    function getDonor(uint256 index) external view returns (
        address donorAddress,
        uint256 totalAmount,
        uint256 ticketNumber,
        uint256 donatedAt
    ) {
        require(index < donors.length, "Invalid donor index");
        Donor memory d = donors[index];
        return (d.donorAddress, d.totalAmount, d.ticketNumber, d.donatedAt);
    }

    function getMyTicket() external view returns (uint256) {
        uint256 idx = donorIndex[msg.sender];
        if (idx == 0) return 0;          // not a donor
        return donors[idx - 1].ticketNumber;
    }

    function getVictim(uint256 id) external view returns (
        uint256  vid,
        bytes32  identityHash,
        uint256  score,
        uint256  reliefAmount,
        address  wallet,
        bool     isPaid
    ) {
        require(id > 0 && id <= victimCount, "Invalid victim id");
        Victim memory v = victims[id];
        return (v.id, v.identityHash, v.score, v.reliefAmount, v.walletAddress, v.isPaid);
    }

    function getFundProgress() external view returns (
        uint256 collected,
        uint256 target,
        uint256 percent
    ) {
        uint256 pct = targetFund == 0 ? 0 : (totalDonated * 100) / targetFund;
        return (totalDonated, targetFund, pct);
    }

    function getLotteryWinnersCount() external view returns (uint256) {
        return lotteryWinners.length;
    }

    function getLotteryWinner(uint256 rank) external view returns (
        address winner,
        uint256 amount,
        uint256 winnerRank,
        bool    claimed
    ) {
        require(rank < lotteryWinners.length, "Invalid rank");
        LotteryPrize memory lp = lotteryWinners[rank];
        return (lp.winner, lp.amount, lp.rank, lp.claimed);
    }

    function isAdmin(address user) external view returns (bool) {
        return user == admin;
    }
}
