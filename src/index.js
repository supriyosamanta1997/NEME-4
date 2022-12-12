 require('dotenv').config()
const express=require("express");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const cors = require("cors");


const PORT= process.env.PORT;

const connect=require("./config/db.js");
const todoController = require("./Todo/todo.route.js");
const authentication =require("./Middleware/validation.js")
const  UserModel =require("./Todo/user.model.js")

const app = express();

app.use(express.json());
app.use(cors());
app.use("/todos",todoController);
app.use(authentication);
app.use(UserModel);



app.post("/signup",async (req,res)=>{
    let {email,password}=req.body;
    bcrypt.hash(password,4).then(async (hash)=>{
        const user = await UserModel.create({email,password:hash});
        res.send({"msg":"Sign up Successfull","all_user":user});
    })
    .catch(()=>{
        res.send("something went wrong");
    });
});

app.post("/login",async (req,res)=>{
    let {email,password} = req.body;
    let user = await UserModel.findOne({email})
    let hash = user.password;
    bcrypt.compare(password,hash,(err,result)=>{
        if(result){
            var token = jwt.sign({email:email},'secret');
            console.log(token);
            res.send({"user":req.body.email,"msg":"login successfull","token":token})
        }
        else{
            res.send("Login failed, invalid credentials")
        };
    });
});


app.listen(PORT,async()=>{
    try{
        await connect();
        console.log("Connected to database successfully");
    }
    catch(e){
        console.log("connection error");    
        console.log(e);
        }
    console.log(`Server listening on port ${PORT}`);
});