/**
 * All Configuration
 */
export default {
  port: 8000,
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
  },
}
