import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  console.log('=== Starting Server ===');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Normalize paths to avoid double-slash issues like //settings/... which can bypass CORS handling
  app.use((req: any, _res: any, next: () => void) => {
    if (typeof req.url === 'string' && req.url.includes('//')) {
      req.url = req.url.replace(/\/{2,}/g, '/');
    }
    next();
  });
  
  console.log('All environment variables:');
  console.log('PORT:', configService.get('PORT'));
  console.log('DB_HOST:', configService.get('DB_HOST'));
  console.log('DB_USERNAME:', configService.get('DB_USERNAME'));
  console.log('DB_NAME:', configService.get('DB_NAME'));
  console.log('DB_PASSWORD:', configService.get('DB_PASSWORD') ? '[SET]' : '[NOT SET]');
  
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://devncca.encrafttech.com',
      'https://163.47.150.168:3000',
      'http://163.47.150.168:3000',
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });

  const port = configService.get('PORT', 3003);
  console.log(`Server starting on port ${port}...`);
  await app.listen(port);
  console.log(`Server is running on http://localhost:${port}`);
}
bootstrap();
