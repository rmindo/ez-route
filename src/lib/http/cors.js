module.exports = (cors) => (req, res, next) => {
  
  if(cors) {
    var allow = 'Access-Control-Allow'

    res.set(`${allow}-Origin`, (() => {
      if(cors.origin) {
        if(Array.isArray(cors.origin) && cors.origin.indexOf(req.headers['origin']) !== -1) {
          return cors.origin.join(',')
        }
        else {
          return cors.origin
        }
      }
      return '*'
    })())

    if(req.method == 'OPTIONS' && req.headers['origin'] && req.headers['access-control-request-method']) {

      res.set(`${allow}-Methods`, cors.allowedMethods.join(','))
      res.set(`${allow}-Headers`, cors.allowedHeaders.join(','))

      res.status(204).end()
      return
    }
  }
  next()
}