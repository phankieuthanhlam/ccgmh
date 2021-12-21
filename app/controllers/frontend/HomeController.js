const layout = './backend/layouts/master';
class HomeController{
   
    index(req,res){
        res.render('backend/home',{layout:layout,title:'aa'});
    }
}
module.exports = new HomeController;