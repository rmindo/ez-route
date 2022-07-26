/**
 * All Configuration
 */
module.exports = {
  port: 7000,
  /**
   * Environment variable
   */
  env: {
    /**
     * Path of environment
     */
    path: {
      dev: '.env/dev',
      prod: '.env/prod',
    }
  },
  routes: {
    api: {
      version: ':version',
      /**
      * Pass through
      */
      pass: {
        users: ['read'],
      },
      /**
        * API Endpoints
        */
      routes: {
        /**
         * REST API
         */
        users: {},
      }
    },
    docs: {
      /**
      * Pass through
      */
      pass: {
        docs: ['index'],
      },
      version: ':version',
      routes: {
        docs: [
          ['GET', 'index', '/docs']
        ]
      }
    }
  },
}
