const mongoose = require('mongoose');
async function connect(){
    try{
       await mongoose.connect('mongodb://localhost:27017/gmholdings') ;
       console.log('Connect success');    
    }catch(exception){
        console.log(exception);
    }
}
module.exports = { connect }