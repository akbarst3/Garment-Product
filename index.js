const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const Product = require('./models/product')

// connect database
mongoose.connect('mongodb://127.0.0.1/shopApp_db').then((result) => {
    console.log('connected to mongodb')
}).catch((err) => {
    console.log(err)
});

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.send('hello world')
})
app.get('/products', async (req, res) => {
    const products = await Product.find({})
    res.render('products/index', {products})    
})
app.get('/products/create', (req, res) => {
    res.render('products/create')    
})
app.get('/products/:id', async (req, res) => {
    const  {id} = req.params
    const product = await Product.findById(id)
    res.render('products/show', {product})    
})

app.listen(8080, () => {
    console.log('Shop app listening on port http://localhost:8080')
})