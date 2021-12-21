require("dotenv").config();
const userModel = require("../../models/BackendUser");
const bcrypt = require("bcrypt");
const layout = "backend/layouts/auth";
const backendLogin = require("../../../config/backend_auth");
class AuthController {
  //get login
  login(req, res) {
    var data = {
      layout: layout,
      title: "Đăng nhập",
      session_error: req.session.error,
    };
    if(req.session.backend_user) res.redirect('/admin/dashboard');
    res.render("backend/login", data);
  }
  async onLogin(req, res, next) {
    try {
      const user = await userModel
        .findOne({ userName: req.body.username })
        .exec();
      if (!user) throw new Error("Tài khoản hoặc mật khẩu không đúng");
      const isPasswordValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!isPasswordValid) {
        throw new Error("Tài khoản hoặc mật khẩu không đúng");
      }
      
      req.session.backend_user = user;
      
      
      
      return res.json({ error: 0, message: 'Đăng nhập thành công', redirect: '/admin/dashboard'});
    } catch (ex) {
      return res.json({ error: 1, message: ex.message });
    }
  }
  //get register
  register(req, res, next) {
    try {
    } catch (ex) {
      res.json({ error: 1, message: ex.toString() });
    }
  }
  async create(req, res, next) {
    try {
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(req.body.password, salt);
      const username = await userModel
        .findOne({ userName: req.body.userName })
        .exec();
      if (username) throw "User exists";
      var model = new userModel();
      model.userName = req.body.userName;
      model.firstName = req.body.firstName;
      model.lastName = req.body.lastName;
      model.email = req.body.email;
      model.phone = req.body.phone;
      model.password = hash;
      model.forgetCode = "";
      model.isActive = false;
      model.bio = "";
      model.isSuperUser = false;
      model.role.name = req.body.roleName ? req.body.roleName : "Quản trị viên";
      model.role.code = req.body.roleCode ? req.body.roleCode : "admin";

      model.save();

      return res.json({ error: 0, message: "Success" });
    } catch (ex) {
      return res.json({ error: 1, message: ex.toString() });
    }
  }
  profile(req, res, next) {
    res.json({ msg: "success" });
  }
  logout(req,res){
    req.session.destroy(function(){
      res.redirect('/admin/login');
    });
  }
}
module.exports = new AuthController();
