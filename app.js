const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Campground = require('./models/campground')
const methodOverride = require('method-override')
mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection;
db.on('error', console.error.bind(console,'connetion error:'));
db.once('open',()=>{
    console.log('MONGO DATA CONNECTED!')
})
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))


app.set('view engine', 'ejs')
app.set('views',path.join(__dirname,'views'))

app.get('/campgrounds',async (req,res)=>{
    const campgrounds = await Campground.find()
    res.render('campgrounds/index.ejs',{campgrounds})
})

app.get('/campgrounds/:id', async (req, res,) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/details', { campground });
}); 


app.listen(3000, () => {
    console.log('app work on port 3000')
})

