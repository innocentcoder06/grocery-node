var mongoose = require('mongoose');


const Vendor = mongoose.model('Vendor',{

    vendorId: {
        type: String, // autoGen by Us.
        required: true
    },
    vendorAdmins: [{
        type:  String //addedBy franchise admin
    }],
    storeName : {
        type: String,
        required: true
    },
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String
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
            type: String,
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
    }],
    createdBy: {
        type: String, // franchiseAdmin name who creates it or vendor name
        required: true
    },
    deliveryWindow: {
        type: String,
        required: true
    },
    pickupWindow: {
        type: String,
        required: true    
    }

},'Vendors')




module.exports = { Vendor };