const ServerResponse = (res, statusCode, data = null, message = null) => {
  res.status(statusCode).json({
    status: statusCode,
    message,
    data,
  });
};

module.exports = ServerResponse;
