let express = require("express"),
    router = express.Router(),
    bcrypt = require("bcrypt"),
    middleware = require("../middleware/index"),
    productdb = require("../models/order"),
    orderdb = require("../models/order"),
    logdb = require("../models/log");

router.post("/add-order", middleware.checkUserAuth, async(req, res) => {
    try {
        if (req.body.data && req.body.data.items.length > 0) {
          //calculate price ici
          var total = 0;
          req.body.data.items.forEach(item => {
            var price = getProductPrice(item.product.id);
            total += price;
          });
            var insertData = {
                user: req.body.auth.user.id,
                // address: {
                //   x: req.body.data.x,
                //   y: req.body.data.y
                // },
                // payment_type: req.body.data.payment_type,
                paid_sts: req.body.data.paid_sts,
                del_status: false,
                // del_comment: req.body.data.delivery_comment,
                items: req.body.data.items
            };
            await orderdb.create(insertData);
            res.status(200).json({ success: "Order Created" });
        } else {
            res.status(400).json({ error: "corrupt data, try again" });
        }
    } catch (err) {
        await logdb.create({title: err});
        console.log(err);
        res.status(500).json({ error: "Please Try Again later" });
    }
});

//pu user la so order
router.post("/list-order", middleware.checkUserAuth, async(req, res) => {
  try {
    if (req.body.data.search) {
      var searchParams = req.body.data.search
  } else {
      var searchParams = {};
  }
  var orders = await orderdb.find(searchParams).populate('product');
  res.status(200).json({ data: orders });
  } catch (err) {
        await logdb.create({title: err});
        console.log(err);
      res.status(500).json({ error: "Please Try Again later" });
  }
});


//by shop owner la  
router.post("/list-owner-orders", middleware.checkOwnerAuth, async(req, res) => {
  if (req.body.data.id) {
    var orders = await orderdb.find({_id: req.body.data.id}).populate('products');
    res.json({data: orders})

  }
})


async function getProductPrice(id) {
  try{
    var products = await productdb.find({_id: id})
  if(products.length > 0){
    var product = products[0];
    if( product.discount == 0){
      return price;
    } else {
      return price*((100 - discount)/100)
    }
  }else{
    return 'err'
  }
  }catch(err){
        await logdb.create({title: err});
        console.log(err);
    res.status(500).json({ error: "getProductPrice() err" });
    return 'err'

  }
}

module.exports = router;