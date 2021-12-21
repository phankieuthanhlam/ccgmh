const session = require('express-session');
module.exports = (req, res, next) => {
  try {
    const backend_user = req.session.backend_user;
    //console.log(req.route.path); 
  
    if (typeof backend_user === 'undefined' || backend_user.username === null) {
       res.redirect('/admin/login');
    } else {             
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};