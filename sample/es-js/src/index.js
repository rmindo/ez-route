import {HTTPRoute} from 'ez-route'


import misc from './lib/misc.js'
import config from './config/index.js'


var app = HTTPRoute(config)


app.use((req, res, next) => {
  console.log(req.url)
  next()
})

app.run({lib: {misc}})