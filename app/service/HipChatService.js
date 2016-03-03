var request = require('request');
var _ = require('underscore');
var __ = require("../constants");

module.exports = {
    push: function(match, tournamentName, isNew) {
        if (!(process.env.HIPCHAT_AUTH_TOKEN || process.env.HIPCHAT_ROOM_ID)) {
            return;
        }
        var creator = match.getCreatedBy();
        var format = function (match) {
            var awayPlayers = match.getPlayers(__.AWAY);
            var homePlayers = match.getPlayers(__.HOME);
            return "<table style='border: 1px solid red;border-collapse: collapse;'>" +
                "<tr>" +
                    "<td align='center'>Home</td>" +
                    "<td align='center' colspan='2'></td>" +
                    "<td align='center'>Away</td>" +
                "</tr>" +
                "<tr>" +
                    "<td align='center'>" + match.home.team + "</td>" +
                    "<td align='center' colspan='2'></td>" +
                    "<td align='center'>" + match.away.team + "</td>" +
                "</tr>" +
                "<tr>" +
                    "<td align='center'>" + homePlayers[0] +"</td>" +
                    "<td align='center' rowspan='2'>" + match.getGoals(__.HOME) + "</td>" +
                    "<td align='center' rowspan='2'>" + match.getGoals(__.AWAY) + "</td>" +
                    "<td align='center'>" + awayPlayers[0] +"</td>" +
                "</tr>" +
                "<tr>" +
                    "<td align='center'>" + (homePlayers[1] || "") +"</td>" +
                    "<td align='center'>" + (awayPlayers[1] || "") +"</td>" +
                "</tr>" +
            "</table>";
        };

        request.post("http://api.hipchat.com/v2/room/" + process.env.HIPCHAT_ROOM_ID +"/notification?auth_token=" + process.env.HIPCHAT_AUTH_TOKEN, function(err,httpResponse,body) {
            console.log(err);
        }).form({
            from: 'Fifa Medallia',
            color: 'random',
            notify: true,
            message: format(match),
            title: creator + " " + (isNew ? 'added' : 'modified') + ' a match',
            description: tournamentName,
            url: process.env.HEROKU_URL
        });
    }
};