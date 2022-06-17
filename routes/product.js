let express = require("express"),
    router = express.Router(),
    bcrypt = require("bcrypt"),
    middleware = require("../middleware/index"),
    shopdb = require("../models/shop"),
    productdb = require("../models/product");

router.post("/add-product", middleware.checkOwnerAuth, async(req, res) => {
  try {
    if (req.body.data) {
      var colors = [];
      var categories = [];
      req.body.data.images.forEach(obj => {
        colors.push(obj.color)
      });
      req.body.data.categories.forEach(cat => {
        var obj = {
          id: cat
        }
        categories.push(onj)
      })
        var insertData = {
                title: req.body.data.title,
                description: req.body.data.description,
                price: req.body.data.price,
                discount: req.body.data.discount,
                images: req.body.data.images,
                colors: colors,
                stock: req.body.data.stock,
                shown: false,
                size: req.body.data.size,
                category: categories,
                shop: {
                  id: req.body.data.shopid
                }
        };
        await productdb.create(insertData);
        res.status(200).json({ success: "product addded" });
      } else {
        res.status(400).json({ error: "corrupt data, try again" });
    }
  } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Please Try Again later" });
  }
});

router.post("/list-product", async(req, res) => {
  try {
    if (req.body.data.search) {
        var searchParams = req.body.data.search
        if (
            searchParams.hasOwnProperty("shown") &&
            req.body.data.populate
        ) {} else {
            searchParams["shown"] = true;
        };
    } else {
        var searchParams = { shown: true };
    }
    if(req.body.data.populate == true){
      var products = await productdb.find(searchParams).populate('category').populate('shop')
    } else {
      var products = await productdb.find(searchParams).populate('category')
    }
    res.status(200).json({ data: products });
} catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
}
});

router.post("/update-product",middleware.checkOwnerAuth, async(req, res) => {
  try {
    if (req.body.data && req.body.data.id) {
        var searchData = {
            id: req.body.data.id,
        };
        var insertData = req.body.data.updateData;

        await productdb.updateOne(searchData, insertData);
        res.status(200).json({ success: "product updated" });
    } else {
        res.status(500).json({ error: "id not found" });
    }
  } catch (err) {
      console.log(err);
      res.status(500).json({ error: err });
  }
});

router.post("/is-show", async(req, res) => {
  try {
    if (req.body.data && req.body.data.id) {
        var searchData = {
            id: req.body.data.id,
        };
        var products = await productdb.find(searchData);
        if (products.length > 0) {
            var product = products[0].toObject();
            res.status(200).json({ data: product.shown });
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

router.post("/set-show", middleware.checkOwnerAuth, async(req, res) => {
  try {
    if (req.body.data && req.body.data.id) {
        var searchData = {
            id: req.body.data.id,
        };
        var insertData = { shown: req.body.data.status };
        await productdb.updateOne(searchData, insertData);
        res.status(200).json({ success: "product updated" });
    } else {
        res.status(500).json({ error: "id not found" });
    }
  } catch (err) {
      console.log(err);
      res.status(500).json({ error: err });
  }
});

module.exports = router;
