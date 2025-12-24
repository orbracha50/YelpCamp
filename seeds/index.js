
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedsHelpers');
const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection;
db.on('error', console.error.bind(console,'connetion error:'));
db.once('open',()=>{
    console.log('MONGO DATA CONNECTED!')
})
const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            name: `${sample(descriptors)} ${sample(places)}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vero, nostrum iure. Adipisci illum tenetur voluptatibus placeat ut sequi consequatur doloribus corporis fugit? Deleniti sed in, illo ipsam ipsa repudiandae perspiciatis!',
            avilable: true,
            price: random1000,
            author: '694ad7c82e7852fda1fc28e2' 
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})