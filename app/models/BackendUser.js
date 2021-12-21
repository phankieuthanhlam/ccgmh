const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const saltRounds = 10;

var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const BackendUserSchema = new Schema({
  id: ObjectId,
  userName: { type: String, unique: [true, "Tài khoản đã tồn tại"],required: [true, "Tài khoản không được trống"] ,lowercase: true,},
  firstName: { type: String, required: [true, "Tên không được trống"] },
  lastName: { type: String, required: [true, "Họ không được trống"] },
  email: { type: String, 
    trim: true,
    lowercase: true,
    unique: [true, "Email đã tồn tại"],
    required: [true, "Email không được trống"],
    validate: [validateEmail, 'Email không đúng định dạng'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email không đúng định dạng'] },
  phone: { type: String, required: [true, "Số điện thoại không được trống"] },
  password: { type: String, required: [true, "Mật khẩu không được trống"] },
  forgetCode: { type: String, default: "" },
  isActive: { type: Boolean, default: false },
  bio: { type: String, default: "" },
  isSuperUser: { type: String, default: false },
  avatar: { type: String, default: "" },
  refreshToken: { type: String, default: "" },
  lastLogin: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: Date.now },
  role: {
    name: { type: String, default: "Administrator",enum: ['Administrator','Editor'] },
    code: { type: String, default: "admin",enum:['admin','editor'] },
  },
});
BackendUserSchema.pre("save", function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();
  bcrypt.hash(user.password, saltRounds, function (err, hash) {
    if (err) return next(err);
    // override the cleartext password with the hashed one
    user.password = hash;
    next();
  });
  
});
BackendUserSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('Email hoặc tài khoản đã tồn tại'));
  } else {
    next(error);
  }
});

module.exports = mongoose.model("backend_users", BackendUserSchema);
