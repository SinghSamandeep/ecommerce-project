const express = require("express");
const router = express.Router();
const {
  storePaymentDetails,
  fetchPaymentDetails,
} = require("../controllers/paymentController");
const { springReqAuth } = require("../middleware/authenticate");

router.post("/payment-details", springReqAuth, storePaymentDetails);
router.get("/fetch-payment", fetchPaymentDetails);

module.exports = router;
