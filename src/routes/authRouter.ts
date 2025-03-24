import { AuthController } from "../controllers/authController";
import { createRouterHandler } from "../utils/routerHandler";

export class AuthRouter {
  private authController: AuthController;

  constructor() {
    this.authController = new AuthController();
  }

  private handleRoute(handler: (req: Request) => Promise<Response>) {
    return createRouterHandler(handler.bind(this.authController)), {
      allowedMethods: ['POST', 'OPTIONS']
    }
  }
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