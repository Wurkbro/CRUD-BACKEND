const express = require('express');
const app = express();
const cors = require('cors');
const routerUrl = require('./routes/router')
const mongoose = require('mongoose')
const dotenv = require('dotenv');

dotenv.config();
mongoose.connect(process.env.DATABASE_ACCESS,() => console.log("connected"));

app.use(express.json());
app.use(cors());
app.use('/api',routerUrl);

app.get('/',(req,res)=>{
    res.send('hello world')
})

app.listen(3000,()=>{
    console.log('connected to port 3000');
})