import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // Konfigurasi CORS dinamis dan aman
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = ['https://pemesanan-buruh-fe.vercel.app'];

      // Izinkan jika origin ada dalam daftar atau jika request tanpa origin (misalnya dari Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Pemesanan jasa buruh API')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Serve raw OpenAPI JSON
  app.use('/api/swagger-json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(document);
  });

  // Serve Swagger UI
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
                url: '/api/swagger-json',
                dom_id: '#swagger-ui',
              });
            };
          </script>
        </body>
      </html>
    `);
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
