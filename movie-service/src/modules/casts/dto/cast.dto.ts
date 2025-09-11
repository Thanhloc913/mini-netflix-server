import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createCastSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
});

export class CreateCastDto extends createZodDto(createCastSchema) {}

export const updateCastSchema = createCastSchema.partial();

export class UpdateCastDto extends createZodDto(updateCastSchema) {}
