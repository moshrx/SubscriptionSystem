
let mongoose=require('mongoose');

function DBConnection(){
mongoose.connect('mongodb://localhost:27017/subscriptionmanagement').then(()=>{
    console.log("DB Connected Successfully");
}).catch((err)=>{
    console.log("DB Connection Error Occur:"+err)
})
}

module.exports=DBConnection;