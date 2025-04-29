import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Setup Swagger config
  const config = new DocumentBuilder()
    .setTitle('Pemesanan Jasa Buruh API')
    .setDescription('API untuk pemesanan jasa buruh pertanian')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Swagger UI akan bisa diakses di /api/swagger
  SwaggerModule.setup('api/swagger', app, document);

  // Gunakan PORT dari environment untuk deployment (contoh: Render/Railway)
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}/api/swagger`);
}

bootstrap();
