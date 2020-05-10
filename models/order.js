var mongoose = require('mongoose');


const Order = mongoose.model('Order',{
    customerId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    vendorId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    products: [{
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
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        MRP: {
            type: Number
        }
    }],
    orderStatus: {
        status : ['Pending','Processing', 'ReadyToDeliver', 'PickedUp' ],
        default : 'Pending'    
    }

},'Orders')



module.exports = {Order}