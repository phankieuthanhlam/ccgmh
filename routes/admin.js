var express = require('express');
const multer  = require('multer');
const upload = multer({ dest: 'storage/uploads/' })
var route = express.Router()
const authMiddlware = require('../app/middlewares/auth');

const authController = require('../app/controllers/backend/AuthController');
const dashboardController = require('../app/controllers/backend/DashboardController');
const administratorController = require('../app/controllers/backend/AdministratorController');
// login
route.get('/login',authController.login);
route.post('/login',authController.onLogin);
route.get('/logout',authController.logout);

// dashboard
route.get('/dashboard',authMiddlware,dashboardController.index);
route.get('/administrator',authMiddlware,administratorController.index);
route.post('/administrator',authMiddlware,administratorController.create);
route.get('/administrator/edit/:id',authMiddlware,administratorController.edit);
route.patch('/administrator/edit/:id',authMiddlware,administratorController.update);
route.delete('/administrator',authMiddlware,administratorController.delete);

//upload
route.post('/upload',upload.single('image'),function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    res.send('asas');
  });

module.exports = route;