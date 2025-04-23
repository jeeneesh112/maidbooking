export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
      const user = req.user;

      console.log("User in authorizeRoles middleware:", user);
  
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized: No user information found.' });
      }
  
      if (user.userType === 'superadmin') {
        return next(); // Super admin has access to all routes
      }
  
      if (!user.roles || !Array.isArray(user.roles)) {
        return res.status(403).json({ message: 'Forbidden: No roles assigned to the user.' });
      }
  
      const hasRole = user.roles.some(role => allowedRoles.includes(role));
      if (!hasRole) {
        return res.status(403).json({ message: 'Forbidden: You do not have the required role.' });
      }
  
      next();
    };
  };
  