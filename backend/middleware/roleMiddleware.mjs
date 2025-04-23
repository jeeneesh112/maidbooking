export const isAdmin = (req, res, next) => {
  console.log("User:", req.user);
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
  