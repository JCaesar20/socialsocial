const express = require("express");
const Scream = require("../models/scream.js");
const Like = require("../models/like.js");
const Comment = require("../models/comment.js");
const Notification = require("../models/notification.js");
const User = require("../models/user.js");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/scream", auth, async (req, res) => {
  const scream = new Scream({
    ...req.body,
    owner: req.user.userHandle,
  });
  if(scream.body === ''){
    res.status(400).send({error: "body cannot be empty"});
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
    let screams = await Scream.find().sort({createdAt: -1});
    screams  = await Promise.all(screams.map(async (scream) => {
      await scream.populate("comments").execPopulate();
      const screamObject = scream.toObject();
      return{
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

router.get("/scream/:id", async (req, res) => {
  try {
    const scream = await Scream.findOne({ _id: req.params.id});
    
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
      owner: req.user.userHandle,
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
     return res.status(404).send({error: 'The Scream was deleted'});
    }else if(!req.body.body){
      return res.status(404).send({error: 'Comment is Empty'});
    }

  
    const comment = new Comment({
      ...req.body,
      screamID: req.params.screamId,
      userHandle: req.user.userHandle,
    });
    await comment.save();
    const user = await User.findOne({userHandle: scream.owner })

    scream = await Scream.findByIdAndUpdate(req.params.screamId,{commentCount: ++scream.commentCount})

    const notification = new Notification({
      sender: req.user.userHandle,
      recipient: user.userHandle ,
      type:'comment',
      screamID: req.params.screamId
    })
    await notification.save();


    res.send({comment,notification});
  } catch (e) {
    console.log(e)
    res.status(400).send({error: "error"});
  }
});

router.get("/scream/:screamId/like", auth, async (req, res) => {
  try {
    let scream = await Scream.findById(req.params.screamId);
    if (!scream) {
     return res.status(404).send();
    }
    const user = await User.findOne({userHandle: scream.owner })
   
    scream = await Scream.findByIdAndUpdate(req.params.screamId,{likeCount: ++scream.likeCount})
    scream = await Scream.findById(req.params.screamId);
    await scream.populate("comments").execPopulate();
    const screamObject = scream.toObject();
    const like = new Like({screamID: req.params.screamId,userHandle: req.user.userHandle})

    await like.save();
    

    const notification = new Notification({
      sender: req.user.userHandle,
      recipient: user.userHandle,
      type: 'like',
      screamID: req.params.screamId
    })
    await notification.save();

    res.status(200).send({like,notification,scream:{
      ...screamObject,
      comments: [...scream.comments]
    }});
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

    scream = await Scream.findByIdAndUpdate(req.params.screamId,{likeCount: --scream.likeCount})
    scream = await Scream.findById(req.params.screamId);
    await scream.populate("comments").execPopulate();
    const screamObject = scream.toObject();
    const like = await Like.findOneAndDelete({screamID:req.params.screamId,userHandle: req.user.userHandle})
    const notification = await Notification.findOneAndDelete({screamID:req.params.screamId,sender: req.user.userHandle,type:'like'})
    
    res.status(200).send({like,notification,scream:{
      ...screamObject,
      comments: [...scream.comments]
    }});
  } catch (e) {
    res.status(400).send();
  }
});

module.exports = router;
