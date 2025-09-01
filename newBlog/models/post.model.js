import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    publicId: String,
    size: Number
})

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: [String]
    },
    previewPix: {
        publicId: String,
        size: Number
    },
    Img2: [imageSchema],
    Img3: [imageSchema],
    Img4: [imageSchema],
    
    user: {type: mongoose.Types.ObjectId, ref: "User"},
    admin: {type: mongoose.Types.ObjectId, ref: "Admin"}

}, {timestamps: true});

//mongoose middleware
postSchema.pre("validate", function(next) {
    console.log("something happened");
    next();
});

const Post = mongoose.model("Post", postSchema);
export default Post