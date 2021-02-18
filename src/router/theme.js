const express = require("express");
const Scream = require("../models/scream.js");
const Theme = require("../models/theme.js");
const User = require("../models/user.js");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/theme", auth, async (req, res) => {
    try {
        if(req.body.themeName === ''){
            return res.status(400).send({error: "themeName cannot be empty"});
        }
        let theme = await Theme.findOne({themeName: req.body.themeName})
        if(theme)
            return res.status(404).send({error: 'The ThemeName is found before'});
        theme = new Theme({
            createdBy: req.user.userHandle,
            members: [{userHandle: req.user.userHandle}],
            ...req.body
        });
        let user = await User.findOne({userHandle: req.user.userHandle})
        await User.findOneAndUpdate({userHandle: req.user.userHandle},{following: [...user.following, {userHandle: req.body.themeName}]})
        await theme.save();
        res.status(201).send(theme);
    }catch(e){
        console.log(e)
        res.status(400).send();
    }
})

router.get("/theme/:themeName", async (req,res) => {
    try{
        const themeName = req.params.themeName;
        const theme = await Theme.findOne({themeName})
        if(!theme){
            return(res.status(400).send())
        }
        const screams = await Scream.find({themeName});
        return res.send({screams, theme});
    }catch(e){
        res.status(400).send({error: 'Something went wrong'})
    }
})

router.get("/themes", async (req,res) => {
    try{
       const themes = await Theme.find({});
       const users= await User.find({})
       let arr = [];
       for(const theme of themes){
           arr.push({...theme.toObject(), newHandle: `#${theme.themeName}`});
        }
       for(const user of users){
           arr.push({...user.toObject(), newHandle: `@${user.userHandle}`});
        }
        return res.send({arr});
    }catch(e){
        res.status(400).send({error: 'Something went wrong'})
    }
})

router.get("/getThemesOfUser", auth, async (req,res) => {
    try{
        const themes = await Theme.find({members: {$elemMatch: {userHandle: req.user.userHandle}}})
        console.log(themes)
        return res.send(themes)
    } catch(e) {
        return res.status(400).send({error: 'Something went wrong'})
    }
})

router.delete("/theme/:themeName", auth, async (req,res) => {
    try{
        const themeName = req.params.themeName;
        const theme = await Theme.findOneAndDelete({themeName})
        const screams = await Scream.deleteMany({themeName});
        const users = await User.find({following: {$elemMatch: {userHandle: req.user.userHandle}}})
        for(let user of users ){
            const resultFollowing = user.following.filter(follower => follower.userHandle !== req.params.themeName);
            await User.findOneAndUpdate({userHandle: user.userHandle},{following: resultFollowing})
        }
        return res.send({screams, theme});
    }catch(e){
        res.status(400).send({error: 'Something went wrong'})
    }
})

router.patch("/theme/:themeName", auth, async (req,res) => {
try{
    console.log("hoha  ", req.body)
    const themeName = req.params.themeName;
    const theme = await Theme.findOneAndUpdate({themeName}, {description: req.body.themeDescription.description}, {new:true});
    if(!theme)
        return res.status(400).send({error: 'Theme not found'})
    res.send({theme})    

}
catch(e){
    res.status(400).send({error: 'Something went wrong'})
}
}
)


module.exports = router;