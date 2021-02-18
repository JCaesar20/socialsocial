const express = require("express");
const Scream = require("../models/scream.js");
const Like = require("../models/like.js");
const Comment = require("../models/comment.js");
const Notification = require("../models/notification.js");
const User = require("../models/user.js");
const Theme = require("../models/theme.js");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/scream", auth, async (req, res) => {
  const scream = new Scream({
    ...req.body,
    owner: req.user.userHandle,
  });
  if (scream.body === '') {
    return res.status(400).send({ error: "body cannot be empty" });
  }
  try {
    await scream.save();
    res.status(201).send(scream);
  } catch (e) {
    res.status(400).send();
  }
});



/*router.get("/screams", auth, async (req, res) => {
  try {
    await req.user.populate("screams").execPopulate();
    res.send(req.user.screams);
  } catch (e) {
    res.status(500).send();
  }
});*/

router.get("/screams", async (req, res) => {
  try {
    let screams = await Scream.find().sort({ createdAt: -1 });
    screams = await Promise.all(screams.map(async (scream) => {
      await scream.populate("comments").execPopulate();
      const screamObject = scream.toObject();
      return {
        ...screamObject,
        comments: [...scream.comments]
      }
    }))
    res.send(screams);
  } catch (e) {
    console.log(e)
    res.status(500).send();
  }
});

router.get("/screamsAuth", auth, async (req, res) => {
  try {
    let user = await User.findOne({ userHandle: req.user.userHandle })
    let screamsArr = [];
    for (const following of user.following) {
      console.log(following)
      user = await User.findOne({ userHandle: following.userHandle });
      let screams = await Scream.find({ owner: following.userHandle }).sort({ createdAt: -1 });
      if (!user) {
        user = await Theme.findOne({ themeName: following.userHandle });
        screams = await Scream.find({ themeName: following.userHandle }).sort({ createdAt: -1 });
      }

      screams = await Promise.all(screams.map(async (scream) => {
        await scream.populate("comments").execPopulate();
        const screamObject = scream.toObject();
        return {
          ...screamObject,
          comments: [...scream.comments]
        }
      }))
      screamsArr.push(...screams)
    }

    screamsArr = screamsArr.filter((thing, index) => {
      const _thing = JSON.stringify(thing);
      return index === screamsArr.findIndex(obj => {
        return JSON.stringify(obj) === _thing;
      });
    });

    screamsArr.sort(function(a,b){
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    res.send(screamsArr);
  } catch (e) {
    console.log(e)
    res.status(500).send();
  }
});

router.get("/scream/:id", async (req, res) => {
  try {
    const scream = await Scream.findOne({ _id: req.params.id });

    if (!scream) {
      return res.status(404).send();
    }
    await scream.populate("comments").execPopulate();
    const screamObject = scream.toObject();
    res.send({
      ...screamObject,
      comments: [...scream.comments]
    });
  } catch (e) {
    res.status(500).send();
  }
});

router.delete("/scream/:id", auth, async (req, res) => {
  try {
    const scream = await Scream.findOne({
      _id: req.params.id,
    });

    if (!scream) {
      return res.status(404).send();
    }
    await scream.remove();
    console.log(scream)
    res.status(200).send(scream);
  } catch (e) {
    console.log(e)
    res.status(500).send();
  }
});

router.post("/scream/:screamId/comment", auth, async (req, res) => {
  try {
    let scream = await Scream.findById(req.params.screamId);

    if (!scream) {
      return res.status(404).send({ error: 'The Scream was deleted' });
    } else if (!req.body.body) {
      return res.status(404).send({ error: 'Comment is Empty' });
    }


    const comment = new Comment({
      ...req.body,
      screamID: req.params.screamId,
      userHandle: req.user.userHandle,
    });
    await comment.save();
    const user = await User.findOne({ userHandle: scream.owner })

    scream = await Scream.findByIdAndUpdate(req.params.screamId, { commentCount: ++scream.commentCount })

    const notification = new Notification({
      sender: req.user.userHandle,
      recipient: user.userHandle,
      type: 'comment',
      screamID: req.params.screamId
    })
    await notification.save();


    res.send({ comment, notification });
  } catch (e) {
    console.log(e)
    res.status(400).send({ error: "error" });
  }
});

router.delete("/comment/:screamId/:commentId", auth, async (req, res) => {
  try {
    const comment = await Comment.findOneAndDelete({ _id: req.params.commentId });
    if (!comment)
      return res.send({ error: 'comment is not found' })
    const scream = await Scream.findById(req.params.screamId)
    console.log(scream, req.params.screamId)
    await Scream.findByIdAndUpdate(req.params.screamId, { commentCount: --scream.commentCount })
    res.send(comment)
  } catch (e) {
    res.status(400).send({ error: "error" });
  }
})

router.get("/scream/:screamId/like", auth, async (req, res) => {
  try {
    let scream = await Scream.findById(req.params.screamId);
    if (!scream) {
      return res.status(404).send();
    }
    const user = await User.findOne({ userHandle: scream.owner })

    scream = await Scream.findByIdAndUpdate(req.params.screamId, { likeCount: ++scream.likeCount })
    scream = await Scream.findById(req.params.screamId);
    await scream.populate("comments").execPopulate();
    const screamObject = scream.toObject();
    const like = new Like({ screamID: req.params.screamId, userHandle: req.user.userHandle })

    await like.save();


    const notification = new Notification({
      sender: req.user.userHandle,
      recipient: user.userHandle,
      type: 'like',
      screamID: req.params.screamId
    })
    await notification.save();

    res.status(200).send({
      like, notification, scream: {
        ...screamObject,
        comments: [...scream.comments]
      }
    });
  } catch (e) {
    console.log(e)
    res.status(400).send();
  }
});

router.get("/scream/:screamId/unlike", auth, async (req, res) => {
  try {
    let scream = await Scream.findById(req.params.screamId);

    if (!scream) {
      return res.status(404).send();
    }

    scream = await Scream.findByIdAndUpdate(req.params.screamId, { likeCount: --scream.likeCount })
    scream = await Scream.findById(req.params.screamId);
    await scream.populate("comments").execPopulate();
    const screamObject = scream.toObject();
    const like = await Like.findOneAndDelete({ screamID: req.params.screamId, userHandle: req.user.userHandle })
    const notification = await Notification.findOneAndDelete({ screamID: req.params.screamId, sender: req.user.userHandle, type: 'like' })

    res.status(200).send({
      like, notification, scream: {
        ...screamObject,
        comments: [...scream.comments]
      }
    });
  } catch (e) {
    res.status(400).send();
  }
});

router.patch('/scream/:screamId', auth, async (req, res) => {
  console.log(req.body)
  try {
    if (req.body.body === '')
      return res.status(400).send({ error: "body cannot be empty" });
    const scream = await Scream.findOne({
      _id: req.params.screamId,
      owner: req.user.userHandle,
    });
    if (!scream)
      return res.send({ error: 'Scream not found' })
    const editedScream = await Scream.findByIdAndUpdate(req.params.screamId, { body: req.body.body }, { new: true })
    return res.status(200).send(editedScream);
  } catch (e) {
    res.status(400).send({ error: "error" });
  }
})




router.patch('/comment/:screamId/:id', auth, async (req, res) => {
  console.log(req.body)
  try {
    if (req.body.body === '')
      return res.status(400).send({ error: "Body cann't be empty" })
    const comment = await Comment.findOne({
      _id: req.params.id,
      userHandle: req.user.userHandle,
    });
    if (!comment)
      return res.send({ error: 'Comment not found' })
    await Comment.findByIdAndUpdate(req.params.id, { body: req.body.body })
    return res.status(200).send({ ...comment.toObject(), body: req.body.body });
  } catch (e) {
    res.status(400).send({ error: "error" });
  }
})

module.exports = router;
