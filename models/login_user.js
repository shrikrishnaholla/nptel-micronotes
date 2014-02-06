var mysql       = require('mysql');
var crypto      = require('crypto');
var salt        = 'F%^$heFTY#r4y&^#@T%VVgu^T&*yh7tw78Tyug76R&^FGYUt76t%^fh';

function md5(s) {
    
    var hash = crypto.createHash('md5').update(s).digest('hex');
    return hash;
}


var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'resistant'
});


connection.connect(function(err) {
    // connected! (unless `err` is set)
});

connection.query('USE nptel', function(err) {
    if (err) {
        console.log(err);
    }
});

exports.login = function(req, callback) {
    var usn = req.body.usn
     ,  passwd = req.body.password;
    var details;
    var flag = true;
    var gerr;
    connection.query('SELECT * FROM users WHERE USN='+mysql.escape(usn.toUpperCase()), function(err, rows) {
        if(err) {
            gerr = err;
        }
        else {
            var hashedpwd = md5(passwd+salt);
	    console.log(hashedpwd);
            if (rows && rows.length && rows.length === 1) {
		 console.log('asd');
                 if (rows[0].password === hashedpwd) {
		     console.log('dhgf');
                     req.session.isLoggedin = true;
                     req.session.user = {name:rows[0].name, usn:rows[0].usn};
                     flag = false;
                 }
                 else {
                     gerr = 'wrong password';
                 }
            }
            else {
                gerr = 'wrong creds';
            }
        }
    });
    if (flag){
        req.session.isLoggedin = true;
        callback(gerr);
    }
    else {
        req.session.isLoggedin = false;
        callback();
    }
    //callback({'failed':true});
}
