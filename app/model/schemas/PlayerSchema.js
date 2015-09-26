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

exports.Player = mongoose.model("Player", playerSchema);
exports.ObjectId = mongoose.Types.ObjectId;