import type { RouteHandlerOptions } from "../interfaces/routerHandlerInterface";

export function createRouterHandler(
  handler: (req: Request) => Promise<Response>,
  options: RouteHandlerOptions = {}
) {

  return async(req: Request) => {

    try{
      if(Bun.env.NODE_ENV === 'development') {
        const origin = req.headers.get('origin');
        if(origin?.includes('localhost')) {
          if(req.method === 'OPTIONS') {
            return new Response(null, {
              headers: {
                'Access-Control-Allow-Origin': origin,
                'Access-Control-Allow-Methods': options.allowedMethods?.join(', ') || 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Credentials': 'true'
              }
            })            
          }
        }
      }

      const response = await handler(req)

      if(Bun.env.NODE_ENV === 'development') {
        const origin = req.headers.get('origin');
        if(origin?.includes('localhost')) {
          response.headers.set('Access-Control-Allow-Origin', origin);
          response.headers.set('Access-Control-Allow-Credentials', 'true');
        }
      }

      return response
    } catch(error){
      console.error('Route handler error:', error);
            return Response.json(
                { error: 'Internal server error' }, 
                { status: 500 }
            );
    }
  }
}