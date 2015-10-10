var service = require("../service/TournamentService");
var _ = require("underscore");
var __ = require("../constants");
var matchService = require("./MatchService");

var createMatchFromCSV = function(matchesCSV) {
    var array = matchesCSV.split("\n").map(function(line) { return line.split(",").map(function(cell) { return cell.trim() }); });
    return createMatchFromArray(array)
};

var createMatchFromArray = function(matchesArray) {
    _.each(matchesArray, function(matchArray) {
        if (matchArray.length != 11) {
            throw new Error("invalid array length");
        }
        var match = {"home": {}, "away": {}};
        match.home.player = matchArray[0];
        match.home.partner = matchArray[1];
        match.home.team = matchArray[2];
        match.away.player = matchArray[3];
        match.away.partner = matchArray[4];
        match.away.team = matchArray[5];
        match.home.goals = parseInt(matchArray[6]);
        match.away.goals = parseInt(matchArray[7]);
        match.date = new Date(matchArray[8]);
        var tournamentName = matchArray[9];
        match.phase = matchArray[10];
        service.getTournament({"name": tournamentName}, function(err, tournament) {
            if (err) {
                console.error(err);
                return;
            }
            match.tournament = tournament._id;
            saveMatch(match);
        })
        
    });
};

var generateMatches = function(model, secondRound) {
    var tournamentName = model.tournamentName;
    service.getTournament({"name": tournamentName}, function(err, tournament) {
        if (err) {
            console.error(err);
            return;
        }
        _.each(model.groups, function(group) {
            var createMatches = function(home, away) {
                var length = group.teams.length;
                var matches = [];
                for (var i = length-1; i >= 0; i--) {
                    for (var j = 1; j < i+1; j++) {
                        var match = {"home": {}, "away": {}};
                        match.tournament = tournament._id;
                        match.phase = group.name;
                        match[home].player = group.teams[i].player;
                        match[home].partner = group.teams[i].partner;
                        match[home].team = group.teams[i].team;
                        match[away].player = group.teams[i - j].player;
                        match[away].partner = group.teams[i - j].partner;
                        match[away].team = group.teams[i - j].team;
                        console.log(match.home.player + " & " + match.home.partner + " vs " + match.away.player + " & " + match.away.partner);
                        matches.push(match);
                    }
                }
                _.each(matches, function(match) {
                    saveMatch(match);
                })
            };
            createMatches(__.HOME, __.AWAY);
            if (secondRound) {
                createMatches( __.AWAY, __.HOME);
            }
        });
    })
};

var saveMatch = function(match) {
    matchService.save(match, function(err, match) {
        if (err) console.error(err);
        console.log("created");
    })
};

module.exports = {
    createMatchFromCSV: createMatchFromCSV,
    generate: generateMatches
};