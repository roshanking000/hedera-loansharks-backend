const mongoose = require('mongoose');
const LoanSchema = new mongoose.Schema({
    lender: { type: String, default: '' },
    borrower: { type: String, default: '' },
    token_id: { type: String, default: '' },
    serial_number: { type: Number, default: -1 },
    loan_amount: { type: Number, default: 0 },
    borrower_fee: { type: Number, default: 0 },
    maturity_date: { type: String, default: '' },
    due: { type: String, default: '' },
    repayment: { type: Number, default: 0 },
    name: { type: String, default: '' },
    creator: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    remainTime: { type: String, default: '' },
    status: { type: String, default: 'in progress' }
}, { timestamps: true });

module.exports = Loan = mongoose.model('Loan', LoanSchema);
