var __ = require("../constants");
var matchService = require("./MatchService");
var _ = require("underscore");
var statsCollector = require("./StatCollector");
var stats = {};

var playerStatistics = function(alias) {
    return stats[alias];
};

var allPlayerStatistics = function() {
    return stats;
};

var updateForPlayer = function(playersArray) {
    _.each(playersArray, function(alias) {
        stats[alias] = statsCollector.createBasicModel(); //force recalculation
    });
    //FIXME: I can ask only for the matches of each player.
    getAllMatches(function(matches) {
        _.each(matches, function(match) {
            __collectBasicStat(match, function(alias) {
                return playersArray.indexOf(alias) != -1;
            });
        })
    })
};

var getAllMatches = function (callback) {
    matchService.getPlayedMatches(function(err, matches) {
        if (err) {
            console.log(err);
        } else {
            callback.call(this, matches);
        }
    });
};


var __verify = function(alias) {
    if (alias && !stats[alias]) {
        stats[alias] = statsCollector.createBasicModel();
    }
};

var __collectBasicStat = function(match, playerFilter) {
    
    if (!playerFilter) playerFilter = function() {return true};

    var collectForTeam = function(players, type) {
        _.each(players, function(player) {
            if (playerFilter(player) && player) {
                __verify(player);
				var stat = stats[player];
                statsCollector.addMatch(stat, match, type);
                statsCollector.addGoals(stat, match, type);
                statsCollector.addCards(stat, match.getYellowCards(type), "yellow");
                statsCollector.addCards(stat, match.getRedCards(type), "red");
            }
        });
    };
    
    collectForTeam(match.getPlayers(__.HOME), __.HOME);
    collectForTeam(match.getPlayers(__.AWAY), __.AWAY);
};

// initialize
getAllMatches(function(matches) {
    _.each(matches, function(match) {
        __collectBasicStat(match);
    });
});

module.exports = {
    playerStatistics: playerStatistics,
    allPlayerStatistics: allPlayerStatistics, 
    updateForPlayer: updateForPlayer
};
