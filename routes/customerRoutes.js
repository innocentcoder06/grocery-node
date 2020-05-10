var mongoose = require('mongoose');

var express = require('express');

const {User} = require('../models/users');
const {Inventory} = require('../models/inventory');
const {Customer} = require('../models/customer');


var router = express.Router();


/** Fetch Product ROUTE
 * uri: /customer/getProducts
 * purpose: used to display products
 */

router.get('/getProducts',(req,res)=>{
    products = [];

    Inventory.find({}).then((docs)=>{

            docs.forEach(element1 => {
                
                element1.products.forEach(element => {
                    products.push(element)
                });
            });

        res.send(products);
    }).catch((err)=>{
        res.send({success:false, message : "OOPS !! Something went Wrong. Please Try Again Later"})
    })
})


/** Fetch Product on Category Wise ROUTE
 * uri: /customer/getProducts/:category
 * purpose: used to display products category wise
 */

 router.get('/getProducts/:category',(req,res)=>{

    products=[];
    Inventory.find({}).then((docs)=>{
        // console.log(docs[0].products)
        docs.forEach(element1 => {
            element1.products.forEach(element => {
                if(element.productCategory==req.params.category)
                {
                    products.push(element)
                }
             });
        });

      
        res.send(products);
    }).catch((err)=>{
        res.send({success:false, message : "OOPS !! Something went Wrong. Please Try Again Later",  Error :err})
    })

 })



/** Add to Cart ROUTE
 * uri: /customer/addToCart
 * purpose: used to update customer's cart
 */

 router.post('/addToCart',(req,res)=>{

    Customer.findOneAndUpdate({'customerId':req.body.email},{$push:{bucket: req.body.product}}).then(()=>{
        res.send({success:true, message : 'Product Added to Cart'})
    }).catch((err)=>{
        res.send({success:false, message:'Error While Adding Product to the Cart'})
    })

 })




/** Clear Cart ROUTE
 * uri: /customer/clearCart
 * purpose: used to clear customer's cart
 */


router.post('/clearCart',(req,res)=>{

    Customer.findOneAndUpdate({'customerId':req.body.email},{$set:{bucket:[]}}).then(()=>{
        res.send({success:true, message:'All the Products are Checked out from Cart and Proceeding for Order'})
    }).catch((err)=>{
        res.send({success:false, message:"Error while checking out the Products in the cart"})
    })
})

module.exports = router;

