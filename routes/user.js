const user = require("../models/user");

let express = require("express"),
    router = express.Router(),
    bcrypt = require("bcrypt"),
    middleware = require("../middleware/index"),
    userdb = require("../models/user");

    router.post("/list-user", middleware.checkAdminAuth, async(req, res) => {
      try {
        var searchParams = req.body.data.search
        if(req.body.data.populate){
          if(req.body.data.populate.cart == true){
            var users = await userdb.find(searchParams).populate("product")          
          }
          if(req.body.data.populate.order == true){
            var users = await userdb.find(searchParams).populate("orders")
          }
        }else{
          var users = await userdb.find(searchParams);
        }
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

  //update so middleware to user
  router.post("/update-user", middleware.checkOwnerAuth, async(req, res) => {
    try {
        if (req.body.data && req.body.data.id) {
            var searchData = {
                id: req.body.data.id,
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

module.exports = router;