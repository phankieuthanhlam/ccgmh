const layout = './backend/layouts/master';
class DashboardController{
   
    index(req,res){
        res.render('backend/home',{layout:layout,title:'Dashboard'});
    }
}
module.exports = new DashboardController;