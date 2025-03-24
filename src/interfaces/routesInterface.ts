export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';
export type RouteHandler = (req: Request) => Promise<Response> | Response;

export interface IRouteHandlers {
  [method: string]: RouteHandler; // Ej: { GET: handler, POST: handler }
}

export interface IRoutes {
  [path: string]: IRouteHandlers | RouteHandler; // Ej: { "/ruta": { GET: handler } }
}