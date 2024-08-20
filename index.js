const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const app = express()
const ErrorHandler = require('./ErrorHandler')


// MODELS
const Product = require('./models/product')
const Garment = require('./models/garment')

// CONNECT DATABASE
mongoose.connect('mongodb://127.0.0.1/shopApp_db').then((result) => {
    console.log('connected to mongodb')
}).catch((err) => {
    console.log(err)
});


app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(err => next(err));
    }
}

app.get('/', (req, res) => {
    res.send('hello world')
})

//ROUTING GARMENT
//ROUTE HALAMAN UTAMA
app.get('/garments', wrapAsync(async (req, res) => {
    const garments = await Garment.find({})
    res.render('garments/index', { garments })
}))

// ROUTE FORM TAMBAH GARMENT BARU
app.get('/garments/create', (req, res) => {
    res.render('garments/create')
})

// ROUTE TAMBAH GARMENT BARU
app.post('/garments', wrapAsync(async (req, res) => {
    const garment = new Garment(req.body)
    await garment.save()
    res.redirect(`/garments`)
}))

// ROUTE DETAIL GARMENT
app.get('/garments/:id', wrapAsync(async (req, res) => {
    const { id } = req.params
    const garment = await Garment.findById(id).populate('products')
    res.render('garments/show', { garment })
}))

// ROUTE TAMBAH PRODUK BERDASARKAN ID GARMENT
app.get('/garments/:garment_id/products', (req, res) => {
    const { garment_id } = req.params
    res.render('products/create', { garment_id })
})

// ROUTE TAMBAH PRODUK DI GARMENT
app.post('/garments/:garment_id/products', wrapAsync(async (req, res) => {
    const { garment_id } = req.params
    const garment = await Garment.findById(garment_id)
    const product = new Product(req.body)
    garment.products.push(product)
    product.garment = garment
    await garment.save()
    await product.save()
    res.redirect(`/garments/${garment_id}`)
}))

// ROUTE TAMPILKAN FORM EDIT GARMENT
app.get('/garments/:id/edit', wrapAsync(async (req, res) => {
    const { id } = req.params
    const garment = await Garment.findById(id)
    res.render('garments/edit', { garment })
}))

// ROUTE UBAH DATA PABRIK
app.put('/garments/:id', wrapAsync(async (req, res) => {
    const { id } = req.params
    const garment = await Garment.findByIdAndUpdate(id, req.body, { runValidators: true })
    res.redirect(`/garments/${garment._id}`)
}))

app.delete('/garments/:garment_id', wrapAsync(async(req, res) => {
    const {garment_id} = req.params
    await Garment.findOneAndDelete({
        _id: garment_id
    })
    res.redirect('/garments')
}))

//------ROUTING PRODUCT------
// ROUTE HALAMAN UTAMA
app.get('/products', async (req, res) => {
    const { category } = req.query
    if (category) {
        const products = await Product.find({ category })
        res.render('products/index', { products, category })
    } else {
        const products = await Product.find({})
        res.render('products/index', { products, category: 'All' })
    }
})

// ROUTE TAMBAH PRODUK BARU
app.post('/products', wrapAsync(async (req, res) => {
    const products = new Product(req.body)
    await products.save()
    res.redirect(`/products/${products._id}`)
}))

// ROUTE HALAMAN FORM TAMBAH PRODUK
app.get('/products/create', (req, res) => {
    res.render('products/create')
})

// HALAMAN DETAIL PRODUK
app.get('/products/:id', wrapAsync(async (req, res) => {
    const { id } = req.params
    const product = await Product.findById(id).populate('garment')
    res.render('products/show', { product })
}))

// ROUTE FORM UBAH PRODUK
app.get('/products/:id/edit', wrapAsync(async (req, res) => {
    const { id } = req.params
    const product = await Product.findById(id)
    res.render('products/edit', { product })
}))

// ROUTE PROSES UBAH PRODUK
app.put('/products/:id', wrapAsync(async (req, res) => {
    const { id } = req.params
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true })
    res.redirect(`/products/${product._id}`)
}))

// ROUTE HAPUS PRODUK
app.delete('/products/:id', wrapAsync(async (req, res) => {
    const { id } = req.params
    await Product.findByIdAndDelete(id)
    res.redirect("/products")
}))

//MIDDLEWARE
const validatorHandler = err => {
    err.status = 400
    err.message = Object.values(err.errors).map(item => item.message)
    return new ErrorHandler(err.message, err.status)
}
const castHandler = err => {
    err.status = 404
    err.message = "Product Not Found"
    return new ErrorHandler(err.message, err.status)
}

// MIDDLEWARE 1
app.use((err, req, res, next) => {
    console.dir(err)
    if (err.name === 'ValidationError') err = validatorHandler(err)
    if (err.name === 'CastError') err = castHandler(err)
    next(err)
})

// MIDDLEWARE 2
app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong' } = err
    res.status(status).send(message)
})

app.listen(8080, () => {
    console.log('Shop app listening on port http://localhost:8080/products')
})