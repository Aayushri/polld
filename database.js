const mysql = require('mysql');
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'zebucoin'
  });

db.connect(function(err) {
    if (err) {
        console.error('error connecting11111: ' + err.stack);
        return;
    }

    console.log('connected as italk_new ' + db.threadId);
});

module.exports = db;