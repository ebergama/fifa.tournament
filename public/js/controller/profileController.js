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

    $scope.initChart = function() {
        var $chart = $('#chart2');
        var points = _.map(_.pluck($scope.history, 'ranking'), parseFloat);
        var opts = {
            chart: {
                type: 'line',
                zoomType: 'x',
                panning: true,
                panKey: 'shift'
            },
            title: {
                text: 'Historial ranking'
            },
            xAxis: {
                title: {
                    text: 'Fecha'
                }
            },
            yAxis: {
                title: {
                    text: 'Ranking'
                }
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true,
                        formatter: function () {
                            var n = parseInt(10 * (points[this.x] - (points[this.x - 1] || 0))) / 10;
                            if (n >= 10) n = parseInt(n);
                            return "<span style='color: " + ((n>0)?"green":"red") + "; font-size: 8px; font-weight: normal'>" + n + "</span>";
                        },
                        useHTML: true,
                        padding: 10
                    }
                }
            },
            series: [{
                name: $scope.thePlayer.alias,
                data: points
            }]
        };

        $chart.highcharts(opts);
        console.log("done");
    };
    $scope.initChartDeprecated = function() {
        //debugger;
        var $chart = $('#chart');
        $chart.width(30 * $scope.history.length).height(350);
        
        var ctx = $chart[0].getContext("2d");
        var points = _.pluck($scope.history, 'ranking');
        //points = points.map(function(p) { return [1,p]; });
        var labels = _.map($scope.history, function(h) { return new Date(h.date).getMonth() + "/" + new Date(h.date).getDate(); });
        points.reverse();
        labels.reverse();
        var data = {
            labels: labels,
            datasets: [
                {
                    label: "Ranking",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: points
                }/*,
                {
                    label: "My Second dataset",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: [28, 48, 40, 19, 86, 27, 90]
                }*/
            ]
            
        };
        var opts = {
            pointHitDetectionRadius: 8,
        };
        
        var myNewChart = new Chart(ctx).Line(data, opts);
        
    }

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
