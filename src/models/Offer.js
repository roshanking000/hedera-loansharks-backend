const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const OfferSchema = new mongoose.Schema({
  sender: { type: String, default: '' },
  offer_type: { type: String, default: '' },
  collateralId: { type: ObjectId },
  loan_amount: { type: Number, default: 0 },
  repayment: { type: Number, default: 0 },
  borrower_fee: { type: Number, default: 0 },
  maturity_date: { type: Number, default: 0 },
  status: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = Offer = mongoose.model('Offer', OfferSchema);
