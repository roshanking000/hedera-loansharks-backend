const { receiveAllowanceNft, sendHbarToBorrower, sendNft } = require('../chainAction');
const { dayToMilliSec: dayToMillisec, dayToMilliSec } = require('../mainFunctions');

const Loan = require('../../models/Loan');
const LoanHistory = require('../../models/LoanHistory');
const Collateral = require('../../models/Collateral');
const Offer = require('../../models/Offer');

const HBAR_DECIMAL = 100000000;

exports.getItemDetail = async (req_, res_) => {
    try {
        if (!req_.query.id)
            return res_.send({ result: false, error: 'failed' });
        const _id = req_.query.id;
        // get collateral info
        const _nftInfo = await Collateral.findOne({ _id: _id });

        // get offer list
        const _offerList = await Offer.findOne({ collateralId: _id });
        return res_.send({ result: true, nftInfo: _nftInfo, offerList: _offerList });
    } catch (error) {
        return res_.send({ result: false, error: 'Error detected in server progress!' });
    }
}

exports.checkListState = async (req_, res_) => {
    try {
        if (!req_.query.token_id || !req_.query.serial_number)
            return res_.send({ result: false, error: 'failed' });
        const _tokenId = req_.query.token_id;
        const _serialNumber = req_.query.serial_number;
        const _nftInfo = await Collateral.findOne({ token_id: _tokenId, serial_number: _serialNumber });
        if (!_nftInfo)
            return res_.send({ result: true, data: { status: false } });
        return res_.send({ result: true, data: { status: true, id: _nftInfo._id, loanAmount: _nftInfo.loan_amount, borrowerFee: _nftInfo.borrower_fee, maturityDate: _nftInfo.maturity_date } });
    } catch (error) {
        return res_.send({ result: false, error: 'Error detected in server progress!' });
    }
}

exports.getList = async (req_, res_) => {
    try {
        // const _pageNumber = req_.query.pageNumber;
        // const _displayCount = req_.query.displayCount;

        const _totalNftList = await Collateral.find({});
        return res_.send({ result: true, data: _totalNftList });
        // const _nftList = await Collateral.find({}).sort({ createdAt: -1 }).skip((_pageNumber - 1) * _displayCount).limit(_displayCount);
        // return res_.send({ result: true, totalCount: _totalNftList.length, data: _nftList });
    } catch (error) {
        return res_.send({ result: false, error: 'Error detected in server progress!' });
    }
}

exports.getOfferList = async (req_, res_) => {
    try {
        if (!req_.query.id)
            return res_.send({ result: false, error: 'failed' });
        const _collateralId = req_.query.id;

        const _totalOfferList = await Offer.find({ collateralId: _collateralId });
        return res_.send({ result: true, data: _totalOfferList });
    } catch (error) {
        return res_.send({ result: false, error: 'Error detected in server progress!' });
    }
}

// exports.getAllOfferList = async (req_, res_) => {
//     try {
//         if (!req_.query.accountId || !req_.query.type)
//             return res_.send({ result: false, error: 'failed' });
//         const _accountId = req_.query.accountId;
//         const _type = req_.query.type;

//         let _offerList = [];

//         if (_type == "borrower") {
//             const _collaterialList = await Collateral.find({ owner: _accountId });
//             for (let i = 0;i < _collaterialList.length;i++) {
//                 const _offerInfo = await Offer.findOne({ collateralId: _collaterialList[i]._id });
//                 _offerList.push(_offerInfo);
//             }
//         }

//         const _totalOfferList = await Offer.find({ collateralId: _collateralId });
//         return res_.send({ result: true, data: _totalOfferList });
//     } catch (error) {
//         return res_.send({ result: false, error: 'Error detected in server progress!' });
//     }
// }

exports.setList = async (req_, res_) => {
    try {
        if (!req_.body.owner_accountid || !req_.body.token_id || !req_.body.serial_number)
            return res_.send({ result: false, error: 'failed' });
        const _ownerAccountId = req_.body.owner_accountid;
        const _tokenId = req_.body.token_id;
        const _serialNumber = req_.body.serial_number;
        const _loanAmount = req_.body.loan_amount;
        const _borrowerFee = req_.body.borrower_fee;
        const _maturityDate = req_.body.maturity_date;
        const _name = req_.body.name;
        const _creator = req_.body.creator;
        const _imageUrl = req_.body.imageUrl;

        const _newCollateral = new Collateral({
            owner: _ownerAccountId,
            token_id: _tokenId,
            serial_number: _serialNumber,
            loan_amount: _loanAmount,
            borrower_fee: _borrowerFee,
            maturity_date: _maturityDate,
            name: _name,
            creator: _creator,
            imageUrl: _imageUrl
        });
        await _newCollateral.save();

        return res_.send({ result: true, msg: 'success! Your NFT has been listed!' });
    } catch (error) {
        return res_.send({ result: false, error: 'Error detected in server progress!' });
    }
}

exports.cancelList = async (req_, res_) => {
    try {
        if (!req_.body.token_id || !req_.body.serial_number)
            return res_.send({ result: false, error: 'failed' });
        const _tokenId = req_.body.token_id;
        const _serialNumber = req_.body.serial_number;

        const _result = await Collateral.findOneAndDelete({ token_id: _tokenId, serial_number: _serialNumber });
        if (!_result)
            return res_.send({ result: false, error: "No NFT in list!" });
        return res_.send({ result: true, msg: 'success! Your NFT has been unlisted!' });
    } catch (error) {
        return res_.send({ result: false, error: 'Error detected in server progress!' });
    }
}

exports.sendOffer = async (req_, res_) => {
    try {
        if (!req_.body.sender || !req_.body.collateralId)
            return res_.send({ result: false, error: 'failed' });
        const _sender = req_.body.sender;
        const _offerType = req_.body.offerType;
        const _collateralId = req_.body.collateralId;
        const _loanAmount = req_.body.loanAmount;
        const _borrowerFee = req_.body.borrowerFee;
        const _maturityDate = req_.body.maturityDate;

        const _newOffer = new Offer({
            sender: _sender,
            offer_type: _offerType,
            collateralId: _collateralId,
            loan_amount: _loanAmount,
            repayment: parseFloat(_loanAmount) + parseFloat(((_loanAmount * HBAR_DECIMAL/100)*(_maturityDate*(_borrowerFee/365)) / HBAR_DECIMAL).toFixed(3)),
            borrower_fee: _borrowerFee,
            maturity_date: _maturityDate
        });
        await _newOffer.save();

        return res_.send({ result: true, msg: 'Send Offer Success!' });
    } catch (error) {
        return res_.send({ result: false, error: 'Error detected in server progress!' });
    }
}

exports.acceptOffer = async (req_, res_) => {
    try {
        if (!req_.body.offer_id)
            return res_.send({ result: false, error: 'failed' });
        const _offerId = req_.body.offer_id;

        // get offer Info
        const _offerInfo = await Offer.findOne({ _id: _offerId });

        // get nft info
        const _nftInfo = await Collateral.findOne({ _id: _offerInfo.collateralId });

        // receive nft to escrow
        const _trxResult = await receiveAllowanceNft(_nftInfo.owner, _nftInfo.token_id, _nftInfo.serial_number);
        if (!_trxResult)
            return res_.send({ result: false, error: 'Error! The transaction was rejected, or failed! Please try again!' });

        // send hbar to borrower
        const _hbarTrxResult = await sendHbarToBorrower(_offerInfo.sender, _nftInfo.owner, _offerInfo.loan_amount);
        if (!_hbarTrxResult)
            return res_.send({ result: false, error: 'Error! The transaction was rejected, or failed! Please try again!' });

        const _newLoan = new Loan({
            lender: _offerInfo.sender,
            borrower: _nftInfo.owner,
            token_id: _nftInfo.token_id,
            serial_number: _nftInfo.serial_number,
            loan_amount: _offerInfo.loan_amount,
            borrower_fee: _offerInfo.borrower_fee,
            maturity_date: _offerInfo.maturity_date,
            repayment: parseFloat(_offerInfo.loan_amount) + parseFloat(((_offerInfo.loan_amount * HBAR_DECIMAL/100)*(_offerInfo.maturity_date*(_offerInfo.borrower_fee/365)) / HBAR_DECIMAL).toFixed(3)),
            name: _nftInfo.name,
            creator: _nftInfo.creator,
            imageUrl: _nftInfo.imageUrl,
            due: Date.now() + dayToMillisec(_offerInfo.maturity_date)
        });

        await _newLoan.save();

        // unlist collateral
        await Collateral.findOneAndDelete({ _id: _offerInfo.collateralId });

        // delete offers
        await Offer.deleteMany({ collateralId: _offerInfo.collateralId });

        if (!_newLoan)
            return res_.send({ result: false, error: 'Error! Add loan data to database is failed!' });

        setDaysTimeout(loanTimerOut, parseInt(_newLoan.maturity_date, 10), _newLoan);

        return res_.send({ result: true, msg: 'Loan agreement accepted!' });
    } catch (error) {
        return res_.send({ result: false, error: 'Error detected in server progress!' });
    }
}

const loanTimerOut = async (loanInfo) => {
    // check existing
    const findLoan = await Loan.findOne({ _id: loanInfo._id });
    if (findLoan === null) return;

    const newRemainTime = 86400000 * parseInt(findLoan.maturity_date, 10) - (Date.now() - findLoan.createdAt);
    if (newRemainTime > 0) {
        setTimeout(loanTimerOut, newRemainTime, findLoan);
        return;
    }

    if (findLoan.status == 'in progress') {
        // save history
        const _history = new LoanHistory({
            lender: findLoan.lender,
            borrower: findLoan.borrower,
            token_id: findLoan.token_id,
            serial_number: findLoan.serial_number,
            loan_amount: findLoan.loan_amount,
            borrower_fee: findLoan.borrower_fee,
            maturity_date: findLoan.maturity_date,
            name: findLoan.name,
            creator: findLoan.creator,
            imageUrl: findLoan.imageUrl,
            status: 'default'
        });

        await _history.save();

        // delete loan from db
        await Loan.findOneAndDelete({ _id: findLoan._id });
    }
}

function setDaysTimeout(callback, days, loanInfo) {
    // 86400 seconds in a day
    let msInDay = 86400*1000;

    let dayCount = 0;
    let timer = setInterval(function() {
        dayCount++;  // a day has passed

        if (dayCount === days) {
           clearInterval(timer);
           callback(loanInfo);
        }
    }, msInDay);
}

const initLoanTimer = async () => {
    console.log('initLoanTimer log - 1');

    const findLoan = await Loan.find({});
    for (let i = 0; i < findLoan.length; i++) {
        const newRemainTime = 86400000 * parseInt(findLoan[i].maturity_date, 10) - (Date.now() - findLoan[i].createdAt);
        if (newRemainTime > 0) {
            setTimeout(loanTimerOut, newRemainTime, findLoan[i]);
        } else {
        }
    }
}

initLoanTimer();