import { createZodDto } from 'nestjs-zod';
import { createMovieSchema } from './create-movie.dto';
import { z } from 'zod';

export const updateMovieSchema = createMovieSchema.partial();

export class UpdateMovieDto extends createZodDto(updateMovieSchema) {}
