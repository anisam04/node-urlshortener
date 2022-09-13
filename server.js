const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shorturl')
const app = express()

mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls: shortUrls })
})


app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl })
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {

    const miniUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (miniUrl == null) return res.sendStatus(404)
    miniUrl.clicks++;
    miniUrl.save();
    res.redirect(miniUrl.full)
})

app.listen(process.env.PORT || 3000)