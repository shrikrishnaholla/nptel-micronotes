var nodemailer = require("nodemailer");

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "nptelmicronotes@gmail.com",
        pass: "PESITnptel"
    }
});


exports.send = function(params) {
    console.log(params)
    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: "NPTEL Micronotes ✔ <nptelmicronotes@gmail.com>", // sender address
        to: params.id, // list of receivers
        subject: "NPTEL Micronotes Account", // Subject line
        text: params.data, // plaintext body
        //html: "<b>Hello world ✔</b>" // html body
    }
    
    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }
    
        // if you don't want to use this transport object anymore, uncomment following line
        smtpTransport.close(); // shut down the connection pool, no more messages
    });
}