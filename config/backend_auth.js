const bcrypt = require('bcrypt');
const userModel = require('../app/models/BackendUser');

async function backendLogin(req,res){
	const user = await userModel.findOne({ userName: req.body.username }).exec();
	if (!user) throw new Error('Tài khoản hoặc mật khẩu không tồn tại');
	const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
	if (!isPasswordValid) {
		throw new Error('Mật khẩu không chính xác');
	}
	req.session.regenerate(function(){
		req.session.backend_user = user;
	});  
}
module.exports = backendLogin;