import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // Menetapkan prefix untuk semua endpoint API

  // Mengonfigurasi CORS yang lebih aman
  app.enableCors({
    origin: '*',  // Mengizinkan semua origin
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,  // Menyertakan cookies atau credential lainnya jika diperlukan
  });

  // Konfigurasi Swagger
  const config = new DocumentBuilder()
    .setTitle('Pemesanan Jasa Buruh API') // Ganti judul dengan API yang sesuai
    .setDescription('API untuk aplikasi pemesanan jasa buruh') // Deskripsi API
    .setVersion('1.0') // Versi API
    .addBearerAuth() // Autentikasi menggunakan Bearer token
    .addSecurityRequirements('bearer') // Keamanan menggunakan bearer token
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Endpoint untuk menyediakan OpenAPI JSON
  app.use('/api/swagger-json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(document);
  });

  // Endpoint untuk menampilkan Swagger UI
  app.use('/api/swagger', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>API Docs</title>
          <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
        </head>
        <body>
          <div id="swagger-ui"></div>
          <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
          <script>
            window.onload = function () {
              SwaggerUIBundle({
                url: '/api/swagger-json', // Menunjukkan URL untuk OpenAPI JSON
                dom_id: '#swagger-ui',
              });
            };
          </script>
        </body>
      </html>
    `);
  });

  // Menambahkan Global Validation Pipe untuk validasi data yang masuk
  app.useGlobalPipes(new ValidationPipe());

  // Menjalankan aplikasi pada port yang sudah ditentukan di environment atau port default 3000
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
