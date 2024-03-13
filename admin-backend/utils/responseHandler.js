const responseHandler = (res, status, message, data = null) => {
  if (status >= 400) {
    return res.status(status).json({
      success: false,
      message,
      error: data,
    });
  }

  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

module.exports = responseHandler;
