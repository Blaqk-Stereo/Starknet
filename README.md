# Starknet
This is an example contract on how we intend integrating starknet smart contract into Blaqk Stereo

## Blaqk Stereo Starknet Off-Ramp Example

This repository demonstrates a Starknet-based off-ramping smart contract for USDC stablecoin payments, developed for Blaqk Stereo, a decentralized music distribution platform. The example uses **Cairo** for the smart contract and **Starknet.js** for interaction, showcasing royalty distribution and off-ramping logic.

## Overview
- **Contract**: `usdc_offramp.cairo` handles USDC royalty deposits, off-ramp destination settings, and withdrawals.
- **Script**: `interact_offramp.js` interacts with the contract to deposit, withdraw, and check balances.
- **Use Case**: Enables artists to receive USDC royalties and off-ramp to local fiat (e.g., NGN, Cedis, KES).
