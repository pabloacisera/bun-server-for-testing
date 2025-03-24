import { ProductController } from '../controllers/productController';
import type { CreateProductInput, UpdateProductInput, ProductId } from '../interfaces/productInterface';
import { createRouterHandler } from '../utils/routerHandler';

export class ProductRouter {
  private productController: ProductController;

  constructor() {
    this.productController = new ProductController();
  }

  private handleRoute(handler: (req: Request) => Promise<Response>) {
    return createRouterHandler(handler.bind(this.productController)), {
      allowedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    }
  }

  getRoutes() {
    return {
      '/api/products': {
        GET: this.handleRoute(this.productController.getAllProducts)
      },
      '/api/products/get': {
        POST: this.handleRoute(async (req: Request) => {
          const body: ProductId = await req.json();
          return this.productController.getProductById(body);
        })
      },
      '/api/products/create': {
        POST: this.handleRoute(async (req: Request) => {
          const body: CreateProductInput = await req.json();
          return this.productController.createProduct(body);
        })
      },
      '/api/products/update': {
        PUT: this.handleRoute(async (req: Request) => {
          const body: UpdateProductInput & ProductId = await req.json();
          return this.productController.updateProduct(body);
        })
      },
      '/api/products/delete': {
        DELETE: this.handleRoute(async (req: Request) => {
          const body: ProductId = await req.json();
          return this.productController.deleteProduct(body);
        })
      }
    };
  }
}