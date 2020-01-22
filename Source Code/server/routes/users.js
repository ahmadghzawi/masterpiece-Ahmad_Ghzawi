/**
 * description: this is a  micro service for users and services
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
const usersDB = require("./../models/UsersDatabase");

router.post("/dashboardLogin", async (req, res) => {
  const { username, password } = req.body;
  await usersDB.findOne({ username, password }, { password: 0 }, (err, doc) => {
    if (err) res.status(500).json({ message: error.message });
    else res.status(200).json(doc);
  });
});

router.post("/dashboardAdd", (req, res) => {
  const { username, password, role } = req.body;

  usersDB.findOne({ username }, (err, doc) => {
    if (err) res.status(500).json({ message: error.message });
    else {
      if (!doc) {
        usersDB.create({ username, password, role }, (err, doc) => {
          if (err) res.status(500).json({ message: error.message });
          else res.status(200).json(doc);
        });
      } else res.status(200).json("user already exists");
    }
  });
});

router.post("/editAdmin", async (req, res) => {
  let { _id, username, password, role } = req.body;
  await usersDB.updateOne(
    { _id },
    { $set: { username, password, role } },
    error => {
      if (error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(200).json("ok");
      }
    }
  );
});

router.put("/editProfile/:user_id/:name/:email/:phone_number",async (req, res) => {
    let { user_id, name, email, phone_number } = req.params;
    await usersDB.updateOne(
      { _id: user_id },
      { $set: { name, email, phone_number } },
      error => {
        if (error) {
          res.status(500).json({ message: error.message });
        } else {
          res.status(200).json("ok");
        }
      }
    );
});

/*<=========================== fetch all users  func.===========================>*/
router.get("/data", async (request, response) => {
  try {
    const users = await usersDB.find();
    response.status(200).json(users);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

/*<=========================== fetch  user by id  ===========================>*/
router.get("/data/:id", async (request, response) => {
  try {
    const users = await usersDB.findById(request.params.id, (err, res) => {
      if (err) {
        response.status(404).json({ message: error.message });
      } else {
        response.json(res);
      }
    });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});


/*<=========================== create new user  func.===========================>*/
async function verifyToCreateAccount(email) {
  const users = await usersDB.find();
  let verified = true;
  users.forEach(item => {
    if (item.email === email) {
      verified = false;
    }
  });
  return verified;
}

router.post("/new", async (request, response) => {
  const { name, email, password, phone_number } = request.body;

  if (await verifyToCreateAccount(email)) {
    const user = new usersDB({
      name,
      email,
      password,
      phone_number
    });

    try {
      const newUser = await user.save();
      response.status(201).json(newUser);
    } catch (error) {
      response.status(204).json({ message: error.message });
    }
  } else {
    response.status(400).json({
      rejection: "email already exists"
    });
  }
});

/*<=========================== verify an existence user  func.===========================>*/
async function verifyAccount(user) {
  const users = await usersDB.find({});
  let p = new Promise((resolve, reject) => {
    users.forEach(({ _id, name, email, password, phone_number }) => {
      if (email === user.email && password === user.password) {
        resolve({ _id, name, phone_number, email });
      }
    });
    reject("no user found");
  });
  return p;
}
router.get("/auth", async (request, response) => {
  await verifyAccount(request.query)
    .then(user => response.status(202).json(user))
    .catch(error => response.status(400).json({ message: error }));
});

/*<=========================== delete an existence user  func.===========================>*/
router.delete("/delete/:id", async (request, response) => {
  let _id = request.params.id;
  await usersDB.deleteOne({ _id }, err => {
    if (err) response.status(400).json({ error: _id });
    else response.status(202).json({ deletion: _id });
  });
});

module.exports = router;
