const mongoose = require('mongoose')

const topicSchema = new mongoose.Schema({

    discription:{
        type:String,
        required:true,
        trim: true,
    },
    owner:{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref:'User'
    }
    },{
    timestamps: true
});


const Topic = mongoose.model('Topic', topicSchema)
module.exports = Topic