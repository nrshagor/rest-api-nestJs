import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthService } from './modules/auth/auth.service';
import { ProductService } from './modules/product/product.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Seed data for User
  const userSeederService = app.get(AuthService);
  await userSeederService.seedDataIfNotExists();
  // Seed data for Product
  const productSeederService = app.get(ProductService);
  await productSeederService.seedDataIfNotExists();
  await app.listen(3000);
}
bootstrap();
