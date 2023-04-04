const { repay, allowanceNft } = require('../chainAction');

const Loan = require('../../models/Loan');
const LoanHistory = require('../../models/LoanHistory');

exports.getCurrentLoanList = async (req_, res_) => {
    try {
        if (!req_.query.accountId || !req_.query.user_type)
            return res_.send({ result: false, error: 'failed' });
        const _accountId = req_.query.accountId;
        const _userType = req_.query.user_type;

        let _currentLoanList = null;
        if (_userType == 'borrow')
            _currentLoanList = await Loan.find({ borrower: _accountId });
        else if (_userType == 'lend')
            _currentLoanList = await Loan.find({ lender: _accountId });

        // get remain time
        for (let i = 0; i < _currentLoanList.length; i++)
            _currentLoanList[i].remainTime = 86400000 * parseInt(_currentLoanList[i].maturity_date, 10) - (Date.now() - _currentLoanList[i].createdAt);

        return res_.send({ result: true, data: _currentLoanList });
    } catch (error) {
        return res_.send({ result: false, error: 'Error detected in server progress!' });
    }
}

exports.getRepayAmount = async (req_, res_) => {
    try {
        if (!req_.query.a)
            return res_.send({ result: false, error: 'failed' });
        const _id = atob(req_.query.a);

        const _loanInfo = await Loan.findOne({ _id: _id });

        return res_.send({ result: true, data: _loanInfo.repayment });
    } catch (error) {
        return res_.send({ result: false, error: 'Error detected in server progress!' });
    }
}

exports.repay = async (req_, res_) => {
    try {
        if (!req_.query.a)
            return res_.send({ result: false, error: 'failed' });
        const _id = atob(req_.query.a);

        const _loanInfo = await Loan.findOne({ _id: _id });

        const _trxResult = await repay(_loanInfo.lender, _loanInfo.borrower, _loanInfo.loan_amount, _loanInfo.repayment, _loanInfo.token_id, _loanInfo.serial_number);
        console.log(_trxResult);
        if (!_trxResult)
            return res_.send({ result: false, error: 'Error! The transaction was rejected, or failed! Please try again!' });

        // save history
        const _history = new LoanHistory({
            lender: _loanInfo.lender,
            borrower: _loanInfo.borrower,
            token_id: _loanInfo.token_id,
            serial_number: _loanInfo.serial_number,
            loan_amount: _loanInfo.loan_amount,
            borrower_fee: _loanInfo.borrower_fee,
            maturity_date: _loanInfo.maturity_date,
            name: _loanInfo.name,
            creator: _loanInfo.creator,
            imageUrl: _loanInfo.imageUrl
        });

        await _history.save();

        // delete loan from db
        await Loan.findOneAndDelete({ _id: _id });
        return res_.send({ result: true, msg: "Repay Success!" });
    } catch (error) {
        return res_.send({ result: false, error: 'Error detected in server progress!' });
    }
}
