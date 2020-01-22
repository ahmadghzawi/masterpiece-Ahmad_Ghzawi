/**
 * description: this is a  micro service for products and services
 *  200 OK
 *  201 successfully create an object
    202 Accepted 
    204 No Content
    400 Bad Request
    404 Not Found
 */
const express = require("express");
const router = express.Router();
router.use(express.json());
const productsDB = require("../models/productsDatabase");

router.get("/getProduct/:_id", (req, res) => {
  let _id = req.params._id;
  productsDB.findOne({ _id }, (err, product) => {
    if (err) res.status(400).json(err);
    else res.status(200).json(product);
  });
});

router.get("/categories", async (req, res) => {
  try {
    let categories = await productsDB.distinct("product_category");
    res.status(200).json(categories);
  } catch {
    response.status(500).json({ message: err.message });
  }
});

router.get("/getProductsByCategory/:category", async (req, res) => {
  try {
    let products = await productsDB.find({
      product_category: req.params.category
    });
    res.status(200).json(products);
  } catch {
    response.status(500).json({ message: err.message });
  }
});

/*<===========================fetch all posts===========================*/
router.get("/data", async (request, response) => {
  try {
    let products = await productsDB.find();
    let categories = await productsDB.distinct("product_category");
    response.status(200).json({ products, categories });
    // response.status(200).json();
  } catch (err) {
    response.status(500).json({ message: err.message });
  }
});

router.get("/getOffers", async (request, response) => {
  response.json(
    request.query.seller_id != null
      ? await sellerOffers(request.query.seller_id)
      : await buyerOffers(request.query.buyer)
  );
});
async function sellerOffers(seller_id) {
  let arr = [];
  if (seller_id != null) {
    let data = productsDB.find();
    await data
      .then(DATA => {
        DATA.map(post => {
          if (post._doc.seller_id === seller_id) {
            Object.keys(post._doc).map(key => {
              if (post._doc[key].price != null) {
                arr.push({
                  image_path: post._doc.image_path,
                  price: post._doc[key].price,
                  status: post._doc[key].status,
                  title: post._doc.title,
                  product_category: post._doc.product_category,
                  location: post._doc.location,
                  buyer: key,
                  _id: post._doc._id,
                  info: post._doc.info
                });
              }
            });
          }
        });
        arr = arr.length === 0 ? [] : arr;
      })
      .catch(err => {
        return { message: err.message };
      });
  }
  return arr;
}
async function buyerOffers(buyer) {
  let arr = [];
  let data = productsDB.find();
  await data
    .then(DATA => {
      DATA.map(post => {
        if (post._doc[buyer] != null) {
          let newObj = post._doc[buyer];
          newObj["image_path"] = post._doc.image_path;
          newObj["_id"] = post._doc._id;
          newObj["title"] = post._doc.title;
          newObj["product_category"] = post._doc.product_category;
          newObj["location"] = post._doc.location;
          newObj["info"] = post._doc.info;
          arr.push(newObj);
        }
      });
      arr = arr.length === 0 ? [] : arr;
    })
    .catch(err => {
      return { message: err.message };
    });

  return arr;
}

/*<=========================== add new products ===========================>*/
router.post("/newProduct", async (request, response) => {
  // console.log(request.body)
  let {
    seller_id,
    product_category,
    location,
    title,
    info,
    image_path,
    bid
  } = request.body;
  if (
    seller_id != null &&
    product_category != null &&
    location != null &&
    title != null &&
    info != null &&
    image_path != null &&
    bid != null
  ) {
    try {
      await productsDB.create(request.body, (err, doc) => {
        if (err) {
          response.status(400).json({ message: err.message });
        } else response.status(201).json(doc);
      });
    } catch (err) {
      response.status(500).json(err);
    }
  }
});

/*<=========================== add offer ===========================>*/
router.get("/postOffers", async (request, response) => {
  let { _id, buyer, offer } = request.query;
  let newObj = {
    bid: offer,
    [buyer]: { price: offer, date: Date(Date.now()), status: "pending" }
  };
  try {
    await productsDB.findByIdAndUpdate(_id, newObj, (err, doc) => {
      if (err) {
        response.status(400).json({ message: err.message });
      } else response.status(201).json(doc);
    });
  } catch (err) {
    response.status(500).json({ message: err.message });
  }
});

/*<=========================== DELETE a Post  func.===========================>*/
let IdsForDeleteArray = [];
router.delete("/deleteAtSpecificTime/:id", async (request, response) => {
  let ids = request.params._id;
  IdsForDeleteArray.push(ids);
  if (IdsForDeleteArray.length !== 0) {
    DeleteTimer;
  }
  response.json("it will be deleted at 12 AM");
});

const DeleteAtSpecificTime = async id => {
  let output = null;
  try {
    await productsDB.findByIdAndDelete(id, (err, doc) => {
      if (err) {
        output = { message: err.message };
      } else {
        output = { deletion: doc };
        IdsForDeleteArray.shift();
      }
    });
  } catch (error) {
    output = { message: error.message };
  }
  return output;
};

const DeleteTimer = setInterval(() => {
  var date = new Date();
  if (date.getHours() === 0 && date.getMinutes() === 0) {
    IdsForDeleteArray.forEach(async id => {
      await DeleteAtSpecificTime(id);
      console.log("deleted items", await DeleteAtSpecificTime());
    });
    IdsForDeleteArray = [];
  }
}, 50000);

router.put("/acceptOffer/", async (request, response) => {
  await productsDB.findById(request.body._id, async (err, doc) => {
    if (err) response.status(401).json(err);
    else {
      let post = doc._doc;
      let newObj = {};
      for (key in post) {
        if (typeof post[key] === "object" && key !== "_id") {
          if (key === request.body.buyer) {
            post[key].status = ["Accepted", request.body.contactNumber];
          } else {
            post[key].status = "Rejected";
          }
          newObj[key] = post[key];
        }
      }
      try {
        await productsDB.findByIdAndUpdate(
          request.body._id,
          newObj,
          (err, doc) => {
            if (err) {
              response.status(400).json({ message: err.message });
            } else response.status(201).json(doc);
          }
        );
      } catch (err) {
        response.status(500).json({ message: err.message });
      }

      // response.json(newObj)
    }
  });
});

router.put("/deniedOffer/", async (request, response) => {
  // let { buyer, _id } = request.body
  let query = request.body.buyer + ".status";
  try {
    await productsDB.updateOne(
      { _id: request.body._id },
      { $set: { [query]: "Rejected" } },
      (err, doc) => {
        if (err) {
          response.status(400).json({ message: err.message });
        } else response.json(doc);
      }
    );
  } catch (err) {
    response.status(500).json({ message: err.message });
  }
});

router.put("/deleteOffer/", (request, response) => {
  let { buyer, _id } = request.body;
  productsDB.updateOne({ _id }, { $unset: { [buyer]: "" } }, error => {
    if (error) response.status(500).json({ message: error.message });
    else response.status(200).json("ok");
  });
});
/*<=========================== DELETE a Post  func.===========================>*/
router.get("/getUserProducts", async (request, response) => {
  try {
    let { seller_id } = request.query;
    let data = await productsDB.find({ seller_id });
    response.json(data);
  } catch {
    response.status(500).json({ err: err.message });
  }
});

router.delete("/deletePost/:id", async (request, response) => {
  try {
    await productsDB.findByIdAndDelete(request.params.id, (err, doc) => {
      if (err) {
        response.status(404).json(err);
      } else {
        response.status(200).json(doc);
      }
    });
  } catch {
    response.status(500).json(err);
  }
});
router.delete("/deleteUserPosts/:id", async (request, response) => {
  let seller_id = request.params.id;
  try {
    await productsDB.deleteMany({ seller_id });
    response.status(201).json(seller_id);
  } catch (err) {
    response.status(404).json({ err });
  }
  try {
    await productsDB.updateMany({}, { $unset: { [seller_id]: "" } });
    response.status(201).json(seller_id);
  } catch (err) {
    response.status(404).json({ err });
  }
});

module.exports = router;
