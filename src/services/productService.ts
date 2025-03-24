import { prisma } from '../config/prisma'
import type { CreateProductInput, Product, UpdateProductInput } from '../interfaces/productInterface';

export class ProductService {
  
  async getAllProducts(): Promise<Product[]> {
    const products = await prisma.product.findMany();
    return products;
  }

  async getProductById(id: number): Promise<Product | null> {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async createProduct(data: CreateProductInput): Promise<Product> {
    const product = await prisma.product.create({ data });
    return product;
  }

  async updateProduct(id: number, data: UpdateProductInput): Promise<Product | null> {
    const product = await prisma.product.update({ where: { id }, data });
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async deleteProduct(id: number) {
    const product = await prisma.product.delete({ where: { id } });
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }
}