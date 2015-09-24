var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playerSchema = new Schema({
    username: String,
    firstName: String,
    lastName: String,
    alias: String,
    email: String,
    image: String,
    lastAccess: { type: Date, default: Date.now },
    ranking: {type: Number, default: 1500},
    previousRanking: Number,
    rankingHistory: {type: Array},
    googleId: {type: String, required: true},
    admin: {type: Boolean, default: false}
});

var tournamentSchema = new Schema({
    name: {type: String, required: true},
    creationDate: { type: Date, default: Date.now },
    current: {type: Boolean, default: false},
    config: {
        phases: [String],
        defaultPhase: String,
        phasesWithStandings: [String],
        standingsModel: String
    },
    winner: {type: Schema.Types.ObjectId, ref: 'User', default: null},
    second: {type: Schema.Types.ObjectId, ref: 'User', default: null},
    third: {type: Schema.Types.ObjectId, ref: 'User', default: null}
});

exports.Player = mongoose.model("Player", playerSchema);
exports.Tournament = mongoose.model("Tournament", tournamentSchema);
exports.ObjectId = mongoose.Types.ObjectId;

