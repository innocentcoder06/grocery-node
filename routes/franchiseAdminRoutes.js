var mongoose = require('mongoose');

var express = require('express');
var router = express.Router();
const {User} = require('../models/users');

const { Vendor } = require('../models/vendor');
const {Franchise} = require('../models/franchise');



/** Get Franchise ROUTE
 * uri: /franchiseAdmin/getFranchise
 * purpose: used to get the Current Franchise.
 */

 router.post('/getFranchise',(req,res)=>{
    
    Franchise.find({'franchiseAdmins':req.body.email}).then((doc)=>{
        res.send(doc)
    }).catch((err)=>{
        res.send({success:false, message:'Franchise Loading Error'})
    })


 })





/** Create Vendor ROUTE
 * uri: /franchiseAdmin/createVendor
 * purpose: used to create new vendor to the current franchise.
 */

 router.post('/createVendor', (req, res) => {
    let newVendor = new Vendor(req.body);

    newVendor.save().then(() => {
        res.send({
            'success': true,
            'message': "New vendor added successfully."
        });
    }).catch((err) => {
        res.send({
            'success': false,
            'message': "Error Occured while adding Vendor"
        });
        console.log(err);
    });
     
 });

/** Edit Vendor ROUTE
 * uri: /franchiseAdmin/editVendor/:vendorId
 * purpose: used to edit existing vendor in the current franchise.
 */

 router.post('/editVendor/:vendorId', (req, res) => {
    
    Vendor.count({ vendorId: req.params.vendorId }).then((cnt) => {
        if (cnt > 0) {
            Vendor.findOneAndUpdate({ vendorId: req.params.vendorId }, { $set: req.body }).then((updatedDoc) => {
                res.send({ success: true, message: 'Vendor details updated successfully.' });
            }).catch((err) => {
                console.log(err);
            });
        } else {
            res.send({ success: false, message: 'Vendor Not Found.' });
        }
    }).catch((err) => {

    });

 });



/** Add Franchise Admin ROUTE
 * uri: /franchiseAdmin/addFranchiseAdmin
 * purpose: used to add Franchise Admin to the current Franchise
 */

router.post('/addFranchiseAdmin',(req,res)=>{


    const user = new User({
        fname : req.body.fname,
        lname : req.body.lname,
        email : req.body.email,
        password : req.body.password,
        role : "Franchise Admin",
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

            Franchise.find({'pinCode':req.body.pincode}, (err,doc)=>{
                if(err)
                {
                    res.json({success:false, message : 'Error While Finding the Franchise'+err})
                }
                else
                {
                    Franchise.update({'pinCode':req.body.pincode},{ $push : {'franchiseAdmins': req.body.email}},(error)=>{
                        if(error)
                        {
                            console.json({success:false, message : 'Error While Adding the Franchise Admin'+error})
                        }
                        else
                        {
                            res.json({success:true, message : 'Franchise Admin Added Successfully'})
                        }
                    })
                }
            })
            
        }
    })




});



/** Add Vendor Admin ROUTE
 * uri: /franchiseAdmin/addVendorAdmin
 * purpose: used to add Vendor Admin to the existing vendor in current franchise.
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





/** Edit Franchise ROUTE
 * uri: /franchiseAdmin/editFranchise/:pincode
 * purpose: used to edit current franchise.
 */

router.post('/editFranchise/:pincode', (req, res) => {
    
    Franchise.count({ pinCode: req.params.pincode }).then((cnt) => {
        if (cnt > 0) {
            Franchise.findOneAndUpdate({ pinCode: req.params.pincode }, { $set: req.body }).then((updatedDoc) => {
                res.send({ success: true, message: 'Franchise Details updated successfully.' });
            }).catch((err) => {
                console.log(err);
            });
        } else {
            res.send({ success: false, message: 'Franchise Not Found.' });
        }
    }).catch((err) => {

    });

 });


 

/** Edit Vendor ROUTE
 * uri: /franchiseAdmin/editVendor/:id
 * purpose: used to edit existing vendors
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



 /** Delete Vendor ROUTE
 * uri: /franchiseAdmin/deleteVendor/:id
 * purpose: used to delete existing vendor.
 */

router.post('/deleteVendor/:id', (req, res) => {
    
    Vendor.count({ _id: req.params.id }).then((cnt) => {
        if (cnt > 0) {
            
                Vendor.find({_id:req.params.id}).then((doc)=>{
                        doc[0].vendorAdmins.forEach(element => {
                            User.findOneAndDelete({email:element}).then(()=>{
                                console.log('User '+element+' Deleted')
                            }).catch((err)=>{
                                console.log('Error While removing '+element)
                            })
                        });
                 Vendor.findOneAndDelete({_id:req.params.id}).then(()=>{
                            res.send({success : true, message : 'Vendor Deleted Successfully'})
                 }).catch((err)=>{
                     res.send({success:false, message:'Error occured while deleting Vendor'})
                 })      

                    
                }).catch((err)=>{
                    res.send({success:false, message:'Error occured while finding Vendor'})
                })

        } else {
            res.send({ success: false, message: 'Vendor Not Found.' });
        }
    }).catch((err) => {

    });

 });

/** Get Vendor ID ROUTE
 * uri: /franchiseAdmin/getVendorIds
 * purpose: used to fetch existing vendors' Ids.
 */

router.get('/getVendorIds',(req,res)=>{
    ids=[]
    Vendor.find({}).then((doc)=>{
          
           doc.forEach(element => {
               ids.push(element.vendorId)
           });
           res.send(ids)

    }).catch((err)=>{
        res.send({Error : err})
    })
})

 

module.exports=router;