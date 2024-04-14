const express= require('express');
const mongoose = require('mongoose');
const cors=require('cors')

mongoose.connect('mongodb://127.0.0.1:27017/lnt')
.then(() => console.log('Connected!'));

const schema = mongoose.Schema;
const User=new schema({
    name:String,
    email:String,
    dob:String,
    password:String,
    role:String,
    status:String
  })
  
  const UserModel = mongoose.model('users',User);
  const app=express();
  app.use(express.json())
  app.use(cors())

  app.get('/getUsers',async (req, res) => {
    const users=await UserModel.find();
    res.send(users);
  })
app.post('/registerUser',async (req,res)=>{
  console.log(req.body)
  const user= await UserModel.findOne(req.body)
  if(user==null){
    var ans=new UserModel(req.body)
    ans.status=0;
    ans.save()
    const tempUser=UserModel.findOne(req.body);
    console.log(tempUser);
    res.status(200).send(" registered successfully");
  }
  else{
    res.send("User already exists");
  }
    
  })
  app.post('/updateUser',async (req,res)=>{
    
    const user= await UserModel.findOne(req.body)
    if(user!=null){
      var ans=new UserModel(req.body)
      ans.status=0;
      ans.save()
      res.status(200).send("logout successfull");
    }
    else{
      res.send("user not exist");
    }
      
    })

  app.post('/loginUser', async (req, res) => {
    console.log(req.body)
    const email= req.body.email;
    const password= req.body.password;
    console.log('Input : '+email,password);
    try {
      const user = await UserModel.findOne(req.body);
      console.log('database output'+user);
      if(user!=null && user.email === email && user.password === password){
        user.status=1
        user.save();
        return res.status(200).send(user);
      }
     else{
      return res.status(403).send("Invalid username or password");
     }
        
    } catch (error) {
      console.error("Error logging in user:", error);
      return res.status(500).send("Error logging in user");
    }
  });

  app.listen(4010,()=>{
    console.log('Server is running')
  })







