const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        number: {
            type: String,
            required: true
        }
    },
    { collection: 'users' }
)

module.exports = mongoose.model('userSchema',userSchema);