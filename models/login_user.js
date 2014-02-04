var salt = 'F%^$heFTY#r4y&^#@T%VVgu^T&*yh7tw78Tyug76R&^FGYUt76t%^fh';

function md5(s) {
    
    var hash = crypto.createHash('md5').update(s).digest('hex');
    return hash;
}
exports.login = function(details, callback) {
    callback({'failed':true});
}