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
            insertData["active"] = false;
            await userdb.updateOne(searchData, insertData);
            updateUserActive({_id : req.body.data.id})
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
router.post("/get-status", async(req, res) => {
  try {
      if (req.body.data ) {
          var searchData = {
              _id: req.body.auth.user.id,
          };
          var users = await userdb.find(searchData);
          if (users.length > 0) {
              var user = users[0].toObject();
              res.status(200).json({ data: user.active });
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


//et met li vrai
//bzn mem contentn la dan 1 function, lakoz pu call lor update si sa
//lor chaque update, update sts lasi false, check sa algo ici la, si li false, laisse pareil else faire li vin true .
router.post("/update-status", async(req, res) => {
  try {
      if (req.body.data ) {
          var searchData = {
              _id: req.body.auth.user.id,
          };
          var resp = updateUserActive(req.body.auth.user.id);
          if(resp){
            res.status(200).json({ success: resp });
          }else{
            res.status(500).json({ error: resp });
          }
      } else {
          res.status(400).json({ error: "corrupt data, try again" });
      }
  } catch (err) {
      console.log(err);
      res.status(500).json({ error: err });
  }
});


async function updateUserActive(id){
  try{
    var users = await userdb.find({_id: id});
    if(users.length > 0){
      var user = users[0].toObject();
      if(user.fullname && user.fullname.length > 0 && user.contact && user.contact != null && user.gender && user.gender.length > 0 && user.dob && user.dob.length > 0 && user.profile_url && user.profile_url.length > 0 && user.card_details && user.card_details.length > 0 && user.address && user.address != null){
        await userdb.updateOne({_id: id}, {active: true})
        return true;
      }else{
        await userdb.updateOne({_id: id}, {active: false})
        return false;
      }
    }else{
      return 'err'
    }
  }catch(err){
    console.log(err);
    res.status(500).json({ error: "checkUserValues() err" });
    return 'err'
  }
}


module.exports = router;