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
            var searchParams = {
                "username": req.body.auth.user.username,
            };
            var users = await userdb.find(searchParams);
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


//avan create owner/user
exports.usernameExists = async(req, res, next) => {
    if (req.body.data && req.body.data.shop && req.body.data.shop.username) {
        var searchData = {
            "owner.username": req.body.data.shop.username
        }
        var records = await shopdb.find(searchData);
        if (results.length > 0) {
            //check pu user
            //si user si zero, lerla ==
            // res.status(400).json({ error: "Username Taken" });
        }else{
            next();
        }
    }
}

//check app-user login
//KIETER SA GGT ?
exports.checkCient = async(req, res, next) => {}