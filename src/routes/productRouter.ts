import { ProductController } from '../controllers/productController';
import { 
  ProductIdSchema,
  CreateProductInputSchema,
  UpdateProductInputSchema,
  type ProductId,
  type CreateProductInput,
  type UpdateProductInput
} from '../utils/productSchema';
import { createRouterHandler } from '../utils/routerHandler';

export class ProductRouter {
  private productController: ProductController;

  constructor() {
    this.productController = new ProductController();
  }

  private handleRoute(handler: (req: Request) => Promise<Response>) {
    return createRouterHandler(handler.bind(this.productController), {
      allowedMethods: ['POST', 'OPTIONS']
    });
  }

  getRoutes() {
    return {
      '/api/products': {
        GET: this.handleRoute(this.productController.getAllProducts)
      },
      '/api/products/get': {
        POST: this.handleRoute(async (req: Request) => {
          const body = ProductIdSchema.parse(await req.json()); // Validación con Zod
          return this.productController.getProductById(body);
        })
      },
      '/api/products/create': {
        POST: this.handleRoute(async (req: Request) => {
          const body = CreateProductInputSchema.parse(await req.json()); // Validación
          return this.productController.createProduct(body);
        })
      },
      '/api/products/update': {
        PUT: this.handleRoute(async (req: Request) => {
          // Combina validación de ID + datos de actualización
          const body = ProductIdSchema.merge(UpdateProductInputSchema).parse(await req.json());
          return this.productController.updateProduct(body);
        })
      },
      '/api/products/delete': {
        DELETE: this.handleRoute(async (req: Request) => {
          const body = ProductIdSchema.parse(await req.json());
          return this.productController.deleteProduct(body);
        })
      }
    };
  }
}