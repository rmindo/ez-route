const auth = require('./authorization')

/**
 * Status Code
 */
 const status = {
  '200': 'Ok',
  '201': 'Created',
  '204': 'No Content',
  '400': 'Bad Request',
  '401': 'Unauthorized',
  '403': 'Forbidden',
  '404': 'Not Found',
  '405': 'Method Not Allowed',
  '406': 'Not Acceptable',
  '409': 'Conflict',
  '500': 'Internal Server Error',
}


/**
 * Send JSON Response
 * @param {object} res
 * @param {object} data 
 * @param {number} code 
 */
 const print = function(res, data = {}, code = 401) {
  var obj = {}

  if(data && Object.keys(data).length > 0) {
    if(data.hasOwnProperty('error')) {
      obj = {
        status: code,
        result: {
          error: data.error
        },
        message: status[code],
      }
    } else {
      obj = {
        status: code,
        result: data,
        message: status[code],
      }
    }
  } else {
    obj = {
      status: code,
      message: status[code],
    }
  }
  res.status(code).send(JSON.stringify(obj, null, 2))
}


/**
 * Get the controller from collection
 * 
 * @param {string} path Path of the controller
 * @param {string} method Name of the method in a controller 
 * @param {object} context Essential information and function to pass down to the controller to use
 * @param {array} params Express' request, response and middleware next
 */
const getController = async function(path, method, context, [req, res, next]) {
  try {
    var imported = await context.file.get(path.filter(i => i).join('/'))
    if(imported) {
      /**
       * CommonJS module
       */
      if(typeof imported == 'function') {
        imported(context)[method](req, res, next)
      }
      /**
       * ES module
       */
      else if(typeof imported.default == 'function') {
        (await imported.default(context))[method](req, res, next)
      }
      else {
        res.print({
          note: 'Export a function to create a controller.'
        }, 404)
      }
    }
    else {
      res.print({error: `Unable to find: ${path.join('/')}`}, 404)
    }
  }
  catch(e) {
    res.print({error: e.toString()}, 500)
  }
}

/**
 * Express route callback
 * 
 * @param {string} collection Name of the collection
 * @param {string} method Name of the method in a controller
 * @param {object} context Essential information and function to pass down to the controller to use
 */
module.exports = function(collection, method, context, callback) {
  /**
   * Authenticate request
   */
  context.router.use((request, response, next) => {
    /**
    * Set default headers and custom print
    */
    response.set(context.config.headers)
    response.print = (data, code) => print(response, data, code)
    /**
     * If not valid request
     */
    var val = auth.validate(request, context)
    if(!val.exist) {
      return response.print({}, 404)
    }
    /**
     * Pass through request
     */
    else if(val.pass) {
      return next()
    }
    else {
      /**
       * Authenticate user
       */
      var authenticate = auth.authenticate(request, context)
      if(authenticate.parsed) {
        request.parsedAuth = authenticate.parsed
        /**
         * Check if token is expired for bearer type of authentication
         */
        if(authenticate.parsed.type == 'Bearer') {
          if(Date.now() > authenticate.parsed.payload.exp) {
            var msg = {
              error: 'Current token has been expired.'
            }
            return response.print(msg)
          }
        }
  
        /**
         * Verify the request
         */
        if(callback) {
          (async () => {
            var user = await callback(request)
            if(user) {
              var keys = [
                'secret',
                'payload'
              ]
              if(!context.object.has(keys, user)) {
                throw new ReferenceError(
                  'No payload or secret key provided.'
                )
              }

              if(authenticate.verify(user.secret, user.payload) == true) {
                return next()
              }
            }
          })()
        }
      }
      response.print({})
    }
  })


  return (request, response, next) => {
    var url = request.url.split('/').slice(0,3);
    /**
     * Set route
     */
    ((path) => {
      /**
       * If the endpoint has version then use the RESTful resource else use the custom url without resource and version.
       * 
       * Go to ./routes and find `setRoutes()` for reference
       */
      var routes = context.config.routes[url[1]]
      if(routes.version) {
        path = [...path,collection]
      }
      /**
       * Import controller
       */
      getController(path, method, context, [request, response, next])
    })
    (['src', 'routes', ...url])
  }
}
