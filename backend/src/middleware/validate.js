const ApiResponse = require('../utils/apiResponse');

/**
 * Zod schema validation middleware factory.
 * Validates req.body, req.params, and/or req.query against Zod schemas.
 *
 * Usage:
 *   validate({ body: registerSchema })
 *   validate({ body: schema, params: paramsSchema })
 */
const validate = (schemas) => {
  return (req, res, next) => {
    const errors = [];

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        errors.push(
          ...result.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
            source: 'body',
          }))
        );
      } else {
        req.body = result.data;
      }
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        errors.push(
          ...result.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
            source: 'params',
          }))
        );
      } else {
        req.params = result.data;
      }
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        errors.push(
          ...result.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
            source: 'query',
          }))
        );
      } else {
        req.query = result.data;
      }
    }

    if (errors.length > 0) {
      return ApiResponse.badRequest(res, 'Validation failed', errors);
    }

    next();
  };
};

module.exports = { validate };
