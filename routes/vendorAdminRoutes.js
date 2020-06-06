var mongoose = require('mongoose');

var express = require('express');
var router = express.Router();
const {User} = require('../models/users');
const {Inventory} = require('../models/inventory');
const {Vendor}= require('../models/vendor');
const inventory = require('../models/inventory');




/** Get Vendor ROUTE
 * uri: /vendorAdmin/getVendor
 * purpose: used to get the Current Vendor.
 */

router.post('/getVendor',(req,res)=>{
    
    Vendor.find({'vendorAdmins':req.body.email}).then((doc)=>{
        res.send(doc)
    }).catch((err)=>{
        res.send({success:false, message:'Vendor Loading Error'})
    })


 })


/** Create Inventory ROUTE
 * uri: /vendorAdmin/createInventory
 * purpose: used to create new Inventory to the current vendor.
 */


router.post('/createInventory',(req,res)=>{

    let newInventory = new Inventory(req.body);

    newInventory.save().then(()=>{
        res.send({
            'success': true,
            'message': "New Inventory Created"
        });
    }).catch((err)=>{
        res.send({
            'success': false,
            'message': "Error Occured while adding Inventory"
        });
        console.log(err);
    })
})



/** Update Inventory ROUTE
 * uri: /vendorAdmin/updateInventory
 * purpose: used to update the exisiting Inventory to the current vendor.
 */

router.post('/updateInventory',(req,res)=>{
    
Inventory.count({'vendorId':req.body.vendorId}).then((cnt)=>{
    if(cnt>0)
    {
        Inventory.findOneAndUpdate({'vendorId':req.body.vendorId},{$push:{'products' :req.body.products} },(error,doc)=>{
            if(!error)
            {
                res.send({
                    "success":true,
                    "message":"Inventory Updated",
                    
                })
            }
            else
            {
                res.send({
                    "success":false,
                    "message":"Error Occured while updating Inventory",
                    "Error ": error
                })
            }
                
            }
        )
      
        
    }
    else
    {
        res.send({
            "success":false,
            "message":"Vendor Not Found"
        })
    }
})
})





/** Add Vendor Admin ROUTE
 * uri: /vendorAdmin/addVendorAdmin
 * purpose: used to add Vendor Admin to the existing vendor
 */


router.post('/addVendorAdmin',(req,res)=>{


    const user = new User({
        fname : req.body.fname,
        lname : req.body.lname,
        email : req.body.email,
        password : req.body.password,
        role : "Vendor Admin",
        address : req.body.address,
        contact : req.body.contact
    })

    User.find({'email': req.body.email}).count((err,num)=>{
        if(num != 0)
        {
         res.json({success:false, message:'Mail Id Exists. This user already registered.'})
        }
        else
        {
            user.save((err,doc)=>{
                if(err)
                {
                    res.json({success:false, message : 'Registration Failed '+err})
                }
                else
                {
                    console.log({success:true, message : 'User Registered Successfully'})
                }
            });

            Vendor.find({'vendorId':req.body.vendorId}, (err,doc)=>{
                if(err)
                {
                    res.json({success:false, message : 'Error While Finding the Vendor'+err})
                }
                else
                {
                    Vendor.update({'vendorId':req.body.vendorId},{ $push : {'vendorAdmins': req.body.email}},(error)=>{
                        if(error)
                        {
                            console.json({success:false, message : 'Error While Adding the vendor admin'+error})
                        }
                        else
                        {
                            res.json({success:true, message : 'Vendor Admin Added Successfully'})
                        }
                    })
                }
            })
            
        }
    })

});


/** Edit Vendor ROUTE
 * uri: /vendorAdmin/editVendor/:id
 * purpose: used to edit current vendor
 */

router.post('/editVendor/:id', (req, res) => {
    
    Vendor.count({ _id: req.params.id }).then((cnt) => {
        if (cnt > 0) {
            Vendor.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }).then((updatedDoc) => {
                res.send({ success: true, message: 'Vendor Details updated successfully.' });
            }).catch((err) => {
                console.log(err);
            });
        } else {
            res.send({ success: false, message: 'Vendor Not Found.' });
        }
    }).catch((err) => {

    });

 });




// /** Get Store Name ROUTE
//  * uri: /vendorAdmin/getVendorStoreNames
//  * purpose: used to fetch existing vendors' storeNames
//  */

//  router.get('/getVendorStoreNames/:vendorId',(req,res)=>{

//     names = [];
//      Vendor.find({'vendorId':req.params.vendorId}).then((doc)=>{

//         res.send(doc[0].storeName)

//      }).catch((err)=>{
//          res.send({Error:err})
//      })
//  })



router.post('/getInventory', (req, res) => {
    const vendorId = req.body.vendorId;
    async function query() {
        const vendorDoc = await Vendor.findOne({ vendorId: vendorId });
        Inventory.findOne({ vendorId:vendorId }).then((inventoryDoc) => {
            if (inventoryDoc) {
                res.send({
                    success: true,
                    doc: inventoryDoc
                });
            } else {
                if (vendorDoc) {
                    const storeName = vendorDoc.storeName;
                    const newInventory = new Inventory({
                        vendorId,
                        storeName
                    });
                    newInventory.save();
                    res.send({
                        success: false,
                        message: 'new Inventory Created Successfully'
                    });
                }
            }
        }).catch((err) => {
            console.log(err);
        });
    }
    query();
});

router.post('/inventory/:inventoryId/product/new', (req, res) => {
    const productName = req.body.productName;
    const productCategory = req.body.productCategory;
    const unit = req.body.unit;
    const quantity = req.body.quantity;
    const stockCnt = req.body.stockCnt;
    const MRP = req.body.MRP;
    const Product = new Object({
        productName,
        productCategory,
        unit,
        quantity,
        stockCnt,
        MRP
    });
    async function query () {
        await Inventory.findByIdAndUpdate({ _id: req.params.inventoryId }, { $push: { products: Product } });
        res.send({
            success: true,
            message: 'Product Added Successfully'
        });
    }
    query();
});

router.post('/inventory/:inventoryId/product/:productId/edit', (req, res) => {
    Inventory.updateOne({ 'products._id': req.params.productId }, { $set: {
        'products.$.productName': req.body.productName,
        'products.$.productCategory': req.body.productCategory,
        'products.$.unit': req.body.unit,
        'products.$.quantity': req.body.quantity,
        'products.$.stockCnt': req.body.stockCnt,
        'products.$.MRP': req.body.MRP
    } }).then((inventoryDoc) => {
        res.send({
            success: true,
            message: 'inventory updated Successfully'
        });
    }).catch((err) => {
        console.log(err);
    });
});

router.delete('/inventory/:inventoryId/product/:productId/delete', (req, res) => {
    Inventory.updateOne({ _id: req.params.inventoryId }, { $pull: { products: { _id: req.params.productId } } }).then((inventoryDoc) => {
        res.send({
            success: true,
            message: 'product removed successfully'
        });
    }).catch((err) => {
        console.log(err);
    })
});

 
module.exports=router;