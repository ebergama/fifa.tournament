var app = angular.module('fifa', ['ngRoute', 'ui.bootstrap', 'fifaControllers', 'ngSanitize', 'ui.select'])

.config(['$routeProvider', "$locationProvider",
        function($routeProvider, $locationProvider) {
            $routeProvider.
                when('/ranking', {
                    templateUrl: 'templates/ranking',
                    controller: 'rankingController',
                    resolve: {
                        players: function(playerService) {
                            return playerService.getPlayers();
                        },
                        allPlayerStats: function(playerService) {
                            return playerService.getAllPlayerStats();
                        },
						rankingHistoryMap: function(playerService) {
							return playerService.getRankingHistory();
						}
                    }
                }).
                when('/tournament/:tournamentName', {
                    templateUrl: 'templates/tournament',
                    controller: 'tournamentController',
                    resolve: {
                        playersData: function(playerService) {
                            return playerService.getPlayers();
                        },
                        matchInfos:  function($route, matchService) {
                            var params = $route.current.params;
                            return matchService.getMatches(params.tournamentName, params.page, params.sort || 'desc');
                        },
                        tournament: function($route, tournamentService) {
                            return tournamentService.getTournament($route.current.params.tournamentName);
                        }
                    }
                }).
                when("/stats", {
                    templateUrl: 'templates/stats',
                    controller: 'statsController',
                    resolve: {
                        allPlayerStats: function(playerService) {
                            return playerService.getAllPlayerStats();
                        },
                        playersData: function(playerService) {
                            return playerService.getPlayers();
                        }

                    }
                }).
                when("/profile/:alias",{
                    templateUrl: 'templates/profile',
                    controller: 'profileController',
                    resolve: {
                        matchesForPlayer: function($route, matchService) {
                            return matchService.getMatchesForPlayer($route.current.params.alias);
                        },
                        playerStats: function($route, playerService) {
                            return playerService.getPlayerStats($route.current.params.alias)
                        },
                        playersData: function(playerService) {
                            return playerService.getPlayers();
                        },
                        player: function($route, playerService) {
                            return playerService.getPlayer($route.current.params.alias);
                        },
                        feeling: function($route, playerService) {
                            return playerService.getFeeling($route.current.params.alias);
                        }
                    }
                }).
                when('/rules', {
                    templateUrl: 'templates/rules'
                }).
                when('/error', {
                    templateUrl: 'templates/error'
                }).
                otherwise({
                    redirectTo: '/ranking'
                });
            $locationProvider.html5Mode(true);
}]);
