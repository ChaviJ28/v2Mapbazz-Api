let express = require("express"),
    router = express.Router(),
    bcrypt = require("bcrypt"),
    middleware = require("../middleware/index"),
    logdb = require("../models/log");

router.post("/list-log", middleware.checkAdminAuth, async(req, res) => {
  try{
    var logs = await logdb.find();
    res.status(200).json(logs);
  }catch(err){
    await logdb.create({title: err});
    res.status(500).json({ error: err });
  }
})

module.exports = router;