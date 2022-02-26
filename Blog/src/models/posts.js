const mongoose = require('mongoose')

const postsSchema = new mongoose.Schema({

    title:{
        type:String,
        required:true,
       
    },
    post_img:{
        type: Buffer
     
    },
    likes:[{
        type : mongoose.Schema.Types.ObjectId,
         ref:'User'
    }],
   
    comments:[{
        
            type:String,
            optional:true,
    
    }]
    ,
    owner:{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref:'User'
    },
    topic:{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref:'Topic'
    }
    },{
    timestamps: true
});

postsSchema.methods.toJSON = function(){
    const posts = this;
    const postsObject = posts.toObject();

    delete postsObject.post_img;
    return postsObject;
}


const Posts = mongoose.model('posts', postsSchema)
module.exports = Posts