import { z } from 'zod';
import { CreateProductInputSchema, UpdateProductInputSchema } from '../utils/productSchema';
import { ProductService } from '../services/productService';
import type { ProductId, UpdateProductInput } from '../interfaces/productInterface';

export class ProductController {
  private productService = new ProductService();

  async getAllProducts(): Promise<Response> {
    try {
      const products = await this.productService.getAllProducts();
      return new Response(JSON.stringify(products), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
      console.error('Error fetching products:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }

  async getProductById(body: ProductId): Promise<Response> {
    try {
      const product = await this.productService.getProductById(body.id);
      if (product) {
        return new Response(JSON.stringify(product), { status: 200, headers: { 'Content-Type': 'application/json' } });
      } else {
        return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
      }
    } catch (error) {
      console.error(`Error fetching product with id ${body.id}:`, error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }

  async createProduct(data: unknown): Promise<Response> {
    try {
      const validatedData = CreateProductInputSchema.parse(data);
      const product = await this.productService.createProduct(validatedData);
      return new Response(JSON.stringify(product), { status: 201, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
      console.error('Error creating product:', error);
      if (error instanceof z.ZodError) {
        return new Response(JSON.stringify({ error: 'Invalid input data', details: error.errors }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }

  async updateProduct(body: UpdateProductInput & ProductId): Promise<Response> {
    try {
      const validatedData = UpdateProductInputSchema.parse(body);
      const product = await this.productService.updateProduct(body.id, validatedData);
      if (product) {
        return new Response(JSON.stringify(product), { status: 200, headers: { 'Content-Type': 'application/json' } });
      } else {
        return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
      }
    } catch (error) {
      console.error(`Error updating product with id ${body.id}:`, error);
      if (error instanceof z.ZodError) {
        return new Response(JSON.stringify({ error: 'Invalid input data', details: error.errors }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }

  async deleteProduct(body: ProductId): Promise<Response> {
    try {
      await this.productService.deleteProduct(body.id);
      return new Response(null, { status: 204, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
      console.error(`Error deleting product with id ${body.id}:`, error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }
}