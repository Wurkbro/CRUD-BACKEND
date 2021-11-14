const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const StudentData = require('../models/studentdata');
dotenv.config();

router.post('/updateData',async(req,res)=>{
    const { token , newnumber , rollno} = req.body;// to get access token from request body
    const numberno = newnumber;
    try{
        const user = jwt.verify(token ,process.env.JWT_SECRET);
        //if verified successfully
        // now we can update student number 
        await StudentData.updateOne({ rollno },{
            $set: { numberno }
        })
        return res.json({status : 'ok', data: 'successfully updated number'});
    }
    catch(error){
        // console.log(error);
        //can't fetch data user has not completed the login process... 
        return res.json({status : 'error',error:'login first'});
    }    
});

router.post('/deleteData',async(req,res)=>{
    const { token , rollno} = req.body;// to get access token from request body
    try{
        const user = jwt.verify(token ,process.env.JWT_SECRET);
        //if verified successfully
        const users = await StudentData.findOneAndDelete({rollno}).lean();//to search user in record
        // console.log(users);
        await User.deleteOne(users);
        return res.json({status : 'ok', data: 'successfully deleted'});
    }
    catch(error){
        //can't fetch data user has not completed the login process... 
        return res.json({status : 'error',error:'Cant fetch data login first'});
    }    
});

router.post('/fetchData',async(req,res)=>{
    const { token } = req.body;// to get access token from request body
    try{
        const user = jwt.verify(token ,process.env.JWT_SECRET);
        //if verified successfully
        const fetchData = await StudentData.find(); // fetch students data from database
        return res.json({status : 'ok', data: fetchData});
    }
    catch(error){
        //can't fetch data user has not completed the login process... 
        return res.json({status : 'error',error:'Cant fetch data login first'});
    }    
});

router.post('/putData',async(req,res)=>{

    const { token , names , regno , rollno, numberno, aadharno} = req.body;
    try{
        const user = jwt.verify(token ,process.env.JWT_SECRET);
        //if verified successfully
        const response = await StudentData.create({
            names,
            regno,
            rollno,
            numberno,
            aadharno
        });
        return res.json({status : 'ok'});
    }
    catch(error){
        // can't put data into the database token not verified
        return res.json({status : 'error',error:'Can\'t Put data login first or duplicate values found'});
    }    
});

router.post('/logout',async(req,res)=>{
    try{
        // res.clearCookie("token");
        console.log("logout success");
        // await req.username.save();
        // res.render("login");
        return res.json({status : 'ok'});
    }catch(error){
        return res.json({status : 'error',error:'Some error occured'});
    }
});
router.post('/changePass',async (req,res)=>{
    const { token , newpassword } = req.body;
    try{
        const user = jwt.verify(token ,process.env.JWT_SECRET);
        // its sure that its the same user
        const _id = user.id;
        if(!newpassword || typeof newpassword !== 'string'){
            //checking the password
            return res.json({status : 'error',error:'invalid password'});     
        }
        if(newpassword.length <= 8)
        {
            //checking the length of password if less than 8 then returning the error 
            return res.json({status : 'error',error:'Too small password should be min 8 characters'});  
        }
        const password = await bcrypt.hash(newpassword,5);
        
        await User.updateOne({ _id },{
            $set: { password }
        });
        res.json({status:"ok"});
    }
    catch(error){
        res.json({status:"error", error: ";))"});
    }
});
router.post('/login',async(req,res)=>{
    // authenticate user
    const username = req.body.username;
    const password = req.body.pass;
    const user = await User.findOne({username}).lean();//to search user in record
    
    if(!user){
        return res.json({status: 'error' , error:'Invalid username and password'});
    }
    if(await bcrypt.compare(password,user.password)){
        //to compare the hash and password
        const token = jwt.sign({
            id: user._id, 
            username: user.username
        }, process.env.JWT_SECRET);
        return res.json({status: 'ok' , data: token});
    }
    else
    {
        return res.json({status: 'error' , error:'Invalid password'});
    }
});

router.post('/register',async(req,res)=>{

    const {name,username,pass,number}=req.body;
    if(!number || typeof number !== 'string'){
        //checking the password
        return res.json({status : 'error',error:'invalid Number'});     
    }
    if(number.length != 10)
    {
        //checking the length of password if less than 8 then returning the error 
        return res.json({status : 'error',error:'Number should of 10 digits'});  
    }
    if(!name || typeof name !== 'string'){
        //checking the name of the user
        return res.json({status : 'error',error:'invalid name'});
    }
    if(!username || typeof username !== 'string'){
        //checking the user name
        return res.json({status : 'error',error:'invalid Username'});
    }
    if(!pass || typeof pass !== 'string'){
        //checking the password
        return res.json({status : 'error',error:'invalid password'});     
    }
    if(pass.length <= 8)
    {
        //checking the length of password if less than 8 then returning the error 
        return res.json({status : 'error',error:'Too small password should be min 8 characters'});  
    }
    const password = await bcrypt.hash(pass,5);// hashing password with 5 salts its makes the code little slower so it should be min 10 max 15

    try{
        const response = await User.create({
            name,
            username,
            password,
            number
        });//this create user creates a user and put all the req values in database
        // console.log(response);
        res.json({Status:"ok"}); //if all goes good then the status is ok...
    }catch(error){
        if(error.code === 11000){
            //duplicate key
            return res.json({status : 'error',error:'Username aleady exist'});
            
        }
        throw error;
        // console.log(error);
        // return res.json({status : 'error'});
    }
});


module.exports = router;