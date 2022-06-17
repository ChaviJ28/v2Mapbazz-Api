const user = require("../models/user");

let express = require("express"),
    router = express.Router(),
    bcrypt = require("bcrypt"),
    middleware = require("../middleware/index"),
    userdb = require("../models/user");

    router.post("/list-user", middleware.checkAdminAuth, async(req, res) => {
      try {
        var searchParams = req.body.data.search
          var users = await userdb.find(searchParams);
        var arr = [];
        users.forEach ((user) => {
          user = user.toObject();
          delete user.pwd
          arr.push(user)
        })
        res.status(200).json({ data: arr });
      } catch (err) {
          console.log(err);
          res.status(500).json({ error: err });
      }
  });


  router.post("/update-user", middleware.checkUserAuth, async(req, res) => {
    try {
        if (req.body.data && req.body.data.id) {
            var searchData = {
                _id: req.body.data.id,
            };
            var insertData = req.body.data.updateData;
            await userdb.updateOne(searchData, insertData);
            res.status(200).json({ success: "user updated" });
        } else {
            res.status(500).json({ error: "id not found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
});


//get-status of user
//et met li vrai
//bzn mem contentn la dan 1 function, lakoz pu call lor update si sa
//lor chaque update, update sts lasi false, check sa algo ici la, si li false, laisse pareil else faire li vin true .

module.exports = router;