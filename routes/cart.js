let express = require("express"),
    router = express.Router(),
    bcrypt = require("bcrypt"),
    middleware = require("../middleware/index"),
    userdb = require("../models/user");

router.post("/add-cart", middleware.checkUserAuth, async(req, res) => {
      try {
          if (req.body.data) {
            var searchParams = req.body.auth.user.id;
              var insertData = {
                  product: req.body.data.product_id,
                  quantity: req.body.data.qty,
                  color: req.body.data.color,
                  size: req.body.data.size
              };
              await userdb.updateOne(searchParams, {$push: {cart: insertData}} );
              res.status(200).json({ success: "product added to cart" });
          } else {
              res.status(400).json({ error: "corrupt date, try again" });
          }
      } catch (err) {
          console.log(err);
          res.status(500).json({ error: "Please Try Again later" });
      }
  });

  router.post("/list-cart", middleware.checkUserAuth, async(req, res) => {
    try {
        if (req.body.data) {
          var searchParams = req.body.auth.user.id;
          var user = await userdb.find(searchParams).populate('product');
          user = user[0].toObject();
          res.status(200).json({ data: user.cart });
        } else {
            res.status(400).json({ error: "corrupt date, try again" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Please Try Again later" });
    }
});


  //geuter sipa li retourne 1 id r cart la,lerla faire accordingly !
  //pancr faire sa la !
  router.post("/delete-cart", middleware.checkUserAuth, async(req, res) => {
    try {
        if (req.body.data) {
          var searchParams = req.body.auth.user.id;
            var insertData = {
                product: req.body.data.product_id,
                quantity: req.body.data.qty,
                color: req.body.data.color,
                size: req.body.data.size
            };
            await userdb.updateOne(searchParams, {$push: {cart: insertData}} );
            res.status(200).json({ success: "product added to cart" });
        } else {
            res.status(400).json({ error: "corrupt date, try again" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Please Try Again later" });
    }
});