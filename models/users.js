var mongoose = require('mongoose');

const User = mongoose.model('Users',{

    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required:true
    },
    role:{
        type : String,
        required:true
},
    address: [{
        careOf: {
            type: String,
            default: null
        },
        doorNo: {
            type: String,
            required: true,
            default: null
        },
        addressLine1: {
            type: String,
            required: true,
            default: null
        },
        addressLine2: {
            type: String,
            default: null
        },
        city: {
            type: String,
            required: true,
            default: null
        },
        district: {
            type: String,
            required:true,
            default: null
        },
        pinCode: {
            type: Number,
            required: true,
            default: null
        },
        country: {
            type: String,
            required: true,
            default: null
        }
    }],
    contact: [{
        whatsApp: {
            type: Number,
            required: true
        },
        mobile: {
            type: Number,
            default: null
        }
    }]
    
},'Users');



module.exports =  { User } ;