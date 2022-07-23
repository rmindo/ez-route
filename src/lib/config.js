var defaultConfig = {
  /**
   * Port to listen
   */
  port: 9000,
  /**
   * Cross origin options
   */
  cors: {
    origin: '*',
    allowedMethods: [
      'GET',
      'PUT',
      'POST',
      'PATCH',
      'DELETE',
      'OPTIONS'
    ],
    allowedHeaders: [
      'Content-Type',
      'Authorization'
    ]
  },
  /**
   * Default headers
   */
  headers: {
    'Content-Type': 'application/json; charset=UTF-8'
  },
  /**
   * Body parser
   */
  parser: {
    urlencoded: {
      extended: false,
    }
  },
  file: {
    ext: 'js',
  },
  /**
   * Environment variable
   */
  env: {
    vars: {
      SOURCE_DIR: `${process.env.PWD}/src`,
      LIBRARY_DIR: `${process.env.PWD}/src/lib`
    }
  },
  routes: {}
}


var setDefault = (config, _default) => {
  for(let name in _default) {
    if(config[name]) {
      if(typeof config[name] == 'object') {
        
        /**
         * CORS
         */
        if(config[name].allowedMethods || config[name].allowedHeaders) {
          if(config[name].allowedMethods) {
            _default[name].allowedMethods.push(...config[name].allowedMethods)
          }
          if(config[name].allowedHeaders) {
            _default[name].allowedHeaders.push(...config[name].allowedHeaders)
          }
        }
        /**
         * Environment variables
         */
        else if(config[name].vars || config[name].path) {
          _default[name].vars = {..._default[name].vars, ...config[name].vars}
          _default[name].path = {..._default[name].path, ...config[name].path}
        }
        else {
          _default[name] = {..._default[name], ...config[name]}
        }
      }
      else {
        _default[name] = config[name]
      }
    }
  }
  return _default
}
module.exports = (config) => setDefault(config, defaultConfig)
