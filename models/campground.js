const mongoose = require ("mongoose");
const Schema = mongoose.Schema;
const Review = require('./review')

const ImageSchema = new Schema ({
    url: String,
    filename: String
})

// virtual we do not need to store, we are storing url
ImageSchema.virtual('tinyimg').get(function(){
    // this refers to particulary images
   return this.url.replace('/upload', '/upload/w_200')
})

const CampgroundSchema = new Schema({
    title: String,
    images: [ ImageSchema],
    price: Number,
    description: String,
    location: String,
    
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
})

//mongoose middelware this Campground.findByIdAndDelete triggers findOneAndDelete
CampgroundSchema.post('findOneAndDelete', async function(doc){
    if (doc) {
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})



module.exports = mongoose.model('Campground', CampgroundSchema)