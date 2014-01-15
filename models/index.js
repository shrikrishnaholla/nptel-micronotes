/* Database module */
/* Schema 
 *
 * usn			: String
 * subject		: String
 * lec_no		: String
 * note_time	: String
 * note_type	: String
 * content		: String
 * ext_links	: String
*/

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/micronotes');
var Schema = mongoose.Schema;

var MicroNoteSchema = new Schema({
	usn			: String,
	subject		: String,
	lec_no		: String,
	note_time	: String,
	note_type	: String,
	content		: String,
	ext_links	: String
});

var MicroNote = mongoose.model('MicroNotes', MicroNoteSchema);

exports.create = function(entry, Callback) {
	var newnote = new MicroNote();
	newnote.usn = entry.usn;
	newnote.subject = entry.subject;
	newnote.lec_no = entry.lec_no;
	newnote.note_time = entry.note_time;
	newnote.note_type = entry.note_type;
	newnote.content = entry.content;
	newnote.ext_links = entry.ext_links;

	newnote.save(Callback);
};

exports.retrieve = function(options, Callback) {
	if (typeof options === 'undefined') {
		options = {};
	};
	MicroNote.find(options, function(err, docs) {
		Callback(err, docs);
	});
};

