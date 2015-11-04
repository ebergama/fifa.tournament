var createBasicModel = function(){
	return {
		matches: { played: 0, won: 0, lost: 0, tied: 0 },
		goals: { received: 0, scored: 0 },
		cards: {
			red: { matches: 0, count: 0 },
			yellow: { matches: 0, count: 0 }
		}
	};
};

var addMatch = function(stat, match, type) {
	var matchesStat = stat.matches;
	matchesStat.played += 1;
	matchesStat.won += match.hasWon(type);
	matchesStat.lost += match.hasLost(type);
	matchesStat.tied += match.hasTied(type);
};

var addGoals = function(stat, match, type) {
	stat.goals.scored += match.getGoals(type);
	stat.goals.received += match.getGoals(match.inverse(type));
};

var addCards = function(stat, amount, type) {
	if (amount != -1) {
		stat.cards[type].count += amount;
		stat.cards[type].matches += 1;
	}
};

module.exports = {
	createBasicModel: createBasicModel,
	addMatch: addMatch,
	addGoals: addGoals,
	addCards: addCards
};