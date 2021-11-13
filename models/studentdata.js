const moogoose = require('mongoose');

const studentData = new moogoose.Schema({
    names:{
        type: String,
        required: true
    },
    regno:{
        type: String,
        required: true,
        unique:true
    },
    rollno:{
        type: String,
        required: true,
        unique:true
    },
    number:{
        type: String,
        required: true,
        unique:true
    },
    aadharno:{
        type: String,
        required: true,
        unique:true
    }
},
{collection: 'StudentData'}
)
module.exports=moogoose.model('studentData',studentData);