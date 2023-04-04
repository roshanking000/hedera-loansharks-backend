const express = require('express');
const router = express.Router();
const collateral = require("./controller");

router.get('/get_item_detail', collateral.getItemDetail);
router.get('/check_list_state', collateral.checkListState);
router.get('/get_list', collateral.getList);
router.get('/get_offer_list', collateral.getOfferList);
//router.get('/get_all_offer_list', collateral.getAllOfferList);

router.post('/set_list', collateral.setList);
router.post('/cancel_list', collateral.cancelList);
router.post('/send_offer', collateral.sendOffer);
router.post('/accept_offer', collateral.acceptOffer);

module.exports = router;
