# USDC Off-Ramp Smart Contract for Blaqk Stereo

**Use Case**: Enables artists to receive USDC royalties and off-ramp to local fiat (e.g., NGN, Cedis, KES).

This Cairo smart contract, developed for Blaqk Stereo’s decentralized music distribution platform, facilitates royalty payments in USDC stablecoin and supports off-ramping to local fiat currencies. It allows artists to deposit royalties, set an off-ramp destination wallet, and withdraw USDC for conversion to local fiat, addressing financial inclusivity in regions like Africa.

## Contract Code

```cairo
%lang starknet
from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.math import assert_not_zero
from starkware.cairo.common.uint256 import Uint256
from starkware.starknet.common.syscalls import get_caller_address

// External interface for USDC (simplified ERC20 interface)
@contract_interface
namespace IERC20 {
    func transfer(recipient: felt, amount: Uint256) -> (success: felt) {
    }
    func balanceOf(account: felt) -> (balance: Uint256) {
    }
}

// Storage variables
@storage_var
func usdc_contract_address() -> (address: felt) {
}

@storage_var
func artist_balances(account: felt) -> (balance: Uint256) {
}

@storage_var
func off_ramp_destination(account: felt) -> (destination: felt) {
}

// Constructor to initialize USDC contract address
@constructor
func constructor{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    usdc_address: felt
) {
    assert_not_zero(usdc_address);
    usdc_contract_address.write(usdc_address);
    return ();
}

// Deposit USDC royalties for an artist
@external
func deposit_royalties{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    artist: felt, amount: Uint256
) {
    assert_not_zero(artist);
    let (current_balance) = artist_balances.read(artist);
    let new_balance = Uint256(
        low=current_balance.low + amount.low,
        high=current_balance.high + amount.high
    );
    artist_balances.write(artist, new_balance);
    return ();
}

// Set off-ramp destination wallet for fiat conversion
@external
func set_off_ramp_destination{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    destination: felt
) {
    let (caller) = get_caller_address();
    assert_not_zero(destination);
    off_ramp_destination.write(caller, destination);
    return ();
}

// Withdraw USDC for off-ramping (simulates fiat conversion)
@external
func withdraw_for_off_ramp{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    amount: Uint256
) {
    let (caller) = get_caller_address();
    let (current_balance) = artist_balances.read(caller);
    assert_not_zero(current_balance.low);
    assert_not_zero(current_balance.high);

    // Ensure sufficient balance
    with_attr error_message("Insufficient balance") {
        assert current_balance.low >= amount.low;
        assert current_balance.high >= amount.high;
    }

    // Update balance
    let new_balance = Uint256(
        low=current_balance.low - amount.low,
        high=current_balance.high - amount.high
    );
    artist_balances.write(caller, new_balance);

    // Transfer USDC to off-ramp destination
    let (destination) = off_ramp_destination.read(caller);
    assert_not_zero(destination);
    let (usdc_address) = usdc_contract_address.read();
    IERC20.transfer(contract_address=usdc_address, recipient=destination, amount=amount);

    // Placeholder for fiat off-ramp integration (e.g., API call to convert to NGN)
    // In production, this would interact with an oracle or off-chain service
    return ();
}

// View function to check artist balance
@view
func get_artist_balance{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    artist: felt
) -> (balance: Uint256) {
    let (balance) = artist_balances.read(artist);
    return (balance=balance);
}
