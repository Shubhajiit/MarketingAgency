const ApiResponse = require('../utils/apiResponse');

/**
 * Role-checking middleware factory.
 * Usage: requireRole('admin') or requireRole('admin', 'moderator')
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.unauthorized(res, 'Authentication required');
    }

    if (!roles.includes(req.user.role)) {
      return ApiResponse.forbidden(res, 'Insufficient permissions');
    }

    next();
  };
};

module.exports = { requireRole };
