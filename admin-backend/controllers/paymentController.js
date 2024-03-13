const PaymentDetail = require("../models/paymentDetail");
const errorHandler = require("../middleware/asyncErrorHandler");

exports.storePaymentDetails = errorHandler(async (req, res) => {
  const paymentDetailsArray = req.body;

  if (!Array.isArray(paymentDetailsArray)) {
    return res.status(400).send({
      message: "Invalid data format. An array of payment details is expected.",
    });
  }

  for (let paymentDetail of paymentDetailsArray) {
    const {
      productId,
      transactionId,
      orderDate,
      paymentStatus,
      orderStatus,
      phoneNumber,
      emailId,
      price,
      quantity,
      address,
    } = paymentDetail;

    const newPaymentDetail = new PaymentDetail({
      productId,
      transactionId,
      orderDate,
      paymentStatus,
      orderStatus,
      customerPhoneNumber: phoneNumber,
      customerEmailId: emailId,
      price,
      quantity,
      address,
    });
    await newPaymentDetail.save();
  }

  res.status(200).send({ message: "Payment details stored successfully." });
});

exports.fetchPaymentDetails = errorHandler(async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  let query = {};
  if (search) {
    query = {
      $or: [
        { transactionId: { $regex: search, $options: "i" } },
        { productId: { $regex: search, $options: "i" } },
        { customerEmailId: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
        { orderStatus: { $regex: search, $options: "i" } },
      ],
    };
  }
  const payments = await PaymentDetail.find(query)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const count = await PaymentDetail.countDocuments(query);

  res.json({
    payments,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  });
});
