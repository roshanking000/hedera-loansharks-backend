const mongoose = require('mongoose');
const CollateralSchema = new mongoose.Schema({
  owner: { type: String, default: '' },
  token_id: { type: String, default: '' },
  serial_number: { type: Number, default: -1 },
  loan_amount: { type: Number, default: 0 },
  borrower_fee: { type: Number, default: 0 },
  maturity_date: { type: Number, default: 0 },
  name: { type: String, default: '' },
  creator: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
}, { timestamps: true });

module.exports = Collateral = mongoose.model('Collateral', CollateralSchema);
