const http = require('http')
const express = require('express')

/**
 * 
 */
const cors = require('./cors')
const response = require('./response')

 
/**
 * 
 */
const routes = {}
const segment = {}

/**
 * Resource ID
 * @param name 
 * @returns {string}
 */
const id = (name) => `:${name.substring(0,1)}id`

 /**
 * Regex path
 * @param path 
 * @returns {string}
 */
const regex = (path) => path.replace(/:(\w+)/g, '([a-zA-Z0-9-]+)')


/**
* Set Route
*
* @param {string} name Collection name
* @param {string} path Route path
* @param {boolean} col Set to false if its not a collection
* @returns {array}
*/
const route = function(name, path, col = true) {
  if(typeof routes[name] == 'undefined') {
    routes[name] = []
  }
  if(col) {
    routes[name] = [
      ...routes[name],
      ['GET', 'index', path, regex(path)],
      ['POST', 'create', path, regex(path)],
    ]
  } else {
    routes[name] = [
      ...routes[name],
      ['GET', 'read', path, regex(path)],
      ['PUT', 'update', path, regex(path)],
      ['DELETE', 'delete', path, regex(path)]
    ]
  }
  return routes[name]
}

/**
* Set path to route
*
* @param {array} segment segment of path
* @param {string} col A sub/collection
* @param {number|string} id ID of resource
* @returns {void}
*/
const setPath = function(segment, col, id) {
 /**
 * Set collection endpoints
 */
  segment.push(col)
  route(col, segment.join('/'))
 /**
 * Set resource endpoints
 */
  segment.push(id)
  route(col, segment.join('/'), false)
}


/**
* Sub Collection and Resource
* 
* @param {array} path 
* @param {array} data 
* @param {number|string} name 
* @returns {void}
*/
const setSub = function(path, data, name) {
  setPath(path, name, id(name))
  for(let val in data) {
    setPath([path[0], path[1], id(path[1]), name, id(name)], val, id(val))
  }
}


/**
 * Generate endpoints
 * 
 * @param {object} context Essential information and function to pass down to the controller to use
 * @callback A function that executes the authentication of the request
 * @returns {void}
 */
const setRoutes = function(context, callback) {
  for(let name in context.config.routes) {
    var path = [
      '',
      name
    ]
    /**
     * Make a path
     */
    {
      var group = context.config.routes[name]
      if(group.version) {
        path.push(group.version)
      }
      path = path.join('/')
    }

    /**
     * Traverse defined routes
     */
    if(typeof group.length == 'undefined') {
      for(let col in group.routes) {
        var data = group.routes[col]

        if(typeof data.length == 'undefined') {
          segment[col] = [path]
          /**
           * Set collection
           */
          setPath(segment[col], col, id(col))
          /**
           * Set sub-collection and resource
           */
          for(let name in data) {
            setSub([path, col, id(col)], data[name], name)
          }
        }
        else {
          routes[col] = data.map((item) => {

            if(!Array.isArray(item)) {
              throw new TypeError('Custom route should be type `array`.')
            }

            if(item[2]) {
              if(item[2] == '/') {
                item[2] = path+item[2]+col
              } else {
                item[2] = path+item[2]
              }
            }
            return item.push(regex(item[2])) && item
          })
        }
      }
    }
    else {
      /**
       * Serve custom url without resource and version
       * useful for any custom request that needs an execution in the backend
       * 
       * e.g. https://api.domain.com/api/custom-url
       */
      if(group.length == 1 || group.length == 2) {
        routes[name] = [[group[0], 'index', path, regex(path)]]
      }
    }
  }
  context.routes = routes
  /**
   * Set generated routes
   */
  for(let collection in routes) {
    routes[collection].map(([httpMethod, method, path]) => {
      context.router[httpMethod.toLowerCase()](path, response(collection, method, context, callback))
    })
  }
}


/**
 * Start the server and list to the port
 * 
 * @port THe port to listen
 * @context Essential information and function to pass down to the controller to use
 * @callback A function that executes the authentication of the request
 * 
 * 
 * @param {number} port
 * @param {object} context
 * @param {fuction} callback
 * @returns {void}
 */
exports.listen = function(port, context, callback) {
  var router = express()
  var server = http.createServer(router)

  /**
   * Start listening
   */
  server.listen(port, () => {
    var {config, object, middleware} = context
    /**
     * Execute user defined middleware and
     * exclude it in the context after executing
     */
    if(middleware.length > 0) {
      middleware.forEach(args => {
        router.use(...args)
      })
      delete context.middleware
    }
    /**
     * Body parser and CORS middleware
     * Execute only if user not overwriting the configuration
     * and decided not to make their owned CORS middleware configuration
     */
    if(config.cors) {
      router.use(cors(object.get(config, 'cors')))
    }
    if(config.parser) {
      /**
       * Parsing incoming requests with JSON 
       */
      router.use(express.json())
      router.use(express.urlencoded(object.get(config.parser, 'urlencoded')))
    }
    /**
     * Start serving routes
     */
    setRoutes({...context, server, router}, callback)
    /**
     *
     */
    console.log(`Listening on port ${port}`)
  })
}

