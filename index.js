const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// connect database
mongoose.connect('mongodb://127.0.0.1/shopApp_db').then((result) => {
    console.log('connected to mongodb')
}).catch((err) => {
    console.log(err)
});

app.get('/', (req, res) => {
    res.send('hello world')
})

app.listen(8080, () => {
    console.log('Shop app listening on port http://localhost:8080')
})