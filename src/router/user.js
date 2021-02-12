const express = require("express");
const User = require("../models/user.js");
const Notification = require("../models/notification.js");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require('path')
const upload = multer({
  limits: {
    fileSize: 2000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpeg|jpg)$/)) {
      return cb(new Error("Please upload a png, jpg or jpeg format"));
    }
    cb(undefined, true);
  },
});
const router = new express.Router();
router.post("/signup", async (req, res) => {
  if (!req.body.Email && !req.body.password && !req.body.userHandle) {
    return res.status(400).send({
      email: "Email Field is Empty",
      password: "Password Field is Empty",
      userHandle: "userHandle Field is Empty",
    });
  } else if (!req.body.Email && !req.body.password) {
    return res.status(400).send({
      email: "Email Field is Empty",
      password: "Password Field is Empty",
    });
  } else if (!req.body.Email && !req.body.userHandle) {
    return res.status(400).send({
      email: "Email Field is Empty",
      userHandle: "userHandle Field is Empty",
    });
  } else if (!req.body.password && !req.body.userHandle) {
    return res.status(400).send({
      password: "Password Field is Empty",
      userHandle: "userHandle Field is Empty",
    });
  } else if (!req.body.Email) {
    return res.status(400).send({ email: "Email Field is Empty" });
  } else if (!req.body.password) {
    return res.status(400).send({ password: "Password Field is Empty" });
  } else if (!req.body.userHandle) {
    return res.status(400).send({ userHandle: "userHandle Field is Empty" });
  } else if (req.body.password.length < 7) {
    return res
      .status(400)
      .send({ password: "password must have 7 or more characters" });
  }
  const imgPath = path.join(__dirname, '/../images/images.png')

  var bitmap = fs.readFileSync(imgPath);
  const buffer = await sharp(bitmap)
    .resize({
      width: 250,
      height: 250,
    })
    .png()
    .toBuffer();
  const user = new User({ ...req.body, avatar: buffer });
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.cookie("auth_token", token);
    res.status(201).send({ user, token });
  } catch (e) {
    const errors = e.keyValue;
    console.log(e);
    const reason = Object.keys(errors)[0];
    if (e.code === 11000 && reason === "Email") {
      return res.status(400).send({ email: "Email is already taken" });
    } else if (e.code === 11000 && reason === "userHandle") {
      res.status(400).send({ userHandle: "username is already taken" });
    } else {
      res.status(400).send(e);
    }
  }
});

router.post("/login", async (req, res) => {
  try {
    if (!req.body.Email && !req.body.password) {
      return res.status(400).send({
        email: "Email Field is Empty",
        password: "Password Field is Empty",
      });
    } else if (!req.body.Email) {
      return res.status(400).send({ email: "Email Field is Empty" });
    } else if (!req.body.password) {
      return res.status(400).send({ password: "Password Field is Empty" });
    }
    const user = await User.findbyCredintials(
      req.body.Email,
      req.body.password
    );

    const token = await user.generateAuthToken();
    res.cookie("auth_token", token);
    res.send({ user, token });
  } catch (e) {
    res.status(400).send({
      error: "Wrong data Entry",
    });
  }
});

router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/user", auth, async (req, res) => {
 try{
  await req.user.populate("likes").execPopulate();
  await req.user.populate({path:'recipients',options: {sort:{createdAt: -1}}}).execPopulate();
  res.send({credentials:req.user,likes: req.user.likes, notifications: req.user.recipients});
} catch(e) {
  console.log(e)
}
});

router.get("/user/:userHandle", async (req, res) => {
  try {
    if (req.params.userHandle) {
      const user = await User.findOne({ userHandle: req.params.userHandle });
      if (!user) {
        res.status(404);
      }
      
      await user.populate({path:'screams',options: {sort:{createdAt: -1}}}).execPopulate()
      return res.send({user,screams: user.screams});
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/user", auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["website", "bio"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid updates" });
    }
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/notifications", auth, async (req, res) => {
  try {
    console.log(req.body)
    
      req.body.forEach(async (notification) => {
        await Notification.findByIdAndUpdate(notification, { read: true });
      });
   
    res.status(200).send();
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/user/image", auth, upload.single("image"), async (req, res) => {
  console.log('enter')
    const buffer = await sharp(req.file.buffer)
      .resize({
        width: 250,
        height: 250,
      })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.get("/users/:userHandle/avater", async (req, res) => {
  try {
    const user = await User.findOne({ userHandle: req.params.userHandle });

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});

module.exports = router;
