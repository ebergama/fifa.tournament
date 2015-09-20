var playerService = require("../service/PlayerService");
var _ = require("underscore");

var accessDenied = function(res) {
    res.status(401).send("You have no access to perform the operation");
};

var handleResponse = function(req, res, next, err, object) {
    if (err) {
        res.send(err);
    } else if (object) {
        if (_.isFunction(object)) {
            object.call(this);
        } else {
            res.json(object);
        }
    } else {
        next();
    }
};

var authenticateAdmin = function(req, res, next) {
    if (!req.user || !req.user.admin) {
        accessDenied(res);
    } else {
        playerService.getById(req.user.id, function(err, user) {
            if (!err & user.admin) {
                next();
            } else {
                accessDenied(res);
            }
        });
    }
};

var authenticateUser = function(req, res, next) {
    if (!req.user) {
        accessDenied(res);
    } else {
        playerService.getById(req.user.id, function(err, user) {
            if (!err && user) {
                next();
            } else {
                accessDenied(res);
            }
        });
    }
};

module.exports = {
    handleResponse: handleResponse,
    authenticateAdmin: authenticateAdmin,
    authenticateUser: authenticateUser
};
