var salt = 'F%^$heFTY#r4y&^#@T%VVgu^T&*yh7tw78Tyug76R&^FGYUt76t%^fh';

function md5(s) {
    
    var hash = crypto.createHash('md5').update(s).digest('hex');
    return hash;
}
exports.login = function(req, callback) {
    req.session.user = {name:'Srinidhi', asd:'sdfg'};
    req.session.isLoggedin = true;
    callback();
    //callback({'failed':true});
}