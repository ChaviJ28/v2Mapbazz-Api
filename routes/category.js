let express = require("express"),
    router = express.Router(),
    middleware = require("../middleware/index"),
    categorydb = require("../models/category");

router.post("/add-category", middleware.checkAdminAuth, async(req, res) => {
    try {
        if (req.body.data && req.body.data.title) {
            var insertData = {
                title: req.body.data.title,
            };
            await categorydb.create(insertData);
            res.status(200).json({ success: "category added" });
        } else {
            res.status(400).json({ error: "corrupt data, try again" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
});

router.post("/list-category", async(req, res) => {
    try {
        if (req.body.data.search) {
            var searchParams = req.body.data.search;
        } else {
            var searchParams = {};
        }
        var categories = await admindb.find(searchParams);
        res.status(200).json({ data: categories });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
});

router.post("/update-category", middleware.checkAdminAuth, async(req, res) => {
    try {
        if (req.body.data && req.body.data.title) {
            var searchData = {
                _id: req.body.data.id,
            };
            var insertData = {
                title: req.body.data.title,
            };
            await categorydb.updateOne(searchData, insertData);
            res.status(200).json({ success: "category updated" });
        } else {
            res.status(400).json({ error: "corrupt data, try again" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
});

module.exports = router;