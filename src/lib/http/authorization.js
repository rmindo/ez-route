/**
 * Validate Request
 * 
 * Check the request method and if the url exist
 * 
 * @param {object} request Incoming Message
 * @param {object} context User configuration
 */
exports.validate = function(request, context) {
  var match = (pat, str) => {
    return str.match(new RegExp(`^${pat}$|${pat}?(.*)`,'i'))
  }
  return {
    /**
     * Pass through request
     */
    pass: ((url) => {
      var group = context.config.routes[url.split('/')[1]]
      if(group) {
        if(Array.isArray(group)) {
          return group[1]
        }
        if(group.pass) {
          for(let name in group.pass) {
            var pass = group.pass[name]
            if(pass && pass.length > 0 && context.routes[name]) {
              /**
               * Check the request method and if the url exist
               */
              var array = context.routes[name].filter((item) => {
                return (item[0] == request.method) && pass.includes(item[1]) && match(item[3], url)
              })
              if(array.length > 0) {
                return true
              }
            }
          }
        }
      }
    })(request.url),
    /**
     * Check request
     */
    exist: ((list, url) => {
      var data = list.reduce((data, item) => {
        return [...data, ...item]
      })
      return data.filter((val) => match(val[3], url)).length
    })
    (Object.values(context.routes), request._parsedUrl.pathname)
  }
}



/**
 * Verify authorization header
 * @param {string} request 
 * @param {object} context 
 */
exports.authenticate = function(request, context) {
  var parsed = context.auth.parse(request.headers.authorization)
  /**
   * Verify authorization
   */
  return {
    parsed,
    verify: (secret, payload) => {
      if(parsed) {
        if(parsed.type == 'Basic') {
          return context.auth.verify(parsed.password, payload, secret)
        }
        if(parsed.type == 'Bearer') {
          return context.auth.verify(secret, parsed.payload, parsed.signature)
        }
      }
    },
  }
}
