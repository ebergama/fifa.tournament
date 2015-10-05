controllers.controller("statsController", ['$scope', 'allPlayerStats', 'playersData', function($scope, allPlayerStats, playersData) {

	var playersMap = _.indexBy(playersData, function(player) {
		return player.alias;
	});
	_.each(allPlayerStats, function(stat, player) {
		var deleteIfMatchesCountNotEnough = function(level1, level2) {
			if (stat[level1][level2].matches < 10) {
				stat[level1][level2].matches = 0;
				stat[level1][level2].count = 0;
			}
		};
		deleteIfMatchesCountNotEnough("cards", "red");
		deleteIfMatchesCountNotEnough("cards", "yellow");
	});
	
	var TemplateFactory = {
		count: 0,
		statTemplates: [],
		createStatTemplate: function(name, description, fnString, sortOrder) {
			sortOrder = sortOrder == 'asc' ? 1 : -1;
			TemplateFactory.count += 1;
			var template = {
				name: name,
				id: TemplateFactory.count,
				description: description,
				fnString: fnString,
				fnValue: function (stat) {
					return eval(fnString)
				},
				list: [],
				pushValue: function (name, stat) {
					var value = this.fnValue(stat);
					if (!isNaN(value) && value !== Infinity) {
						this.list.push({name: name, value: value});
					}
				},
				sortOrder: sortOrder
			};
			TemplateFactory.statTemplates.push(template);
			return template;
		}
	};
	
    $scope.stats = [];
	$scope.getPicture = function(alias) {
		var player = playersMap[alias];
		return player ? player.image : "";
	};
	$scope.addStatTemplate = function(name, description, fnString, sortOrder) {
		var statTemplate = TemplateFactory.createStatTemplate(name, description, fnString, sortOrder);
		_.each(allPlayerStats, function(stat, playerName) {
			var playerAttributes = playersMap[playerName];
			if (playerAttributes && playerAttributes.active !== false) {
				statTemplate.pushValue(playerName, stat);
			}
		});
		sortAndPush(statTemplate, statTemplate.sortOrder);
	};
	$scope.removeStat = function(id) {
		var index = _.findIndex($scope.stats, function (item) {
			return item.id == id;
		});
		$scope.stats.splice(index, 1);
	};

	function sortAndPush(stat, order) {
		order = order >=0 ? 1 : -1;
		stat.list = _.sortBy(stat.list, function (player) {
			return player.value ? order * player.value : 0;
		});
		$scope.stats = [stat].concat($scope.stats);
	}

	TemplateFactory.createStatTemplate("Pichichi", "Promedio de goles a favor", "stat.goals.scored / stat.matches.played");
	TemplateFactory.createStatTemplate("El goleado", "Promedio de goles en contra (desc)", "stat.goals.received / stat.matches.played");
	TemplateFactory.createStatTemplate("Valla menos vencida", "Promedio de goles en contra (asc)", "stat.goals.received / stat.matches.played", 'asc');
	TemplateFactory.createStatTemplate("Premio chenemigo", "Promedio de tarjetas rojas", "stat.cards.red.count / stat.cards.red.matches");
	TemplateFactory.createStatTemplate("Premio chenemiguito", "Promedio de tarjetas amarillas", "stat.cards.yellow.count / stat.cards.yellow.matches");
	TemplateFactory.createStatTemplate("Terminator", "Promedio de: rojas + amarillas/2", "(stat.cards.red.count / stat.cards.red.matches) + (0.5*stat.cards.yellow.count / stat.cards.yellow.matches) ");
	TemplateFactory.createStatTemplate("Fair Play", "Promedio de: rojas + amarillas/2 (asc)", "(stat.cards.red.count / stat.cards.red.matches) + (0.5*stat.cards.yellow.count / stat.cards.yellow.matches)", 'asc');
	TemplateFactory.createStatTemplate("Vicio yo?", "El que mas partidos jugo", "stat.matches.played");
	TemplateFactory.createStatTemplate("Deportivo empate", "Promedio de partidos empatados", "stat.matches.tied / stat.matches.played");
	TemplateFactory.createStatTemplate("Victorias", "Promedio de victorias", "stat.matches.won / stat.matches.played");

    _.each(allPlayerStats, function(stat, playerName) {
        var playerAttributes = playersMap[playerName];
        if (playerAttributes && playerAttributes.active !== false) {
			_.each(TemplateFactory.statTemplates, function(statTemplate) {
				statTemplate.pushValue(playerName, stat);
			});
        }
    });
    
    _.each(TemplateFactory.statTemplates, function(statTemplate) {
        sortAndPush(statTemplate, statTemplate.sortOrder);
    });

}]);


controllers.controller('statModalController', ["$scope", "$modal", "$log", function ($scope, $modal, $log) {

	$scope.animationsEnabled = true;
	
	$scope.open = function (match) {
		var modalInstance = $modal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'statHelp',
			controller: 'statModalInstanceController'
		});
	};

	$scope.toggleAnimation = function () {
		$scope.animationsEnabled = !$scope.animationsEnabled;
	};

}]);

controllers.controller('statModalInstanceController', function ($scope, $modalInstance) {
	$modalInstance.rendered.then(function() {
		$('pre code').each(function(i, block) {
			hljs.highlightBlock(block);
		});
	});
	$scope.ok = function () {
		$modalInstance.close();
	}
});