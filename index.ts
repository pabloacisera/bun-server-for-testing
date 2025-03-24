import { AuthRouter } from './src/routes/authRouter';
import { ProductRouter } from './src/routes/productRouter';

// Inicialización de routers
const authRouter = new AuthRouter();
const productRouter = new ProductRouter();

// Combinación de todas las rutas
const allRoutes = {
  ...authRouter.getRoutes(),
  ...productRouter.getRoutes()
};

const server = Bun.serve({
  port: Bun.env.PORT || 3000,
  async fetch(req: Request) {
    const url = new URL(req.url);
    const routePath = url.pathname;
    
    // Manejo especial para rutas con parámetros (si es necesario)
    const routeKey = Object.keys(allRoutes).find(key => {
      // Para rutas simples, comparación directa
      if (key === routePath) return true;
      
      // Aquí podrías añadir lógica para rutas con parámetros
      // Ejemplo: '/api/products/:id'
      return false;
    });

    if (routeKey) {
      const routeHandlers = allRoutes[routeKey as keyof typeof allRoutes];
      
      // Si es un objeto con métodos HTTP
      if (typeof routeHandlers === 'object') {
        const methodHandler = routeHandlers[req.method as keyof typeof routeHandlers];
        if (methodHandler) {
          return methodHandler(req);
        }
        return new Response('Method Not Allowed', { status: 405 });
      }
      
      // Si es una función directa (para compatibilidad con version anterior)
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