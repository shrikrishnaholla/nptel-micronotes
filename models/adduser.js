var mysql      = require('mysql');
var crypto = require('crypto');
var mailsender = require('./sendmail.js');

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

var salt = 'F%^$heFTY#r4y&^#@T%VVgu^T&*yh7tw78Tyug76R&^FGYUt76t%^fh';

function md5(s) {
    
    var hash = crypto.createHash('md5').update(s).digest('hex');
    return hash;
}

function makepass(length) {
    
    if (typeof(length)===undefined){
        length = Math.floor((1+Math.random())*8);
    }
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length ; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function sendmail(details, pass) {
    if (typeof(details) !== 'object') {
        console.log('Error details cannot be '+details);
    }
    var data = 'Hi '+details.name+',\nYour password for micronotes account is :'+pass;
    data += '\nYour username is :'+details.usn;
    mailsender.send({data:data, id:details.emailid});
}

exports.add = function (details , callback) {
    
    //Generate random string for password
    rawpass = makepass();
    
    //salt and hash the password for storing in DB
    pass = md5(rawpass+salt);
    sendmail(details, rawpass);
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