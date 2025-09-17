import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://mini-netflix-client-kboxu04nc-thanhlc8-681315ca.vercel.app',
      'https://mini-netflix-client.vercel.app',
    ],
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
