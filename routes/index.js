
/*
 * GET home page.
 */

var subject_list = require('../subjects');
var models = require('../models');

exports.index = function(req, res){
  res.render('index', { subjects: subject_list });
};

exports.note_submit = function(req, res) {
	models.create(req.body, function(err) {
		if (err) {
			res.end("Oops! There was an error submitting your note. Please try again<br><a href='/'>Go back</a>");
		} else {
			res.end("Your note was Successfully saved!");
		}
	});
};

exports.search = function(req, res) {
	searchOpts = {};
	if(req.query.usn)
		searchOpts["usn"] = req.query.usn;
	models.retrieve(searchOpts, function(err, notes) {
		if (err) {
			res.end("No notes found for the requested user");
		};
		res.json(notes);
		res.end();
	});
};
