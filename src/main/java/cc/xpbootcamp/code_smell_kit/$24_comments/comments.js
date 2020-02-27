const db = require('../lib/database');

module.exports = async ({ mssql, notification = {}, response }) => {
  // Mapping DB input and output parameter as MSSQL dont allow input and out params name to be same.
  // Currently we have only 2 such params repeated, so thus its inline.
  const mapDbInput = {
    requestQueueIdIn: notification.requestQueueId || undefined,
    requestIdIn: notification.requestId || undefined,
  };

  try {
    const { responseContent } = response;
    response.responseContent = JSON.stringify(responseContent);
  } catch (e) {
    // do nothing
  }

  const context = {
    requestId: notification.parentUUID,
    requestQueueId: notification.requestQueueId,
  };

  return db.logRequest(
    mssql,
    {
      ...notification,
      ...response,
      ...mapDbInput,
    },
    context,
  );
};
