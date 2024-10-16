
let mongoose=require('mongoose');

function DBConnection(){
mongoose.connect('mongodb+srv://charmyparekh08:charmy123@cluster0.llqkq.mongodb.net/subscriptionmanagement').then(()=>{
    console.log("DB Connected Successfully");
}).catch((err)=>{
    console.log("DB Connection Error Occur:"+err)
})
}

module.exports=DBConnection;