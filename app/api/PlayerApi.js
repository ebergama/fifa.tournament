var rankingService = require("../service/RankingService");
var statsService = require("../service/BasicStatsService");
var apiHandler = require("./ApiHandler");
var playerService = require("../service/PlayerService");
var _ = require("underscore");

module.exports = function(app) {
    app.get("/api/player", function(req, res, next) {
        playerService.getPlayers(function(err, players) {
            _.each(players, function(player) {
                player.rankingHistory = rankingService.getRankingHistory(player.alias);
            });
            apiHandler.handleResponse(req, res, next, err, players);
        });
    });
    app.get("/api/player/:alias", function(req, res, next) {
        var alias = req.params.alias;
        playerService.getByAlias(alias, function(err, player) {
            player.rankingHistory = rankingService.getRankingHistory(alias);
            apiHandler.handleResponse(req, res, next, err, player);
        });
    });
    app.post("/api/player", function(req, res, next) {
        var body = req.body;
        playerService.save(body, function(err) {
            apiHandler.handleResponse(req, res, next, err, body);
        });
    });
    app.post("/api/player/ranking", apiHandler.authenticateUser, function(req, res, next) {
        rankingService.calculateGeneralRanking(function(glickoPlayers) {
            res.send("Finished successfully")
        })
    });
    app.get("/api/player/stats/all", function(req, res, next) {
        res.json(statsService.allPlayerStatistics());
    });
    app.get("/api/player/stats/:alias", function(req, res, next) {
        res.json(statsService.playerStatistics(req.params.alias));
    });
    
};