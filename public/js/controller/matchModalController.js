controllers.controller('modalController', ["$scope", "$modal", "$log", "playerService", "teamService", function ($scope, $modal, $log, playerService, teamService) {

	$scope.today = function() {
		$scope.dt = new Date();
	};
	$scope.today();

	$scope.clear = function () {
		$scope.dt = null;
	};

	// Disable weekend selection
	$scope.disabled = function(date, mode) {
		return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
	};

	$scope.toggleMin = function() {
		$scope.minDate = $scope.minDate ? null : new Date();
	};
	$scope.toggleMin();
	$scope.maxDate = new Date(2020, 5, 22);


	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};

	$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];

	$scope.status = {
		opened: false
	};

	var tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	var afterTomorrow = new Date();
	afterTomorrow.setDate(tomorrow.getDate() + 2);
	$scope.events =
		[
			{
				date: tomorrow,
				status: 'full'
			},
			{
				date: afterTomorrow,
				status: 'partially'
			}
		];

	$scope.getDayClass = function(date, mode) {
		if (mode === 'day') {
			var dayToCheck = new Date(date).setHours(0,0,0,0);

			for (var i=0;i<$scope.events.length;i++){
				var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

				if (dayToCheck === currentDay) {
					return $scope.events[i].status;
				}
			}
		}

		return '';
	};
	
	
	
	
	
	
    $scope.animationsEnabled = true;
	$scope.status = {
		opened: false
	};
	
	$scope.openCal = function($event) {
		$scope.status.opened = true;
	};

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