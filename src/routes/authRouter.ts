import { AuthController } from "../controllers/authController";
import { createRouterHandler } from "../utils/routerHandler";

/**
 * Clase que define las rutas de autenticación
 */
export class AuthRouter {
  private authController: AuthController;

  /**
   * Constructor de AuthRouter.
   * Inicializa una instancia de AuthController.
   */
  constructor() {
    this.authController = new AuthController();
  }

  /**
   * Maneja una ruta y envuelve el controlador con la lógica de manejo de rutas.
   * @param {function(Request): Promise<Response>} handler Controlador de la ruta.
   * @returns {function(Request): Promise<Response>} Función que maneja las solicitudes entrantes.
   */
  private handleRoute(handler: (req: Request) => Promise<Response>) {
    return createRouterHandler(handler.bind(this.authController), { // <- Paréntesis corregido
      allowedMethods: ['POST', 'OPTIONS']
    });
  }

   /**
   * Devuelve un objeto que mapea las rutas de autenticación a sus controladores y métodos HTTP permitidos.
   * @returns {object} Objeto que contiene las rutas de autenticación.
   */
  getRoutes() {
    return {
      '/api/auth/register': {
        POST: this.handleRoute(this.authController.registerUser)
      },
      '/api/auth/login': {
        POST: this.handleRoute(this.authController.loginUser)
      }
    };
  }
}