// 腐坏点： switch 条件判断
module.exports = (action) => {
  switch (action) {
    case constants.CREATE_INSTRUCTION:
    case constants.CREATE_TEST_INSTRUCTION: {
      //Do something
    }

    case constants.UPDATE_JOB: {
     //Do something
    }

    case constants.DECLINE_JOB: {
     //Do something
    }

    case constants.CANCEL_JOB_REQUEST: {
      //Do something
    }

    case constants.QUERY_JOB_RESPONSE: {
      //Do something
    }

    case constants.ACTION_UPDATE: {
      //Do something
    }

    case constants.REPORT_DELAY: {
      //Do something
    }

    case constants.REPORT_CONTACTING: {
      //Do something
    }

    case constants.REALLOCATE_JOB: {
      //Do something
    }

    case constants.ACCEPT_JOB: {
      //Do something
    }

    case constants.ESC_JOB_REQUEST: {
      //Do something
    }

    case constants.CHANGE_REQUEST: {
      //Do something
    }

    case constants.ADD_DOCUMENT: {
      //Do something
    }

    case constants.REPORT: {
      //Do something
    }

    case constants.REPORT_INSPECTION: {
      //Do something
    }

    default: {
      //Do something
    }
  }
}
