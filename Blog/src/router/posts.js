const express = require('express')
const router = new express.Router()
const Posts = require('../models/posts')
const auth = require('../db/middleware/auth');
const multer = require('multer')
const sharp = require('sharp');

//create posts

const upload = multer({
    limits: {
        fileSize: 10000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})
router.post('/posts/:topic_id',auth, upload.single('post_img'), async (req, res) => {

    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
   
    const topic = req.params.topic_id
    const posts = new Posts({
        ...req.body,
   
        post_img : buffer,
        owner : req.user._id,
        topic 
    })

    try {
        await posts.save()
        res.status(201).send({ posts })
    } catch (e) {
        res.status(400).send(e)
    }
});

//getAll posts
router.get('/posts', async (req, res) => {
    try{
       const posts =  await Posts.find({})
        
        res.status(200).send(posts)
    }
    catch(e){
        res.status(400).send()
    }
   
});
//get post by id for view
router.get('/posts/:id/img', async (req, res) => {
    try {
        const posts = await Posts.findById(req.params.id)

        if (!posts || !posts.post_img) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(posts.post_img)
    } catch (e) {
        res.status(404).send()
    }
})

//post by topics
router.get('/posts/:topic_id', async (req, res) => {
    const topic_id = req.params.topic_id;
    try{
       const posts =  await Posts.find({topic:topic_id})
        res.status(200).send(posts)
    }
    catch(e){
        res.status(400).send()
    }
   
})


//delete posts
router.delete('/posts/:id',auth,async (req,res)=>{
    try{
        //const task = await Task.findByIdAndDelete(req.params.id)
        const posts = await Posts.findOneAndDelete({_id: req.params.id , owner:req.user._id})
        if(!posts){
            return res.status(500).send()
        }
        res.send(posts)
    }catch(e){
        res.status(500).send()
    }
})



//Edit Posts
router.patch('/posts/:id', auth,upload.single('post_img'), async (req, res) => {

    try {
       
        const buffer = await sharp(req.file.buffer ).resize({ width: 250, height: 250 }).png().toBuffer()
        const posts = await Posts.findByIdAndUpdate(req.params.id, {  
            ...req.body,
           post_img : buffer,
            },
             { new: true, runValidators: true })
        if (!posts) {
            return res.status(404).send()
        }
      
        res.send(posts)
    } catch (e) {
        res.status(400).send(e)
    }
})


//Like Posts
router.patch('/posts/like/:id', auth , async (req, res) => {
        try{

        const post = await Posts.findByIdAndUpdate({_id:req.params.id },{
            $push :{
                likes:req.user._id
            }},{
                new:true
            }).exec((error,result)=>{
                if(error){
                    return res.status(404).send()
                }else{
                    res.status(200).send(result)
                }
            })
       
        
      
        
    } catch (e) {
        res.status(400).send(e)
    }
})

//disLike posts
router.patch('/posts/dislike/:id', auth , async (req, res) => {


    try {
        const post = await Posts.findByIdAndUpdate({_id:req.params.id },{
            $pull :{likes:req.user._id}
            },{
                new:true
            }).exec((error,result)=>{
                if(error){
                    return res.status(404).send()
                }else{
                    res.send(result)
                }
            })
        
    } catch (e) {
        res.status(400).send(e)
    }
})

//add comment


router.patch('/posts/comment/:id', auth , async (req, res) => {


    try {
        const post = await Posts.findByIdAndUpdate({_id:req.params.id },{
            $push :{comments:req.body.comments}
            },{
                new:true
            }).exec((error,result)=>{
                if(error){
                    return res.status(404).send()
                }else{
                    res.send(result)
                }
            })
        
    } catch (e) {
        res.status(400).send(e)
    }
})




// get most recent posts
router.get('/mostposts', async (req, res) => {
     
    try{
        const sort={};
        if(req.query.sortBy){
            const part=req.query.sortBy.split(':');
            sort[part[0]]= part[1]==='desc' ? -1 : 1
         }

         await req.user.populate({
            path:'posts',
           
            options:{
                limit : parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.user.posts)

       // console.log(req.user.posts)
      
    }
    catch(e){
        res.status(400).send()
    }
   
});



router.get('/posts_mostlike', async (req, res) => {
    try{
      const posts =  await Posts.find({})
       
        res.status(200).send(posts)
        
        //console.log(posts[likes])
       const post = posts.sort((a, b) => {
            return  b.likes - a.likes ;
        });

       
       console.log( "Title : ",post[0].title);
       console.log(" Likes " ,post[0].likes)
    }
    catch(e){
        res.status(400).send()
    }
   
});



      

module.exports=router