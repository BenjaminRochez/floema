require('dotenv').config()
const express = require('express')
const errorHandler = require('errorhandler')
const app = express()
const path = require('path')
const port = 3000

const Prismic = require('@prismicio/client')
const PrismicDOM = require('prismic-dom')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const logger = require('morgan')
const UAParser = require('ua-parser-js');

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(errorHandler())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride())
app.use(express.static(path.join(__dirname, 'public')))



const initApi = req => {
  return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req: req
  })
}

const handleLinkResolver = (doc) => {
  return doc.type === 'product'
    ? `/detail/${doc.slug}`
    : doc.type === 'about' ? '/about' : doc.type === 'collections' ? '/collections' : '/'
}

app.use((req, res, next) => {
  const ua = UAParser(req.headers['user-agent']);

  res.locals.isDesktop = ua.device.type === undefined;
  res.locals.isPhone = ua.device.type === 'mobile';
  res.locals.isTablet = ua.device.type === 'tablet';


  res.locals.Link = handleLinkResolver
  res.locals.PrismicDOM = PrismicDOM
  res.locals.Numbers = index => {
    return index === 0 ? 'One' : index === 1 ? 'Two' : index === 2 ? 'Three' : index === 3 ? 'Four' : ''
  }
  next()
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

const handleRequest = async (api) => {
  // Preload all images & content
  const home = await api.getSingle('home')
  const about = await api.getSingle('about')
  const { results: collections } = await api.query(Prismic.Predicates.at('document.type', 'collection'), {
    fetchLinks: 'product.image'
  })

  const meta = await api.getSingle('meta')
  const navigation = await api.getSingle('navigation')
  const preloader = await api.getSingle('preloader')

  let assets = []

  home.data.gallery.forEach(item =>{
    assets.push(item.image.url);
  })

  about.data.gallery.forEach(item =>{
    assets.push(item.image.url);
  })

  about.data.body.forEach(section =>{
    if(section.slice_type === 'gallery'){
      section.items.forEach(item =>{
        assets.push(item.image.url);
      })
    }
  })

  collections.forEach(collection =>{
    collection.data.products.forEach(item =>{
      assets.push(item.products_product.data.image.url);
    })
  })
  return {
    assets,
    home,
    about,
    collections,
    meta,
    navigation,
    preloader
  }
}

app.get('/', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)
  //const home = await api.getSingle('home')
  // const { results: collections } = await api.query(Prismic.Predicates.at('document.type', 'collection'), {
  //   fetchLinks: 'product.image'
  // })
  res.render('pages/home', {
    ...defaults,
    //home,
    //collections
  })
})

app.get('/about', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)
  //const about = await api.getSingle('about')
  res.render('pages/about', {
    ...defaults,
    //about
  })
})

app.get('/detail/:uid', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)

  //const home = await api.getSingle('home')
  const product = await api.getByUID('product', req.params.uid, {
    fetchLinks: 'collection.title'
  })
  res.render('pages/detail', {
    ...defaults,
    //home,
    product
  })
})

app.get('/collections', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)
  //const home = await api.getSingle('home')
  // const { results: collections } = await api.query(Prismic.Predicates.at('document.type', 'collection'), {
  //   fetchLinks: 'product.image'
  // })
  res.render('pages/collections', {
    ...defaults,
    //home,
    //collections
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
