controllers.controller('modalController', ["$scope", "$modal", "$log", "playerService", "teamService", function ($scope, $modal, $log, playerService, teamService) {

    $scope.open = function (match) {
        
        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'resultsEditor',
            controller: 'modalInstanceController',
            resolve: {
                match: function () { return match; },
                players: function() { return playerService.getPlayers(); },
				teams: function() { return teamService.getTeams();}
            }
        });

        modalInstance.result.then(
			function (updatedMatch) {
				if (!match.home.player && !match.home.player) {
					$scope.matches.push(match);
				}
				angular.copy(updatedMatch, match);
            	$scope.calculateStandings();
        }, function () {
            	$log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };

}]);

angular.module('fifa').controller('modalInstanceController', function ($scope, $modalInstance, match, players, teams, $http) {

	//FIXME: ui-select doesn't support repeat over map yet.
	var playersMap = _.indexBy(players, function (player) { return player.alias });
	$scope.teams = teams;
	var teamsMap = _.indexBy($scope.teams, function(team) { return team.cssValue });

	var jsonToSelect = function(object) {
		if (object) return {selected: object}
		else return undefined;
	};
	var selectToJson = function(selectObject, key) {
		return selectObject && selectObject.selected ? selectObject.selected[key] : undefined;
	};

	var __select2 = function(modalMatch, type) {
		modalMatch[type].player = jsonToSelect(playersMap[match[type].player]);
		modalMatch[type].partner = jsonToSelect(playersMap[match[type].partner]);
		modalMatch[type].team = jsonToSelect(teamsMap[match[type].team]);
	};

	var __reverseSelect2 = function(modalMatch, type) {
		modalMatch[type].player = selectToJson(modalMatch[type].player, "alias");
		modalMatch[type].partner = selectToJson(modalMatch[type].partner, "alias");
		modalMatch[type].team = selectToJson(modalMatch[type].team, "cssValue");
	};

	var modalMatch = angular.copy(match);
	__select2(modalMatch, "home");
	__select2(modalMatch, "away");
	modalMatch.date = match.date ? new Date(match.date) : new Date();

    $scope.players = players;
    $scope.match = modalMatch;
	
    $scope.ok = function () {
		__reverseSelect2(modalMatch, "home");
		__reverseSelect2(modalMatch, "away");
        if (modalMatch._id) {
            $http.put("/api/match", modalMatch).success(function(response) {
                $modalInstance.close(modalMatch);
            }).error(function() {
                $modalInstance.dismiss("error")
            })
        } else {
            $http.post("/api/match", modalMatch).success(function(response) {
                $modalInstance.close(modalMatch);
            }).error(function() {
                $modalInstance.dismiss("error")
            })
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});