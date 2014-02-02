var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'resistant'
});

connection.connect(function(err) {
    // connected! (unless `err` is set)
});

connection.query('CREATE DATABASE IF NOT EXISTS nptel', function(err) {
    if (err) {
        console.log(err);
    }
});

connection.query('USE nptel', function(err) {
    if (err) {
        console.log(err);
    }
});

connection.query('CREATE TABLE IF NOT EXISTS users'+
    '(USN varchar(11) NOT NULL PRIMARY KEY,' +
    'emailid varchar(50) NOT NULL, ' +
    'password varchar(100) NOT NULL, '+
    'name varchar(50) NOT NULL)' , function(err) {
    if (err) {
        console.log(err);
    }
});

exports.add = function (details , callback) {
    pass = '123456'
    connection.query('SELECT `emailid` FROM users WHERE USN='+mysql.escape(details.usn.toUpperCase()), function(err, rows){
        if (rows.length === 1) {
            callback({'failed':'true', 'reason':'User already registered with emailid'+rows[0]});
        }
        else if (rows.length === 0){
            connection.query('INSERT INTO users VALUES (' + mysql.escape(details.usn) + ','+  mysql.escape(details.emailid) + 
                ','+ mysql.escape(pass)+ ','+ mysql.escape(details.name)+');' , 
                function(err){
                    if (err) {
                        callback({'failed':'true','reason':err});
                    }
                    else {
                        callback({'failed':false,'reason':''});
                    }
                });
        }
    });
};