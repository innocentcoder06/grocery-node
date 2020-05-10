var mongoose = require('mongoose');




const Inventory = mongoose.model('Inventory',{

    vendorId: {
        type: String,
        required: true
    },

    storeName : {
        type : String,
        required : true
    },

    products: [{
        productId: {
            type: String, // autoGen by Us.
            required: true
        },
        productName: {
            type: String,
            required: true
        },
      
        productCategory:{
            type:String,
            required:true
        },
        unit: {
            type: String,
            
        },
        quantity: {
            type: Number,
            
        },
        stockCnt: {
            type: Number,
          
        },
        MRP: {
            type: Number
        }
    }]

},'Inventory')

module.exports = { Inventory };