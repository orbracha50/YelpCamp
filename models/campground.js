const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    name: String,
    price: Number,
    description: String,
    location : String,
    avilable: true
})

module.exports = mongoose.model('Campground',CampgroundSchema)