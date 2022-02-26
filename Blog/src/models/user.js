const mongoose = require('mongoose')
const validator = require('validator')
const bycript = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Topic = require('../models/topic');
const Posts = require('../models/posts')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
  
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],

},

{
    timestamps: true
})

// userSchema.virtual('tasks',{
//     ref:'Task',
//     localField :'_id',
//     foreignField :'owner'
// },{
//     timestamps : true
// })

userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
   

     return userObject;
}

userSchema.methods.generateAuthToken= async function(){
    const user = this;
    const token = jwt.sign({_id: user.id.toString()},process.env.JWT_SECRET)
     user.tokens = user.tokens.concat({token});
     await user.save()
     return token;

}
userSchema.statics.findCredentials=async (email,password)=>{
    const user = await User.findOne({email})
   
    if(!user){
        throw new Error('Unable to Login!!')
    }

    const ismatch = await bycript.compare(password,user.password)
    if(!ismatch) throw new Error("unable to login")

    return user;
}

userSchema.pre('save',async function(next){
    const user = this

    if(user.isModified('password')){
        user.password = await bycript.hash(user.password,8)
    }

    next()
})

// deleteing al,task when user rmove account

userSchema.pre('remove',async function(next){
    const user = this
    await Topic.deleteMany({owner : user._id})
    await Posts.deleteMany({owner : user._id})
    next()
})
const User = mongoose.model('User',userSchema);


module.exports = User