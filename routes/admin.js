let express = require("express"),
    router = express.Router(),
    bcrypt = require("bcrypt"),
    middleware = require("../middleware/index"),
    admindb = require("../models/admin");

router.post("/add-admin", middleware.checkAdminAuth, async(req, res) => {
    try {
        if (req.body.data && req.body.data.username) {
            var insertData = {
                username: req.body.data.username,
                email: req.body.data.email,
                full_name: req.body.data.full_name,
                pwd: bcrypt.hashSync(
                    "admin567",
                    parseInt(process.env.HASH_SALT)
                )
            };
            await admindb.create(insertData);
            res.status(200).json({ success: "admin added" });
        } else {
            res.status(400).json({ error: "corrupt date, try again" });
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Please Try Again later" });
    }
});

router.post("/list-admin", middleware.checkAdminAuth, async(req, res) => {
    try {
        if (req.body.data.search) {
            var searchParams = req.body.data.search;
        } else {
            var searchParams = {};
        }
        var arr = [],
            admins = await admindb.find(searchParams);
        admins.forEach(admin => {
            admin = admin.toObject();
            delete user.pwd;
            delete user.__v;
            arr.push(admin)
        })
        res.status(200).json({ data: arr });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Please Try Again later" });
    }
});


module.exports = router;