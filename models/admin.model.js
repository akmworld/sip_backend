const mongoose =require('mongoose');

export const admin=mongoose.model(
    "Admin",
    new mongoose.schema({
        fullname: {type:String, required:true},
        EmpID: {type:Number, required:true}
    }),
    "Admins"
);