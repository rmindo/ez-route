/**
 * Authentication utilities
 */
exports.auth = require('./auth')

/**
 * Object utilities
 */
exports.object = {
  /**
   * Check if key exist in an object
   * 
   * @array List of keys you want to check
   * @object The object to check (heystack)
   * 
   * 
   * @param {array} array 
   * @param {object} object 
   * @returns {boolean}
   */
  has: (array, object) => {
    var list = Object.keys(object)
    if(array.filter((val) => list.includes(val)).length == array.length) {
      return true
    }
  },
  /**
   * Get property and value recursively
   * 
   * @object The object (heystack) where to search
   * @key The name (needle) you want to search
   * 
   * 
   * @param {object} object
   * @param {string} key
   * @returns {object|undefined}
   */
  get: (object, key) => {
    if(object) {
      if(object.hasOwnProperty(key)) {
        return object[key]
      }
      /**
       * Traverse object and check every property
       */
      if(typeof object == 'object') {
        for(var name in object) {
          if(object[name].hasOwnProperty(key)) {
            var value = object[name][key]
            if(value) {
              return value
            }
          }
          else {
            /**
             * Do it again if found an object
             */
            exports.object.get(object[name], key)
          }
        }
      }
    }
  },
  /**
   * Filter out unwanted data from an object
   * 
   * @object The object you want to filter
   * @exclude The list of key you want to filter out
   * @data The object you want to merge or replace the value of current object
   * 
   * 
   * @param {object} object
   * @param {array} exclude
   * @param {object} data
   */
  filter: (object, exclude = [], data = {}) => {
    for(var name in object) {
      if(!exclude.includes(name)) {
        data[name] = object[name]
      }
    }
    return data
  }
}

/**
 * File utilities
 */
exports.file = (() => {
  var fs = require('fs')

  return {
    /**
     * Import file dynamically
     * 
     * @path The path of the file
     * 
     * @param {string} path
     * @returns {promise|function|undefined}
     */
    get: (path) => {
      var file = process.env.PWD.concat('/', path)
      try {
        /**
         * ES module import
         * This import triggers if you have "type": "module" inside the package.json,
         */
        if(process.env.MODULE_TYPE === 'module') {
          if(fs.existsSync(file) && fs.lstatSync(file).isDirectory()) {
            /**
             * NodeJS ES module does not support import directory with index.js automatically,
             * So If the path is directory then add the index.js
             */
            return import(file.concat('/index.js'))
          }
          /**
           * NodeJS ES module does not support without .js extension
           */
          else {
            if(fs.existsSync(file.concat('.js'))) {
              return import(file.concat('.js'))
            }
          }
        }
        /**
         * CommonJS module
         */
        else {
          return require(file)
        }
      }
      catch(e) {}
    },


    /**
     * Parse the string from a file containing a key and value format 
     * 
     * e.g. API_KEY=zUpiKsaP2EyeP2KMg7GxWs==
     * 
     * @file The path of the file containing key and value format
     * 
     * @param {string} file
     * @returns {object}
     */
    parse: (file) => {
      var items = {}
      var path = require('path')
      
      if(file) {
        if(!path.isAbsolute(file)) {
          file = `${process.env.PWD}/${file}`
        }
        if(fs.existsSync(file)) {
          var content = fs.readFileSync(file, 'utf-8').split('\n')
          
          for(var value of content) {
            var item = value.match(/([A-Z_\s]+)=(.*)/)
            if(item) {
              items[item[1].replace(/\s/g, '')] = item[2].replace(/\s/g, '')
            }
          }
        }
        return items
      }
    },
  }
})()

/**
 * String utilities
 */
exports.string = {
  /**
  * Replace the {variable_name} with value in a string
  * 
  * @string The string with {variable_name} you want to replace with value
  * @data Object that matched the key and the variable in the string where you going to replace with new value
  * 
  * @param {string} string
  * @param {object} data
  * @returns {string}
  */
  replace: (string, data) => {
    var patt = string.match(/(\{[a-z_]+\})/g)
    if(patt) {
      string = string.replace(new RegExp(patt.join('|'), 'g'), (v) => {
        var value = data[v.match(/([a-z_]+)/g)]
        if(value) {
          return value
        }
        return ''
      })
    }
    return string
  }
}