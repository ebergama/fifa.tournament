var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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

exports.Tournament = mongoose.model("Tournament", tournamentSchema);
exports.ObjectId = mongoose.Types.ObjectId;