import {HTTPRoute} from 'ez-route'


import misc from './lib/misc'
import config from './config'


var app = HTTPRoute(config)


app.use((req:any, res:any, next:any) => {
  console.log(req.url)
  next()
})

app.run({lib: {misc}}, () => {
  return {
    // secret: 'sdsdsd',
    // payload: {}
  }
})

