import { z } from 'zod';

export const ProductIdSchema = z.object({
  id: z.number().int().positive() // Cambiado a number para consistencia
});

export const CreateProductInputSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  price: z.number().min(0).positive('Price must be a positive number'),
});

export const UpdateProductInputSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  price: z.number().positive('Price must be a positive number').optional(),
});

// Tipos inferidos
export type ProductId = z.infer<typeof ProductIdSchema>;
export type CreateProductInput = z.infer<typeof CreateProductInputSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductInputSchema>;