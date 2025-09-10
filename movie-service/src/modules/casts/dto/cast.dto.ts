import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const createCastSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
});

export const updateCastSchema = createCastSchema.partial();

export class CreateCastDto extends createZodDto(createCastSchema) {}
export class UpdateCastDto extends createZodDto(updateCastSchema) {}
