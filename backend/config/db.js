
let mongoose=require('mongoose');

function DBConnection(){
<<<<<<< HEAD
mongoose.connect('mongodb+srv://charmyparekh08:charmy123@cluster0.llqkq.mongodb.net/subscriptionmanagementcd').then(()=>{
=======
mongoose.connect('mongodb+srv://charmyparekh08:charmy123@cluster0.llqkq.mongodb.net/subscriptionmanagement').then(()=>{
>>>>>>> c378ee18113c8ca0aa00d28a645568ab9c324ade
    console.log("DB Connected Successfully");
}).catch((err)=>{
    console.log("DB Connection Error Occur:"+err)
})
}

module.exports=DBConnection;