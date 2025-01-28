import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { config } from 'dotenv';
import * as bodyParser from 'body-parser';


async function bootstrap() {
  config();

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: false,
      referrerPolicy: false,
      crossOriginOpenerPolicy: false,
    }),
  );
  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

  await app.listen(process.env.PORT || 3003);
}
bootstrap();
