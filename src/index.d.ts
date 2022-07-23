
declare module 'ez-route' {

  interface CORS {
    origin?: string;
    allowedMethods?: string[];
    allowedHeaders?: string[];
  }

  interface ENV {
    vars?: object;
    path?: object;
  }

  interface Config {
    env?: ENV;
    cors?: CORS;
    port?: number;
    routes?: object;
    parser?: object;
    headers?: object;
  }

  interface Route {
    use(args?:any, callback?:Function): void;
    run(args?:object, callback?:Function): void;
  }

  export function HTTPRoute(config:Config): Route;
}