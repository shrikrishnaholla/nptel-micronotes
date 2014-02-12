
/*
 * GET home page.
 */

var subject_list    = require('../subjects');
var models          = require('../models');
var adduser         = require('../models/adduser');
var login_user      = require('../models/login_user'); 

exports.index = function(req, res){
    //console.log(req.session);
    if (req.session.isLoggedin === 1 && typeof(req.session.user) !== 'undefined') {
        res.redirect('/home');
    }
    else res.render('index');
};

exports.create_account = function (req, res) {
    res.render('create_account');
};

exports.send_login = function (req, res) {
    adduser.add(req.body, function(err) {
        if(err){
            res.send(err);
        }
        else {
            res.redirect('/?just_registered=1');
        }
    });
};

exports.home = function(req, res) {
    //console.log(req.session);
    if (req.session.isLoggedin === 1 && typeof(req.session.user) !== 'undefined') {
        models.retrieve({}, function(error, notes) {
            if (error) {
                res.send(500);
            }
            else {
                res.render('notes',{user:req.session.user, notes: notes});
            }
        });
    }
    else {
        res.redirect('/?loggedin=0');
    }
}

exports.add_comment = function(req, res) {
    if (req.session.isLoggedin === 1 && typeof(req.session.user) !== 'undefined') {
        models.add_comment(req.body, function(err) {
           if(err) {
               res.send('Error occured');
           } 
           else {
               // res.redirect('/view_note?_id='+req.body.p_id);
               res.end();
           }
        });
    }
    
    else {
        res.redirect('/?loggedin=0');
    }
}

exports.view_note = function(req, res) {
    if (req.session.isLoggedin === 1 && typeof(req.session.user) !== 'undefined') {
        var pid = req.query['_id'];
        models.retrieve({'_id': pid}, function(err, note) {
            if (err) {
                res.send(500);
            }
            
            else {
                console.log(note);
                models.get_comments({'parent_id': pid}, function(err, cmnts) {
                    if(err) {
                        res.send(500);
                    }
                    else {
                        res.render('view_note', {user:req.session.user, note:note, comments:cmnts});
                    }
                });
            }
        });
    }
    else {
        res.redirect('/?loggedin=0');
    }
}
exports.login = function(req, res) {
    login_user.login(req, function(err) {
       console.log(err);
       console.log(req.session);
       if(err) {
           res.redirect('/?ntries=1');
       } 
       else {
           res.redirect('/home');
       }
    });
};

exports.note_submit = function(req, res) {

  if (req.session.isLoggedin === 1 && typeof(req.session.user) !== 'undefined') {
      models.create(req.body, function(err) {
          if (err) {
              res.setHeader('Content-Type', 'text/plain');
            res.end("Oops! There was an error submitting your note. Please try again<br><a href='/home'>Go back</a>");
          } else {
              res.setHeader('Content-Type', 'text/plain');
            res.end("Your note was Successfully saved! <br/> <a href='/home'>Go back</a>");
          }
      });
    }
    else {
        res.redirect('/?loggedin=0');
    }
};

exports.search = function(req, res) {
    if (req.session.isLoggedin === 1 && typeof(req.session.user) !== 'undefined') {
        var qryparams = {}
        for (var param in req.query)
        {
            if(typeof req.query[param] === 'string' && param !== 'content') {
                qryparams[param] = req.query[param].toUpperCase();
            }
            else {
                qryparams[param] = req.query[param];
            }
        }   
    	console.log(qryparams);
    	models.retrieve(qryparams, function(err, notes) {
    		if (err) {
    			res.end("No notes found for the requested user");
    		}
        res.render('notes',{user:req.session.user, notes: notes});
    	});
    } else {
        res.redirect('/?loggedin=0');
    }
};

exports.download_notes = function(req, res) {
    if (req.session.isLoggedin === 1 && typeof(req.session.user) !== 'undefined') {
        var ids = req.query['ids'];
        var results = [];
        ids.forEach(function(id) {
            models.retrieve({_id : id}, function(err, note) {
                results.push(note[0]);
                if (results.length  == ids.length) {
                    console.log('here');
                    res.setHeader('Content-disposition', 'attachment; filename=micronotes.json');
                    res.setHeader('Content-type', 'application/json');
                    res.charset = 'UTF-8';
                    res.write(JSON.stringify(results));
                    res.end();
                };
            });
        });
    } else {
        res.redirect('/?loggedin=0');
    }
};

exports.addnote = function(req, res) {
    if (req.session.isLoggedin === 1 && typeof(req.session.user) !== 'undefined') {
        res.render('addnote', { subjects: subject_list , user : req.session.user});
    } else {
        res.redirect('/?loggedin=0');
    }
};

exports.query = function(req, res) {
    if (req.session.isLoggedin === 1 && typeof(req.session.user) !== 'undefined') {
        res.render('query', { subjects: subject_list});
    } else {
        res.redirect('/?loggedin=0');
    }
};
