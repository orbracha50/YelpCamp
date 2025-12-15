const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    name: String,
    price: Number,
    image: String,
    description: String,
    location : String,
    avilable: Boolean
})

module.exports = mongoose.model('Campground',CampgroundSchema)

