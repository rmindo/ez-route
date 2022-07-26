import {HTTPRoute} from 'ez-route'


import misc from './lib/misc'
import config from './config'


var app = HTTPRoute(config)


app.use((req:any, res:any, next:any) => {
  /**
   * Code here
   */
  next()
})

app.run({lib: {misc}}, () => {
  return {
    // secret: 'sdsdsd',
    // payload: {}
  }
})

