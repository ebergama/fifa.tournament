var controllers = angular.module('fifaControllers', []);

controllers.factory('Data', function() {
    var currentTournament;
    var currentPhase;
    return {
        getCurrentTournament : function() {return currentTournament;},
        setCurrentTournament : function(tournament) {return currentTournament = tournament;},
        getCurrentPhase : function() {return currentPhase;},
        setCurrentPhase : function(phase) {return currentPhase = phase;}
    }

});

controllers.controller("playerController", ["$scope", "$http", "$location", "Data", "matchesForPlayer", "playerStats", function($scope, $http, $location, Data, matchesForPlayer, playerStats) {
    //FIXME separate controllers...
    Data.setCurrentTournament(undefined);
    
    if ($location.path().lastIndexOf("profile") != -1) {
        $http.get("/api/player" + $location.path().substring($location.path().lastIndexOf("/")))
            .success(function(data, status, headers, config) {
                data.image = data.image.substring(0, data.image.lastIndexOf('?'));
                $scope.thePlayer = data;
                $scope.matchesForPlayer = matchesForPlayer;
                $scope.thePlayer.stats = playerStats;
            }
        );

    }

    $scope.goTo = function(player) {
        $location.path('/profile/' + player.alias);
    };

    $http.get("/api/player")
        .success(function(data, status, headers, config) {
            $scope.players = data;
        }
    );
    
    $scope.updateRanking = function() {
        if(confirm("Estas seguro?")) {
            $http.post("/api/player/ranking").success(function() {
                $location.path("/");
            });
        }
    }
}]);

controllers.controller('mainController', ['$scope', 'tournamentService', 'Data', function($scope, tournamentService, Data) {

    $scope.mainPage = function() {
        Data.setCurrentTournament(undefined);
    };

    $scope.logout = function() {
        window.location = '/account/logout';
    };

    tournamentService.getTournaments().then(function(response) {
        $scope.tournaments = response.data;
    });

    $scope.$watch(function () { return Data.getCurrentTournament(); }, function (newValue, oldValue) {
        if (newValue !== oldValue) $scope.theTournament = newValue;
    });

    $scope.selectPhase = function(phase) {
        Data.setCurrentPhase(phase);
    }
}]);