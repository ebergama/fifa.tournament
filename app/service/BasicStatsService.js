var __ = require("../constants");
var matchService = require("./MatchService");
var _ = require("underscore");
var players = {};

var playerStatistics = function(alias) {
    return players[alias];
};

var allPlayerStatistics = function() {
    return players;
};

var updateForPlayer = function(playersArray) {
    _.each(playersArray, function(alias) {
        players[alias] = __createBasicModel(); //force recalculation
    });
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

var __createBasicModel = function(){
    return {
        matches: { played: 0, won: 0, lost: 0, tied: 0 },
        goals: { received: 0, scored: 0 },
        cards: {
            red: { matches: 0, count: 0 },
            yellow: { matches: 0, count: 0 }
        }
    };
};

var __verify = function(alias) {
    if (alias && !players[alias]) {
        players[alias] = __createBasicModel();
    }
};

var __addPlayerMatch = function(alias, won, lost, tied) {
    var matchesStat = players[alias].matches;
    matchesStat.played += 1;
    matchesStat.won += won;
    matchesStat.lost += lost;
    matchesStat.tied += tied;
};

var __addPlayerGoals = function(alias, scored, received) {
    players[alias].goals.scored += scored;
    players[alias].goals.received += received;
};

var __addPlayerCards = function(alias, amount, type) {
    if (amount != -1) {
        players[alias].cards[type].count += amount;
        players[alias].cards[type].matches += 1;
    }
};

var __collectBasicStat = function(match, playerFilter) {
    
    if (!playerFilter) playerFilter = function() {return true};

    var collectForTeam = function(players, type) {
        _.each(players, function(player) {
            if (playerFilter(player) && player) {
                __verify(player);
                var won = type == __.HOME ? match.homeWon : match.homeLost;
                var lost = type == __.HOME ? match.homeLost : match.homeWon;
                __addPlayerMatch(player, won, lost, match.homeTied);
                var inverse = (type == __.HOME ? __.AWAY : __.HOME);
                __addPlayerGoals(player, match[type].goals, match[inverse].goals);
                __addPlayerCards(player, match[type].yellowCards, "yellow");
                __addPlayerCards(player, match[type].redCards, "red");
            }
        });
    };
    
    collectForTeam(match.homeArray, __.HOME);
    collectForTeam(match.awayArray, __.AWAY);
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
