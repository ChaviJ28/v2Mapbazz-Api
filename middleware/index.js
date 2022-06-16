// middleware for checking api_key
exports.checkApiKey = async(req, res, next) => {
    if (
        req.body.auth &&
        req.body.auth.api_key &&
        req.body.auth.api_key == process.env.API_KEY
    ) {
        next();
    } else {
        res.status(403).json({ error: "api-key error" });
    }
};

exports.checkUserAuth = async(req, res, next) => {
    if (req.body.auth && req.body.auth.user) {
        if (req.body.auth.user.access_type == "admin") {
            var searchParams = {
                username: req.body.auth.user.username,
            };
            var users = await admindb.find(searchParams);
            if (users.length > 0) {
                next();
            } else {
                res.status(401).json({ error: "Forbidden Access" });
            }
        } else if (req.body.auth.user.access_type == "owner") {
            var searchParams = {
                "owner.username": req.body.auth.user.username,
            };
            var users = await shopdb.find(searchParams);
            if (users.length > 0) {
                next();
            } else {
                res.status(401).json({ error: "Forbidden Access" });
            }
        } else if (req.body.auth.user.access_type == "user") {
            //check if credentials exist in user
        } else {
            res.status(400).json({ error: "corrupt userdata, login again" });
        }
    } else {
        res.status(401).json({ error: "UserAuth does not exist in req" });
    }
};

exports.checkOwnerAuth = async(req, res, next) => {
    if (req.body.auth && req.body.auth.user) {
        if (req.body.auth.user.access_type == "admin") {
            var searchParams = {
                username: req.body.auth.user.username,
            };
            var users = await admindb.find(searchParams);
            if (users.length > 0) {
                next();
            } else {
                res.status(401).json({ error: "Forbidden Access" });
            }
        } else if (req.body.auth.user.access_type == "owner") {
            var searchParams = {
                "owner.username": req.body.auth.user.username,
            };
            var users = await shopdb.find(searchParams);
            if (users.length > 0) {
                next();
            } else {
                res.status(401).json({ error: "Forbidden Access" });
            }
        } else {
            res.status(400).json({ error: "corrupt userdata, login again" });
        }
    } else {
        res.status(401).json({ error: "UserAuth does not exist in req" });
    }
};

exports.checkAdminAuth = async(req, res, next) => {
    if (req.body.auth && req.body.auth.user) {
        if (req.body.auth.user.access_type == "admin") {
            var searchParams = {
                username: req.body.auth.user.username,
            };
            var users = await admindb.find(searchParams);
            if (users.length > 0) {
                next();
            } else {
                res.status(401).json({ error: "Forbidden Access" });
            }
        } else {
            res.status(400).json({ error: "corrupt userdata, login again" });
        }
    } else {
        res.status(401).json({ error: "UserAuth does not exist in req" });
    }
};

exports.usernameExists = async(req, res, next) => {
    if (req.body.data && req.body.data.shop && req.body.data.shop.username) {
        var username = req.body.data.shop.username;
        var sql = "SELECT * FROM shop_owner WHERE username = '" + username + "';";
        connection.query(sql, async(err, results) => {
            if (err) {
                res.status(500).json({ error: err });
            } else {
                console.log(results)
                if (results.length == 0) {
                    next();
                } else {
                    res.status(400).json({ error: "Username Taken" });
                }
            }
        })
    }
    if (req.body.data && req.body.data.username) {
        var username = req.body.data.username;
        var sql =
            "SELECT * FROM user WHERE username = '" + username + "';";
        connection.query(sql, async(err, results) => {
            if (err) {
                res.status(500).json({ error: err });
            } else {
                if (results.length == 0) {
                    next();
                } else {
                    res.status(400).json({ error: "Username Taken" });
                }
            }
        });
    }
}

//check app-user login
exports.checkCient = async(req, res, next) => {}