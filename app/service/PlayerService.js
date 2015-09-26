var Player = require("../model/schemas/PlayerSchema").Player;
var ObjectId = require("../model/schemas/PlayerSchema").ObjectId;
var __ = require("../constants");

var __get = function(condition, callback) {
    Player.findOne(condition, callback);
};

var getById = function(id, callback) {
    var condition = {};
    if (typeof id !== ObjectId) {
        id = ObjectId(id);
    }
    condition[__.MONGO_ID] = id;
    __get(condition, callback);
};

var getByGoogleId = function(googleId, callback) {
    __get({googleId: googleId}, callback);
};

var getByAlias = function(alias, callback) {
    __get({"alias": alias}, callback);
};

var getPlayers = function(callback) {
    Player.find(callback).sort({"ranking": -1})
};

var getPlayersBy = function(condition, callback) {
    Player.find(condition, callback);
};

var save = function(json, callback) {
    var player = new Player(json);
    player.save(callback);
};

module.exports = {
    getPlayers: getPlayers,
    getPlayersBy: getPlayersBy,
    getByAlias: getByAlias,
    getById: getById,
    getByGoogleId: getByGoogleId,
    save: save
};