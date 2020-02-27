const validate = (request) => {
  const type = get(request, 'notificatiotype');
  let finalSchema;
  let result;
  try {
    finalSchema = schema(type);
    result = finalSchema.validate(request, {
      context: {
        type,
      },
      allowUnknown: true,
      abortEarly: false,
    });
  } catch (error) {
    result = { error };
  }

  if (result.error && !result.error.code) {
    result.error.code = FALLBACK_ERR.code;
    result.error.message = `${FALLBACK_ERR.message} ${result.error.message}`.trim();
  }
  return result;
};
