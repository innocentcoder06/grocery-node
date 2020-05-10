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
            type: String
        },
        doorNo: {
            type: String,
            required: true
        },
        addressLine1: {
            type: String,
            required: true
        },
        addressLine2: {
            type: String
        },
        city: {
            type: String,
            required: true
        },
        district: {
            type: String,
            required:true
        },
        pinCode: {
            type: Number,
            required: true
        },
        country: {
            type: String,
            required: true
        }
    }],
    contact: [{
        whatsApp: {
            type: Number,
            required: true
        },
        mobile: {
            type: Number
        }
    }]
    
},'Users');



module.exports =  { User } ;