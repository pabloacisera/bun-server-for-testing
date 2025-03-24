import { AuthRouter } from './src/routes/authRouter';
import { ProductRouter } from './src/routes/productRouter';
import type { IRoutes } from './src/interfaces/routesInterface';

// Inicialización
/**
 * Punto de entrada principal de la aplicación
 * Configura el servidor Bun y manjea las solicitudes entrantes
 */
const authRouter = new AuthRouter();
const productRouter = new ProductRouter();

// Combinar rutas con tipo explícito

/**
 * Conbinación de rutas de autenticación y productos en un solo objeto
 * @type {IRoutes}
 */
const allRoutes: IRoutes = {
  ...authRouter.getRoutes(),
  ...productRouter.getRoutes()
};

/**
 * Configuracion del servidor de Bun
 */
const server = Bun.serve({
  port: Bun.env.PORT || 3000,

  /**
   * Maneja las solicitudes entrantes
   * @param {Request}
   * @returns {Promise<Response>}
   */
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
  /**
   * Maneja los errores del servidor
   * @param {Error} error El error del servidor
   * @returns {Response}
   */
  error(error) {
    console.error('Server error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
});

console.log(`Server running at http://${server.hostname}:${server.port}`);