const {Router}=require('express');
const jwt=require("jsonwebtoken");
const TodoModel=require('./todo.model.js');
const todoController=Router();


todoController.get("/",async(req,res)=>{
    // const {status,tag} =req.query;
    const all_todo=await TodoModel.find();
    res.send(all_todo);
});
todoController.post("/create", async (req,res)=>{
    try{
        const new_todo=await TodoModel.create({...req.body});
        res.send(new_todo);
    }
    catch(e){
        res.send("Todo Created Failed");
    }
});
todoController.delete("/delete/:id", async (req,res)=>{
    const token = req.headers?.authorization
    jwt.verify(token,'secret',async(err,decoded)=>{
        if(err){
            res.send("please login")
        }
        else{
            const result = req.params;
            const data = await TodoModel.findOne(req.params);
            if(data.email===req.body.email){
                await TodoModel.deleteOne(result)
                try{
                    res.send("Todo Deleted Successfully");
                }
                catch(e){
                    res.send(e);
                }
            }
            else{
                res.send("This feed is not created by you")
            }
        }
    })
    
    
});
todoController.patch("/update/:id", async (req,res)=>{
    const result = req.params;
    const data = await TodoModel.findOne(result);
    if(data.email===req.body.email){
        try{
            const newFeeds = {data,...req.body};
            console.log(newFeeds);
            const updates = await TodoModel.findByIdAndUpdate(req.params, req.body, {new :true})
            res.send(updates)
        }
        catch(err){
            console.log(err)
        }
    }
    else{
        res.send("This feed is not created by you")
    }
});
module.exports=todoController
