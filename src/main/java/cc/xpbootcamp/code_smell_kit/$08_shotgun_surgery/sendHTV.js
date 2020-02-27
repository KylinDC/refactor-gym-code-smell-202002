

module.exports = async ({ logger, notification, engine }) => {

  try {
    // sendNotificationToHTV
  } catch (err) {
    // In case of any 5XX or 4xx or any of retryable codes we should retry.
    if (/^[45][0-9][0-9]$/.test(err.code || err.statusCode)) {
      requestStatus = ERROR;
      logger.warn();
    } else if (err.message && RETRYABLE_CODES.some((code) => err.message.includes(code))) {
      logger.warn();
      requestStatus = ERROR;
      err.code = HTTP_CODE_503;
    } else {
      logger.error('FATAL: Received HTV notification error.', err);
    }
  }

  return {
    requestStartTime,
    requestEndTime,
    requestStatus,
    statusCode: status,
  };
};
