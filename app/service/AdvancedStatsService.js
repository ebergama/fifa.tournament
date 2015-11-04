var matchService = require("./MatchService");
var statsCollector = require("./StatCollector");
var _ = require("underscore");
var __ = require("../constants");

//FIXME: consider have a full model in memory.

var getFeelingForPartner = function(feelingMap, partner) {
	if (!feelingMap[partner]) {
		feelingMap[partner] = __createFeeling(partner); 
	}
	return feelingMap[partner];
};

var __createFeeling = function(partner) {
	var basicModel = statsCollector.createBasicModel();
	basicModel.partner = partner;
	return basicModel;
};

var lookForCondition = function(match, alias) {
	if (_.contains(match.getPlayers(__.HOME), alias)) {
		return __.HOME;
	} else if (_.contains(match.getPlayers(__.AWAY), alias)) {
		return __.AWAY;
	} else {
		console.error("PLAYER IS NOT HERE!!");
		return null;
	}
};

var lookForPartner = function(match, type, alias) {
	return _.filter(match.getPlayers(type), function(item) {return item != alias})[0];
};

var calculateFeeling = function(alias, callback) {
	var feelingMap = {};
	matchService.getForAlias(alias, function(err, matches) {
		_.each(matches, function(match) {
			if (match.getGoals(__.HOME) != -1 && match.getGoals(__.AWAY) != -1) {
				var homeOrAway = lookForCondition(match, alias);
				var partner = lookForPartner(match, homeOrAway, alias);
				if (partner) {
					var feeling = getFeelingForPartner(feelingMap, partner);
					statsCollector.addMatch(feeling, match, homeOrAway);
					statsCollector.addGoals(feeling, match, homeOrAway);
					statsCollector.addCards(feeling, match.getYellowCards(homeOrAway), 'yellow');
					statsCollector.addCards(feeling, match.getRedCards(homeOrAway), 'red');
				}
			}
		});
		callback.call(this, feelingMap);
	});
	
};

module.exports = {
	calculateFeeling: calculateFeeling
};