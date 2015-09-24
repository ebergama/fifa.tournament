var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var matchSchema = new Schema({
    date: Date,
    createdBy: {type: String, required: false},
    home: {
        player: {type: String, required: true},
        partner: {type: String, required: false},
        goals: {type: Number, default: -1},
        penalties: {type: Number, default: 0},
        redCards: {type: Number, default: -1},
        yellowCards: {type: Number, default: -1},
        team: String
    },
    away: {
        player: {type: String, required: true},
        partner: {type: String, required: false},
        goals: {type: Number, default: -1},
        penalties: {type: Number, default: 0},
        redCards: {type: Number, default: -1},
        yellowCards: {type: Number, default: -1},
        team: String
    },
    tournament: {type: Schema.Types.ObjectId, ref: "Tournament"},
    phase: {type: String, required: true}
});

// Virtual definitions
// All players array
matchSchema.virtual("allPlayers").get(function() {
    return [this.home.player, this.home.partner, this.away.player, this.away.partner];
});

// homeArray & awayArray
var __getPlayersFor = function(homeOrAway) {
    return function() {
        return [this[homeOrAway].player, this[homeOrAway].partner];
    };
};

matchSchema.virtual("homeArray").get(__getPlayersFor("home"));
matchSchema.virtual("awayArray").get(__getPlayersFor("away"));

// who won?
matchSchema.virtual("homeWon").get(function() {
    return this.home.goals > this.away.goals ? 1 : 0;
});
matchSchema.virtual("homeLost").get(function() {
    return this.home.goals < this.away.goals ? 1 : 0;
});
matchSchema.virtual("homeTied").get(function() {
    return this.home.goals === this.away.goals;
});

exports.Match = mongoose.model("Match", matchSchema);
