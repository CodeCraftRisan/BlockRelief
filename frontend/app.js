/* ============================================================
   Block-Relief : Frontend Logic
   ============================================================ */

// Remix deployment address
const CONTRACT_ADDRESS = "0x05eD32f416a3D9142921299891AF1B28EdAac463";

// ✅ FIXED ABI (single array)
const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_targetFundInWei",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "autoDistribute",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "donate",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_identityHash",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "_score",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_wallet",
        "type": "address"
      }
    ],
    "name": "registerVictim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_newTargetInWei",
        "type": "uint256"
      }
    ],
    "name": "updateTargetFund",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getContractBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getDonorCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getFundProgress",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "collected",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "target",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "percent",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "rank",
        "type": "uint256"
      }
    ],
    "name": "getLotteryWinner",
    "outputs": [
      {
        "internalType": "address",
        "name": "winner",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "winnerRank",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "claimed",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getLotteryWinnersCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMyTicket",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "getVictim",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "vid",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "identityHash",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "score",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "reliefAmount",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "wallet",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "isPaid",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "isAdmin",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "isDistributed",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "victimCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

let provider, signer, contract, userAddress, isAdmin = false;

const $ = (id) => document.getElementById(id);

const setStatus = (msg, color = "#94a3b8") => {
  $("status").innerHTML =
    `<span style="color:${color}">${msg}</span>`;
};

// -------- Connect Wallet --------
async function connect() {

  if (!window.ethereum) {
    setStatus("❌ MetaMask not found", "#ef4444");
    return;
  }

  try {

    provider = new ethers.providers.Web3Provider(window.ethereum);

    await provider.send("eth_requestAccounts", []);

    signer = provider.getSigner();

    userAddress = await signer.getAddress();

    contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );

    $("walletStatus").textContent = "Connected";
    $("walletStatus").className = "pill pill-good";

    $("walletAddr").textContent =
      userAddress.slice(0, 8) +
      "..." +
      userAddress.slice(-6);

    // admin check
    isAdmin = await contract.isAdmin(userAddress);

    $("walletRole").textContent =
      isAdmin ? "ADMIN" : "DONOR";

    $("walletRole").className =
      "pill " +
      (isAdmin ? "pill-good" : "pill-warn");

    $("distributeBtn").disabled = !isAdmin;

    setStatus(
      "✅ Wallet Connected",
      "#22c55e"
    );

    await refresh();

    window.ethereum.on(
      "accountsChanged",
      () => location.reload()
    );

  } catch (e) {

    console.error(e);

    setStatus(
      "❌ Connect error: " + e.message,
      "#ef4444"
    );
  }
}

// -------- Refresh Dashboard --------
async function refresh() {

  if (!contract) return;

  try {

    const progress =
      await contract.getFundProgress();

    const collected =
      ethers.utils.formatEther(progress[0]);

    const target =
      ethers.utils.formatEther(progress[1]);

    const percent =
      Number(progress[2]);

    $("collected").textContent =
      Number(collected).toFixed(4) + " ETH";

    $("target").textContent =
      Number(target).toFixed(4) + " ETH";

    $("progBar").style.width =
      percent + "%";

    $("progText").textContent =
      percent + "%";

    const vc =
      await contract.victimCount();

    $("victimCount").textContent =
      vc.toString();

    const dc =
      await contract.getDonorCount();

    $("donorCount").textContent =
      dc.toString();

    const distributed =
      await contract.isDistributed();

    $("distStatus").textContent =
      distributed ? "Yes" : "No";

    $("distStatus").className =
      "pill " +
      (distributed
        ? "pill-good"
        : "pill-warn");

    // my ticket
    try {

      const ticket =
        await contract.getMyTicket();

      $("myTicket").textContent =
        Number(ticket) > 0
          ? "#" + ticket
          : "Not yet";

    } catch {}

    if (distributed) {
      await renderLottery();
    }

  } catch (e) {

    console.error(e);

    setStatus(
      "❌ Refresh error",
      "#ef4444"
    );
  }
}

// -------- Donate --------
async function donate() {

  const amount =
    $("amount").value;

  if (
    !amount ||
    parseFloat(amount) <= 0
  ) {

    setStatus(
      "❌ Invalid amount",
      "#ef4444"
    );

    return;
  }

  try {

    setStatus(
      "⏳ Sending donation...",
      "#f59e0b"
    );

    const tx =
      await contract.donate({
        value:
          ethers.utils.parseEther(amount)
      });

    setStatus(
      "⏳ Waiting for confirmation...",
      "#38bdf8"
    );

    await tx.wait();

    setStatus(
      "✅ Donation successful!",
      "#22c55e"
    );

    $("amount").value = "";

    await refresh();

  } catch (e) {

    console.error(e);

    setStatus(
      "❌ Donation failed: " +
      (e.data?.message || e.message),
      "#ef4444"
    );
  }
}

// -------- Admin Distribute --------
async function distribute() {

  if (!isAdmin) {

    setStatus(
      "❌ Only admin can distribute",
      "#ef4444"
    );

    return;
  }

  try {

    setStatus(
      "⏳ Distributing funds...",
      "#f59e0b"
    );

    const tx =
      await contract.autoDistribute();

    await tx.wait();

    setStatus(
      "🎉 Distribution completed!",
      "#22c55e"
    );

    await refresh();

  } catch (e) {

    console.error(e);

    setStatus(
      "❌ Distribution failed: " +
      (e.data?.message || e.message),
      "#ef4444"
    );
  }
}

// -------- Lottery Winners --------
async function renderLottery() {

  try {

    const count =
      await contract.getLotteryWinnersCount();

    if (Number(count) === 0) {

      $("lotteryArea").innerHTML =
        "No winners yet.";

      return;
    }

    let html =
      "<table><tr><th>Rank</th><th>Winner</th><th>Prize</th></tr>";

    for (
      let i = 0;
      i < Number(count);
      i++
    ) {

      const winnerData =
        await contract.getLotteryWinner(i);

      const winner =
        winnerData[0];

      const amount =
        winnerData[1];

      const rank =
        winnerData[2];

      html += `
        <tr>
          <td>#${rank}</td>
          <td>
            ${winner.slice(0, 8)}
            ...
            ${winner.slice(-6)}
          </td>
          <td>
            ${Number(
              ethers.utils.formatEther(amount)
            ).toFixed(4)} ETH
          </td>
        </tr>
      `;
    }

    html += "</table>";

    $("lotteryArea").innerHTML =
      html;

  } catch (e) {

    console.error(
      "Lottery Error:",
      e
    );
  }
}

// -------- Buttons --------
$("connectBtn")
  .addEventListener(
    "click",
    connect
  );

$("donateBtn")
  .addEventListener(
    "click",
    donate
  );

$("distributeBtn")
  .addEventListener(
    "click",
    distribute
  );

// -------- Auto Refresh --------
setInterval(() => {

  if (contract) {
    refresh();
  }

}, 5000);