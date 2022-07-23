
# Easy Route

A managed route and auto-generated RESTful API endpoints with routed versions.

### Install

`yarn add ez-route`
Or
`npm install ez-route`

### Usage
Import, configure and run

```js
// ./src/index.js
import HTTP from 'ez-route'
/**
 * Local modules
 */
import config from './config'

/**
 *  HTTP Request
 */
const app = HTTP(config)
 
/**
 * Run the app with business logic loaded as lib
 */
app.run({lib: {}})
```

### Configure
Configure port, headers, CORS and routes

```js
// ./src/config.js
/**
 * All Configuration
 */
 export default {
  /**
   * Port
   */
  port: 8080,
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
      'OPTIONS',
    ],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ]
  },
  /**
   * Default headers
   */
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
  },
  /**
   * Body parser
   */
  parser: {
    urlencoded: {
      extended: false
    }
  },
  /**
   * Environment variable
   */
  env: {
    /**
     * Path of .env
     */
    path: {
      dev: '.env/dev'
    }
  },
  routes: {
    api: {
      version: ':version',
      /**
      * Pass through
      */
      pass: {
        custom: ['index'],
      },
      /**
      * API Endpoints
      */
      routes: {
        /**
         * Custom routes
         */
        custom: [
          ['GET','index','/']
        ],
        /**
         * RESTful API auto-generated routes
         */
        users: {}
      },
    },
  },
}
```

### Routes directories
CRUD operation and response


```js
// ./src/routes/api/v1/users.js
/**
 * Export default
 */
export default () => {
  return {
    /**
     * Show all users
     * GET /api/v1/users
     */
    index: async (req, res) => {
      res.print({success: true}, 200)
    },
    /**
     * Read user
     * GET /api/v1/users/:uid
     */
    read: async (req, res) => {
      res.print({success: true}, 200)
    },
    /**
     * Create user
     * POST /api/v1/users
     */
    create: async (req, res) => {
      res.print({success: true}, 200)
    },
    /**
     * Update user
     * PUT /api/v1/users/:uid
     */
    update: async (req, res) => {
      res.print({success: true}, 200)
    },
    /**
     * Delete user
     * DELETE /api/v1/users/:uid
     */
    delete: async (req, res) => {
      res.print({success: true}, 200)
    },
  }
}
```


## Example

See example at [https://github.com/rmindo/ez-route/tree/main/sample](https://github.com/rmindo/ez-route/tree/main/sample)


## Change Log

[Semantic Versioning](http://semver.org/)

## License

MIT
