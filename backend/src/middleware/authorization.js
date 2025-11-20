/**
 * Authorization Middleware
 * 
 * Checks user permissions based on employee_type.
 */

/**
 * Require trainer role
 */
const requireTrainer = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }

  if (req.user.employee_type !== 'trainer') {
    return res.status(403).json({
      success: false,
      error: 'Trainer access required'
    });
  }

  next();
};

/**
 * Require regular employee role
 */
const requireRegular = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }

  if (req.user.employee_type !== 'regular') {
    return res.status(403).json({
      success: false,
      error: 'Regular employee access required'
    });
  }

  next();
};

/**
 * Check if user owns the resource
 */
const requireOwnership = (userIdParam = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const resourceUserId = req.params[userIdParam];

    // Trainers can access any resource
    if (req.user.employee_type === 'trainer') {
      return next();
    }

    // Regular users can only access their own resources
    if (req.user.user_id !== resourceUserId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. You can only access your own resources.'
      });
    }

    next();
  };
};

module.exports = {
  requireTrainer,
  requireRegular,
  requireOwnership
};

