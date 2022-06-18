let express = require("express"),
    router = express.Router(),
    multer = require("multer"),
    logdb = require("../models/log");
    middleware = require("../middleware/index");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

router.post("/add-image", upload.array("image"), async(req, res) => {
    console.log(req.files);
    try {
        if (req.files) {
            var arr = [];
            req.files.forEach((img) => {
                arr.push(img.filename);
            });
            res.status(200).send({ data: arr });
        } else {
            res.status(400).json({ error: "corrupt data, try again" });
        }
    } catch (err) {
        await logdb.create({title: err});
        console.log(err);
        res.status(500).json({ error: "Please Try Again later" });
    }
});


module.exports = router;