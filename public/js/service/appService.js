angular.module("fifa").service("tournamentService", ["$http", function($http) {
    this.getTournaments = function() {
        return $http.get("/api/tournament").then(function(data) {
            return data;
        });
    };
    this.getTournament = function(tournamentName) {
        return $http.get("/api/tournament/" + tournamentName).then(function(response) {
            return response.data;
        });
    }
}])
    .service("playerService", ["$http", function($http) {
        this.getPlayers = function() {
            return $http.get("/api/player").then(function(response) {
                return response.data;
            });
        };
        this.getPlayer = function(alias) {
            return $http.get("/api/player/" + alias).then(function(response) {
                return response.data;
            });
        };
        this.getPlayerStats = function(alias) {
            return $http.get("/api/player/stats/" + alias).then(function(response) {
                return response.data;
            });
        };
        this.getAllPlayerStats = function() {
            return $http.get("/api/player/stats/all").then(function(response) {
                return response.data;
            });
        };
		this.getRankingHistory = function() {
			return $http.get("/api/player/ranking").then(function(response) {
				return response.data;
			});
		};
        this.getFeeling = function(alias) {
            return $http.get("/api/player/feeling/" + alias).then(function(response) {
                return response.data;
            });
        }
    }])
    .service("matchService", ["$http", function($http) {
        this.getMatches = function(tournamentName, page, sort) {
            page = page || 1;
            var basePath = "/api/match/tournament/" + tournamentName;
            basePath += "?page=" + page;
            basePath += "&sort=" + sort;
            return $http.get(basePath).then(function(response) {
                return response.data;
            });

        };
        this.getMatchesForPlayer = function(alias) {
            return $http.get("/api/match/player/" + alias).then(function(response) {
                return response.data;
            });
        };
		this.deleteMatch = function(match, callback) {
			return $http.delete("/api/match/" + match._id).then(callback);
		}
    }])
	.service("teamService", [function() {
		//FIXME: backend should provide these.
        this.getTeams = function() {
            return [
				{cssValue: "RealMadrid", text: "Real Madrid"},
				{cssValue: "Barcelona", text: "Barcelona"},
				{cssValue: "Chelsea", text:"Chelsea"},
				{cssValue: "PSG", text:"PSG"},
				{cssValue: "Bayern", text:"Bayern Munich"},
				{cssValue: "Borussia", text:"Borussia Dortmund"},
				{cssValue: "ManUtd", text:"Manchester United"},
				{cssValue: "ManCity", text:"Manchester City"},
				{cssValue: "Juventus", text:"Juventus"},
				{cssValue: "Argentina", text:"Argentina"},
				{cssValue: "Alemania", text:"Alemania"},
				{cssValue: "Brasil", text:"Brasil"},
				{cssValue: "Espana", text:"Espana"},
				{cssValue: "Francia", text:"Francia"},
				{cssValue: "Holanda", text:"Holanda"},
				{cssValue: "Inglaterra", text:"Inglaterra"},
				{cssValue: "Italia", text:"Italia"},
				{cssValue: "Mexico", text:"Mexico"},
				{cssValue: "Uruguay", text:"Inglaterra"},
				{cssValue: "Colombia", text:"Colombia"},
				{cssValue: "CDMarfil", text:"Costa de Marfil"},
				{cssValue: "EEUU", text:"EEUU"},
				{cssValue: "Portugal", text:"Portugal"},
				{cssValue: "Peru", text:"Peru"},
				{cssValue: "Ecuador", text:"Ecuador"},
				{cssValue: "Chile", text:"Chile"},
				{cssValue: "Venezuela", text:"Venezuela"},
				{cssValue: "Paraguay", text:"Paraguay"},
				{cssValue: "Bolivia", text:"Bolivia"},
				{cssValue: "Gales", text:"Gales"},
				{cssValue: "Australia", text:"Australia"},
				{cssValue: "Korea", text:"Corea del sur"},
                                {cssValue: "SanLorenzo", text:"San Lorenzo"},
                                {cssValue: "Arsenal", text:"Arsenal"},
                                {cssValue: "ChoulinhoLombardiFC", text:"Choulinho Lombardi FC"}
			];
        }
        
    }]);
