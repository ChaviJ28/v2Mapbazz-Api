let express = require("express"),
    router = express.Router(),
    bcrypt = require("bcrypt"),
    middleware = require("../middleware/index"),
    admindb = require("../models/admin"),
    shopdb = require("../models/shop");

router.post("/login", async(req, res) => {
    try {
        var searchParams = {
            username: req.body.data.username
        };
        var users = await admindb.find(searchParams);
        if (users.length > 0) {
            var user = users[0].toObject();
            if (bcrypt.compareSync(req.body.data.password, user.pwd)) {
                delete user.pwd;
                delete user.__v;
                user.access_type = "admin";
                res.status(200).json({ data: user });
            } else {
                res.status(401).json({ error: "Wrong Password" });
            }
        } else {
            searchParams = {
                owner: {
                    username: req.body.data.username,
                }
            };
            var users = await shopdb.find(searchParams);
            if (users.length > 0) {
                var user = users[0].toObject();
                user = user.owner;
                if (bcrypt.compareSync(req.body.data.password, user.pwd)) {
                    delete user.pwd;
                    user.access_type = "owner";
                    await incrementLoginCount(shopdb, user.id)
                    res.status(200).json({ data: user });
                } else {
                    res.status(401).json({ error: "Wrong Password" });
                }
            } else {
                console.log("for app_user check");
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
});


router.post("/change-password", async(req, res) => {
    try {
        var searchParams = {
            username: req.body.data.username
        }
        if (req.body.auth.user.access_type.equals("admin")) {
            var records = await admindb.find(searchParams);
            if (records[0]) {
                var admin = records[0].toObject();
                var verified = await verifyPasswords(req.body.data.oldpassword, req.body.data.pass1, req.body.data.pass2, admin.pwd);
                if (verified.equals("success")) {
                    await admindb.updateOne(searchParams, { pwd: bcrypt.hashSync(req.body.data.pass1, parseInt(process.env.HASH_SALT)) });
                } else {
                    res.status(400).json({ error: verified });
                };
            } else {
                res.status(400).json({ error: "User does not exist" });
            }
        } else if (req.body.auth.user.access_type.equals("owner")) {
            var records = await shopdb.find(searchParams);
            if (records[0]) {
                var owner = records[0].toObject();
                var verified = await verifyPasswords(req.body.data.oldpassword, req.body.data.pass1, req.body.data.pass2, owner.pwd);
                if (verified.equals("success")) {
                    await shopdb.updateOne(searchParams, { owner: { pwd: bcrypt.hashSync(req.body.data.pass1, parseInt(process.env.HASH_SALT)) } });
                } else {
                    res.status(400).json({ error: verified });
                };
            } else {
                res.status(400).json({ error: "User does not exist" });
            }
        } else if (req.body.auth.user.access_type.equals("user")) {
            //user find
        } else {
            res.status(400).json({ error: "corrupt data" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
})

async function verifyPasswords(old, p1, p2, current) {
    try {
        if (p1.equals(p2)) {
            if (bcrypt.compareSync(old, current)) {
                return "success"
            } else {
                return "Wrong Password"
            }
        } else {
            return "Passwords do not match"
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "verifyPasswords() err" });
    }
}

async function incrementLoginCount(db, id) {
    try {
        var records = await db.find({ id: id });
        var record = records[0].toObject();
        var newCount = record.owner.login_count + 1;
        db.updateOne({ id: id }, { owner: { login_count: newCount } })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "incrementLoginCount() err" });
    }
}

module.exports = router;