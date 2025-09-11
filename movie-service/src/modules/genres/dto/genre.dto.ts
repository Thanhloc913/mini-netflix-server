import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createGenreSchema = z.object({
  name: z.string().min(1),
});

export class CreateGenreDto extends createZodDto(createGenreSchema) {}

export const updateGenreSchema = createGenreSchema.partial();

export class UpdateGenreDto extends createZodDto(updateGenreSchema) {}
