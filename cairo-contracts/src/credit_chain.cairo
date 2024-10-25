#[starknet::interface]
trait IERC20<TContractState> {
    fn transfer_from(self: @TContractState, sender: ContractAddress, recipient: ContractAddress, amount: u256) -> bool;
}
#[starknet::contract]
mod CreditChain {
    use starknet::ContractAddress;
    use starknet::{ContractAddress, get_caller_address, get_contract_address};
    use integer::u256_checked_sub;

    struct Storage {
        usdc_token: ContractAddress,
        users: LegacyMap::<ContractAddress, UserInfo>,
        deposits: LegacyMap::<ContractAddress, DepositInfo>,
    }

    struct UserInfo {
        credit_score: u256,
        borrowed_amount: u256,
        last_repayment_time: u64,
    }

    struct DepositInfo {
        amount: u256,
        deposit_time: u64,
    }

    const MAX_LOAN_AMOUNT: u256 = 300_000_000; // 300 USDC (assuming 6 decimals)
    const BORROW_INTEREST_RATE: u256 = 5; // 5% APY for borrowers
    const DEPOSIT_INTEREST_RATE: u256 = 2; // 2% APY for depositors
    const INTEREST_RATE_DENOMINATOR: u256 = 100;
    const YEAR_IN_SECONDS: u64 = 31_536_000; // 365 days

    #[event]
    fn Deposit(user: ContractAddress, amount: u256) {}

    #[constructor]
    fn constructor(ref self: ContractState, usdc_token: ContractAddress) {
        self.usdc_token.write(usdc_token);
    }

    #[external(v0)]
    fn deposit(ref self: ContractState, amount: u256) {
        assert(amount > 0, 'Must deposit some USDC');
        
        let success = IERC20::transfer_from(self.usdc_token.read(), get_caller_address(), get_contract_address(), amount);
        assert(success, 'USDC transfer failed');

        // Note: You'd need to implement calculate_deposit_interest
        let interest = calculate_deposit_interest(get_caller_address());
        
        let mut deposit_info = self.deposits.read(get_caller_address());
        deposit_info.amount += interest;
        deposit_info.amount += amount;
        deposit_info.deposit_time = starknet::get_block_timestamp();
        self.deposits.write(get_caller_address(), deposit_info);

        Deposit(get_caller_address(), amount);
    }

    #[external(v0)]
    fn withdraw(ref self: ContractState, amount: u256) {
        let caller = get_caller_address();
        let mut deposit_info = self.deposits.read(caller);
        assert(deposit_info.amount > 0, 'No deposit found');

        let interest = self.calculate_deposit_interest(caller);
        let total_balance = deposit_info.amount + interest;

        assert(total_balance >= amount, 'Insufficient balance');

        if amount == total_balance {
            deposit_info.amount = 0;
            deposit_info.deposit_time = 0;
        } else {
            deposit_info.amount = u256_checked_sub(total_balance, amount).unwrap();
            deposit_info.deposit_time = starknet::get_block_timestamp();
        }

        self.deposits.write(caller, deposit_info);

        // Note: Implement actual IERC20 transfer here
        let success = IERC20::transfer(self.usdc_token.read(), caller, amount);
        assert(success, 'USDC transfer failed');

        self.emit(Withdrawal { user: caller, amount, interest });
    }

    #[view]
    fn calculate_deposit_interest(self: @ContractState, user: ContractAddress) -> u256 {
        let deposit_info = self.deposits.read(user);
        let time_elapsed = starknet::get_block_timestamp() - deposit_info.deposit_time;
        return (deposit_info.amount * DEPOSIT_INTEREST_RATE * time_elapsed) / (INTEREST_RATE_DENOMINATOR * YEAR_IN_SECONDS);
    }

    #[external(v0)]
    fn borrow(ref self: ContractState, amount: u256) {
        assert(amount <= MAX_LOAN_AMOUNT, 'Exceeds maximum loan amount');
        let caller = get_caller_address();
        let mut user_info = self.users.read(caller);
        assert(user_info.credit_score > 0, 'No credit score assigned');
        assert(user_info.borrowed_amount == 0, 'Existing loan must be repaid first');

        user_info.borrowed_amount = amount;
        user_info.last_repayment_time = starknet::get_block_timestamp();
        self.users.write(caller, user_info);

        // Note: Implement actual IERC20 transfer here
        let success = IERC20::transfer(self.usdc_token.read(), caller, amount);
        assert(success, 'USDC transfer failed');

        self.emit(LoanIssued { user: caller, amount });
    }

    #[external(v0)]
    fn repay(ref self: ContractState, amount: u256) {
        let caller = get_caller_address();
        let mut user_info = self.users.read(caller);
        assert(user_info.borrowed_amount > 0, 'No active loan');

        let interest = self.calculate_borrow_interest(caller);
        let total_due = user_info.borrowed_amount + interest;

        if amount > total_due {
            amount = total_due;
        }

        // Note: Implement actual IERC20 transferFrom here
        let success = IERC20::transfer_from(self.usdc_token.read(), caller, get_contract_address(), amount);
        assert(success, 'USDC transfer failed');

        if amount == total_due {
            user_info.borrowed_amount = 0;
        } else {
            user_info.borrowed_amount = u256_checked_sub(total_due, amount).unwrap();
        }

        user_info.last_repayment_time = starknet::get_block_timestamp();
        self.users.write(caller, user_info);

        self.emit(LoanRepaid { user: caller, amount });
    }

    #[view]
    fn calculate_borrow_interest(self: @ContractState, user: ContractAddress) -> u256 {
        let user_info = self.users.read(user);
        let time_elapsed = starknet::get_block_timestamp() - user_info.last_repayment_time;
        return (user_info.borrowed_amount * BORROW_INTEREST_RATE * time_elapsed) / (INTEREST_RATE_DENOMINATOR * YEAR_IN_SECONDS);
    }

    #[external(v0)]
    fn update_credit_score(ref self: ContractState, user: ContractAddress, new_score: u256) {
        // Note: Implement owner check here
        let mut user_info = self.users.read(user);
        user_info.credit_score = new_score;
        self.users.write(user, user_info);
        self.emit(CreditScoreUpdated { user, new_score });
    }

}