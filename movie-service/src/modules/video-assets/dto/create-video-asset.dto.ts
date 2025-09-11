import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createVideoAssetSchema = z.object({
  movieId: z.string().uuid().optional(),
  episodeId: z.string().uuid().optional(),
  resolution: z.enum(['1080p', '720p', '480p']),
  format: z.string().min(1),
  url: z.string().url(),
  status: z.enum(['pending', 'processing', 'done', 'failed']).optional(),
});

export class CreateVideoAssetDto extends createZodDto(createVideoAssetSchema) {}
