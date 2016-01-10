var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;
var _ = require("underscore");
var __ = require("../../constants");

var matchSchema = new Schema({
    date: Date,
    createdBy: {type: String, required: false},
    home: {
        player: {type: String, required: true},
        partner: {type: String, required: false},
        goals: {type: Number, default: -1},
        penalties: {type: Number, default: 0},
        redCards: {type: Number, default: 0},
        yellowCards: {type: Number, default: 0},
        team: String
    },
    away: {
        player: {type: String, required: true},
        partner: {type: String, required: false},
        goals: {type: Number, default: -1},
        penalties: {type: Number, default: 0},
        redCards: {type: Number, default: 0},
        yellowCards: {type: Number, default: 0},
        team: String
    },
    tournament: {type: Schema.Types.ObjectId, ref: "Tournament"},
    phase: {type: String, required: true}
});

matchSchema.plugin(mongoosePaginate);


var Match = mongoose.model("Match", matchSchema);

Match.prototype.inverse = function(type) {
    switch (type) {
        case __.HOME: return __.AWAY;
        case __.AWAY: return __.HOME;
        default: throw new Error("invalid type: " + type);
    }
};

Match.prototype.getCreatedBy = function() { return this.createdBy; };

Match.prototype.getPhase = function() { return this.phase };

Match.prototype.getPlayers = function(type) {
    return [this[type].player, this[type].partner];
};

Match.prototype.getAllPlayers = function() {
    return _.union(this.getPlayers(__.HOME), this.getPlayers(__.AWAY))
};

Match.prototype.hasWon = function(type) {
    return this[type].goals > this[this.inverse(type)].goals;
};

Match.prototype.hasTied = function(type) {
    return this[type].goals == this[this.inverse(type)].goals;
};

Match.prototype.hasLost = function(type) {
    return this[type].goals < this[this.inverse(type)].goals;
};

Match.prototype.getGoals = function(type) { return this[type].goals; };

Match.prototype.getYellowCards = function(type) { return this[type].yellowCards; };

Match.prototype.getRedCards = function(type) { return this[type].redCards; };

exports.Match = Match;
exports.ObjectId = mongoose.Types.ObjectId;