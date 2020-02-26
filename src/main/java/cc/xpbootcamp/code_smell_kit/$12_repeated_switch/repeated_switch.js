// 腐坏点： switch 条件判断
module.exports = (action) => {
  switch (action) {
    case constants.CREATE_INSTRUCTION:
    case constants.CREATE_TEST_INSTRUCTION: {
      return job.concat(
        Joi.object({a}),
      );
    }

    case constants.UPDATE_JOB: {
      return job.concat(
        Joi.object({b}),
      );
    }

    case constants.DECLINE_JOB: {
      return job.concat(
        Joi.object({c}),
      );
    }

    case constants.CANCEL_JOB_REQUEST: {
      return job.concat(
        Joi.object({d}),
      );
    }

    case constants.QUERY_JOB_RESPONSE: {
      return job.concat(
        Joi.object({e}),
      );
    }

    case constants.ACTION_UPDATE: {
      return job.concat(
        Joi.object({f}),
      );
    }

    case constants.REPORT_DELAY: {
      return job.concat(
        Joi.object({j}),
      );
    }

    case constants.REPORT_CONTACTING: {
      return job.concat(
        Joi.object({h}),
      );
    }

    case constants.REALLOCATE_JOB: {
      return job.concat(
        Joi.object({i}),
      );
    }

    case constants.ACCEPT_JOB: {
      return job.concat(
        Joi.object({g}),
      );
    }

    case constants.ESC_JOB_REQUEST: {
      return job.concat(
        Joi.object({k}),
      );
    }

    case constants.CHANGE_REQUEST: {
      return job.concat(
        Joi.object({m}),
      );
    }

    case constants.ADD_DOCUMENT: {
      return job.concat(
        Joi.object({n}),
      );
    }

    case constants.REPORT: {
      return job.concat(
        Joi.object({o}),
      );
    }

    case constants.REPORT_INSPECTION: {
      return job.concat(
        Joi.object({p}),
      );
    }

    default: {
      return Joi.empty();
    }
  }
}
