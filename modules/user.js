const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    username:{
        type:String,
        required:true,
        trim:true
    },

    name:{
        type:String,
        required:true,
        trim:true
    },

    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },

    age:{
        type:Number,
        default:0
    },

    password:{
        type:String,
        default:null
    },

    provider:{
        type:String,
        enum:["local","google"],
        default:"local"
    },

    googleId:{
        type:String,
        unique:true,
        sparse:true
    },

    profilepic:{
        type:String,
        default:"https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
    },

    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"post"
        }
    ]
},
{
    timestamps:true
}
);

module.exports = mongoose.model("user",userSchema);