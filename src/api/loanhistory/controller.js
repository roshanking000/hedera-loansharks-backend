const { allowanceNft } = require('../chainAction');

const Loan = require('../../models/Loan');
const LoanHistory = require('../../models/LoanHistory');

exports.getLoanHistoryList = async (req_, res_) => {
    try {
        if (!req_.query.accountId || !req_.query.user_type)
            return res_.send({ result: false, error: 'failed' });
        const _accountId = req_.query.accountId;
        const _userType = req_.query.user_type;

        let _loanHistoryList = null;
        if (_userType == 'borrow')
            _loanHistoryList = await LoanHistory.find({ borrower: _accountId });
        else if (_userType == 'lend')
            _loanHistoryList = await LoanHistory.find({ lender: _accountId });

        return res_.send({ result: true, data: _loanHistoryList });
    } catch (error) {
        return res_.send({ result: false, error: 'Error detected in server progress!' });
    }
}

exports.requestClaimNft = async (req_, res_) => {
    try {
        if (!req_.query.a)
            return res_.send({ result: false, error: 'failed' });
        const _id = atob(req_.query.a);

        const _loanInfo = await LoanHistory.findOne({ _id: _id });

        const _trxResult = await allowanceNft(_loanInfo.lender, _loanInfo.token_id, _loanInfo.serial_number);
        if (!_trxResult)
            return res_.send({ result: false, error: 'Error! The transaction was rejected, or failed! Please try again!' });
        return res_.send({ result: true, data: _loanInfo });
    } catch (error) {
        return res_.send({ result: false, error: 'Error detected in server progress!' });
    }
}

exports.claimSuccess = async (req_, res_) => {
    try {
        if (!req_.body.a)
            return res_.send({ result: false, error: 'failed' });
        const _id = atob(req_.body.a);

        await LoanHistory.findOneAndUpdate(
            { _id: _id },
            { status: 'end' }
        );

        return res_.send({ result: true });
    } catch (error) {
        return res_.send({ result: false, error: 'Error detected in server progress!' });
    }
}
