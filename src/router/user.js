const express = require("express");
const User = require("../models/user.js");
const Notification = require("../models/notification.js");
const Theme = require("../models/theme.js");
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
  const themes = await Theme.find({members: {$elemMatch: {userHandle: req.user.userHandle}}})
  res.send({credentials:{...req.user.toObject(), themes},likes: req.user.likes, notifications: req.user.recipients});
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
    });

    res.status(201).send(user);
  } catch (e) {
    res.status(400).send({error: 'Wrong Entry'});
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

/* router.post("/follow/:userHandle", auth, async (req,res) => {
  try{
  let followedUser = await User.findOne({userHandle: req.params.userHandle});
  if(!followedUser) 
    return res.send({error: 'User not found'})
  let user = await User.findOneAndUpdate({userHandle: req.user.userHandle})
  await User.findOneAndUpdate({userHandle: req.user.userHandle},{following: [...user.following, {userHandle: req.params.userHandle}]})
  await User.findOneAndUpdate({userHandle: req.params.userHandle},{followed: [...followedUser.followed, {userHandle: req.user.userHandle}]})
  return res.status(200).send();

  }catch(e) {
    return res.status(400).send(e);
  }
}) */

router.post("/follow/:userHandle", auth, async (req,res) => {
  try{
  let followedUser = await User.findOne({userHandle: req.params.userHandle});
  if(!followedUser) 
    return res.send({error: 'User not found'})
  let user = await User.findOne({userHandle: req.user.userHandle})
  user = await User.findOneAndUpdate({userHandle: req.user.userHandle},{following: [...user.following, {userHandle: req.params.userHandle}]}, {new: true})
  await User.findOneAndUpdate({userHandle: req.params.userHandle},{followers: [...followedUser.followers, {userHandle: req.user.userHandle}]})
  return res.status(200).send(user);

  }catch(e) {
    console.log(e)
    return res.status(400).send(e);
  }
})

router.post("/unfollow/:userHandle", auth, async (req,res) => {
  try{
  let followedUser = await User.findOne({userHandle: req.params.userHandle});
  if(!followedUser) 
    return res.send({error: 'User not found'})
  let user = await User.findOne({userHandle: req.user.userHandle})
  const resultFollowing = user.following.filter(follower => follower.userHandle !== req.params.userHandle);
  const resultFollowed = followedUser.followers.filter(follower => follower.userHandle !== req.user.userHandle);
  const boomboom = await User.findOneAndUpdate({userHandle: req.user.userHandle},{following: resultFollowing}, {new:true})
  await User.findOneAndUpdate({userHandle: req.params.userHandle},{followers: resultFollowed})
  return res.status(200).send(boomboom);
  }catch(e) {
    return res.status(400).send(e);
  }
})


router.post("/followTheme/:themeName", auth, async (req,res) => {
  try{
  let followedTheme = await Theme.findOne({themeName: req.params.themeName});
  if(!followedTheme) 
    return res.send({error: 'Theme not found'})
  let user = await User.findOne({userHandle: req.user.userHandle})
  await User.findOneAndUpdate({userHandle: req.user.userHandle},{following: [...user.following, {userHandle: req.params.themeName}]})
  await Theme.findOneAndUpdate({themeName: req.params.themeName},{members: [...followedTheme.members, {userHandle: req.user.userHandle}], membersCount: ++followedTheme.membersCount})
  return res.status(200).send();

  }catch(e) {
    return res.status(400).send(e);
  }
})


router.post("/unfollowTheme/:themeName", auth, async (req,res) => {
  try{
    console.log("HOORE")
  let followedTheme = await Theme.findOne({themeName: req.params.themeName});
  if(!followedTheme) 
    return res.send({error: 'Theme not found'})
  let user = await User.findOne({userHandle: req.user.userHandle})
  const resultFollowing = user.following.filter(follower => follower.userHandle !== req.params.themeName);
  const resultFollowed = followedTheme.members.filter(follower => follower.userHandle !== req.user.userHandle);
  console.log(resultFollowed)
  await User.findOneAndUpdate({userHandle: req.user.userHandle},{following: resultFollowing})
  await Theme.findOneAndUpdate({themeName: req.params.themeName},{members: resultFollowed}) 
  return res.status(200).send();
  }catch(e) {
    return res.status(400).send(e);
  }
})

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
