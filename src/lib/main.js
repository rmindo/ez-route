var util = require('./util')
var http = require('./http/routes')
var setDefaultConfig = require('./config')


/**
 * HTTP Request
 */
module.exports = (config) => {
  var config = setDefaultConfig(config)
  
  var env = config.env
  var pkg = util.file.get('package')

  if(env) {
    var node = util.object.get(env.path, process.env.NODE_ENV)
    if(node) {
      var vars = {
        MODULE_TYPE: pkg.type || '',
        ...env.vars,
        ...util.file.parse(node)
      }
      for(var i in vars) {
        process.env[i] = vars[i]
      }
      /**
       * Empty the pkg so that, it doesn't eat more memory
       * as we only need one info from package.json for now
       */
      pkg = {}
    }
    /**
     * We're not using it anymore,
     * we already set it to environment
     */
    delete config.env
  }
  

  var middleware = []
  return {
    /**
     * Use express middleware and pass down to execute it.
     */
    use: function() {
      middleware.push(arguments)
    },
    /**
     * Run the app with specified port
     */
    run: function(args = {}, callback = null) {

      if(config.port) {
        if(typeof config.port !== 'number') {
          throw new TypeError(
            'Expected port to be of type `number` but received a `string`.'
          )
        }
        http.listen(config.port, {...args, ...util, config, middleware}, callback)
      }
      else {
        throw new ReferenceError('No port provided')
      }
    }
  }
}