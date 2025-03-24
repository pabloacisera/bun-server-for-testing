export interface Product {
  id: number;
  name: string;
  price: number;
  created: Date;
}

export interface CreateProductInput {
  name: string;
  price: number;
}

export interface UpdateProductInput {
  name?: string;
  price?: number;
}

export interface ProductId {
  id: number;
}

export type ProductResponse = Product | Product[] | null;