var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');

var router = express.Router();
var db = require('../database');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    type: "SMTP",
    host: "smtp.gmail.com",
    secure: true,
    auth: {
       
        user: 'globalhelpers22@gmail.com',
        pass: 'pcdnnkepxjinunan',
       

    }
  });

  

var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {

        //console.log(file);
        if (file.fieldname === 'enquiry') {
            cb(null, './public/enquiry/')
        }

    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })



/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('index');
});

router.get('/login',function (req,res,next){
    res.send('login');
});


/* GET categorys listing. */
router.post('/categorys', function (req, res, next) {
    var company_id = req.body.company_id;
    var query = "SELECT * FROM category where company_id= '" + company_id + "' and is_delete ='0' ORDER BY `start_date` ASC";
    // console.log(query);
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {
            res.json({
                error: "false",
                message: "Category List",
                data: result,
            });
        }
        else {
            res.json({
                error: "True",
                message: "No record found",
                data: "",
            });
        }
    });

});

/* GET categorys questions listing. */
router.post('/topic_questions', function (req, res, next) {
    var category_id = req.body.topic_id;
    var query = "SELECT `id`, `question`, `a`, `b`, `c`, `d` FROM question_answera where category_id= '" + category_id + "' and is_delete ='0' ORDER BY `id` DESC";
    // console.log(query);
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {
            res.json({
                error: "false",
                message: "Category questions List",
                data: result,
            });
        }
        else {
            res.json({
                error: "True",
                message: "No record found",
                data: "",
            });
        }
    });

});


/* GET register. */
router.post('/register', async function (req, res, next) {

    const salt = await bcrypt.genSalt(10);
    let passwordhash = await bcrypt.hash(req.body.password, salt);
    var email = req.body.email;
    var name = req.body.name;
    var contact = req.body.contact;
    var password = passwordhash;
    var date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    var selectquery = "SELECT `id` FROM users where email= '" + email + "'";

    db.query(selectquery, function (err, result, fields) {
        if (err) {
            throw err;
        }
        if (result.length > 0) {
            res.json({
                error: "true",
                message: "Email id already exist",
                data: "",
            });
        }
        else {
            const query = "Insert into users (email,name,contact,password,created_date) values ('" + email + "','" + name + "','" + contact + "','" + password + "','" + date + "')";
            // console.log(query);
            db.query(query, function (err, result, fields) {
                if (err) throw err;
                else {
                    res.json({
                        error: "false",
                        message: "Registration done successfully",
                        data: "",
                    });
                }

            });

        }

    });

});


/* GET user login. */
router.post('/user_login', function (req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    var query = "SELECT `id`, `name`,`password`, `email`,`contact` FROM users where email= '" + email + "'";
    // console.log(query);
    db.query(query, async function (err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {
            const validPass = await bcrypt.compare(password, result[0].password);

            if (validPass) {
                res.json({
                    error: "false",
                    message: "User login successfully",
                    data: result,
                });
            } else {
                res.json({
                    error: "True",
                    message: "Invalid details",
                    data: "",
                });
            }
        }
        else {
            res.json({
                error: "True",
                message: "Invalid details",
                data: "",
            });
        }
    });

});

router.post('/enquiry', upload.single('enquiry'), function (req, res, next) {
    var imageCode = JSON.stringify(req.file);
    var imageData = JSON.parse(imageCode);
    console.log(imageData.originalname);
    var Userdata = JSON.stringify(req.body);
    var userCode = JSON.parse(Userdata);
    var userId = req.body.userId;
    var title = req.body.title;
    var description = req.body.description;
    var date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const query = "Insert into enquiry (user_id,title,description,image,created_date) values ('" + userId + "','" + title + "','" + description + "','" + imageData.originalname + "','" + date + "')";
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        // console.log('result',result);
        if (result) {
            res.json({
                error: "false",
                message: "Enquiry submited successfully",
                data: '',
            });
        }
        else {
            res.json({
                error: "True",
                message: "something went worng",
                data: "",
            });
        }
    });
});


// / check company code. /
router.post('/check_company_code', function (req, res, next) {
    var company_id = req.body.company_id;
    // console.log('ok');
    var query = "SELECT id FROM company where company_id= '" + company_id + "' and is_delete ='0' ";
    //  console.log(query);
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {
            res.json({
                error: "false",
                message: "Company Id found",
                data: result[0],
            });
        }
        else {
            res.json({
                error: "True",
                message: "No record found",
                data: "",
            });
        }
    });

});


// enquiry add
router.post('/enquiry', upload.single('enquiry'), function (req, res, next) {
    var imageCode = JSON.stringify(req.file);
    var imageData = JSON.parse(imageCode);
    console.log(imageData.originalname);
    var Userdata = JSON.stringify(req.body);
    var userCode = JSON.parse(Userdata);
    var userId = req.body.userId;
    var title = req.body.title;
    var description = req.body.description;
    var date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const query = "Insert into enquiry (user_id,title,description,image,created_date) values ('" + userId + "','" + title + "','" + description + "','" + imageData.originalname + "','" + date + "')";
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        // console.log('result',result);
        if (result) {
            res.json({
                error: "false",
                message: "Enquiry submited successfully",
                data: '',
            });
        }
        else {
            res.json({
                error: "True",
                message: "something went worng",
                data: "",
            });
        }
    });
});


router.post('/send_otp', function (req, res, next) {
    var email = req.body.email;

    //check user 
    var query = "SELECT * FROM users WHERE  email = '" + email + "'";
        //  console.log(query);
        db.query(query, function (err, result, fields) {
            if(result.length>0){
        
                // console.log('ok');
                var otp =  Math.floor(Math.random() * 99999);


                const mailOptions = {
                    from: 'Polldesk globalhelpers22@gmail.com',
                    to: email,
                    subject: 'OTP for Contact details Verification', 
                    html: '<h3>Dear User,</h3> <br> <h4>Your OTP for Contact verification is '+otp+' <h4>',
                    text: 'Hello People!, Welcome to Bacancy!', // Plain text body
            };

            transporter.sendMail(mailOptions, function(err, info) {
                if (err) {
                    console.log(err)
                } else {
                    
                    var query = "UPDATE users SET otp= '" + otp + "' WHERE  email = '" + email + "'";
                    //  console.log(query);
                    db.query(query, function (err, result, fields) {
                        if (err) throw err;
                        if (result) {
                            res.json({
                                error: "false",
                                message: "OTP SENT SUCCESSFULLY ",
                                data: "",
                            });
                        }
                        else {
                            res.json({
                                error: "True",
                                message: "No record found",
                                data: "",
                            });
                        }
                    });

                }
            });

            }else{
                res.json({
                    error: "True",
                    message: "Email not exists",
                    data: "",
                });
            }
        });
    

});

router.post('/reset_password', async function (req, res, next) {
    var email = req.body.email;
    var otp = req.body.otp;

    const salt = await bcrypt.genSalt(10);
    let passwordhash = await bcrypt.hash(req.body.password, salt);

    //check user 
    var query = "SELECT * FROM users WHERE  email = '" + email + "' AND otp = '"+otp+"'";
        //console.log(query);
        db.query(query, function (err, result, fields) {
            if(result.length>0){
                //update Password
                var query = "update users SET password = '" + passwordhash + "' , otp=0 WHERE email = '"+email+"' ";
                db.query(query, function (err, result, fields) {
                    if (err) throw err;
                    else{
                        res.json({
                            error: "false",
                            message: "Password Reset Successfully..!!",
                            data: "",
                        });
                    }
                });

            }else{
                res.json({
                    error: "True",
                    message: "Record not found",
                    data: "",
                });
            }
        });
});


router.post('/topics', function (req, res, next) {
    var company_id = req.body.company_id;
    var date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    //check user 
    var query = "SELECT * FROM category WHERE  company_id = " + company_id + "  AND CAST(end_date as DATE) > '"+date+"'" ;
        //console.log(query);
        db.query(query, function (err, result, fields) {
            if(result.length>0){
             
                res.json({
                    error: "false",
                    message: "List Of Topics",
                    data: result,
                });
             
            }else{
                res.json({
                    error: "True",
                    message: "No Data found",
                    data: "",
                });
            }
        });
});

router.post('/user_topics', function (req, res, next) {
    var user_id = req.body.user_id;
    var date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    //check user 
    var query = "SELECT category.* FROM user_topics JOIN category ON category.id = user_topics.id WHERE  user_id = " + user_id + "" ;
        //console.log(query);
        db.query(query, function (err, result, fields) {
            if(result.length>0){
             
                res.json({
                    error: "false",
                    message: "List Of Topics",
                    data: result,
                });
             
            }else{
                res.json({
                    error: "True",
                    message: "No Data found",
                    data: "",
                });
            }
        });
});




module.exports = router;
