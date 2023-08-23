const jwt = require('jsonwebtoken');

// Verification of token
const authGuard = (req, res, next) => {
  const token = req.cookies['jwt-login-auth'];
  
  if (!token) {
    return res.redirect("/login");
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    if (decoded) {
      res.locals.name = decoded.name;
      res.locals.email = decoded.email;
      return next();
    }
  } catch (err) {
    // Handle the token verification error
    return res.redirect("/login");
  }
}

// Prevent acces to login and reg route after successfully logged in
const guest = (req, res, next) => {
  const token = req.cookies['jwt-login-auth'];
  
  if (!token) {
    next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded) {
      res.locals.name = decoded.name;
      res.locals.email = decoded.email;
      return res.redirect("/");
    }
  } catch (err) {
    // Handle the token verification error
    next();
  }
  
}


// For showing and hiding the logout button
const validateUser = (req, res, next) => {
  const token = req.cookies['jwt-login-auth'];
  
  if (!token) {
    res.locals.user = false;
    return next();
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded) {
      req.user = decoded;
      res.locals.user = true;
      return next();
    }
  } catch (err) {
    // Handle the token verification error
    return res.redirect("/login");
  }
}

module.exports = {
  authGuard,
  guest,
  validateUser

};
