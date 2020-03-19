import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from "@nestjs/microservices";
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

const port = process.env.PORT || 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const microservice = app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port,
    },
  });

  await app.startAllMicroservicesAsync();
  await app.listen(port);
  Logger.log(`Microservice Invoice is listening on http://localhost:${port}`, 'Bootstrap')
}
bootstrap();
