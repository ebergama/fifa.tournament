var Tournament = require("../model/schemas/TournamentSchema").Tournament;

var getTournaments = function(callback, sortOrder) {
    Tournament.find({}).sort({creationDate: sortOrder}).exec(callback);
};

var save = function(body, callback) {
    var tournament = new Tournament(body);
    tournament.save(callback);
};

var deleteByName = function(name, callback) {
    Tournament.findOneAndRemove({"name": name}, callback);
};

var getTournament = function(condition, callback, sortOrder) {
    Tournament.findOne(condition, callback).sort({creationDate: sortOrder == "desc" ? -1 : 1})
};

var update = function(name, body, callback) {
    Tournament.update({"name": name}, { $set: body }, callback);
};

module.exports = {
    getTournaments: getTournaments,
    getTournament: getTournament,
    save: save,
    delete: deleteByName,
    update: update
};