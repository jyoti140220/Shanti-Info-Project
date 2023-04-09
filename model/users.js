const mongoose=require('mongoose')

const user = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    OTP:{
        type: String,
        default: null
    },
    friendRequestArray:{
        type: Array,
        default: []
    },
    alreadyFriendArray: {
        type: Array,
        default: []
    }
})



const userschema = new mongoose.model('users', user)

module.exports=userschema

