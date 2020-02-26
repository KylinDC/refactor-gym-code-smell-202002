function buildGenericResponse(logger, error, { audit, references, innerSystemInfo }) {
  let response;
  if (error) {
    // Ensure the error code is a known value.
    const knownError = error.code && VALID_ERROR_CODES.includes(error.code.toString());
    if (!knownError) {
      logger.warn(
        `Error code ${error.code} is not defined in codes.json, defaulting to fallback error.`,
        error,
      );
    }
    // This seems redundant but creating a regular object out of the error
    // allows us to control the ordering of the keys/output. Picky but worth it.
    response = {
      code: knownError ? error.code : FALLBACK_ERR.code,
      message: knownError ? error.message : FALLBACK_ERR.message,
      stack: DEVELOPING ? error.stack : undefined,
    };
  }

  return references
    ? { audit, response, innerSystemInfo, body: { references } }
    : { audit, response, innerSystemInfo };
}


// if (error) return buildGenericResponse(logger, error, { audit, references });
// if (error) return buildGenericResponse(logger, error, { audit });

