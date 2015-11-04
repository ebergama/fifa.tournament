var Match = require("../model/schemas/MatchSchema").Match;
var ObjectId = require("../model/schemas/MatchSchema").ObjectId;

var __getObjectId = function(id) {
    if (typeof id !== ObjectId) {
        return ObjectId(id);
    }
    return id;
};

var getMatches = function(callback) {
    Match.find().populate("tournament").exec(callback);
};

var save = function(matchJson, callback) {
    var match = new Match(matchJson);
    match.save(callback);
};

var update = function(_id, matchJson, callback) {
    var objectId = __getObjectId(_id);
    matchJson._id = objectId;
    Match.update({"_id": objectId}, {$set: matchJson}, callback);
};

var getForAlias = function(alias, callback) {
    Match.find({
        $or: [{"home.player": alias}, {"away.player": alias}, {"home.partner": alias}, {"away.partner": alias}]
    }).populate("tournament").exec(callback);
};

var getForTournament = function(tournamentId, callback) {
    Match.find({tournament: __getObjectId(tournamentId)}).populate("tournament").exec(callback);
};

var getPlayedMatches = function(callback, sort) {
    Match.find({
        $and: [ {"home.goals": {$gt: -1}}, {"away.goals": {$gt: -1}} ]
    }).populate("tournament").sort({"date": sort == "desc" ? -1 : 1}).exec(callback);
};

var remove = function(id, callback) {
	Match.remove({_id: __getObjectId(id)}, callback);
};

var getById = function(id, callback) {
	Match.findOne({_id: __getObjectId(id)}, callback);
};

module.exports = {
    getMatches: getMatches,
    getPlayedMatches: getPlayedMatches,
    getForAlias: getForAlias,
	getById: getById,
    getForTournament: getForTournament,
    save: save,
    update: update,
	remove: remove
};