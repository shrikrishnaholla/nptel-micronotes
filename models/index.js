/* Database module */
/* Schema 
 *
 * usn			: String
 * subject		: String
 * lec_no		: String
 * note_time	: String
 * language     : String
 * note_type	: String
 * content		: String
 * ext_links	: String
 * ratings      : Object
*/

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/micronotes');
var Schema = mongoose.Schema;

var MicroNoteSchema = new Schema({
	usn			: String,
	subject		: String,
	lec_no		: Number,
	note_time	: String,
    language    : String,
	note_type	: String,
	content		: String,
	ext_links	: String,
	datetime    : String,
   ratings     : [{
        usn : String,
        rating : Number
   }]
});

var CommentSchema = new Schema({
    author    : String,
    datetime  : String,
    parent_id : String,
    content   : String,
    emailid   : String
});

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

}
var MicroNote = mongoose.model('MicroNotes', MicroNoteSchema);
var Comment   = mongoose.model('Comments', CommentSchema);

exports.add_comment = function(entry, callback) {
    var newcomment = new Comment();
    console.log(entry);
    newcomment.author = entry.usn.toUpperCase();
    newcomment.emailid = entry.emailid;
    newcomment.parent_id = entry.p_id;
    newcomment.content = entry.content;
    newcomment.datetime = getDateTime();
    newcomment.save(callback);
}

exports.get_comments = function(params, callback) {
    if(typeof(params) === 'undefined') {
        params = {};
    }
    Comment.find(params, function(err, cmnts) {
        callback(err, cmnts);
    });
}

exports.is_rated = function(note_id, usn) {
    MicroNote.findById(note_id, function(err, note) {
        if(err) {
            return true;
        }
        else {
            for(var i=0; i < note.ratings.length; i++) {
                if (usn === note.ratings[i].usn) {
                    return true;
                }
            }
            return false;
        }
    });
}

exports.rate_note = function(note_id, usn, rating, callback) {
    MicroNote.findById(note_id, function(err, note) {
        if(err) {
            callback(err);
        }
        else {
            var usrrating = {
                usn : usn,
                rating:rating
            };
            note.ratings.push(usrrating);
            note.save(callback);
        }
    });
}


exports.create = function(entry, Callback) {
	var newnote = new MicroNote();
	newnote.usn = entry.usn.toUpperCase();
	newnote.subject = entry.subject.toUpperCase();
	newnote.lec_no = parseInt(entry.lec_no);
	newnote.note_time = entry.note_time.toUpperCase();
    newnote.language = entry.language.toUpperCase();
	newnote.note_type = entry.note_type.toUpperCase();
    if(newnote.note_type == "MCQ")
	newnote.content = entry.content + "\n@$#\n" + entry.option1 + ',' + entry.option2 + ',' + entry.option3 + ',' + entry.option4 ;
	else
    newnote.content = entry.content;
    newnote.ext_links = entry.ext_links.toUpperCase();
    newnote.ratings = [];
    newnote.datetime = getDateTime();
	newnote.save(Callback);
};

exports.retrieve = function(options, Callback) {
	if (typeof options === 'undefined') {
		options = {};
	}
	MicroNote.find(options).sort({lec_no:-1}).exec(function(err, docs) {
		Callback(err, docs);
	});
};
exports.sendlogin = function(enrty, Callback) {
    var email = enrty.email;
}

