const express = require('express');
const router = express.Router();

const Collateral = require("./collateral");
const Loan = require("./loan");
const LoanHistory = require("./loanhistory");
const zuseApi = require("./zuse-api");

router.use("/collateral", Collateral);
router.use("/loan", Loan);
router.use("/loanhistory", LoanHistory);
router.use("/zuseapi", zuseApi);

module.exports = router;
