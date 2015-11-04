controllers.controller("profileController", ["$scope", "$location", "player", "matchesForPlayer", "playerStats", "playersData", "feeling", function($scope, $location, player, matchesForPlayer, playerStats, playersData, feeling) {

    $scope.tabs = ["home", "stats", "history", "feeling"];
    $scope.selectedTab = "home";
    
    player.image = player.image.substring(0, player.image.lastIndexOf('?'));
    $scope.thePlayer = player;
    $scope.matchesForPlayer = matchesForPlayer;

    $scope.playersMap = _.indexBy(playersData, function(player) {return player.alias});

    var indexedMatches = _.indexBy(matchesForPlayer, '_id');
    $scope.stats = playerStats;
    $scope.history = _.map(player.rankingHistory || [], function(h) {
        h.match = indexedMatches[h.match];
        //FIXME: class handling shouldn't be here, duplicated
        var setResultsClass = function(match) {
            if (match.home.goals == -1 && match.away.goals == -1) {
                match.clazz = "notPlayed";
            } else {
                var homeGoals = match.home.goals;
                var awayGoals = match.away.goals;
                if (homeGoals == awayGoals) {
                    homeGoals += (match.home.penalties || 0);
                    awayGoals += (match.away.penalties || 0);
                }
                var playerIsHome = [match.home.player, match.home.partner].indexOf(player.alias) != -1;
                if (homeGoals > awayGoals) {
                    match.home.clazz = playerIsHome ? "won" : "";
                    match.away.clazz = playerIsHome ? "" : "lost";
                } else if (homeGoals < awayGoals) {
                    match.home.clazz = playerIsHome ? "lost" : "";
                    match.away.clazz = playerIsHome ? "" : "won";
                } else {
                    match.home.clazz = "";
                    match.away.clazz = "";
                }
            }
        };
        setResultsClass(h.match);
        return h;
    });

    $scope.getPicture = function(alias) {
        var player = $scope.playersMap[alias];
        return player ? player.image : null;
    };


    $scope.goTo = function(player) { $location.path('/profile/' + player); };
    
    $scope.selectTab = function(tab) { $scope.selectedTab = tab; };
    
    $scope.getTabName = function(tab) {
        switch (tab) {
            case "home": return "Home";
            case "stats": return "Estadisticas";
            case "history": return "Historial";
            case "feeling": return "Feeling";
        }
    };

	/*-- Feeling --*/
	var feelingStats = [
		{name: "Played", calc: "myFeeling.matches.played"},
		{name: "Won avg", calc: "myFeeling.matches.won/myFeeling.matches.played"},
		{name: "Lost avg", calc: "myFeeling.matches.lost/myFeeling.matches.played"},
		{name: "Tied avg", calc: "myFeeling.matches.tied/myFeeling.matches.played"},
		{name: "Scored  goals avg", calc: "myFeeling.goals.scored/myFeeling.matches.played"},
		{name: "Received goals avg", calc: "myFeeling.goals.received/myFeeling.matches.played"},
		{name: "Yellow cards avg", calc: "myFeeling.cards.yellow.count/myFeeling.cards.red.matches"},
		{name: "Red cards avg", calc: "myFeeling.cards.red.count/myFeeling.cards.red.matches"}
	];
    $scope.feeling = {};
    $scope.feeling[""] = _.map(feelingStats, function(stat) {return stat.name});

	_.each(feeling, function(myFeeling, partner) {
		if($scope.playersMap[partner] && $scope.playersMap[partner].active !== false) {
			_.each(feelingStats, function(stat) {
				$scope.feeling[partner] = $scope.feeling[partner] || [];
				var model = {
					name: stat.name,
					value: (eval(stat.calc).toFixed(2))
				};
				if (isNaN(model.value)) {
					model.value = "-";
				}
				$scope.feeling[partner].push(model);
			});
		}
    });
}])/*.filter("orderByStat", function() {
	return function(object, statCriteria) {
		var desiredStats = [];
		_.each(object, function(stats, partner) {
			if (partner != "") {
				_.each(stats, function(stat) {
					if (stat.name == statCriteria) {
						var copy = angular.copy(stat);
						copy.partner = partner;
						desiredStats.push(copy);
					}
				});
			}
		});
		var sorteredPlayers = _.union([""], _.map(
			_.sortBy(desiredStats, function(stat) {return -stat.value}),
			function(item) {
				return item.partner;
			}
		));
		var result = {};
		_.each(sorteredPlayers, function(player) {
			result[player] = object[player];
		});
		return result;
	}
})*/;
