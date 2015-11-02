controllers.controller("profileController", ["$scope", "$location", "player", "matchesForPlayer", "playerStats", "playersData", function($scope, $location, player, matchesForPlayer, playerStats, playersData) {
    
    $scope.tabs = ["home", "stats", "history", "feeling"];
    
    $scope.selectedTab = "home";
    
    player.image = player.image.substring(0, player.image.lastIndexOf('?'));
    
    $scope.thePlayer = player;
    
    $scope.matchesForPlayer = matchesForPlayer;
    
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

    $scope.playersMap = {};

    $.each(playersData, function (index, player) {
        $scope.playersMap[player.alias] = player;
    });

    $scope.goTo = function(player) {
        $location.path('/profile/' + player);
    };
    
    $scope.selectTab = function(tab) {
        $scope.selectedTab = tab;
    }
    
    $scope.getTabName = function(tab) {
        switch (tab) {
            case "home": return "Home";
            case "stats": return "Estadisticas";
            case "history": return "Historial";
            case "feeling": return "Feeling";

        }
        
    }


}]);
