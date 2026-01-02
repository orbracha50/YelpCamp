const mongoose = require('mongoose');
const europeCities = require('./cities');
const { places, descriptors } = require('./seedsHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('MONGO DATA CONNECTED!');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});

  for (let i = 0; i < 50; i++) {
    const city = sample(europeCities);

    const camp = new Campground({
      location: `${city.city}, ${city.country}`,
      name: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: "Point",
        coordinates: [city.lng, city.lat], 
      images: [
        {
          url: 'https://res.cloudinary.com/dp58bebjn/image/upload/v1766932331/YelpCamp/va32t8yn5ogtquurl1qb.jpg',
          filename: 'YelpCamp/va32t8yn5ogtquurl1qb',
        },
        {
          url: 'https://res.cloudinary.com/dp58bebjn/image/upload/v1766932332/YelpCamp/o54ut9yutdmsqjzuy79h.jpg',
          filename: 'YelpCamp/o54ut9yutdmsqjzuy79h',
        },
        {
          url: 'https://res.cloudinary.com/dp58bebjn/image/upload/v1766932333/YelpCamp/zy0mjzhr0z8c2e2yjzhg.jpg',
          filename: 'YelpCamp/zy0mjzhr0z8c2e2yjzhg',
        }
      ],
      description:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vero, nostrum iure. Adipisci illum tenetur voluptatibus placeat ut sequi consequatur doloribus corporis fugit? Deleniti sed in, illo ipsam ipsa repudiandae perspiciatis!',
      avilable: true,
      price: Math.floor(Math.random() * 50) + 10, 
      author: '694ad7c82e7852fda1fc28e2'
    });

    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
