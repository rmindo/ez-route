var {HTTPRoute} = require('ez-route')


var misc = require('./lib/misc')
var config = require('./config')


var app = HTTPRoute(config)


app.use((req, res, next) => {
  console.log(req.url)
  next()
})

app.run({lib: {misc}})