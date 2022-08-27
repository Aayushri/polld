var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var router = express.Router();
var db = require('../database');
var session = require('express-session');
var moment = require('moment');
var bcrypt = require('bcryptjs');
const { ids } = require('webpack');
// router.use(express.static("public")); 
// router.use(express.static(__dirname + '/public'));
router.use('/public', express.static('public'));
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




router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.use(session({
  secret: 'XASDASDA',
  resave: true,
  saveUninitialized: true
}));

var ssn;
/* GET home page. */
router.get('/login', function(req, res, next) {

  ssn = req.session; 
  if(ssn.email && ssn.userID ) {
    res.redirect('/wallet');
  } else {
    
      res.render('login', { title: 'Express' });
  
    
  }

  router.post('/login', async function(req, res, next) {

    //console.log(req.body);
  
    let email = req.body.email;
	  let password = req.body.password;
    // console.log(email);
  
    let query = `SELECT * from users where email='${email}'  limit 1`;
    //console.log(query);
     db.query(query,async function (err, response) {
      
      if (err) {
        res.send('error');
      } else {
        if (response.length > 0) {
          
          const validPass =  await bcrypt.compare(password, response[0].password);
          ssn = req.session;
          ssn.email=req.body.email;
          ssn.userID = response[0].id;
          
          if(validPass){
            res.send('success');
          }else{
            res.send('invalid');
          }
          
        } else {
          res.send('invalid');
        }
      }
      
    })
  });
  
  
});

router.get('/register', function(req, res, next) {

  ssn = req.session; 
  if(ssn.email && ssn.userID ) {
    res.redirect('/wallet');
  } else {
      res.render('register', { title: 'Express' });
    
  }
});

router.post('/register', async function(req, res, next) {
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
        res.send('invalid');
    }
    else {
        const query = "Insert into users (email,name,contact,password,created_date) values ('" + email + "','" + name + "','" + contact + "','" + password + "','" + date + "')";
        // console.log(query);
        db.query(query, function (err, result, fields) {
            if (err) throw err;
            else {
              res.send('success');  
            }

        });

    }

});

  
});


router.get('/admin/login', function(req, res, next) {

  ssn = req.session; 
  if(ssn.email && ssn.adminID ) {
    res.redirect('/admin/dashboard');
  } else {
    
    if(ssn.companyID){
      res.redirect('/company/dashboard');
    }else{
        res.render('admin/login', { title: 'Express' });
    }
    
  }

  
});

router.get('/', function(req, res, next) {
  ssn = req.session; 
  if(ssn.email ) {
    res.locals.is_login = 1;
  }else{
    res.locals.is_login = 0;
  }
  res.render('index', { title: 'Express' });
});

router.get('/logout',function(req,res){
  req.session.destroy(function(err) {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

router.post('/admin/login',  function(req, res, next) {

    //console.log(req.body);

    let email = req.body.email;
	  let password = req.body.password;
    // console.log(email);

    let query = `SELECT * from admin where email='${email}'  limit 1`;
     db.query(query,async function (err, response) {
      console.log(response);
			if (err) {
        res.send('error');
			} else {
				if (response.length > 0) {
          
          const validPass =  await bcrypt.compare(password, response[0].password);
          ssn = req.session;
          ssn.email=req.body.email;
          ssn.adminID = response[0].id;
          
          if(validPass){
            res.send('success');
          }else{
            res.send('invalid');
          }
          
				} else {
          res.send('invalid');
				}
			}
      
		})
});

router.get('/wallet', function(req, res, next) {
  ssn = req.session; 
  if(ssn.email && ssn.userID ) {
    var query = "SELECT * FROM transaction WHERE user_id = "+ssn.userID+" ORDER BY `transaction`.`id` DESC";
    db.query(query, function (err, response) {
      var query1 = "SELECT sum(amount) as wallet FROM transaction  WHERE user_id = "+ssn.userID+" GROUP BY `transaction`.`user_id` limit 1";
      var sum = 0;
      console.log(query1);
      db.query(query1, function (err, ret) {
        if(ret.length>0){
         sum =ret[0].wallet;
         res.render('wallet', { title: 'Express',records:response,moment:moment,sum:sum });
        }else{
          res.render('wallet', { title: 'Express',records:response,moment:moment,sum:sum });
        }
      });
      //res.render('wallet', { title: 'Express',records:response,moment:moment,sum:sum });
    });
  }else{
        res.redirect('login', { title: 'Express' });
  }
});


router.get('/admin/dashboard', function(req, res, next) {
  ssn = req.session; 
  if(ssn.email && ssn.adminID ) {
    res.render('admin/dashboard', { title: 'Express' });
  }else{
      res.render('/admin/login', { title: 'Express' }); 
  }
});

router.get('/admin/users', function(req, res, next) {
  ssn = req.session; 
  if(ssn.email && ssn.adminID ) {
    var query = "SELECT * FROM users ORDER BY `users`.`id` DESC";
    db.query(query, function (err, response) {
      res.render('admin/user', { title: 'Express',records:response,moment:moment });
    });
  }else{
      res.render('/admin/login', { title: 'Express' }); 
  }
});




router.post('/transferWallet', function(req, res, next) {
  var id = req.body.id;
  var amount = req.body.amount;
  var query = "UPDATE `users` SET `wallet`=`wallet`+"+amount+" WHERE `id` ="+id ;
  console.log(query);
  db.query(query, function (err, results) {
    if(err)
    {
      res.send("error");
      //throw err;
    }
    else
    {
      var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
      var query = "Insert INTO transaction (user_id,amount,description,created_at) VALUES ("+id+","+amount+",'Amount Transfered By Admin','"+date+"')";
      console.log(query);
          db.query(query, function (err, results) {
            if(err)
            {
              res.send("error");
              //throw err;
            }
            else
            {
                res.send("success");
            }
          });
    }
  });
  //res.render('admin/addcompany', { title: 'Express' });
});

router.get('/addcompany', function(req, res, next) {
  ssn = req.session; 
  if(ssn.email && ssn.adminID ){
    res.render('admin/addcompany', { title: 'Add Company' });
  }else{
    if(ssn.companyID){
      res.redirect('/company/dashboard');
    }else{
        res.render('login', { title: 'Express' });
    }
  }
});

router.post('/deleteCompany', function(req, res, next) {
  var id = req.body.id;
  var query = "UPDATE `company` SET `is_delete`='1' WHERE `id` ='"+id+ "'" ;
  db.query(query, function (err, results) {
    if(err)
    {
      res.send("error");
      //throw err;
    }
    else
    {
      res.send("success");
    }
  });
  //res.render('admin/addcompany', { title: 'Express' });
});


router.post('/checkCompany',function(req,resp){
  company_name = req.body.company_name;
  console.log(company_name);

  var sql = "SELECT id FROM company where is_delete= 0 and name='"+company_name+"'";
  console.log(sql);
  db.query(sql, function (err, results) {
    if(err)
    {
      // throw err;
      resp.send('false');
    }
    else if(results.length > 0)
    {
      // console.log(results);
      resp.send('false');
    }
    else
    {
      resp.send('true');
    }
  });

});

router.post('/checkpassword',function(req,resp){

  ssn = req.session;
  var adminID =   ssn.adminID;
  var old_password = req.body.old_password;
  var sql = "SELECT password FROM admin where  id='"+adminID+"'";
  console.log(sql);
  db.query(sql,async function (err, results) {
    if(err)
    {
      resp.send('false');
    }
    else if(results.length > 0)
    {
      
      const validPass =  await bcrypt.compare(old_password, results[0].password);
      if(validPass){
        resp.send('true');
      }else{
        resp.send('false');
      }   
      
    }
    else
    {
      resp.send('false');
    }
  });

});

router.post('/checkCompanyName',function(req,resp){
  company_name = req.body.company_name;
  company_id = req.body.company_id;
  console.log(company_name);

  var sql = "SELECT id FROM company where is_delete= 0 and name ='"+company_name+"' and id !='"+company_id+"'";
  console.log(sql);
  db.query(sql, function (err, results) {
    if(err)
    {
      // throw err;
      resp.send('false');
    }
    else if(results.length > 0)
    {
      // console.log(results);
      resp.send('false');
    }
    else
    {
      resp.send('true');
    }
  });

});


router.get("/editCompany/:id",function(req,resp){

  var id =   req.params.id;
  var sql = "SELECT * FROM company where is_delete= 0 and id='"+id+"' limit 1 "  ;
  db.query(sql, function (err, results) {
  if(err)
  {
    throw err;
  }
  else
  {
    // console.log(results);
    resp.render('admin/editcompany', { title: 'Edit Company', row : results[0] });
  }

});  

  
});


router.post("/updateCompany",function(req,resp){
  
    var id = req.body.company_id;
    var name = req.body.company_name;
    var email = req.body.email;
    var contact = req.body.number;
    var address = req.body.address;
    var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    var query = "UPDATE `company` SET `name`='"+name+ "',`email`='"+email+ "',`contact`='"+contact+ "',`address`='"+address+ "',`update_date`='"+date+ "' WHERE `id` ='"+id+ "'" ;
    //console.log(query);
   db.query(query, function (err, results) {
      if(err)
      {
        throw err;
      }
      else
      {
        resp.send('success');
      }
    });
});


router.post("/addCompany",async function(req,resp){
  const salt = await bcrypt.genSalt(10);
  passwordhash = await bcrypt.hash(req.body.password, salt);
  
  var name = req.body.company_name;
  var email = req.body.email;
  var contact = req.body.number;
  var password = passwordhash;
  var address = req.body.address;
  var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  
  var sql = "Insert into company (name,email,password,contact,address,create_date) values ('"+name+ "','"+email+ "','"+password+ "','"+contact+ "','"+address+ "','"+date+ "')" ;
  db.query(sql, function (err, results) {
    if(err)
    {
        console.log(err);
    }
    else 
    {
      let threeChar =  name.substring(0,3).toUpperCase();
      let text2 = new Date().getFullYear();

      let mainId = text2+threeChar+results.insertId ;
      //.concat("", results.insertId);
      
        // console.log(results.insertId);
        var query = "UPDATE `company` SET `company_id`='"+mainId+ "' WHERE `id` ='"+results.insertId+ "'" ;
        console.log(query);
        db.query(query, function (errs, resul) {
          if(err)
          {
            resp.send('error');
          }
          else 
          {
            resp.send('success');
          }
        }); 
    }
  });

});


router.get("/changePassword",function(req,resp){
  ssn = req.session;
  var adminID =   ssn.adminID;
  if(adminID){
    resp.render('admin/changePassword', { title: 'Edit Company' });
  }
});

router.get("/forget_password", function(req,res){
  res.render('forget_password', { title: 'Forget Password' });  
});

router.get("/reset_password", function(req,res){
  res.render('reset_password', { title: 'Forget Password' });  
});

router.post('/forget_password',function(req,res,next){
  var email = req.body.email;
  //check user 
  var query = "SELECT * FROM users WHERE  email = '" + email + "'";
      //  console.log(query);
      db.query(query, function (err, result, fields) {
          if(result.length>0){
              // console.log('ok');
              var otp =  Math.floor(Math.random() * 99999);
              const mailOptions = {
                  from: 'Zebucoin globalhelpers22@gmail.com',
                  to: email,
                  subject: 'OTP for Password Reset Request',
                  html: '<h3>Dear User,</h3> <br> <h4>Your OTP for Password Reset is '+otp+' <h4>',
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
                          res.send('success');
                      }
                      else {
                        res.send('invalid');
                      }
                  });

              }
          });

          }else{
            res.send('invalid');
          }
      });
  

});

router.post('/reset_password', async function (req, res, next) {
  
  var otp = req.body.otp;

  const salt = await bcrypt.genSalt(10);
  let passwordhash = await bcrypt.hash(req.body.password, salt);

  //check user 
  var query = "SELECT * FROM users WHERE otp = '"+otp+"'";
      //console.log(query);
      db.query(query, function (err, result, fields) {
          if(result.length>0){
              //update Password
              var query = "update users SET password = '" + passwordhash + "' , otp=0 WHERE email = '"+result[0].email+"' ";
              db.query(query, function (err, result, fields) {
                  if (err) throw err;
                  else{
                      res.send('success');
                  }
              });

          }else{
              res.send('invalid');
          }
      });
});


router.post("/Passwordchange",async function(req,resp, next){
  const obj = JSON.parse(JSON.stringify(req.body));

  const salt = await bcrypt.genSalt(10);
  var password = await bcrypt.hash(obj.new_password, salt);
  ssn = req.session;
  var adminID =   ssn.adminID;
  var query = "UPDATE `admin` SET `password`='"+password+ "' WHERE `id` ='"+adminID+ "'" ;
  db.query(query, function (err, results) {
    if(err)
    {
      throw err;
    }
    else
    {
      resp.send('success');
    }
  });
});



module.exports = router;
