const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const methodOverride = require('method-override')
mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection;
db.on('error', console.error.bind(console,'connetion error:'));
db.once('open',()=>{
    console.log('MONGO DATA CONNECTED!')
})
const app = express();

app.set('view engine', 'ejs')
app.set('views',path.join(__dirname,'views'))


app.get('/home', (req,res)=>{
    res.render('home.ejs')
})


app.listen(3000, () => {
    console.log('app work on port 3000')
})

app.use(methodOverride('_method'))