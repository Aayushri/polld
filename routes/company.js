var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var router = express.Router();
var db = require('../database');
var session = require('express-session');
var moment = require('moment');
var bcrypt = require('bcryptjs');



router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.use(session({
    secret: 'XASDASDA',
    resave: true,
    saveUninitialized: true
  }));

/* GET users listing. */
router.get('/login', function(req, res, next) {
    ssn = req.session; 
    if(ssn.companyID) {
        res.redirect('/company/dashboard');
    } else {
        if(ssn.adminID){
            res.redirect('/dashboard');
          }else{
            res.render('company/login', { title: 'Express' });
          }
        
    }
});
router.post('/login', function(req, res, next) {
     //console.log(req.body);

     let email = req.body.email;
     var password = req.body.password;
   // console.log(email);
    let query = `SELECT * from company where email='${email}' and is_delete ='0'  limit 1`;
    db.query(query, async function (err, response) {
        if (err) {
            res.send('error');
        } else {
            if (response.length > 0) {
                const validPass =  await bcrypt.compare(password, response[0].password);
                ssn = req.session;
                ssn.email=req.body.email;
                ssn.companyID=response[0].id;
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
router.get('/logout',function(req,res){
    req.session.destroy(function(err) {
      if(err) {
        console.log(err);
      } else {
        res.redirect('/company/login');
      }
    });
});
  
router.get('/dashboard', function(req, res, next) {
    ssn = req.session; 
    if(ssn.companyID) {
        res.render('company/dashboard', { title: 'Express' });
    } else {
        res.redirect('/company/login');
    }
  
});
router.get('/category', function(req, res, next) {
    ssn = req.session; 
    if(ssn.companyID){
        let query = `SELECT * from category where company_id='${ssn.companyID}' and is_delete !='1' order by id desc`;
        db.query(query, function (err, response) {
            if (err) {
                res.send('error');
            } else {
                
                res.render('company/category', { title: 'Express',data:response,moment:moment });
            
            }
            
        })
    }  
});
router.get('/addcategory', function(req, res, next) {
    ssn = req.session; 
    if(ssn.companyID){
        res.render('company/addcategory', { title: 'Express' });
    }
});
router.post('/addcategory', function(req, res, next) {
    //console.log(req.body);
    ssn = req.session;
    let heading = req.body.heading;
    let description = req.body.description;
    let start_date = moment(req.body.start_date).format('Y-M-D h:s');
    let end_date = moment(req.body.end_date).format('Y-M-D h:s');
    let company_id = ssn.companyID;
    let date1 = new Date().toJSON().slice(0, 10)
    let date = moment(date1).format('Y-M-D h:s');

    let query = `INSERT INTO category (company_id, heading, description,start_date,end_date, create_date, update_date) VALUES ('${company_id}','${heading}','${description}','${start_date}','${end_date}','${date}','${date}');
   `;
    db.query(query, function (err, response) {
        console.log(response);
        if (err) {
            res.send('error');
        } else {
            res.send('success');
        }
    })
});
router.get('/editcategory/:id?', function(req, res, next) {
    id = req.params.id;
    
    if(id){
        let query = `SELECT * from category where id='${id}' limit 1`;
    
     db.query(query, function (err, response) {
        if (err) {
            res.send('error');
        } else {
      
            res.render('company/editcategory', { title: 'Express',data:response[0], moment: moment });
        }
     })
    }else{
        //res.render('./admin/addblogcategory', { title: 'Big Bull',data1:"" });
    }
});
router.post('/updatecategory', function(req, res, next) {
    //console.log(req.body);
    ssn = req.session;
    let heading = req.body.heading;
    let description = req.body.description;
    let start_date = moment(req.body.start_date).format('Y-M-D h:s');
    let end_date = moment(req.body.end_date).format('Y-M-D h:s');

    let id = req.body.id;
    let date1 = new Date().toJSON().slice(0, 10)
    let date = moment(date1).format('Y-M-D h:s');

    // console.log(email);A
    let query = `UPDATE category SET heading = '${heading}', description = '${description}', end_date = '${end_date}', start_date = '${start_date}', update_date = '${date}' WHERE id = '${id}'`;
    console.log(query);
    db.query(query, function (err, response) {
       console.log(response);
           if (err) {
               res.send('error');
           } else {
                res.send('success');
           }
    
    })
});
router.post('/deletecategory', function(req, res, next) {
    var id = req.body.id;
    var query = "UPDATE `category` SET `is_delete`='1' WHERE `id` ='"+id+ "'" ;
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
    //res.render('admin/addcompany', { title: 'Express' });
});
router.get('/question/:id?', function(req, res, next) {
    ssn = req.session; 
    var conpany_id = ssn.companyID;
    category_id = req.params.id;
    
    
    if(category_id){
        let query = `SELECT * from question_answera where company_id='${conpany_id}' and category_id='${category_id}' and is_delete !='1' order by id desc`;
        console.log(query);
        db.query(query, function (err, response) {
            if (err) {
                res.send('error');
            } else {
                
                res.render('company/question', { title: 'Express',data:response,moment:moment });
            
            }
            
        })
    }
});
router.get('/addquestion', function(req, res, next) {
    ssn = req.session;
    let query = `SELECT * from category where id='${ssn.companyID}'`;
    console.log(query);
    db.query(query, function (err, response) {
        if (err) {
            res.send('error');
        } else {
            res.render('company/addquestion', { title: 'Express',data:response });
        }
    })
  });
router.post('/addquestion', function(req, res, next) {
    console.log(req.body);
    ssn = req.session;
    let category_id = req.body.category_id;
    let question = req.body.question;
    let a = req.body.a;
    let b = req.body.b;
    let c = req.body.c;
    let d = req.body.d;

    let company_id = 1;
    let date = new Date().toJSON().slice(0, 10)

    let query = `INSERT INTO question_answera (company_id, category_id, question, a, b, c, d,create_date,update_date) VALUES ('${company_id}','${category_id}','${question}','${a}','${b}','${c}','${d}','${date}','${date}')`;
    db.query(query, function (err, response) {
        if (err) {
            res.send('error');
        } else {
            res.send('success');
        }
    })
});
router.get('/editquestion/:id?', function(req, res, next) {
    id = req.params.id;
    ssn = req.session;
    if(id){
        let query = `SELECT * from category where company_id='${ssn.companyID}'`;
        console.log(query);
        db.query(query, function (err, response) {
        if (err) {
            res.send('error');
        } else {
            let query2 = `SELECT * from question_answera where id='${id}' limit 1`;
            db.query(query2, function (error, ress) {
                if (error) {
                    res.send('error');
                } else {
                    res.render('company/editquestion', { title: 'Express', data:response, questiondetails:ress[0] });
                }
            })
        }
     })
    }else{
        //res.render('./admin/addblogcategory', { title: 'Big Bull',data1:"" });
    }
});
router.post('/updatequestion', function(req, res, next) {
    //console.log(req.body);
    ssn = req.session;
    let category_id = req.body.category_id;
    let question = req.body.question;
    let a = req.body.a;
    let b = req.body.b;
    let c = req.body.c;
    let d = req.body.d;
    let id = req.body.id;
    let companyID = ssn.companyID;
    let date = new Date().toJSON().slice(0, 10)
    // console.log(email);A
    let query = `UPDATE question_answera SET company_id = '${companyID}', category_id = '${category_id}', question = '${question}',a ='${a}',b ='${b}',c ='${c}',d ='${d}',update_date='${date}' WHERE id = '${id}'`;
    
    db.query(query, function (err, response) {
        if (err) {
            res.send('error');
        } else {
            res.send('success');
        }
    })
});
router.post('/deletequestion', function(req, res, next) {
    var id = req.body.id;
    var query = "UPDATE `question_answera` SET `is_delete`='1' WHERE `id` ='"+id+ "'" ;
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
    //res.render('admin/addcompany', { title: 'Express' });
});
router.get('/enquiry/', function(req, res, next) {
    ssn = req.session;
    var conpany_id = ssn.companyID;
    if(conpany_id){
        let query = `SELECT * from enquiry INNER JOIN company ON company.id=enquiry.user_id where enquiry.user_id='${conpany_id}'`;
        console.log(query);
        db.query(query, function (err, response) {
        if (err) {
            res.send('error');
        } else {
            res.render('company/enquiry', { title: 'Express',data:response });
            
        }
     })
    }else{
        //res.render('./admin/addblogcategory', { title: 'Big Bull',data1:"" });
    }
});

module.exports = router;
