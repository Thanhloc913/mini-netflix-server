import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createMovieSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  releaseDate: z.string().datetime().optional(),
  duration: z.number().int().positive().optional(),
  isSeries: z.boolean(),
  posterUrl: z.string().url().optional(),
  trailerUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  genreIds: z.array(z.string().uuid()).optional(),
});

export class CreateMovieDto extends createZodDto(createMovieSchema) {}
