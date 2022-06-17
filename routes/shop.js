let express = require("express"),
    router = express.Router(),
    bcrypt = require("bcrypt"),
    middleware = require("../middleware/index"),
    shopdb = require("../models/shop");

router.post("/add-shop", middleware.checkAdminAuth, async(req, res) => {
    try {
        if (req.body.data && req.body.data.username) {
            var insertData = {
                owner: {
                    username: req.body.data.username,
                    name: req.body.data.name,
                    pwd: bcrypt.hashSync(
                        "owner567",
                        parseInt(process.env.HASH_SALT)
                    ),
                    login_count: 0
                },
                trade_name: req.body.data.trade_name,
                is_active: false,
                subscription_type: req.body.data.type,
            };
            await shopdb.create(insertData);
            res.status(200).json({ success: "shop addded" });
        } else {
            res.status(400).json({ error: "corrupt data, try again" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Please Try Again later" });
    }
});

//si ena is_active dan search la et populate false, li pu return tou seki is_active false
//populate pu gne owner, login
router.post("/list-shop", async(req, res) => {
    try {
        if (req.body.data.search) {
            var searchParams = req.body.data.search
            if (
                searchParams.hasOwnProperty("is_active")
            ) {} else {
                searchParams["is_active"] = true;
            };
        } else {
            var searchParams = { is_active: true };
        }
        var shops = await shopdb.find(searchParams),
            arr = [];
        shops.forEach((shop) => {
            shop = shop.toObject();
            if (req.body.data.populate) {
                delete shop.owner.pwd;
            } else {
                delete shop.owner;
            }
            arr.push(shop);
        });
        res.status(200).json({ data: arr });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
});

router.post("/update-shop", middleware.checkOwnerAuth, async(req, res) => {
    try {
        if (req.body.data && req.body.data.id) {
            var searchData = {
                _id: req.body.data.id,
            };
            var insertData = req.body.data.updateData;

            await shopdb.updateOne(searchData, insertData);
            res.status(200).json({ success: "shop updated" });
        } else {
            res.status(500).json({ error: "id not found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
});

router.post("/get-status", async(req, res) => {
    try {
        if (req.body.data && req.body.data.id) {
            var searchData = {
                _id: req.body.data.id,
            };
            var shops = await shopdb.find(searchData);
            if (shops.length > 0) {
                var shop = shops[0].toObject();
                res.status(200).json({ data: shop.is_active });
            } else {
                res.status(500).json({ error: "id not found" });
            }
        } else {
            res.status(400).json({ error: "corrupt data, try again" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
});

//faire 1 check aussi pu checker sipa tou fill in, sinn beze err ki pa cav update !
router.post("/update-status", middleware.checkAdminAuth, async(req, res) => {
    try {
        if (req.body.data && req.body.data.id) {
            var searchData = {
                _id: req.body.data.id,
            };
            var insertData = { is_active: req.body.data.status };
            await shopdb.updateOne(searchData, insertData);
            res.status(200).json({ success: "shop updated" });
        } else {
            res.status(500).json({ error: "id not found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
});

module.exports = router;
