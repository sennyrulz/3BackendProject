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
        type: String
    },
    category: {
        type: [String],
        enum: ["Technology", "Health", "Travel", "Food", "Lifestyle", "Education", "Finance", "Entertainment", "Sports", "Politics", "Science", "Business", "World", "Culture"],
        default: ["Technology"],
        required: true
    },
    previewPix: {
        publicId: String,
        size: Number
    },
    Img1: [imageSchema],
    Img2: [imageSchema],
    Img3: [imageSchema],

    // tags: [String],

    // likeCount: {
    //     type: Number,
    //     default: 0
    // },
    // dislikeCount: {
    //     type: Number,
    //     default: 0
    // },
    // commentCount: {
    //     type: Number,
    //     default: 0
    // },
    // viewCount: {
    //     type: Number,
    //     default: 0
    // },
    // published: {
    //     type: Boolean,
    //     default: false
    // },
    // comment: {
    //     type: String
    // },
    
postedBy: {
    id: { type: mongoose.Types.ObjectId, required: true, refPath: "postedBy.role" },
    role: { 
        type: String, 
        required: true, 
        enum: ["User", "Admin"] 
    }
}

}, {timestamps: true});

//mongoose middleware
// postSchema.pre("validate", function(next) {
//     console.log("something happened");
//     next();
// });

const Post = mongoose.model("Post", postSchema);
export default Post