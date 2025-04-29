import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Pemesanan Jasa Buruh API')
    .setDescription('API untuk pemesanan jasa buruh pertanian')
    .setVersion('1.0')
    .addBearerAuth() // Ini sudah bagus untuk JWT auth
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger tersedia di /api

  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}

bootstrap();
