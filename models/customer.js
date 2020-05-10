var mongoose = require('mongoose');




const Customer = mongoose.model('Customer',{

    customerId: {
        type: String, //email
        required: true
    },
    // preferredVendors: [{
    //     vendorId: {
    //         type: mongoose.Types.ObjectId, // vendorId
    //         required: true
    //     }
    // }],
    bucket: [{
        productName: {
            type: String,
            required: true
        },
        productId: {
            type: String, // autoGen by Us.
            required: true
        },
        unit: {
            type: String,
            
        },
        quantity: {
            type: Number,
            required: true
        },
        MRP: {
            type: Number
        }
    }]


},'Customer')



module.exports={Customer}