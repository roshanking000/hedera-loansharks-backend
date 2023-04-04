const express = require('express');
const router = express.Router();
const loanhistory = require("./controller");

router.get('/get_loanhistory_list', loanhistory.getLoanHistoryList);
router.get('/request_claim_nft', loanhistory.requestClaimNft);

router.post('/claim_success', loanhistory.claimSuccess);

module.exports = router;
