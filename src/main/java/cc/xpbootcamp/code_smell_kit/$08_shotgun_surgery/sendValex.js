
module.exports = async ({ logger, notification }) => {

  try {
    // sendToValex
  } catch (error) {
    statusCode = error.code || error.statusCode;


    // Won't retry for 4xx code when create order failed on  side. eg. validation error
    if (/^4\d{2}$/.test(statusCode) && type === SEND_INSTRUCTION) {
      logger.warn();
    }
    // In case of any 5XX or 4xx or any of retryable codes we should retry.
    else if (/^[45]\d{2}$/.test(statusCode)) {
      logger.warn();
      requestStatus = ERROR;
    }
    // In case of any  response retryable codes we should retry.
    else if (
      error.Response &&
      RETRYABLE_CODES.some((code) => JSON.stringify(error.Response).includes(code))
    ) {
      logger.warn();
      requestStatus = ERROR;
      statusCode = HTTP_CODE_503;
    } else {
      logger.error('FATAL: Received notification error.', error);
    }
  }
  return {
    response: {
      requestStartTime,
      requestEndTime: new Date(),
      requestStatus,
      statusCode,
    }
  };
};
