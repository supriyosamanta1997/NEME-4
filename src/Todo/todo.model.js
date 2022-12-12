const mongoose = require('mongoose');
const TodoSchema=new mongoose.Schema({
    taskname:String,
    status:{type:String,enum:["pending", "complete"]},
    tag:{type:String,enum:["personal","official","family"]},
    email:String
},{
    versionKey:false,
    timestamps:true
});
const TodoModel=mongoose.model("todo",TodoSchema);

module.exports=TodoModel;