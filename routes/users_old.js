var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');

var router = express.Router();
var db = require('../database');

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
  res.send('login');
});



/* GET categorys listing. */
router.post('/categorys', function (req, res, next) {
  var company_id = req.body.company_id;
  // console.log('ok');
  var query = "SELECT * FROM category where company_id= '" + company_id + "' and is_delete ='0' ORDER BY `start_date` DESC";
  console.log(query);
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
router.post('/categorys_questions', function (req, res, next) {
  var category_id = req.body.category_id;
  // console.log('ok');
  var query = "SELECT `id`, `question`, `a`, `b`, `c`, `d` FROM question_answers where category_id= '" + category_id + "' and is_delete ='0' ORDER BY `id` DESC";
  console.log(query);
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
      console.log(query);
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
  // console.log('ok');
  var query = "SELECT `id`, `name`, `email`,`contact` FROM users where email= '" + email + "'";
  // console.log(query);
  db.query(query, async function (err, result, fields) {
    if (err) throw err;
    if (result.length > 0) {
      const validPass =  await bcrypt.compare(password, response[0].password);
      
      if(validPass){
        res.json({
          error: "false",
          message: "User login successfully",
          data: result,
        });
      }else{
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
    console.log('result',result);
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


/ GET conpany code. /
router.post('/check_company_code', function(req, res, next) {
  var company_id = req.body.company_id;
  // console.log('ok');
  var query = "SELECT id FROM company where company_id= '"+company_id+ "' and is_delete ='0' "  ;
  console.log(query);
  db.query(query, function (err, result, fields) {
    if (err) throw err;
    if(result.length > 0)
    {
      res.json({
        error: "false",
        message: "Company Id found",
        data: result[0],
      });
    }
    else
    {
      res.json({
        error: "True",
        message: "No record found",
        data: "",
      });
    }
});

});

module.exports = router;
