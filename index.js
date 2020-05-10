var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');

const jwt = require('jsonwebtoken');

const crypto = require('crypto').randomBytes(256).toString('hex');


const {User} = require('./models/users');
const {Customer} = require('./models/customer')

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

var port = process.env.PORT || 3000;

//split this file into seperate files..

// create db config file.

app.listen(port,()=>{
    console.log("Server Started at Port "+port);
})


mongoose.connect('mongodb://localhost:27017/GrocerySOS',{ useUnifiedTopology: true, useNewUrlParser : true },(err)=>{
    if(!err)
    {
        console.log('Database Connected !!');
    }
    else
    {
        console.log("Error in Database Connection "+err);
    }
});


// Cros headers middleware
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Request-With, x-access-token, x-refresh-token, Content-Type, Accept, _id");
    res.header("Access-Control-Expose-Headers", "x-access-token, x-refresh-token");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});


/** USER LOGIN
 * uri: /user/login
 * req.body: {
 *      email,
 *      password
 * }
 * res.body {
 *      success,
 *      message
 * }
 * purpose: used to verify and login customer / vendor / fadmin.
 */

app.post('/user/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ 'email': email }).then((userDoc) => {
        if (userDoc) {
            if (userDoc.password === password) {
                const token = jwt.sign({userId:userDoc._id}, crypto, {expiresIn : '24h'});
                res.send({
                    success: true,
                    message: 'User Logged in successfully.',
                    token : token, 
                    user : {email :userDoc.email},
                    role: userDoc.role
                });
            } else {
                res.send({
                    success: false,
                    message: 'Incorrect password. please enter valid password.',
                    reason: 'password'
                });
            }
        } else {
            res.send({
                success: false,
                message: 'There is no user found associated with the given email id ' + email + '.',
                reason: 'email'
            });
        }
    }).catch((err) => {
        console.log(err);
    })

 });







/** USER REGISTER
 * uri: /user/register
 * req.body: {
 *      fname,
 *      lname[optional],
 *      whatsapp,
 *      email,
 *      password
 * }
 * res.body {
 *      success,
 *      message
 * }
 * purpose: used to register new customer / vendor / fadmin.
 */

 app.post('/user/register', (req, res) => {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const whatsApp = req.body.whatsapp;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;

  

    User.findOne({ 'email': email }).then((userDoc) => {
        if (userDoc) {
            res.send({ 
                success: false,
                message: 'Given Mail id ' + email + ' is already associated with another account.' 
                });
        } else {

            if(role === 'Customer')
            {
                let customer = new Customer({
                    customerId:req.body.email,
                    bucket : []
                })
                customer.save();
            }

            const newUser = new User({
                fname,
                lname,
                email,
                password,
                role,
                contact: [{
                    whatsApp
                }]
            });

            newUser.save().then(() => {
                res.send({
                    success: true,
                    message: 'User register successfully.'
                });
            }).catch((err) => {
                console.log(err);
            });
        }
    }).catch((err) => {
        console.log(err);
    });

 });



//for customer
const customerRoutes = require('./routes/customerRoutes');
app.use('/customer',customerRoutes);

//for superAdmin
const superAdminRoutes = require('./routes/superAdminRoutes');
app.use('/superAdmin',superAdminRoutes);

//for franchiseAdmin
const franchiseAdminRoutes = require('./routes/franchiseAdminRoutes');
app.use('/franchiseAdmin',franchiseAdminRoutes);

//for vendorAdmin
const vendorAdminRoutes = require('./routes/vendorAdminRoutes');
app.use('/vendorAdmin',vendorAdminRoutes);




