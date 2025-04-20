const { Provider, Account, Contract, json, uint256 } = require("starknet");
const fs = require("fs");

// Starknet provider (e.g., testnet)
const provider = new Provider({ sequencer: { network: "goerli-alpha" } });

// Artist wallet (pre-funded with testnet ETH)
const privateKey = "YOUR_PRIVATE_KEY"; // Replace with actual private key
const accountAddress = "YOUR_ACCOUNT_ADDRESS"; // Replace with actual address
const account = new Account(provider, accountAddress, privateKey);

// USDC contract address (mock for testnet)
const usdcAddress = "0xTEST_USDC_ADDRESS"; // Replace with actual USDC address

// Load compiled contract ABI and address
const compiledContract = json.parse(
  fs.readFileSync("path/to/compiled_usdc_offramp.json").toString("ascii")
);
const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS"; // Replace after deployment
const offRampContract = new Contract(compiledContract.abi, contractAddress, provider);

// Connect account for transactions
offRampContract.connect(account);

async function main() {
  try {
    // 1. Deposit royalties (e.g., 100 USDC)
    const amount = uint256.bnToUint256(100n * 10n ** 6n); // USDC has 6 decimals
    const depositCall = await offRampContract.deposit_royalties(accountAddress, amount);
    await provider.waitForTransaction(depositCall.transaction_hash);
    console.log("Deposited 100 USDC royalties");

    // 2. Set off-ramp destination wallet
    const destinationWallet = "0xDESTINATION_WALLET_ADDRESS"; // Replace with actual address
    const setDestinationCall = await offRampContract.set_off_ramp_destination(destinationWallet);
    await provider.waitForTransaction(setDestinationCall.transaction_hash);
    console.log("Off-ramp destination set");

    // 3. Withdraw USDC for off-ramping
    const withdrawCall = await offRampContract.withdraw_for_off_ramp(amount);
    await provider.waitForTransaction(withdrawCall.transaction_hash);
    console.log("Withdrawn 100 USDC for off-ramping");

    // 4. Check artist balance
    const balance = await offRampContract.get_artist_balance(accountAddress);
    console.log(`Artist balance: ${uint256.uint256ToBN(balance.balance).toString() / 10 ** 6} USDC`);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
