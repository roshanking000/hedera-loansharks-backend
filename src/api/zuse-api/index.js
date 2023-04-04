const express = require('express');
const router = express.Router();
const zuseApi = require("./controller");

router.get('/get_floor_price', zuseApi.getFloorPrice);

module.exports = router;
