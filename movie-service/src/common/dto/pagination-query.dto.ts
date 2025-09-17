import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const paginationQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().int().min(1)).optional(),
  limit: z.string().transform(Number).pipe(z.number().int().min(1).max(100)).optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['ASC', 'DESC']).optional().default('DESC'),
});

export class PaginationQueryDto extends createZodDto(paginationQuerySchema) {}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface NonPaginatedResponse<T> {
  data: T[];
  total: number;
}