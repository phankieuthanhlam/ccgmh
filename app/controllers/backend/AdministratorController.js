const layout = "./backend/layouts/master";
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");
const adminModel = mongoose.model("backend_users");
class AdministratorController {
  index(req, res) {
    var perPage = 10;
    var page = req.query.page || 1;
    
    adminModel
      .find({})
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec(function (err, results) {
       
        adminModel.count().exec(function (err, count) {
          if (err) return next(err);
          res.render("backend/admin/list", {
            layout: layout,
            title: "Quản trị thành viên",
            results: results,
            current: page,
            pages: Math.ceil(count / perPage)
          });
        });
      });
  }
  async create(req,res){
    try{
        const user = new adminModel();
        user.userName = req.body.username.toLowerCase();
        user.email = req.body.email;
        user.firstName = req.body.firstname; 
        user.lastName = req.body.lastname;
        user.password = req.body.password;
        user.phone = req.body.phone;
        user.role.code = req.body.role;
        user.role.name = req.body.role == 'admin' ? 'Administrator' : 'Editor';
        const newAdminModel = await user.save();
        if(newAdminModel !== user) throw new Error('Tạo thất bại');
        return res.json({error:0,message:'Tạo tài khoản thành công'});
    }
    catch(ex){
      return res.json({error:1,message:ex.message});
    }
  }
  edit(req,res){
    adminModel.findById(req.params.id, function (err, user) {
      if(err){
      res.status(err.status || 500);
      res.render('error');
      }
      res.render('backend/admin/edit',{  title: "Quản trị thành viên",layout: layout,user:user});
    })   
  }
  async update(req,res){
    try{
      const user = await adminModel.findById(req.params.id);
      if(!user) throw new Error('Tài khoản không tồn tại');
      //update password
      if(req.body.password){
        const isPasswordValid = bcrypt.compareSync(
          req.body.currentPassword,
          user.password
        );
        if (!isPasswordValid) {
          throw new Error("Mật khẩu cũ không đúng");
        }
        user.password = req.body.password;
      }
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.phone = req.body.phone;
      user.bio = req.body.bio;
      const newAdminModel = await user.save();
        if(newAdminModel !== user) throw new Error('Cập nhật thất bại');
        return res.json({error:0,message:'Cập nhật thành công'});
    }
    catch(ex){
      return res.json({error:1,message:ex.message});
    }
  }
  async delete(req,res){
    try{
      //console.log(req.body.id);
      // cannot delete myself;
      if(req.body.id == req.session.backend_user._id) throw new Error('Cannot delete yourself');
      //await adminModel.deleteOne({ _id: req.body.id });
      return res.json({error:0,message:'Xoá thành công'});
    }
    catch(ex){
      return res.json({error:1,message:ex.message});
    }
  }
}
module.exports = new AdministratorController();
