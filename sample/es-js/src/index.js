import {HTTPRoute} from 'ez-route'


import misc from './lib/misc.js'
import config from './config/index.js'


var app = HTTPRoute(config)


app.use((req, res, next) => {
  /**
   * Code here
   */
  next()
})

app.run({lib: {misc}})