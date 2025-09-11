import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createEpisodeSchema = z.object({
  movieId: z.string().uuid(),
  seasonNumber: z.number().int().positive(),
  title: z.string().min(1),
  duration: z.number().int().positive().optional(),
});

export class CreateEpisodeDto extends createZodDto(createEpisodeSchema) {}

export const updateEpisodeSchema = createEpisodeSchema.partial();

export class UpdateEpisodeDto extends createZodDto(updateEpisodeSchema) {}
