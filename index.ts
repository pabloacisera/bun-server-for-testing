import { AuthRouter } from './src/routes/authRouter';
import { ProductRouter } from './src/routes/productRouter';
import type { IRoutes } from './src/interfaces/routesInterface';

// Inicialización
const authRouter = new AuthRouter();
const productRouter = new ProductRouter();

// Combinar rutas con tipo explícito
const allRoutes: IRoutes = {
  ...authRouter.getRoutes(),
  ...productRouter.getRoutes()
};

const server = Bun.serve({
  port: Bun.env.PORT || 3000,
  async fetch(req: Request) {
    const url = new URL(req.url);
    const routePath = url.pathname;

    const routeKey = Object.keys(allRoutes).find(key => key === routePath);

    if (routeKey) {
      const routeHandlers = allRoutes[routeKey];

      if (typeof routeHandlers === 'object') {
        const method = req.method as keyof typeof routeHandlers;
        const methodHandler = routeHandlers[method];

        if (methodHandler && typeof methodHandler === 'function') {
          return methodHandler(req);
        }
        return new Response('Method Not Allowed', { status: 405 });
      }

      if (typeof routeHandlers === 'function') {
        return routeHandlers(req);
      }
    }

    return new Response('Not Found', { status: 404 });
  },
  error(error) {
    console.error('Server error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
});

console.log(`Server running at http://${server.hostname}:${server.port}`);