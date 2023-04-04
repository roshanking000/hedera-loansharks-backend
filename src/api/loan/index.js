const express = require('express');
const router = express.Router();
const loan = require("./controller");

router.get('/get_current_loan_list', loan.getCurrentLoanList);
router.get('/get_repay_amount', loan.getRepayAmount);
router.get('/repay', loan.repay);

module.exports = router;
