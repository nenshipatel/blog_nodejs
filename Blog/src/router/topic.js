const express = require('express')
const router = new express.Router()
const Topic = require('../models/topic')
const auth = require('../db/middleware/auth')

router.post('/topics', auth,async (req, res) => {
    const topic = new Topic({
        ...req.body,
        owner : req.user._id,
    })

    try {
        await topic.save()
     res.status(201).send({ topic })
    } catch (e) {
        res.status(400).send(e)
    }
})


router.get('/topic/me',auth,async (req,res)=>{
       //const _id = req.params.id 
    try{
        //const task = await Task.findById(_id)
        const topic = await Topic.find({ owner:req.user._id})
        if(!topic){
            res.status(500).send() 
         }
         res.send(topic)
    }
    catch(e){
        res.status(500).send()
    }
});

router.get('/topics',async (req,res)=>{
    
 try{
    
     const topic = await Topic.find({} )
     if(!topic){
         res.status(500).send() 
      }
      res.send(topic)
 }
 catch(e){
     res.status(500).send()
 }
});

module.exports=router