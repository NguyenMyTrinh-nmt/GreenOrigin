// Middleware kiểm tra quyền theo role

module.exports = function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      console.log('❌ AuthorizeRole: No user in request');
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: no user in request'
      });
    }

    const userRole = req.user.role;
    console.log(`🔍 AuthorizeRole: User role = ${userRole}, Allowed = [${allowedRoles.join(', ')}]`);

    if (!userRole || !allowedRoles.includes(userRole)) {
      console.log(`❌ AuthorizeRole: Role ${userRole} not in allowed roles`);
      return res.status(403).json({
        success: false,
        message: 'Forbidden: you do not have permission to perform this action',
        userRole: userRole,
        allowedRoles: allowedRoles
      });
    }

    console.log(`✅ AuthorizeRole: User authorized with role ${userRole}`);
    next();
  };
};
